// src/app/api/projects/[id]/analyze/route.ts
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { analyzeBrand } from '@/jobs/analyze-brand';
import { Queue } from 'bullmq';
import Redis from 'redis';

const redis = Redis.createClient({
  url: process.env.REDIS_URL,
});

const analyzeQueue = new Queue('analyze-brand', { connection: redis });

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { workspace: true },
    });

    if (!project || project.workspace.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const website = await prisma.website.findUnique({
      where: { projectId: params.id },
    });

    if (!website) {
      return NextResponse.json(
        { error: 'No website URL configured' },
        { status: 400 }
      );
    }

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        projectId: params.id,
        type: 'BRAND_ANALYSIS',
        status: 'QUEUED',
      },
    });

    // Queue the job
    await analyzeQueue.add('analyze', {
      projectId: params.id,
      url: website.url,
      generationId: generation.id,
    });

    return NextResponse.json({
      generationId: generation.id,
      message: 'Brand analysis queued',
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to start analysis' },
      { status: 500 }
    );
  }
}
