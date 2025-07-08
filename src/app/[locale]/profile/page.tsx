'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  Settings,
  Trophy,
  Users,
  Star,
  Clock,
  MapPin,
  Calendar,
  Edit,
  MessageSquare,
  GamepadIcon,
  Target,
  Award,
  TrendingUp,
  Shield,
  Crown,
  Medal,
  Zap
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  image?: string;
  rank: string;
  points: number;
  wins: number;
  losses: number;
  level: number;
  xp: number;
  joinedAt: string;
  lastSeen: string;
  role: string;
  badges: Array<{
    badge: {
      name: string;
      description: string;
      icon: string;
    };
  }>;
  clan?: {
    name: string;
    tag: string;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchUserProfile();
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/users/${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'legendary': return 'text-purple-400';
      case 'general': return 'text-red-400';
      case 'colonel': return 'text-blue-400';
      case 'major': return 'text-green-400';
      case 'captain': return 'text-yellow-400';
      case 'lieutenant': return 'text-orange-400';
      case 'sergeant': return 'text-gray-400';
      case 'recruit': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const calculateWinRate = (wins: number, losses: number) => {
    const total = wins + losses;
    return total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
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

  if (!session || !userProfile) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
            <Button onClick={() => router.push('/')}>Go Home</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-8">
        <div className="zh-container">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <Card className="zh-card">
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-zh-accent bg-zh-primary flex items-center justify-center">
                    {userProfile.image ? (
                      <img 
                        src={userProfile.image} 
                        alt={userProfile.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-zh-accent" />
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-white mb-2">{userProfile.username}</h1>
                  <p className="text-gray-300 mb-4">{userProfile.name}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge className={`${getRankColor(userProfile.rank)} bg-zh-accent/20`}>
                      <Crown className="h-4 w-4 mr-1" />
                      {userProfile.rank}
                    </Badge>
                    <Badge variant="secondary">
                      Level {userProfile.level}
                    </Badge>
                    {userProfile.role === 'admin' && (
                      <Badge className="bg-red-500/20 text-red-400">
                        <Shield className="h-4 w-4 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-white">{userProfile.points.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Ranking Points</div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-zh-accent">{userProfile.xp.toLocaleString()} XP</div>
                    <div className="text-sm text-gray-400">Experience Points</div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-300 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(userProfile.joinedAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Last seen {formatDate(userProfile.lastSeen)}
                    </div>
                    {userProfile.clan && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {userProfile.clan.name} [{userProfile.clan.tag}]
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="gaming" className="w-full flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Achievements */}
              {userProfile.badges.length > 0 && (
                <Card className="zh-card mt-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Badges & Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {userProfile.badges.map((userBadge, index) => (
                      <div key={index} className="text-center p-3 rounded-lg bg-zh-primary/30">
                        <div className="text-2xl mb-2">{userBadge.badge.icon}</div>
                        <div className="text-xs font-medium text-white">{userBadge.badge.name}</div>
                        <div className="text-xs text-gray-400">{userBadge.badge.description}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              
              {/* Stats Overview */}
              <Card className="zh-card mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Game Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{userProfile.wins}</div>
                      <div className="text-sm text-gray-400">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{userProfile.losses}</div>
                      <div className="text-sm text-gray-400">Losses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{userProfile.wins + userProfile.losses}</div>
                      <div className="text-sm text-gray-400">Total Games</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{calculateWinRate(userProfile.wins, userProfile.losses)}%</div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card className="zh-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Username</label>
                        <div className="text-white font-medium">{userProfile.username}</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Display Name</label>
                        <div className="text-white font-medium">{userProfile.name}</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <div className="text-white font-medium">{userProfile.email}</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Account Type</label>
                        <div className="text-white font-medium capitalize">{userProfile.role}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 