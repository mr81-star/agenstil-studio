// src/jobs/generate-ads.ts
import { prisma } from '@/lib/db';
import { registry } from '@/providers/registry';

export interface AdCopy {
  headline: string;
  subheading: string;
  cta: string;
  price?: string;
  offer?: string;
}

export async function generateAdCopy(
  generationId: string,
  projectId: string,
  productName: string,
  productPrice?: number,
  offer?: string
): Promise<AdCopy[]> {
  const brand = await prisma.brand.findUnique({ where: { projectId } });
  if (!brand) throw new Error('Brand not found');

  const adStyles = [
    'BOLD LUXURY',
    'SIMPLE PREMIUM',
    'LUXURY SERVICE',
  ];

  const adCopies: AdCopy[] = [];

  for (const style of adStyles) {
    const prompt = `
Create an advertisement for: ${productName}
Brand: ${brand.name}
Brand Tone: ${brand.tone}
Style: ${style}
Price: ${productPrice ? `$${productPrice}` : 'Not specified'}
Offer: ${offer || 'None'}

Respond with JSON:
{
  "headline": "catchy headline max 10 words",
  "subheading": "supporting text max 15 words",
  "cta": "call to action button text",
  "price": "${productPrice ? `$${productPrice}` : ''}",
  "offer": "${offer || ''}"
}
`;

    const result = await registry.executeCapability('TEXT_LLM', {
      prompt,
    });

    if (result.status === 'COMPLETED') {
      try {
        const jsonMatch = result.url?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const adData = JSON.parse(jsonMatch[0]);
          adCopies.push(adData);
        }
      } catch (e) {
        console.error('Parse error:', e);
      }
    }
  }

  // Save to database
  await prisma.generation.update({
    where: { id: generationId },
    data: {
      status: 'COMPLETED',
      metadata: {
        adCopies,
        styles: adStyles,
      },
    },
  });

  return adCopies;
}
