'use client';

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

interface HomeSection {
  id: string;
  type: 'hero' | 'stats' | 'features' | 'cta' | 'custom';
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  order: number;
  isVisible: boolean;
  settings: {
    bgColor?: string;
    textColor?: string;
    buttonColor?: string;
    alignment?: 'left' | 'center' | 'right';
    animation?: string;
    customClass?: string;
  };
}

interface HomePageConfig {
  sections: HomeSection[];
  globalSettings: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    customCSS: string;
  };
  lastModified?: string;
  lastPublished?: string;
}

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

interface DynamicHomePageClientProps {
  translations: Record<string, string>;
  locale: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default function DynamicHomePageClient({ translations, locale }: DynamicHomePageClientProps) {
  const [homeConfig, setHomeConfig] = useState<HomePageConfig | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch home page configuration and stats in parallel
        const [configResponse, statsResponse] = await Promise.all([
          fetch('/api/cms/home'),
          fetch('/api/stats')
        ]);

        if (configResponse.ok) {
          const configData = await configResponse.json();
          setHomeConfig(configData);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderHeroSection = (section: HomeSection) => {
    const title = locale === 'ar' ? section.titleAr || section.title : section.title;
    const content = locale === 'ar' ? section.contentAr || section.content : section.content;
    
    return (
      <div 
        className="relative -mt-20 pt-20"
        style={{ backgroundColor: section.settings.bgColor }}
      >
        <AnimatedBackground 
          variant="hero" 
          className="absolute inset-0"
        />
        <div className="relative z-10">
        <div className="min-h-[600px] flex items-center justify-center py-20">
          <div className="zh-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-zh-accent to-zh-gold bg-clip-text text-transparent"
                style={{ color: section.settings.textColor }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                {title}
              </motion.h1>
              
              <p 
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
                style={{ color: section.settings.textColor || '#FFFFFF' }}
              >
                {content}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="gaming" 
                    size="lg" 
                    className="min-w-[200px] text-lg shadow-lg"
                    style={{ backgroundColor: section.settings.buttonColor }}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    {translations['home.hero.joinNow']}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="min-w-[200px] text-lg border-white text-white hover:bg-white hover:text-black"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {translations['home.hero.learnMore']}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      </div>
    );
  };

  const renderStatsSection = (section: HomeSection) => {
    if (!stats) return null;

    const title = locale === 'ar' ? section.titleAr || section.title : section.title;
    
    const liveStats = [
      { 
        icon: Users, 
        value: formatNumber(stats.overview.totalUsers), 
        label: translations['home.stats.totalMembers'], 
        trend: stats.activity.newUsersToday > 0 ? `+${stats.activity.newUsersToday}` : '0', 
        color: 'text-zh-accent' 
      },
      { 
        icon: Trophy, 
        value: stats.overview.activeTournaments.toString(), 
        label: translations['home.stats.activeTournaments'], 
        trend: stats.activity.newTournamentsToday > 0 ? `+${stats.activity.newTournamentsToday}` : '0', 
        color: 'text-zh-gold' 
      },
      { 
        icon: MessageSquare, 
        value: formatNumber(stats.overview.totalForumPosts), 
        label: translations['home.stats.forumPosts'], 
        trend: stats.activity.newPostsToday > 0 ? `+${stats.activity.newPostsToday}` : '0', 
        color: 'text-zh-blue' 
      },
      { 
        icon: Gamepad2, 
        value: stats.overview.onlineUsers.toString(), 
        label: translations['home.stats.onlinePlayers'], 
        trend: 'LIVE', 
        color: 'text-zh-red' 
      }
    ];

    return (
      <section 
        className="py-20"
        style={{ backgroundColor: section.settings.bgColor }}
      >
        <div className="zh-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: section.settings.textColor }}
            >
              {title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {liveStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GamingCard className="h-full text-center group">
                    <div className={`${stat.color} text-5xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={48} className="mx-auto" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-zh-border text-sm mb-2">
                      {stat.label}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${stat.trend === 'LIVE' ? 'bg-zh-red text-white animate-pulse' : 'bg-zh-accent/20 text-zh-accent'}`}>
                      {stat.trend}
                    </div>
                  </GamingCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderFeaturesSection = (section: HomeSection) => {
    const title = locale === 'ar' ? section.titleAr || section.title : section.title;
    const content = locale === 'ar' ? section.contentAr || section.content : section.content;

    const features = [
      {
        icon: Swords,
        title: translations['home.features.clans.title'],
        description: translations['home.features.clans.description'],
        action: translations['home.features.clans.action'],
        href: '/clans',
        color: 'from-zh-red to-red-800',
        glowColor: '#D85C5C'
      },
      {
        icon: Target,
        title: translations['home.features.rankings.title'],
        description: translations['home.features.rankings.description'],
        action: translations['home.features.rankings.action'],
        href: '/rankings',
        color: 'from-zh-accent to-green-700',
        glowColor: '#3A9A5B'
      },
      {
        icon: MessageSquare,
        title: translations['home.features.forum.title'],
        description: translations['home.features.forum.description'],
        action: translations['home.features.forum.action'],
        href: '/forum',
        color: 'from-zh-blue to-blue-700',
        glowColor: '#326DA8'
      },
      {
        icon: Trophy,
        title: translations['home.features.tournaments.title'],
        description: translations['home.features.tournaments.description'],
        action: translations['home.features.tournaments.action'],
        href: '/tournaments',
        color: 'from-zh-gold to-yellow-600',
        glowColor: '#F2C94C'
      }
    ];

    return (
      <section 
        className="py-20"
        style={{ backgroundColor: section.settings.bgColor }}
      >
        <div className="zh-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: section.settings.textColor }}
            >
              {title}
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: section.settings.textColor || '#FFFFFF' }}
            >
              {content}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <GamingCard className="h-full text-center relative overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    
                    <div className="relative z-10">
                      <div 
                        className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{ boxShadow: `0 0 20px ${feature.glowColor}40` }}
                      >
                        <Icon size={32} className="text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      
                      <p className="text-zh-border mb-6 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <Link href={feature.href}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group-hover:bg-white group-hover:text-black transition-colors duration-300"
                        >
                          {feature.action}
                        </Button>
                      </Link>
                    </div>
                  </GamingCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderCtaSection = (section: HomeSection) => {
    const title = locale === 'ar' ? section.titleAr || section.title : section.title;
    const content = locale === 'ar' ? section.contentAr || section.content : section.content;

    return (
      <section 
        className="py-20"
        style={{ backgroundColor: section.settings.bgColor }}
      >
        <div className="zh-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: section.settings.textColor }}
            >
              {title}
            </h2>
            
            <p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              style={{ color: section.settings.textColor || '#FFFFFF' }}
            >
              {content}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="gaming" 
                size="lg"
                className="min-w-[200px]"
                style={{ backgroundColor: section.settings.buttonColor }}
              >
                <Crown className="mr-2 h-5 w-5" />
                {translations['home.cta.register']}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="min-w-[200px] border-white text-white hover:bg-white hover:text-black"
              >
                <Shield className="mr-2 h-5 w-5" />
                {translations['home.cta.learn']}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  const renderCustomSection = (section: HomeSection) => {
    const title = locale === 'ar' ? section.titleAr || section.title : section.title;
    const content = locale === 'ar' ? section.contentAr || section.content : section.content;

    return (
      <section 
        className={`py-20 ${section.settings.customClass || ''}`}
        style={{ backgroundColor: section.settings.bgColor }}
      >
        <div className="zh-container">
          <div 
            className={`text-${section.settings.alignment || 'center'}`}
          >
            {title && (
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ color: section.settings.textColor }}
              >
                {title}
              </h2>
            )}
            
            {content && (
              <div 
                className="prose prose-lg max-w-none"
                style={{ color: section.settings.textColor }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderSection = (section: HomeSection) => {
    if (!section.isVisible) return null;

    switch (section.type) {
      case 'hero':
        return renderHeroSection(section);
      case 'stats':
        return renderStatsSection(section);
      case 'features':
        return renderFeaturesSection(section);
      case 'cta':
        return renderCtaSection(section);
      case 'custom':
        return renderCustomSection(section);
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-zh-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zh-accent mx-auto mb-4"></div>
            <p className="text-zh-border">{translations['common.loading']}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Apply global custom CSS */}
      {homeConfig?.globalSettings?.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: homeConfig.globalSettings.customCSS }} />
      )}
      
      {/* Render sections in order */}
      {homeConfig?.sections
        ?.sort((a, b) => a.order - b.order)
        ?.map((section) => (
          <div key={section.id}>
            {renderSection(section)}
          </div>
        ))}
      
      {/* Fallback if no sections */}
      {(!homeConfig?.sections || homeConfig.sections.length === 0) && (
        <AnimatedBackground variant="hero" className="relative -mt-20 pt-20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="zh-container text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-zh-accent to-zh-gold bg-clip-text text-transparent">
                {translations['home.hero.title']}
              </h1>
              <p className="text-xl md:text-2xl text-zh-border mb-8 max-w-3xl mx-auto">
                {translations['home.hero.subtitle']}
              </p>
            </div>
          </div>
        </AnimatedBackground>
      )}
    </MainLayout>
  );
} 