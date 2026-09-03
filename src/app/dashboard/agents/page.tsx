// src/app/dashboard/agents/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AgentsPage() {
  const session = await auth();
  const agents = await prisma.agent.findMany({
    where: { userId: session?.user?.id },
    include: {
      conversations: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  const agentEmojis: { [key: string]: string } = {
    PERSONAL_ASSISTANT: '👤',
    REGENERATION: '🔄',
    MEMORY: '💾',
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">🤖 Intelligent Agents</h1>
        <p className="text-muted-foreground">Chat with AI agents to manage your campaigns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{agentEmojis[agent.type] || '🤖'}</span>
                {agent.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{agent.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground">
                {agent.conversations.length} conversation{agent.conversations.length !== 1 ? 's' : ''}
              </div>
              <Link href={`/dashboard/agents/${agent.id}`}>
                <Button className="w-full">Chat</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
