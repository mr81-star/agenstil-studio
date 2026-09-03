// src/app/api/projects/route.ts
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workspaceId, name, url } = await req.json();

    // Verify workspace belongs to user
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace || workspace.userId !== session.user.id) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        workspaceId,
      },
    });

    // If URL provided, create website record
    if (url) {
      await prisma.website.create({
        data: {
          projectId: project.id,
          url,
        },
      });
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
