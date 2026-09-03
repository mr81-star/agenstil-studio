// src/components/dashboard/nav.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Home, Settings, LogOut, Zap, BookOpen, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/projects', label: 'Projects', icon: FileText },
  { href: '/dashboard/generations', label: 'Generations', icon: Zap },
  { href: '/dashboard/library', label: 'Library', icon: BookOpen },
  { href: '/dashboard/agents', label: 'Agents', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="w-full border-b border-border md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="space-y-4 px-4 py-6">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-3xl">🎨</span>
            <span>Agenstil</span>
          </Link>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-border pt-4">
          <div className="mb-4 rounded-md bg-card p-3 text-sm">
            <p className="font-medium">{session?.user?.email}</p>
            <p className="text-xs text-muted-foreground">AI Creative Studio</p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut({ redirect: true, callbackUrl: '/auth/login' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
