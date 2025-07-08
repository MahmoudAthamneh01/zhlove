import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy,
  Users,
  Crown,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  CalendarDays,
  Flag,
  Shield,
  Sword,
  Target,
  MapPin,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Gamepad2,
  UserPlus,
  Settings,
  EyeIcon,
  Plus,
  Award,
  Zap,
  Globe
} from 'lucide-react';

// Export static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

// Mock data for player rankings
const mockPlayerRankings = [
  {
    id: 1,
    rank: 1,
    player: "ZH_ProMaster",
    clan: "Elite Warriors",
    points: 2847,
    wins: 128,
    losses: 23,
    winRate: 84.8,
    faction: "USA",
    level: 45,
    badge: "legend",
    trend: "up",
    lastMatch: "2024-01-25",
    avatar: "/assets/placeholders/medal.svg"
  },
  {
    id: 2,
    rank: 2,
    player: "ChinaCommander",
    clan: "Red Dragons",
    points: 2756,
    wins: 145,
    losses: 34,
    winRate: 81.0,
    faction: "China",
    level: 42,
    badge: "grandmaster",
    trend: "up",
    lastMatch: "2024-01-25",
    avatar: "/assets/placeholders/medal.svg"
  },
  {
    id: 3,
    rank: 3,
    player: "GLA_Terrorist",
    clan: "Desert Storm",
    points: 2689,
    wins: 134,
    losses: 41,
    winRate: 76.6,
    faction: "GLA",
    level: 39,
    badge: "grandmaster",
    trend: "down",
    lastMatch: "2024-01-24",
    avatar: "/assets/placeholders/medal.svg"
  },
  {
    id: 4,
    rank: 4,
    player: "TankDestroyer",
    clan: "Steel Legion",
    points: 2634,
    wins: 118,
    losses: 28,
    winRate: 80.8,
    faction: "USA",
    level: 38,
    badge: "master",
    trend: "same",
    lastMatch: "2024-01-25",
    avatar: "/assets/placeholders/medal.svg"
  },
  {
    id: 5,
    rank: 5,
    player: "DragonFire",
    clan: "Red Dragons",
    points: 2591,
    wins: 142,
    losses: 45,
    winRate: 75.9,
    faction: "China",
    level: 37,
    badge: "master",
    trend: "up",
    lastMatch: "2024-01-25",
    avatar: "/assets/placeholders/medal.svg"
  }
];

// Mock data for clan rankings
const mockClanRankings = [
  {
    id: 1,
    rank: 1,
    name: "Elite Warriors",
    tag: "[EW]",
    members: 15,
    leader: "ZH_ProMaster",
    points: 8947,
    wins: 89,
    losses: 12,
    winRate: 88.1,
    founded: "2023-03-15",
    trophies: 23,
    logo: "/assets/placeholders/army.svg",
    trend: "up"
  },
  {
    id: 2,
    rank: 2,
    name: "Red Dragons",
    tag: "[RD]",
    members: 12,
    leader: "ChinaCommander",
    points: 8234,
    wins: 76,
    losses: 18,
    winRate: 80.9,
    founded: "2023-01-20",
    trophies: 18,
    logo: "/assets/placeholders/army.svg",
    trend: "up"
  },
  {
    id: 3,
    rank: 3,
    name: "Desert Storm",
    tag: "[DS]",
    members: 18,
    leader: "GLA_Terrorist",
    points: 7856,
    wins: 82,
    losses: 25,
    winRate: 76.6,
    founded: "2023-02-10",
    trophies: 15,
    logo: "/assets/placeholders/army.svg",
    trend: "down"
  },
  {
    id: 4,
    rank: 4,
    name: "Steel Legion",
    tag: "[SL]",
    members: 10,
    leader: "TankDestroyer",
    points: 7234,
    wins: 68,
    losses: 21,
    winRate: 76.4,
    founded: "2023-04-05",
    trophies: 12,
    logo: "/assets/placeholders/army.svg",
    trend: "same"
  }
];

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case 'legend':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    case 'grandmaster':
      return 'bg-gradient-to-r from-purple-500 to-pink-500';
    case 'master':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    case 'diamond':
      return 'bg-gradient-to-r from-cyan-400 to-blue-500';
    case 'platinum':
      return 'bg-gradient-to-r from-gray-300 to-gray-500';
    case 'gold':
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    case 'silver':
      return 'bg-gradient-to-r from-gray-200 to-gray-400';
    case 'bronze':
      return 'bg-gradient-to-r from-amber-600 to-amber-800';
    default:
      return 'bg-gray-500';
  }
};

const getFactionFlag = (faction: string) => {
  switch (faction) {
    case 'USA':
      return '🇺🇸';
    case 'China':
      return '🇨🇳';
    case 'GLA':
      return '☪️';
    default:
      return '🏳️';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <ChevronUp className="h-4 w-4 text-green-400" />;
    case 'down':
      return <ChevronDown className="h-4 w-4 text-red-400" />;
    default:
      return <div className="h-4 w-4" />;
  }
};

export default function RankingsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = useTranslations();

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-zh-primary via-zh-secondary to-zh-accent py-16">
          <div className="absolute inset-0 bg-[url('/assets/backgrounds/zh-love-bg.svg')] bg-cover bg-center opacity-10"></div>
          <div className="relative zh-container text-center">
            <Trophy className="h-16 w-16 text-zh-accent mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('rankings.title')}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {t('rankings.subtitle')}
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-zh-primary/20">
          <div className="zh-container">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">2,847</div>
                  <div className="text-sm text-gray-400">Active Players</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">156</div>
                  <div className="text-sm text-gray-400">Active Clans</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Sword className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">8,934</div>
                  <div className="text-sm text-gray-400">Matches Today</div>
                </CardContent>
              </Card>

              <Card className="zh-card text-center">
                <CardContent className="p-6">
                  <Globe className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-1">47</div>
                  <div className="text-sm text-gray-400">Countries</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="zh-container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Player Rankings */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-400" />
                    {t('rankings.playerRankings')}
                  </h2>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      {t('common.filter')}
                    </Button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search players..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Rankings Table */}
                <Card className="zh-card">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-zh-secondary/50 border-b border-gray-700">
                          <tr>
                            <th className="text-left p-4 font-semibold text-gray-300">#</th>
                            <th className="text-left p-4 font-semibold text-gray-300">{t('rankings.player')}</th>
                            <th className="text-left p-4 font-semibold text-gray-300">{t('rankings.clan')}</th>
                            <th className="text-left p-4 font-semibold text-gray-300">{t('rankings.points')}</th>
                            <th className="text-left p-4 font-semibold text-gray-300">{t('rankings.winRate')}</th>
                            <th className="text-left p-4 font-semibold text-gray-300">{t('rankings.faction')}</th>
                            <th className="text-left p-4 font-semibold text-gray-300">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockPlayerRankings.map((player) => (
                            <tr key={player.id} className="border-b border-gray-700/50 hover:bg-zh-secondary/20 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-white">#{player.rank}</span>
                                  {getTrendIcon(player.trend)}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={player.avatar} 
                                    alt={player.player}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <div>
                                    <div className="font-semibold text-white">{player.player}</div>
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${getBadgeColor(player.badge)} text-white border-0 text-xs`}>
                                        {t(`rankings.badges.${player.badge}`)}
                                      </Badge>
                                      <span className="text-xs text-gray-400">Lv.{player.level}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-blue-400 font-medium">{player.clan}</span>
                              </td>
                              <td className="p-4">
                                <span className="text-yellow-400 font-bold">{player.points.toLocaleString()}</span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-green-400 font-semibold">{player.winRate}%</span>
                                  <span className="text-xs text-gray-400">({player.wins}W/{player.losses}L)</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{getFactionFlag(player.faction)}</span>
                                  <span className="text-sm text-gray-300">{player.faction}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <Button variant="ghost" size="sm">
                                  <EyeIcon className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Load More */}
                <div className="text-center mt-6">
                  <Button variant="outline">
                    {t('common.loadMore')}
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* My Stats Card */}
                <Card className="zh-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Target className="h-5 w-5 text-blue-400" />
                      {t('rankings.myStats')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Crown className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-lg font-bold text-white">Rank #234</div>
                      <div className="text-sm text-gray-400">2,156 Points</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-400">67</div>
                        <div className="text-xs text-gray-400">{t('rankings.wins')}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-400">23</div>
                        <div className="text-xs text-gray-400">{t('rankings.losses')}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-400">74.4%</div>
                        <div className="text-xs text-gray-400">{t('rankings.winRate')}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-400">90</div>
                        <div className="text-xs text-gray-400">Total</div>
                      </div>
                    </div>

                    <Button variant="gaming" className="w-full">
                      {t('rankings.profile')}
                    </Button>
                  </CardContent>
                </Card>

                {/* Top Clans */}
                <Card className="zh-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-purple-400" />
                        {t('rankings.clanRankings')}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockClanRankings.slice(0, 5).map((clan) => (
                      <div key={clan.id} className="flex items-center gap-3 p-3 rounded-lg bg-zh-secondary/30 hover:bg-zh-secondary/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-400">#{clan.rank}</span>
                          {getTrendIcon(clan.trend)}
                        </div>
                        
                        <img 
                          src={clan.logo} 
                          alt={clan.name}
                          className="w-8 h-8 rounded"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm truncate">{clan.name}</span>
                            <span className="text-xs text-blue-400">{clan.tag}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{clan.members} members</span>
                            <span>{clan.points} pts</span>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <EyeIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full" size="sm">
                      View All Clans
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Matches */}
                <Card className="zh-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Clock className="h-5 w-5 text-orange-400" />
                      {t('rankings.stats.recentMatches')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { player1: "ZH_ProMaster", player2: "ChinaCommander", result: "Win", time: "5m ago" },
                      { player1: "GLA_Terrorist", player2: "TankDestroyer", result: "Loss", time: "12m ago" },
                      { player1: "DragonFire", player2: "SteelWarrior", result: "Win", time: "18m ago" }
                    ].map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-zh-secondary/20">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant={match.result === 'Win' ? 'success' : 'destructive'} className="text-xs">
                            {match.result}
                          </Badge>
                          <span className="text-white">{match.player1}</span>
                          <span className="text-gray-400">vs</span>
                          <span className="text-white">{match.player2}</span>
                        </div>
                        <span className="text-xs text-gray-400">{match.time}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
} 