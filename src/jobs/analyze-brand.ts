// src/jobs/analyze-brand.ts
import { prisma } from '@/lib/db';
import { registry } from '@/providers/registry';
import { ollamaAdapter } from '@/providers/adapters/ollama';
import { groqAdapter } from '@/providers/adapters/groq';
import { chromadb } from './chromadb-setup';
import playwright from 'playwright';

// Register adapters
await registry.registerAdapter(ollamaAdapter);
await registry.registerAdapter(groqAdapter);

export async function analyzeBrand(projectId: string, url: string) {
  try {
    console.log(`🎬 Analyzing brand from ${url}...`);

    // 1. Capture website screenshots
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    // Desktop screenshot
    const desktopScreenshot = await page.screenshot({ path: `/uploads/${projectId}-desktop.png` });

    // Mobile screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileScreenshot = await page.screenshot({ path: `/uploads/${projectId}-mobile.png` });

    // Extract text content
    const textContent = await page.evaluate(() => {
      return {
        title: document.title,
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent),
        paragraphs: Array.from(document.querySelectorAll('p')).map(p => p.textContent).slice(0, 10),
        links: Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent, href: a.href })).slice(0, 10),
      };
    });

    // Extract colors from CSS
    const colors = await page.evaluate(() => {
      const colorSet = new Set<string>();
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const bg = window.getComputedStyle(el).backgroundColor;
        const color = window.getComputedStyle(el).color;
        if (bg && bg !== 'rgba(0, 0, 0, 0)') colorSet.add(bg);
        if (color) colorSet.add(color);
      });
      return Array.from(colorSet).slice(0, 5);
    });

    // Extract fonts
    const fonts = await page.evaluate(() => {
      const fontSet = new Set<string>();
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const font = window.getComputedStyle(el).fontFamily;
        if (font) fontSet.add(font);
      });
      return Array.from(fontSet).slice(0, 5);
    });

    await browser.close();

    // 2. Use LLM to analyze brand
    const analysisPrompt = `
Analyze this website information and extract brand details:
Title: ${textContent.title}
Headings: ${textContent.headings.join(', ')}
Content: ${textContent.paragraphs.join(' ')}

Respond with JSON:
{
  "name": "brand name",
  "niche": "industry/niche",
  "industry": "main industry",
  "audience": "target audience",
  "tone": "brand tone (luxury/casual/professional)",
  "products": [{"name": "product", "price": 0}],
  "services": [{"name": "service", "price": 0}]
}
`;

    const analysisResult = await registry.executeCapability('TEXT_LLM', {
      prompt: analysisPrompt,
    });

    if (analysisResult.status !== 'COMPLETED') {
      throw new Error('Failed to analyze brand');
    }

    let brandData: any = {};
    try {
      const jsonMatch = analysisResult.url?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        brandData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('JSON parse error:', e);
    }

    // 3. Save to database
    const brand = await prisma.brand.upsert({
      where: { projectId },
      update: {
        name: brandData.name || textContent.title,
        niche: brandData.niche,
        industry: brandData.industry,
        audience: brandData.audience,
        tone: brandData.tone,
        colors: colors,
        fonts: fonts,
        analysis: {
          textContent,
          rawAnalysis: analysisResult.url,
          ...brandData,
        },
      },
      create: {
        projectId,
        name: brandData.name || textContent.title,
        niche: brandData.niche,
        industry: brandData.industry,
        audience: brandData.audience,
        tone: brandData.tone,
        colors: colors,
        fonts: fonts,
        analysis: {
          textContent,
          rawAnalysis: analysisResult.url,
          ...brandData,
        },
      },
    });

    // 4. Store in ChromaDB for agent memory
    await chromadb.add({
      ids: [`brand-${projectId}`],
      documents: [analysisResult.url || ''],
      metadatas: [{ projectId, type: 'brand' }],
    });

    console.log(`✅ Brand analysis complete: ${brand.name}`);
    return brand;
  } catch (error) {
    console.error('❌ Brand analysis failed:', error);
    throw error;
  }
}
