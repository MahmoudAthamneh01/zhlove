import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  Download,
  Upload,
  Eye,
  ThumbsUp,
  Share,
  Clock,
  Calendar,
  FileVideo,
  Flag,
  Star,
  Search,
  Filter,
  MapPin,
  Users,
  Gamepad2,
  Trophy,
  TrendingUp,
  HardDrive,
  FileText,
  Plus,
  MoreVertical,
  Heart,
  MessageSquare,
  Zap
} from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

// Export static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

// Mock data for replays
const mockReplays = [
  {
    id: 1,
    title: "ZH World Championship Final - ProMaster vs ChinaCommander",
    description: "Epic final match from the 2024 World Championship. Amazing micro management and strategic plays.",
    thumbnail: "/assets/placeholders/tank.svg",
    duration: "42:15",
    fileSize: "8.7 MB",
    map: "Tournament Desert",
    players: ["ZH_ProMaster (USA)", "ChinaCommander (China)"],
    uploadedBy: "ZH_Admin",
    uploadDate: "2024-01-25",
    downloads: 1247,
    likes: 892,
    views: 3456,
    rating: 4.8,
    category: "tournaments",
    featured: true,
    tags: ["tournament", "finals", "usa", "china", "competitive"]
  },
  {
    id: 2,
    title: "Perfect GLA Rush Strategy Guide",
    description: "Learn the perfect GLA rush technique that dominates early game. Step-by-step tutorial replay.",
    thumbnail: "/assets/placeholders/tank.svg",
    duration: "18:33",
    fileSize: "4.2 MB",
    map: "Bayside Marina",
    players: ["GLA_Master (GLA)", "Training_Bot (USA)"],
    uploadedBy: "GLA_Terrorist",
    uploadDate: "2024-01-24",
    downloads: 567,
    likes: 423,
    views: 1234,
    rating: 4.6,
    category: "educational",
    featured: false,
    tags: ["gla", "rush", "tutorial", "strategy", "early-game"]
  },
  {
    id: 3,
    title: "1v1 Tournament Highlights - Best Moments",
    description: "Compilation of the most epic moments from recent 1v1 tournaments. Amazing comebacks and plays!",
    thumbnail: "/assets/placeholders/tank.svg",
    duration: "25:47",
    fileSize: "6.1 MB",
    map: "Multiple Maps",
    players: ["Various Players"],
    uploadedBy: "ZH_Highlights",
    uploadDate: "2024-01-23",
    downloads: 834,
    likes: 678,
    views: 2156,
    rating: 4.7,
    category: "highlights",
    featured: true,
    tags: ["highlights", "tournament", "1v1", "compilation", "epic"]
  },
  {
    id: 4,
    title: "China Superweapons Mastery",
    description: "Advanced China tactics focusing on superweapon usage and timing. Great for intermediate players.",
    thumbnail: "/assets/placeholders/tank.svg",
    duration: "31:22",
    fileSize: "7.3 MB",
    map: "Industrial Revolution",
    players: ["DragonFire (China)", "SteelLegion (USA)"],
    uploadedBy: "DragonFire",
    uploadDate: "2024-01-22",
    downloads: 456,
    likes: 234,
    views: 987,
    rating: 4.4,
    category: "educational",
    featured: false,
    tags: ["china", "superweapons", "advanced", "strategy", "tactics"]
  },
  {
    id: 5,
    title: "USA Air Force Domination",
    description: "How to build and manage the perfect USA air force. Includes counter strategies against all factions.",
    thumbnail: "/assets/placeholders/tank.svg",
    duration: "28:15",
    fileSize: "6.8 MB",
    map: "Green Acres",
    players: ["AirForceGeneral (USA)", "ArabWarrior (GLA)"],
    uploadedBy: "AirForceGeneral",
    uploadDate: "2024-01-21",
    downloads: 723,
    likes: 445,
    views: 1567,
    rating: 4.5,
    category: "educational",
    featured: false,
    tags: ["usa", "air-force", "strategy", "air-units", "dominance"]
  }
];

const getFactionFlag = (faction: string) => {
  const factionLower = faction?.toLowerCase?.() || '';
  switch (factionLower) {
    case 'usa':
      return 'USA';
    case 'china':
      return 'CHN';
    case 'gla':
      return 'GLA';
    default:
      return 'UNK';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'tournaments':
      return Trophy;
    case 'highlights':
      return Star;
    case 'educational':
      return FileText;
    case 'recent':
      return Clock;
    case 'popular':
      return TrendingUp;
    default:
      return FileVideo;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'tournaments':
      return 'text-yellow-400 bg-yellow-400/20';
    case 'highlights':
      return 'text-purple-400 bg-purple-400/20';
    case 'educational':
      return 'text-blue-400 bg-blue-400/20';
    case 'recent':
      return 'text-green-400 bg-green-400/20';
    case 'popular':
      return 'text-red-400 bg-red-400/20';
    default:
      return 'text-gray-400 bg-gray-400/20';
  }
};

export default function ReplaysPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = useTranslations();

  const categories = [
    { key: 'all', label: t('replays.categories.all'), icon: FileVideo },
    { key: 'featured', label: t('replays.categories.featured'), icon: Star },
    { key: 'tournaments', label: t('replays.categories.tournaments'), icon: Trophy },
    { key: 'highlights', label: t('replays.categories.highlights'), icon: Zap },
    { key: 'educational', label: t('replays.categories.educational'), icon: FileText },
    { key: 'recent', label: t('replays.categories.recent'), icon: Clock },
    { key: 'popular', label: t('replays.categories.popular'), icon: TrendingUp }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <AnimatedBackground variant="subtle" className="py-16">
          <div className="zh-container text-center">
            <Play className="h-16 w-16 text-zh-accent mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('replays.title')}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {t('replays.subtitle')}
            </p>
          </div>
        </AnimatedBackground>

        {/* Stats Section */}
        <section className="py-12 bg-zh-primary/20">
          <div className="zh-container">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <FileVideo className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">2,847</div>
                  <div className="text-sm text-gray-400">{t('replays.stats.totalReplays')}</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Download className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">156K</div>
                  <div className="text-sm text-gray-400">{t('replays.stats.totalDownloads')}</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Upload className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">89</div>
                  <div className="text-sm text-gray-400">{t('replays.stats.todayUploads')}</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <MapPin className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">45</div>
                  <div className="text-sm text-gray-400">{t('replays.stats.popularMaps')}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Replays */}
        <section className="py-16">
          <div className="zh-container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <Star className="h-8 w-8 text-yellow-400" />
                {t('replays.featured')}
              </h2>
              <Button variant="gaming" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {t('replays.uploadButton')}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {mockReplays.filter(r => r.featured).map((replay) => {
                const CategoryIcon = getCategoryIcon(replay.category);
                
                return (
                  <Card key={replay.id} className="zh-card overflow-hidden">
                    <div className="relative">
                      <img 
                        src={replay.thumbnail} 
                        alt={replay.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="gaming" size="lg" className="rounded-full">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge variant="warning" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                          {replay.duration}
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <Badge className={`${getCategoryColor(replay.category)} border-0`}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {t(`replays.categories.${replay.category}`)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {replay.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {replay.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          {replay.map}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <HardDrive className="h-4 w-4 text-green-400" />
                          {replay.fileSize}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Download className="h-4 w-4 text-orange-400" />
                          {replay.downloads.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <ThumbsUp className="h-4 w-4 text-red-400" />
                          {replay.likes.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {replay.players.slice(0, 2).map((player, index) => {
                          const faction = player.split('(')[1]?.split(')')[0];
                          return (
                            <div key={index} className="flex items-center gap-1 text-xs">
                              <span>{getFactionFlag(faction || '')}</span>
                              <span className="text-gray-300">{player.split(' (')[0]}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="gaming" className="flex-1">
                          <Download className="h-4 w-4 mr-1" />
                          {t('replays.download')}
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 bg-zh-primary/30">
          <div className="zh-container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search replays..."
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  {t('common.filter')}
                </Button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* All Replays Grid */}
        <section className="py-16">
          <div className="zh-container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockReplays.map((replay) => {
                const CategoryIcon = getCategoryIcon(replay.category);
                
                return (
                  <Card key={replay.id} className="zh-card overflow-hidden group hover:scale-105 transition-transform">
                    <div className="relative">
                      <img 
                        src={replay.thumbnail} 
                        alt={replay.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="gaming" className="rounded-full">
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="absolute top-3 left-3">
                        <Badge className={`${getCategoryColor(replay.category)} border-0 text-xs`}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {t(`replays.categories.${replay.category}`)}
                        </Badge>
                      </div>
                      
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                          {replay.duration}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm">
                        {replay.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {replay.downloads}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {replay.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {replay.views}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{t('replays.uploadedBy')} {replay.uploadedBy}</span>
                        <span>{replay.uploadDate}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="gaming" size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          {t('replays.download')}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                {t('common.loadMore')}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
} 