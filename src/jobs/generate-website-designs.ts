// src/jobs/generate-website-designs.ts
import { prisma } from '@/lib/db';
import { registry } from '@/providers/registry';

export interface WebsiteDesign {
  design_number: number;
  hero_section: string;
  color_scheme: string[];
  layout_style: 'MODERN' | 'MINIMAL' | 'LUXURY' | 'PLAYFUL';
  typography: string;
  sections: string[];
  html_code: string;
}

export async function generateWebsiteDesigns(
  generationId: string,
  projectId: string,
  quantity: number = 3
): Promise<WebsiteDesign[]> {
  try {
    console.log(`🏗️ Generating ${quantity} website design options`);

    const brand = await prisma.brand.findUnique({ where: { projectId } });
    if (!brand) throw new Error('Brand not found');

    const designs: WebsiteDesign[] = [];

    for (let i = 0; i < quantity; i++) {
      const styles = ['MODERN', 'MINIMAL', 'LUXURY', 'PLAYFUL'];
      const style = styles[i % styles.length];

      const prompt = `
Design a complete website design for: ${brand.name}
Industry: ${brand.industry}
Style: ${style}
Tone: ${brand.tone}
Colors: ${brand.colors.join(', ')}

Provide HTML/CSS code for a responsive website with:
- Hero section
- Products section
- Contact section
- Footer

Respond with JSON:
{
  "design_number": ${i + 1},
  "hero_section": "headline and description",
  "color_scheme": ["#color1", "#color2"],
  "layout_style": "${style}",
  "typography": "font recommendations",
  "sections": ["Hero", "Products", "Contact", "Footer"],
  "html_code": "<html>...</html>"
}
`;

      const result = await registry.executeCapability('TEXT_LLM', {
        prompt,
      });

      if (result.status === 'COMPLETED') {
        try {
          const jsonMatch = result.url?.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const designData = JSON.parse(jsonMatch[0]);
            designs.push(designData);

            // Save design as asset
            const designPath = `/uploads/website-design-${generationId}-${i + 1}.html`;
            await prisma.asset.create({
              data: {
                projectId,
                type: 'WEBSITE',
                url: designPath,
                tags: ['website-design', style.toLowerCase()],
                metadata: {
                  design: designData,
                  designNumber: i + 1,
                },
              },
            });
          }
        } catch (e) {
          console.error('Parse error for design', i + 1, e);
        }
      }
    }

    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'COMPLETED',
        metadata: {
          designs,
          quantity,
          generatedAt: new Date().toISOString(),
        },
      },
    });

    console.log(`✅ Generated ${designs.length} website designs`);
    return designs;
  } catch (error) {
    console.error('❌ Website design generation failed:', error);
    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'FAILED',
        error: String(error),
      },
    });
    throw error;
  }
}
