'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Crown,
  Trophy,
  Star,
  Plus,
  Search,
  Shield,
  Sword,
  Target,
  Award,
  Calendar,
  MapPin,
  User,
  Settings,
  Edit,
  UserPlus,
  MessageSquare,
  TrendingUp,
  Clock,
  Flag
} from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import Link from 'next/link';

interface Clan {
  id: string;
  name: string;
  tag: string;
  description?: string;
  logo?: string;
  points: number;
  wins: number;
  losses: number;
  foundedAt: string;
  isRecruiting: boolean;
  maxMembers: number;
  owner: {
    id: string;
    username: string;
    name?: string;
    image?: string;
  };
  members: Array<{
    user: {
      id: string;
      username: string;
      name?: string;
      image?: string;
      rank: string;
    };
  }>;
  _count: {
    members: number;
  };
}

interface Stats {
  totalClans: number;
  totalMembers: number;
  activeWars: number;
  recruitingClans: number;
}

function getClanLogo(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=281B39&color=fff&size=128&rounded=true`;
}

function getRankColor(index: number) {
  if (index < 3) return 'text-yellow-400';
  if (index < 10) return 'text-gray-300';
  return 'text-orange-400';
}

export default function ClansClient() {
  const t = useTranslations();
  const [clans, setClans] = useState<Clan[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalClans: 0,
    totalMembers: 0,
    activeWars: 0,
    recruitingClans: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClans = async () => {
      try {
        const response = await fetch('/api/clans');
        if (response.ok) {
          const clansData = await response.json();
          setClans(clansData);
          
          // Calculate stats
          const totalMembers = clansData.reduce((sum: number, clan: Clan) => sum + clan._count.members, 0);
          const recruitingClans = clansData.filter((clan: Clan) => clan.isRecruiting).length;
          
          setStats({
            totalClans: clansData.length,
            totalMembers,
            activeWars: 89, // This would come from clan wars API
            recruitingClans
          });
        }
      } catch (error) {
        console.error('Error fetching clans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClans();
  }, []);

  const filteredClans = clans.filter(clan =>
    clan.name.toLowerCase().includes(search.toLowerCase()) ||
    clan.tag.toLowerCase().includes(search.toLowerCase()) ||
    clan.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <AnimatedBackground variant="battle" className="py-16">
          <div className="zh-container text-center">
            <Users className="h-16 w-16 text-zh-accent mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Clans & Teams
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Join or create competitive clans and fight together for glory
            </p>
          </div>
        </AnimatedBackground>

        {/* Stats Section */}
        <section className="py-12 bg-zh-primary/20">
          <div className="zh-container">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {loading ? '---' : stats.totalClans}
                  </div>
                  <div className="text-sm text-gray-400">Active Clans</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {loading ? '---' : stats.totalMembers}
                  </div>
                  <div className="text-sm text-gray-400">Clan Members</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Trophy className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {loading ? '---' : stats.activeWars}
                  </div>
                  <div className="text-sm text-gray-400">Clan Wars Today</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <UserPlus className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {loading ? '---' : stats.recruitingClans}
                  </div>
                  <div className="text-sm text-gray-400">Recruiting Now</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-zh-secondary/20">
          <div className="zh-container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search clans by name, tag, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-zh-secondary border-zh-border text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="gaming">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Clan
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Clans Grid */}
        <section className="py-12">
          <div className="zh-container">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="zh-card animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-zh-border/20 rounded mb-4"></div>
                      <div className="h-16 bg-zh-border/20 rounded mb-4"></div>
                      <div className="h-4 bg-zh-border/20 rounded mb-2"></div>
                      <div className="h-4 bg-zh-border/20 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClans.map((clan, index) => {
                  const winRate = clan.wins + clan.losses > 0 ? (clan.wins / (clan.wins + clan.losses)) * 100 : 0;
                  
                  return (
                    <Card key={clan.id} className="zh-card hover:border-zh-accent/50 transition-all group">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`text-lg font-bold ${getRankColor(index)}`}>
                              #{index + 1}
                            </div>
                            <img
                              src={clan.logo || getClanLogo(clan.name)}
                              alt={clan.name}
                              className="w-12 h-12 rounded-lg"
                            />
                            <div>
                              <CardTitle className="text-white text-lg">
                                {clan.tag} {clan.name}
                              </CardTitle>
                              <div className="text-sm text-gray-400">
                                {clan._count.members}/{clan.maxMembers} members
                              </div>
                            </div>
                          </div>
                          {clan.isRecruiting && (
                            <Badge variant="outline" className="text-zh-accent border-zh-accent">
                              Recruiting
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {clan.description || 'No description available'}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 text-center mb-4">
                          <div>
                            <div className="text-lg font-bold text-zh-accent">{clan.points}</div>
                            <div className="text-xs text-gray-400">Points</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-400">{clan.wins}</div>
                            <div className="text-xs text-gray-400">Wins</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-400">{clan.losses}</div>
                            <div className="text-xs text-gray-400">Losses</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <span>Win Rate: {winRate.toFixed(1)}%</span>
                          <span>Founded: {new Date(clan.foundedAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <Crown className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">
                            Leader: {clan.owner.name || clan.owner.username}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link href={`/clans/${clan.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          {clan.isRecruiting && (
                            <Button variant="gaming" size="sm">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!loading && filteredClans.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No clans found</h3>
                <p className="text-gray-400 mb-4">
                  {search ? 'Try adjusting your search terms' : 'Be the first to create a clan!'}
                </p>
                <Button variant="gaming">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Clan
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
} 