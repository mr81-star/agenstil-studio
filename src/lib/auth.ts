// src/lib/auth.ts
import { hash, compare } from 'bcryptjs';
import { prisma } from './db';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      workspaces: { include: { plan: true } },
      agents: true,
    },
  });
}

export async function createUser(
  email: string,
  password: string,
  name?: string
) {
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // Create default workspace with BRAND plan
  const brandPlan = await prisma.plan.findUnique({
    where: { name: 'BRAND' },
  });

  if (brandPlan) {
    await prisma.workspace.create({
      data: {
        name: 'My Workspace',
        userId: user.id,
        planId: brandPlan.id,
      },
    });
  }

  return user;
}
