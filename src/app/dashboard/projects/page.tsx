// src/app/dashboard/projects/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ProjectsPage() {
  const session = await auth();
  const projects = await prisma.project.findMany({
    where: {
      workspace: { userId: session?.user?.id },
    },
    include: { brand: true, workspace: true },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Projects</h1>
        <Link href="/dashboard/workspace">
          <Button>+ New Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-muted-foreground">No projects yet</p>
            <Link href="/dashboard/workspace">
              <Button>Create Your First Project</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:bg-accent/5 transition">
              <CardContent className="p-6">
                <h3 className="mb-1 font-bold">{project.name}</h3>
                {project.brand && (
                  <p className="mb-4 text-sm text-muted-foreground">{project.brand.name}</p>
                )}
                <p className="mb-4 text-xs text-muted-foreground">{project.workspace.name}</p>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Button className="w-full">Open</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
