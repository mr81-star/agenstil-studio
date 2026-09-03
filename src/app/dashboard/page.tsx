// src/app/dashboard/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DashboardHome() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: { workspaces: { include: { plan: true } } },
  });

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name || user?.email}! 👋</h1>
        <p className="text-muted-foreground">AI Creative Studio - Turn websites into campaigns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Create your first project</p>
            <Link href="/dashboard/projects/new">
              <Button className="w-full">New Project</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">📚 Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">View all generated assets</p>
            <Link href="/dashboard/library">
              <Button variant="outline" className="w-full">
                Open Library
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">🤖 Agents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Chat with AI agents</p>
            <Link href="/dashboard/agents">
              <Button variant="outline" className="w-full">
                Open Agents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Your Workspaces</h2>
        <div className="grid gap-4">
          {user?.workspaces.map((workspace) => (
            <Card key={workspace.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{workspace.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{workspace.plan.name} Plan</p>
                  </div>
                  <Link href={`/dashboard/workspace/${workspace.id}`}>
                    <Button>Select</Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
