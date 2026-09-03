// src/app/dashboard/workspace/[id]/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function WorkspacePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: {
      plan: true,
      projects: {
        include: { brand: true },
      },
    },
  });

  if (!workspace || workspace.userId !== session?.user?.id) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">{workspace.name}</h1>
        <p className="text-muted-foreground">Plan: {workspace.plan.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspace.projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspace.plan.name}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Link href={`/dashboard/workspace/${workspace.id}/projects/new`}>
            <Button>+ New Project</Button>
          </Link>
        </div>

        {workspace.projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No projects yet. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {workspace.projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      {project.brand && (
                        <p className="text-sm text-muted-foreground">{project.brand.name}</p>
                      )}
                    </div>
                    <Link href={`/dashboard/workspace/${workspace.id}/projects/${project.id}`}>
                      <Button>Open</Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
