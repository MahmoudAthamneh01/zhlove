'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Trophy, Shield, Activity, Award, Home, Edit } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

interface AdminPageProps {
  params: { locale: string };
}

export default function AdminPage({ params: { locale } }: AdminPageProps) {
  // Enable static rendering for this page
  if (typeof window === 'undefined') {
    setRequestLocale(locale);
  }

  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 0,
    forums: 0,
    tournaments: 0,
    clans: 0,
    onlineUsers: 0,
    badges: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
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
      <div className="zh-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-zh-border">Welcome back, {session.user.name || session.user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="zh-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zh-border text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{(stats.users || 0).toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-zh-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="zh-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zh-border text-sm">Forum Posts</p>
                  <p className="text-2xl font-bold text-white">{(stats.forums || 0).toLocaleString()}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-zh-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="zh-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zh-border text-sm">Active Tournaments</p>
                  <p className="text-2xl font-bold text-white">{(stats.tournaments || 0).toLocaleString()}</p>
                </div>
                <Trophy className="h-8 w-8 text-zh-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="zh-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zh-border text-sm">Total Clans</p>
                  <p className="text-2xl font-bold text-white">{(stats.clans || 0).toLocaleString()}</p>
                </div>
                <Shield className="h-8 w-8 text-zh-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="zh-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zh-border text-sm">Online Now</p>
                  <p className="text-2xl font-bold text-white">{(stats.onlineUsers || 0).toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-zh-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="zh-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zh-border text-sm">Total Badges</p>
                  <p className="text-2xl font-bold text-white">{(stats.badges || 0).toLocaleString()}</p>
                </div>
                <Award className="h-8 w-8 text-zh-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="zh-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Home className="h-5 w-5" />
                Website CMS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/cms/home">
                <Button variant="gaming" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Customize Home Page
                </Button>
              </Link>
              <Link href="/admin/content">
                <Button variant="secondary" className="w-full justify-start">
                  Page Content Manager
                </Button>
              </Link>
              <Link href="/admin/cms/game-info">
                <Button variant="secondary" className="w-full justify-start">
                  Game Information
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="zh-card">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/users">
                <Button variant="secondary" className="w-full justify-start">
                  View All Users
                </Button>
              </Link>
              <Link href="/admin/users?filter=role">
                <Button variant="secondary" className="w-full justify-start">
                  Manage Roles
                </Button>
              </Link>
              <Link href="/admin/users?filter=banned">
                <Button variant="secondary" className="w-full justify-start">
                  Ban/Unban Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="zh-card">
            <CardHeader>
              <CardTitle className="text-white">Content Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/content">
                <Button variant="secondary" className="w-full justify-start">
                  Moderate Posts
                </Button>
              </Link>
              <Link href="/admin/tournaments">
                <Button variant="secondary" className="w-full justify-start">
                  Manage Tournaments
                </Button>
              </Link>
              <Link href="/admin/content?tab=reports">
                <Button variant="secondary" className="w-full justify-start">
                  Review Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 