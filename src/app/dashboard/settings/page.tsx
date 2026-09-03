// src/app/dashboard/settings/page.tsx
import { auth } from '@/auth.config';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">⚙️ Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Name</label>
            <p className="font-medium">{user?.name || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Account Created</label>
            <p className="font-medium">{user?.createdAt.toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">API key management coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
