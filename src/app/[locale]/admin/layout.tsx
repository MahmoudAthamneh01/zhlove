'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  Shield, 
  Award, 
  Settings, 
  FileText, 
  BarChart3,
  Flag,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/content', label: 'Content Moderation', icon: MessageSquare },
  { href: '/admin/tournaments', label: 'Tournament Management', icon: Trophy },
  { href: '/admin/clans', label: 'Clan Management', icon: Shield },
  { href: '/admin/badges', label: 'Badge Management', icon: Award },
  { href: '/admin/cms', label: 'Content Management', icon: FileText },
  { href: '/admin/reports', label: 'Reports & Flags', icon: Flag },
  { href: '/admin/settings', label: 'System Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;
    
    // Only redirect if we're completely sure there's no session
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Check admin role only when we have a valid session
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zh-accent/20 border-t-zh-accent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        {/* Admin Sidebar */}
        <div className="w-64 bg-zh-secondary border-r border-zh-border/20">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <Crown className="h-6 w-6 text-zh-accent" />
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            </div>
            
            <nav className="space-y-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive 
                        ? "bg-zh-accent text-white" 
                        : "text-zh-border hover:text-white hover:bg-zh-container"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-zh-primary">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 