// src/app/dashboard/agents/[id]/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentChat } from '@/components/agent/chat';

export default async function AgentPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const agent = await prisma.agent.findUnique({
    where: { id: params.id },
    include: {
      conversations: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      },
    },
  });

  if (!agent || agent.userId !== session?.user?.id) {
    redirect('/dashboard/agents');
  }

  const agentEmojis: { [key: string]: string } = {
    PERSONAL_ASSISTANT: '👨',
    REGENERATION: '🔄',
    MEMORY: '💾',
  };

  const agentDescriptions: { [key: string]: string } = {
    PERSONAL_ASSISTANT: 'Your AI assistant for campaign planning and strategy',
    REGENERATION: 'Regenerate and modify existing generations with prompts',
    MEMORY: 'Store and retrieve project information and insights',
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{agentEmojis[agent.type] || '🤖'}</div>
        <div>
          <h1 className="text-3xl font-bold">{agent.name}</h1>
          <p className="text-muted-foreground">
            {agentDescriptions[agent.type] || agent.description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentChat agentId={agent.id} conversationId={agent.conversations[0]?.id} />
        </CardContent>
      </Card>
    </div>
  );
}
