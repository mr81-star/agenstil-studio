// src/app/dashboard/library/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';

export default async function LibraryPage() {
  const session = await auth();
  const libraryItems = await prisma.libraryItem.findMany({
    where: { userId: session?.user?.id },
    include: { asset: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const categories: { [key: string]: typeof libraryItems } = {};
  libraryItems.forEach((item) => {
    if (!categories[item.type]) categories[item.type] = [];
    categories[item.type].push(item);
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">📚 Library</h1>

      {libraryItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No generated assets yet. Create a project to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <h2 className="mb-4 text-xl font-bold">{category}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    {item.asset.type === 'IMAGE' && (
                      <img
                        src={item.asset.url}
                        alt={item.type}
                        className="h-40 w-full object-cover"
                      />
                    )}
                    {item.asset.type === 'VIDEO' && (
                      <video
                        src={item.asset.url}
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground">{item.type}</p>
                      <p className="text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
