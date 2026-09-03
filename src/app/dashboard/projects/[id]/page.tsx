// src/app/dashboard/projects/[id]/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProjectActions } from '@/components/project/actions';

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      brand: true,
      website: true,
      products: true,
      services: true,
      generations: { orderBy: { createdAt: 'desc' }, take: 10 },
      workspace: true,
    },
  });

  if (!project || project.workspace.userId !== session?.user?.id) {
    redirect('/dashboard/projects');
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        {project.brand && (
          <p className="text-muted-foreground">🏢 {project.brand.name}</p>
        )}
        {project.website && (
          <p className="text-sm text-muted-foreground">{project.website.url}</p>
        )}
      </div>

      <ProjectActions projectId={project.id} />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Generations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.generations.length}</div>
          </CardContent>
        </Card>
      </div>

      {project.brand && (
        <Card>
          <CardHeader>
            <CardTitle>Brand Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Niche</label>
              <p>{project.brand.niche}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Tone</label>
              <p>{project.brand.tone}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Colors</label>
              <div className="flex gap-2">
                {project.brand.colors.map((color, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-4 text-2xl font-bold">Recent Generations</h2>
        {project.generations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No generations yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {project.generations.map((gen) => (
              <Card key={gen.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{gen.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(gen.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      gen.status === 'COMPLETED' ? 'text-green-500' :
                      gen.status === 'FAILED' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {gen.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
