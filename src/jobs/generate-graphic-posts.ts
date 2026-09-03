// src/jobs/generate-graphic-posts.ts
import { prisma } from '@/lib/db';
import { registry } from '@/providers/registry';

export interface GraphicPostConfig {
  type: 'PRODUCT_SHOWCASE' | 'TESTIMONIAL' | 'PROMOTION' | 'EDUCATIONAL';
  headline: string;
  subtext: string;
  cta?: string;
  productImage?: string;
  style: 'BOLD' | 'MINIMAL' | 'LUXURY' | 'MODERN';
}

export async function generateGraphicPost(
  generationId: string,
  projectId: string,
  config: GraphicPostConfig
) {
  try {
    console.log(`🎨 Generating graphic post: ${config.type}`);

    const brand = await prisma.brand.findUnique({ where: { projectId } });
    if (!brand) throw new Error('Brand not found');

    // Generate design prompt
    const designPrompt = `
Create a social media graphic design:
Type: ${config.type}
Headline: ${config.headline}
Subtext: ${config.subtext}
Style: ${config.style}
Brand Colors: ${brand.colors.join(', ')}
Brand Tone: ${brand.tone}

Make it eye-catching, mobile-optimized (1080x1350px), and ready for Instagram/TikTok.
`;

    // In production: call ComfyUI or Tensor.Art
    const imagePath = `/uploads/graphic-post-${generationId}.png`;
    console.log(`✨ Designing graphic post...`);

    const asset = await prisma.asset.create({
      data: {
        projectId,
        type: 'IMAGE',
        url: imagePath,
        dimensions: '1080x1350',
        tags: ['graphic-post', config.type.toLowerCase(), config.style.toLowerCase()],
        metadata: {
          postConfig: config,
          designPrompt,
        },
      },
    });

    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'COMPLETED',
        resultUrl: imagePath,
        metadata: {
          postConfig: config,
          assetId: asset.id,
        },
      },
    });

    console.log(`✅ Graphic post generated: ${imagePath}`);
    return imagePath;
  } catch (error) {
    console.error('❌ Graphic post generation failed:', error);
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

export async function generateAnimatedGraphicPost(
  generationId: string,
  projectId: string,
  config: GraphicPostConfig,
  duration: number = 6
) {
  try {
    console.log(`🎬 Generating animated graphic post`);

    // First generate static graphic
    const staticPath = `/uploads/graphic-static-${generationId}.png`;

    // Then animate it
    const videoPath = `/uploads/graphic-animated-${generationId}.mp4`;

    const asset = await prisma.asset.create({
      data: {
        projectId,
        type: 'VIDEO',
        url: videoPath,
        duration,
        tags: ['animated-graphic-post', config.type.toLowerCase()],
        metadata: {
          postConfig: config,
          staticImagePath: staticPath,
        },
      },
    });

    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'COMPLETED',
        resultUrl: videoPath,
        metadata: {
          postConfig: config,
          assetId: asset.id,
          duration,
        },
      },
    });

    console.log(`✅ Animated graphic post generated: ${videoPath}`);
    return videoPath;
  } catch (error) {
    console.error('❌ Animated graphic post generation failed:', error);
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
