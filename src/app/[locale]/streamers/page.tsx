import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  Users,
  Eye,
  Radio,
  Clock,
  Calendar,
  ThumbsUp,
  ExternalLink,
  Search,
  Filter,
  Star,
  Trophy,
  Globe,
  Youtube,
  UserPlus,
  Share,
  Bell,
  MoreVertical,
  Video,
  TrendingUp
} from 'lucide-react';

// Export static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

// Mock data for streamers
const mockStreamers = [
  {
    id: 1,
    name: "ZH ProMaster",
    channel: "ZHProMaster",
    avatar: "/assets/placeholders/general.svg",
    subscribers: 125000,
    views: 2847000,
    isLive: true,
    currentViewers: 1247,
    language: "english",
    category: "pro",
    featured: true,
    description: "Professional Zero Hour player and tournament champion. Daily streams with educational content.",
    latestVideo: {
      title: "USA vs China - Advanced Tactics Guide",
      thumbnail: "/assets/placeholders/tank.svg",
      duration: "28:45",
      views: 45620,
      uploadDate: "2024-01-25"
    },
    socialMedia: {
      youtube: "https://youtube.com/@zhpromaster",
      discord: "ZHProMaster#1234"
    }
  },
  {
    id: 2,
    name: "ArabZH Master",
    channel: "ArabZHMaster",
    avatar: "/assets/placeholders/general.svg",
    subscribers: 89000,
    views: 1560000,
    isLive: false,
    currentViewers: 0,
    language: "arabic",
    category: "educational",
    featured: true,
    description: "أفضل قناة عربية لتعليم Zero Hour. شروحات تفصيلية واستراتيجيات متقدمة.",
    latestVideo: {
      title: "شرح شامل للفصائل الثلاثة - دليل المبتدئين",
      thumbnail: "/assets/placeholders/tank.svg",
      duration: "35:12",
      views: 67890,
      uploadDate: "2024-01-24"
    },
    socialMedia: {
      youtube: "https://youtube.com/@arabzhmaster",
      discord: "ArabZH#5678"
    }
  },
  {
    id: 3,
    name: "ChinaCommander",
    channel: "ChinaCommander",
    avatar: "/assets/placeholders/general.svg",
    subscribers: 67000,
    views: 890000,
    isLive: true,
    currentViewers: 834,
    language: "english",
    category: "entertainment",
    featured: false,
    description: "China faction specialist. Fun gameplay with commentary and viewer interaction.",
    latestVideo: {
      title: "Epic 1v1 Tournament Highlights",
      thumbnail: "/assets/placeholders/tank.svg",
      duration: "22:18",
      views: 23450,
      uploadDate: "2024-01-23"
    },
    socialMedia: {
      youtube: "https://youtube.com/@chinacommander",
      discord: "ChinaCMD#9012"
    }
  },
  {
    id: 4,
    name: "GLA Terrorist",
    channel: "GLATerrorist",
    avatar: "/assets/placeholders/general.svg",
    subscribers: 45000,
    views: 567000,
    isLive: false,
    currentViewers: 0,
    language: "english",
    category: "pro",
    featured: false,
    description: "GLA tactics expert. Unconventional strategies and surprise attacks.",
    latestVideo: {
      title: "GLA Rush Tactics - Dominate Early Game",
      thumbnail: "/assets/placeholders/tank.svg",
      duration: "18:33",
      views: 34560,
      uploadDate: "2024-01-22"
    },
    socialMedia: {
      youtube: "https://youtube.com/@glaterrorist",
      discord: "GLATerror#3456"
    }
  }
];

// Mock popular videos
const mockPopularVideos = [
  {
    id: 1,
    title: "Zero Hour World Championship Finals 2024",
    thumbnail: "/assets/placeholders/tank.svg",
    channel: "ZH ProMaster",
    views: 156789,
    duration: "2:15:45",
    uploadDate: "2024-01-20",
    likes: 12450
  },
  {
    id: 2,
    title: "أفضل استراتيجيات الفوز السريع",
    thumbnail: "/assets/placeholders/tank.svg",
    channel: "ArabZH Master",
    views: 89456,
    duration: "24:12",
    uploadDate: "2024-01-19",
    likes: 8900
  },
  {
    id: 3,
    title: "USA Superweapons Guide - Complete Tutorial",
    thumbnail: "/assets/placeholders/tank.svg",
    channel: "ChinaCommander",
    views: 67234,
    duration: "31:28",
    uploadDate: "2024-01-18",
    likes: 5670
  }
];

export default function StreamersPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = useTranslations();

  const filters = [
    { key: 'all', label: t('streamers.filters.all') },
    { key: 'live', label: t('streamers.filters.live') },
    { key: 'english', label: t('streamers.filters.english') },
    { key: 'arabic', label: t('streamers.filters.arabic') },
    { key: 'pro', label: t('streamers.filters.pro') },
    { key: 'educational', label: t('streamers.filters.educational') },
    { key: 'entertainment', label: t('streamers.filters.entertainment') }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-zh-primary via-zh-secondary to-zh-accent py-16">
          <div className="absolute inset-0 bg-[url('/assets/backgrounds/zh-love-bg.svg')] bg-cover bg-center opacity-10"></div>
          <div className="relative zh-container text-center">
            <Youtube className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('streamers.title')}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {t('streamers.subtitle')}
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-zh-primary/20">
          <div className="zh-container">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Eye className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">12.4K</div>
                  <div className="text-sm text-gray-400">{t('streamers.stats.totalViewers')}</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Radio className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">8</div>
                  <div className="text-sm text-gray-400">{t('streamers.stats.liveStreams')}</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">156</div>
                  <div className="text-sm text-gray-400">{t('streamers.stats.totalStreamers')}</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">45.2K</div>
                  <div className="text-sm text-gray-400">{t('streamers.stats.hoursWatched')}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Streamers */}
        <section className="py-16">
          <div className="zh-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Star className="h-8 w-8 text-yellow-400" />
                {t('streamers.featured')}
              </h2>
              <p className="text-gray-400 text-lg">Top content creators in the ZH-Love community</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {mockStreamers.filter(s => s.featured).map((streamer) => (
                <Card key={streamer.id} className="zh-card overflow-hidden">
                  <div className="relative">
                    <img 
                      src={streamer.latestVideo.thumbnail} 
                      alt={streamer.latestVideo.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="gaming" className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        {streamer.isLive ? t('streamers.watchLive') : 'Watch Video'}
                      </Button>
                    </div>
                    
                    {streamer.isLive && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
                          <Radio className="h-3 w-3" />
                          {t('streamers.live')}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 right-4">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {streamer.latestVideo.duration}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img 
                        src={streamer.avatar} 
                        alt={streamer.name}
                        className="w-16 h-16 rounded-full"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">{streamer.name}</h3>
                          {streamer.isLive && (
                            <Badge variant="success" className="text-xs">
                              {streamer.currentViewers.toLocaleString()} {t('streamers.viewers')}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-3">{streamer.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {(streamer.subscribers / 1000).toFixed(1)}K {t('streamers.subscribers')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {(streamer.views / 1000000).toFixed(1)}M views
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant={streamer.isLive ? "destructive" : "gaming"} size="sm" className="flex-1">
                            {streamer.isLive ? (
                              <>
                                <Radio className="h-4 w-4 mr-1" />
                                {t('streamers.watchLive')}
                              </>
                            ) : (
                              <>
                                <Youtube className="h-4 w-4 mr-1" />
                                {t('streamers.viewChannel')}
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Streamers & Filters */}
        <section className="py-16 bg-zh-primary/10">
          <div className="zh-container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">{t('streamers.allStreamers')}</h2>
              
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search streamers..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  {t('common.filter')}
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filters.map((filter) => (
                <Button
                  key={filter.key}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Streamers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStreamers.map((streamer) => (
                <Card key={streamer.id} className="zh-card group hover:scale-105 transition-transform">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img 
                          src={streamer.avatar} 
                          alt={streamer.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {streamer.isLive && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zh-primary animate-pulse"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{streamer.name}</h3>
                          {streamer.isLive && (
                            <Badge variant="destructive" className="text-xs">
                              {t('streamers.live')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                          <span>{(streamer.subscribers / 1000).toFixed(1)}K subs</span>
                          {streamer.isLive && (
                            <span className="text-green-400">{streamer.currentViewers} viewers</span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          {streamer.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {t(`streamers.filters.${streamer.language}`)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {t(`streamers.filters.${streamer.category}`)}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant={streamer.isLive ? "destructive" : "outline"} size="sm" className="flex-1">
                        {streamer.isLive ? t('streamers.watchLive') : t('streamers.viewChannel')}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Videos */}
        <section className="py-16">
          <div className="zh-container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-orange-400" />
                {t('streamers.popular')}
              </h2>
              <Button variant="outline">
                View All Videos
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPopularVideos.map((video) => (
                <Card key={video.id} className="zh-card overflow-hidden group hover:scale-105 transition-transform">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="gaming" size="lg" className="rounded-full">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                        {video.duration}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <span>{video.channel}</span>
                      <span>•</span>
                      <span>{(video.views / 1000).toFixed(1)}K views</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{video.uploadDate}</span>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{(video.likes / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
} 