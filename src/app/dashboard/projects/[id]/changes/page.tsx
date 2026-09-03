// src/app/dashboard/projects/[id]/changes/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ChangesPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      workspace: true,
      changeEvents: { orderBy: { detectedAt: 'desc' }, take: 50 },
    },
  });

  if (!project || project.workspace.userId !== session?.user?.id) {
    redirect('/dashboard/projects');
  }

  const changeTypeColors: { [key: string]: string } = {
    NEW_PRODUCT: 'bg-green-500',
    PRICE_CHANGE: 'bg-blue-500',
    PRODUCT_REMOVED: 'bg-red-500',
    WEBSITE_UPDATE: 'bg-purple-500',
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">🔍 Website Changes</h1>
        <p className="text-muted-foreground">Auto-detected changes on {project.name}</p>
      </div>

      {project.changeEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No changes detected yet. The website watcher checks every 24 hours.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {project.changeEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="flex items-start justify-between p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${changeTypeColors[event.type] || 'bg-gray-500'} text-white`}
                    >
                      {event.type}
                    </Badge>
                    <p className="font-medium">{event.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.detectedAt).toLocaleString()}
                  </p>
                </div>
                {!event.processed && (
                  <Badge variant="outline">Pending Action</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
