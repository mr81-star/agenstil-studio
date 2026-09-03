// src/app/dashboard/generations/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function GenerationsPage() {
  const session = await auth();
  const generations = await prisma.generation.findMany({
    where: {
      project: { workspace: { userId: session?.user?.id } },
    },
    include: { project: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const statusColors: { [key: string]: string } = {
    COMPLETED: 'text-green-500',
    FAILED: 'text-red-500',
    RUNNING: 'text-blue-500',
    QUEUED: 'text-yellow-500',
    WAITING_FOR_PROVIDER: 'text-orange-500',
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">⚡ All Generations</h1>

      {generations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No generations yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {generations.map((gen) => (
            <Card key={gen.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium">{gen.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Project</p>
                    <p className="font-medium">{gen.project.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Provider</p>
                    <p className="font-medium">{gen.provider || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className={`font-medium ${statusColors[gen.status] || 'text-muted-foreground'}`}>
                      {gen.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-medium text-xs">
                      {new Date(gen.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
