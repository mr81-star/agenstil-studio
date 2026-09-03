// src/app/api/agents/chat/route.ts
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { registry } from '@/providers/registry';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { agentId, conversationId, message } = await req.json();

    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent || agent.userId !== session.user.id) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const conv = await prisma.conversation.create({
        data: {
          agentId,
          title: message.substring(0, 50),
        },
      });
      convId = conv.id;
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: convId,
        role: 'user',
        content: message,
      },
    });

    // Get agent response using LLM
    const systemPrompt = `You are ${agent.name}. ${agent.description || 'Help the user with their marketing campaign.'}
Be helpful, concise, and actionable.`;

    const result = await registry.executeCapability('TEXT_LLM', {
      prompt: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`,
    });

    if (result.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Failed to get agent response' },
        { status: 500 }
      );
    }

    // Save assistant message
    const assistantMsg = await prisma.message.create({
      data: {
        conversationId: convId,
        role: 'assistant',
        content: result.url || 'I apologize, I could not generate a response.',
      },
    });

    return NextResponse.json({
      conversationId: convId,
      messageId: assistantMsg.id,
      response: assistantMsg.content,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
