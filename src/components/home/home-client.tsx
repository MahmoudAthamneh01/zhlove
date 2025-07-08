'use client';

import { useTranslations } from 'next-intl';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GamingCard } from '@/components/ui/gaming-card';
import { XPProgressBar } from '@/components/ui/xp-progress-bar';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  MessageSquare, 
  Gamepad2,
  Swords,
  Target,
  Zap,
  Crown,
  Shield,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  overview: {
    totalUsers: number;
    totalClans: number;
    activeTournaments: number;
    totalForumPosts: number;
    onlineUsers: number;
    totalReplays: number;
    completedMatches: number;
    totalBadges: number;
  };
  activity: {
    newUsersToday: number;
    newPostsToday: number;
    newTournamentsToday: number;
    newClansToday: number;
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default function HomePageClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mock data for demonstration when stats are loading
  const playerStats = {
    level: 42,
    currentXP: 3250,
    maxXP: 5000,
    rank: 'Diamond',
    winRate: 67
  };

  const liveStats = loading || !stats ? [
    { icon: Users, value: '---', label: t('home.stats.totalMembers'), trend: '---', color: 'text-zh-accent' },
    { icon: Trophy, value: '---', label: t('home.stats.activeTournaments'), trend: '---', color: 'text-zh-gold' },
    { icon: MessageSquare, value: '---', label: t('home.stats.forumPosts'), trend: '---', color: 'text-zh-blue' },
    { icon: Gamepad2, value: '---', label: t('home.stats.onlinePlayers'), trend: 'LIVE', color: 'text-zh-red' }
  ] : [
    { 
      icon: Users, 
      value: formatNumber(stats.overview.totalUsers), 
      label: t('home.stats.totalMembers'), 
      trend: stats.activity.newUsersToday > 0 ? `+${stats.activity.newUsersToday}` : '0', 
      color: 'text-zh-accent' 
    },
    { 
      icon: Trophy, 
      value: stats.overview.activeTournaments.toString(), 
      label: t('home.stats.activeTournaments'), 
      trend: stats.activity.newTournamentsToday > 0 ? `+${stats.activity.newTournamentsToday}` : '0', 
      color: 'text-zh-gold' 
    },
    { 
      icon: MessageSquare, 
      value: formatNumber(stats.overview.totalForumPosts), 
      label: t('home.stats.forumPosts'), 
      trend: stats.activity.newPostsToday > 0 ? `+${stats.activity.newPostsToday}` : '0', 
      color: 'text-zh-blue' 
    },
    { 
      icon: Gamepad2, 
      value: stats.overview.onlineUsers.toString(), 
      label: t('home.stats.onlinePlayers'), 
      trend: 'LIVE', 
      color: 'text-zh-red' 
    }
  ];

  const features = [
    {
      icon: Swords,
      title: t('home.features.clans.title'),
      description: t('home.features.clans.description'),
      action: t('home.features.clans.action'),
      href: '/clans',
      color: 'from-zh-red to-red-800',
      glowColor: '#D85C5C'
    },
    {
      icon: Target,
      title: t('home.features.rankings.title'),
      description: t('home.features.rankings.description'),
      action: t('home.features.rankings.action'),
      href: '/rankings',
      color: 'from-zh-accent to-green-700',
      glowColor: '#3A9A5B'
    },
    {
      icon: MessageSquare,
      title: t('home.features.forum.title'),
      description: t('home.features.forum.description'),
      action: t('home.features.forum.action'),
      href: '/forum',
      color: 'from-zh-blue to-blue-700',
      glowColor: '#326DA8'
    },
    {
      icon: Trophy,
      title: t('home.features.tournaments.title'),
      description: t('home.features.tournaments.description'),
      action: t('home.features.tournaments.action'),
      href: '/tournaments',
      color: 'from-zh-gold to-yellow-600',
      glowColor: '#F2C94C'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section with Animated Background */}
      <AnimatedBackground variant="hero" className="relative -mt-20 pt-20">
        <div className="min-h-[600px] flex items-center justify-center py-20">
          <div className="zh-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Animated Logo/Title */}
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-zh-accent to-zh-gold bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                {t('home.hero.title')}
              </motion.h1>
              
              <p className="text-xl md:text-2xl text-zh-border mb-8 max-w-3xl mx-auto">
                {t('home.hero.subtitle')}
              </p>

              {/* CTA Buttons with hover effects */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="gaming" 
                    size="lg" 
                    className="min-w-[200px] text-lg shadow-lg shadow-zh-accent/30"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    {t('home.hero.joinNow')}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="min-w-[200px] text-lg"
                  >
                    {t('home.hero.learnMore')}
                  </Button>
                </motion.div>
              </div>

              {/* Player Progress Preview */}
              <motion.div 
                className="mt-12 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <XPProgressBar 
                  currentXP={playerStats.currentXP}
                  maxXP={playerStats.maxXP}
                  level={playerStats.level}
                  size="lg"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatedBackground>

      {/* Live Stats Section */}
      <section className="py-16 relative">
        <div className="zh-container">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {liveStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GamingCard variant="default" glowColor={stat.color}>
                  <div className="text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-zh-border">{stat.label}</div>
                    {stat.trend && (
                      <div className={`text-xs mt-2 ${stat.trend === 'LIVE' ? 'text-zh-red animate-pulse' : 'text-zh-accent'}`}>
                        {stat.trend === 'LIVE' ? (
                          <span className="flex items-center justify-center gap-1">
                            <Activity className="h-3 w-3" />
                            {stat.trend}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {stat.trend}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </GamingCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <AnimatedBackground variant="subtle">
          <div className="zh-container">
            <motion.h2 
              className="text-4xl font-bold text-center text-white mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t('home.features.title')}
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Link href={`/${locale}${feature.href}`}>
                    <GamingCard 
                      variant="battle" 
                      glowColor={feature.glowColor}
                      className="h-full group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} shadow-lg`}>
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zh-gold transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-zh-border mb-4">
                            {feature.description}
                          </p>
                          <span className="text-zh-accent font-medium group-hover:translate-x-2 inline-block transition-transform">
                            {feature.action} →
                          </span>
                        </div>
                      </div>
                    </GamingCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedBackground>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zh-accent/20 to-zh-gold/20 animate-pulse" />
        <div className="zh-container relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Crown className="h-16 w-16 text-zh-gold mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-zh-border mb-8 max-w-2xl mx-auto">
              {t('home.cta.description')}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="gold" 
                size="lg" 
                className="text-lg px-8 shadow-lg shadow-zh-gold/30"
              >
                <Shield className="mr-2 h-5 w-5" />
                {t('home.cta.action')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
} 