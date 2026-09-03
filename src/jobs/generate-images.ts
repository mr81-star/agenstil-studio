// src/jobs/generate-images.ts
import { prisma } from '@/lib/db';
import { registry } from '@/providers/registry';
import { BrandAnalysis } from '@/providers/types';

export async function generatePhotoshootImages(
  generationId: string,
  projectId: string,
  productName: string,
  style: 'BOLD' | 'SIMPLE' | 'LUXURY',
  quantity: number = 5
) {
  const brand = await prisma.brand.findUnique({ where: { projectId } });
  if (!brand) throw new Error('Brand not found');

  const stylePrompts = {
    BOLD: 'Bold, vibrant, eye-catching professional product photography',
    SIMPLE: 'Clean, minimal, elegant product photography',
    LUXURY: 'Premium, cinematic, luxury product photography with dramatic lighting',
  };

  const prompt = `
Professional product photography of ${productName}.
Style: ${stylePrompts[style]}
Brand colors: ${brand.colors.join(', ')}
Brand tone: ${brand.tone}
Highly detailed, 4K, professional lighting, white background.
`;

  const urls: string[] = [];

  for (let i = 0; i < quantity; i++) {
    try {
      // This would call ComfyUI in production
      const mockUrl = `/uploads/photoshoot-${generationId}-${i + 1}.png`;
      urls.push(mockUrl);

      // Create asset
      await prisma.asset.create({
        data: {
          projectId,
          type: 'IMAGE',
          url: mockUrl,
          tags: ['photoshoot', style.toLowerCase(), productName],
        },
      });
    } catch (error) {
      console.error('Image generation failed:', error);
    }
  }

  // Update generation status
  await prisma.generation.update({
    where: { id: generationId },
    data: {
      status: 'COMPLETED',
      resultUrl: urls[0],
      metadata: {
        urls,
        style,
        quantity,
      },
    },
  });

  return urls;
}
