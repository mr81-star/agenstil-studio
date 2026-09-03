// src/app/api/projects/[id]/generations/route.ts
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import Redis from 'redis';

const redis = Redis.createClient({
  url: process.env.REDIS_URL,
});

const jobQueues: { [key: string]: Queue } = {};

function getQueue(jobType: string): Queue {
  if (!jobQueues[jobType]) {
    jobQueues[jobType] = new Queue(jobType, { connection: redis });
  }
  return jobQueues[jobType];
}

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

    const { type, payload } = await req.json();

    // Create generation record
    const generation = await prisma.generation.create({
      data: {
        projectId: params.id,
        type,
        status: 'QUEUED',
        metadata: payload,
      },
    });

    // Queue the job
    const queue = getQueue(type);
    await queue.add(type, {
      projectId: params.id,
      generationId: generation.id,
      ...payload,
    });

    return NextResponse.json({
      generationId: generation.id,
      message: `${type} queued for generation`,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to queue generation' },
      { status: 500 }
    );
  }
}
