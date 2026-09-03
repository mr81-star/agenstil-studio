// src/app/dashboard/layout.tsx
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard/nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
