// src/jobs/generate-testimonials.ts
import { prisma } from '@/lib/db';
import { registry } from '@/providers/registry';

export interface TestimonialVideo {
  testimonial_id: string;
  customer_name: string;
  customer_role: string;
  quote: string;
  rating: number; // 1-5
  video_script: string;
}

export async function generateTestimonialContent(
  generationId: string,
  projectId: string,
  productName: string,
  quantity: number = 3
): Promise<TestimonialVideo[]> {
  try {
    console.log(`⭐ Generating ${quantity} testimonial videos`);

    const brand = await prisma.brand.findUnique({ where: { projectId } });
    if (!brand) throw new Error('Brand not found');

    const testimonials: TestimonialVideo[] = [];

    for (let i = 0; i < quantity; i++) {
      const prompt = `
Create a testimonial for: ${productName}
Brand: ${brand.name}
Brand Tone: ${brand.tone}

Generate a realistic customer testimonial video script:

Respond with JSON:
{
  "testimonial_id": "testimonial_${i + 1}",
  "customer_name": "realistic customer name",
  "customer_role": "e.g. Small Business Owner, Freelancer",
  "quote": "short powerful quote 2-3 sentences",
  "rating": 5,
  "video_script": "30-60 second video script for testimonial"
}
`;

      const result = await registry.executeCapability('TEXT_LLM', {
        prompt,
      });

      if (result.status === 'COMPLETED') {
        try {
          const jsonMatch = result.url?.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const testimonialData = JSON.parse(jsonMatch[0]);
            testimonials.push(testimonialData);

            // Create generation record for video
            const videoGen = await prisma.generation.create({
              data: {
                projectId,
                type: 'TESTIMONIAL_VIDEO',
                status: 'QUEUED',
                metadata: {
                  testimonialData,
                },
              },
            });
          }
        } catch (e) {
          console.error('Parse error for testimonial', i + 1, e);
        }
      }
    }

    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'COMPLETED',
        metadata: {
          testimonials,
          quantity: testimonials.length,
        },
      },
    });

    console.log(`✅ Generated ${testimonials.length} testimonial scripts`);
    return testimonials;
  } catch (error) {
    console.error('❌ Testimonial generation failed:', error);
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
