// src/app/api/auth/register/route.ts
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Get BRAND plan
    const brandPlan = await prisma.plan.findUnique({
      where: { name: 'BRAND' },
    });

    if (!brandPlan) {
      return NextResponse.json(
        { error: 'Default plan not found' },
        { status: 500 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Create default workspace
    await prisma.workspace.create({
      data: {
        name: 'My Workspace',
        userId: user.id,
        planId: brandPlan.id,
      },
    });

    // Create default agents
    await prisma.agent.create({
      data: {
        userId: user.id,
        name: 'Regeneration Agent',
        type: 'REGENERATION',
        description: 'Regenerate and modify existing generations',
      },
    });

    await prisma.agent.create({
      data: {
        userId: user.id,
        name: 'Memory Agent',
        type: 'MEMORY',
        description: 'Store and retrieve project information',
      },
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
