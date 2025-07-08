import { notFound } from 'next/navigation';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Trophy, Star, Target, Crown, Calendar, MessageSquare, Plus, ArrowLeft, Award, Swords, Flame } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockClans = [
  {
    id: '1',
    name: 'Desert Eagles',
    tag: '[DE]',
    logo: 'https://ui-avatars.com/api/?name=Desert+Eagles&background=281B39&color=fff&size=128&rounded=true',
    description: 'Elite competitive clan focused on tournaments and ranking climbs.',
    specialization: 'Competitive',
    founded: '2023-01-15',
    isRecruiting: true,
    leader: {
      username: 'DesertCommander',
      avatar: 'https://ui-avatars.com/api/?name=Desert+Commander&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
      role: 'Leader',
    },
    members: [
      {
        username: 'DesertCommander',
        avatar: 'https://ui-avatars.com/api/?name=Desert+Commander&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Leader',
      },
      {
        username: 'SandStorm',
        avatar: 'https://ui-avatars.com/api/?name=Sand+Storm&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Co-Leader',
      },
      {
        username: 'Falcon',
        avatar: 'https://ui-avatars.com/api/?name=Falcon&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Member',
      },
      {
        username: 'EagleEye',
        avatar: 'https://ui-avatars.com/api/?name=Eagle+Eye&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Member',
      },
    ],
    points: 12450,
    rank: 1,
    wins: 89,
    losses: 23,
    winRate: 79.5,
    achievements: [
      { id: 1, name: 'Tournament Winners', icon: Trophy, color: 'text-yellow-400' },
      { id: 2, name: 'Top 3 Clan', icon: Crown, color: 'text-purple-400' },
      { id: 3, name: 'Active Community', icon: Users, color: 'text-blue-400' },
    ],
    warHistory: [
      { id: 1, opponent: 'Zero Hour Legends', result: 'Win', rounds: '3-1', date: '2024-01-20' },
      { id: 2, opponent: 'GLA Masters', result: 'Loss', rounds: '2-3', date: '2024-01-15' },
      { id: 3, opponent: 'Red Dragons', result: 'Win', rounds: '3-0', date: '2024-01-10' },
    ],
  },
  {
    id: '2',
    name: 'Zero Hour Legends',
    tag: '[ZHL]',
    logo: 'https://ui-avatars.com/api/?name=Zero+Hour+Legends&background=281B39&color=fff&size=128&rounded=true',
    description: 'Veteran players sharing knowledge and strategies with newcomers.',
    specialization: 'Educational',
    founded: '2022-08-20',
    isRecruiting: true,
    leader: {
      username: 'ZeroMaster',
      avatar: 'https://ui-avatars.com/api/?name=Zero+Master&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
      role: 'Leader',
    },
    members: [
      {
        username: 'ZeroMaster',
        avatar: 'https://ui-avatars.com/api/?name=Zero+Master&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Leader',
      },
      {
        username: 'GuidePro',
        avatar: 'https://ui-avatars.com/api/?name=Guide+Pro&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Co-Leader',
      },
      {
        username: 'Tactician',
        avatar: 'https://ui-avatars.com/api/?name=Tactician&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Member',
      },
      {
        username: 'Newbie',
        avatar: 'https://ui-avatars.com/api/?name=Newbie&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Member',
      },
    ],
    points: 11200,
    rank: 2,
    wins: 67,
    losses: 31,
    winRate: 68.4,
    achievements: [
      { id: 1, name: 'Mentor Clan', icon: Award, color: 'text-blue-400' },
      { id: 2, name: 'Strategy Guides', icon: Star, color: 'text-yellow-400' },
      { id: 3, name: 'Community Choice', icon: Users, color: 'text-green-400' },
    ],
    warHistory: [
      { id: 1, opponent: 'Desert Eagles', result: 'Loss', rounds: '1-3', date: '2024-01-20' },
      { id: 2, opponent: 'GLA Masters', result: 'Win', rounds: '3-2', date: '2024-01-12' },
      { id: 3, opponent: 'Red Dragons', result: 'Win', rounds: '3-1', date: '2024-01-05' },
    ],
  },
  {
    id: '3',
    name: 'Global Liberation Army',
    tag: '[GLA]',
    logo: 'https://ui-avatars.com/api/?name=Global+Liberation+Army&background=281B39&color=fff&size=128&rounded=true',
    description: 'GLA specialists mastering guerrilla tactics and stealth strategies.',
    specialization: 'Faction Focus',
    founded: '2023-03-10',
    isRecruiting: false,
    leader: {
      username: 'GuerillaLeader',
      avatar: 'https://ui-avatars.com/api/?name=Guerilla+Leader&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
      role: 'Leader',
    },
    members: [
      {
        username: 'GuerillaLeader',
        avatar: 'https://ui-avatars.com/api/?name=Guerilla+Leader&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Leader',
      },
      {
        username: 'StealthMaster',
        avatar: 'https://ui-avatars.com/api/?name=Stealth+Master&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Co-Leader',
      },
      {
        username: 'Saboteur',
        avatar: 'https://ui-avatars.com/api/?name=Saboteur&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Member',
      },
      {
        username: 'DesertFox',
        avatar: 'https://ui-avatars.com/api/?name=Desert+Fox&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Member',
      },
    ],
    points: 10800,
    rank: 3,
    wins: 72,
    losses: 28,
    winRate: 72.0,
    achievements: [
      { id: 1, name: 'GLA Masters', icon: Swords, color: 'text-purple-400' },
      { id: 2, name: 'Stealth Tactics', icon: Flame, color: 'text-red-400' },
      { id: 3, name: 'Faction Pride', icon: Users, color: 'text-blue-400' },
    ],
    warHistory: [
      { id: 1, opponent: 'Desert Eagles', result: 'Win', rounds: '3-2', date: '2024-01-15' },
      { id: 2, opponent: 'Zero Hour Legends', result: 'Loss', rounds: '2-3', date: '2024-01-12' },
      { id: 3, opponent: 'Red Dragons', result: 'Win', rounds: '3-1', date: '2024-01-08' },
    ],
  },
  {
    id: '4',
    name: 'Command & Conquer Pro',
    tag: '[CCP]',
    logo: 'https://ui-avatars.com/api/?name=Command+%26+Conquer+Pro&background=281B39&color=fff&size=128&rounded=true',
    description: 'Professional esports organization competing in major tournaments.',
    specialization: 'Esports',
    founded: '2023-06-05',
    isRecruiting: true,
    leader: {
      username: 'ProCommander',
      avatar: 'https://ui-avatars.com/api/?name=ProCommander&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
      role: 'Leader',
    },
    members: [
      {
        username: 'ProCommander',
        avatar: 'https://ui-avatars.com/api/?name=ProCommander&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Leader',
      },
      {
        username: 'Ace',
        avatar: 'https://ui-avatars.com/api/?name=Ace&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Co-Leader',
      },
      {
        username: 'Sniper',
        avatar: 'https://ui-avatars.com/api/?name=Sniper&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Member',
      },
      {
        username: 'Tank',
        avatar: 'https://ui-avatars.com/api/?name=Tank&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true',
        role: 'Member',
      },
    ],
    points: 10500,
    rank: 4,
    wins: 58,
    losses: 12,
    winRate: 82.9,
    achievements: [
      { id: 1, name: 'Esports Champions', icon: Trophy, color: 'text-yellow-400' },
      { id: 2, name: 'Pro Team', icon: Crown, color: 'text-purple-400' },
      { id: 3, name: 'Tournament Kings', icon: Star, color: 'text-blue-400' },
    ],
    warHistory: [
      { id: 1, opponent: 'Desert Eagles', result: 'Loss', rounds: '0-3', date: '2024-01-10' },
      { id: 2, opponent: 'Zero Hour Legends', result: 'Win', rounds: '3-1', date: '2024-01-05' },
      { id: 3, opponent: 'GLA Masters', result: 'Loss', rounds: '1-3', date: '2024-01-08' },
    ],
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ClanProfilePage({ params }: { params: { clanId: string; locale: string } }) {
  const clan = mockClans.find((c) => c.id === params.clanId || c.id === String(params.clanId));
  if (!clan) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Clan Not Found</h1>
      <p className="text-gray-300 mb-6">العشيرة غير موجودة أو تم تغيير معرفها.</p>
      <Link href={`/${params.locale}/clans`} className="text-zh-accent underline">العودة إلى قائمة العشائر</Link>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* خلفية ديناميكية مع تأثيرات جزيئات وضباب */}
      <AnimatedBackground variant="battle" className="py-16 animate-fog" />
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-br from-zh-primary/60 to-black/80 animate-glow" />
      </div>
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="zh-container flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="relative flex-shrink-0">
            <span className="absolute -inset-2 rounded-full animate-glow-gold blur-lg opacity-60" />
            <img src={clan.logo} alt={clan.name} className="w-36 h-36 rounded-full border-4 border-zh-accent shadow-xl animate-border-glow-gold" />
            <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${clan.rank === 1 ? 'bg-yellow-400/90 text-black animate-glow-gold' : 'bg-zh-accent/80 text-white'}`}>#{clan.rank}</div>
            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-bold ${clan.isRecruiting ? 'bg-green-500/80 text-white animate-pulse' : 'bg-gray-500/80 text-white'}`}>{clan.isRecruiting ? 'Recruiting' : 'Closed'}</div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-2">
              <span>{clan.tag}</span> {clan.name}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
              <Badge className="bg-zh-accent/20 text-zh-accent animate-glow">{clan.specialization}</Badge>
              <Badge className="bg-zh-gold/20 text-zh-gold">{formatDate(clan.founded)}</Badge>
            </div>
            <p className="text-gray-300 mb-4 max-w-2xl mx-auto md:mx-0">{clan.description}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {clan.isRecruiting && (
                <Button variant="gaming" className="flex items-center gap-2 animate-bounce shadow-lg">
                  <Plus className="h-4 w-4" /> انضم للعشيرة
                </Button>
              )}
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> دردشة العشيرة
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> إبلاغ عن العشيرة
              </Button>
              <Link href={`/${params.locale}/clans`} className="flex items-center gap-2 text-zh-accent underline font-bold hover:text-zh-gold transition-colors">
                <ArrowLeft className="h-4 w-4" /> عودة للعشائر
              </Link>
            </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <section className="zh-container grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
          <Card className="zh-card text-center animate-glow">
            <CardContent className="p-4">
              <Star className="h-6 w-6 text-yellow-400 mx-auto mb-1 animate-pulse" />
              <div className="text-lg font-bold text-white">{clan.points.toLocaleString()}</div>
              <div className="text-xs text-gray-400">النقاط</div>
            </CardContent>
          </Card>
          <Card className="zh-card text-center">
            <CardContent className="p-4">
              <Trophy className="h-6 w-6 text-zh-accent mx-auto mb-1" />
              <div className="text-lg font-bold text-zh-accent">{clan.wins}</div>
              <div className="text-xs text-gray-400">انتصارات</div>
            </CardContent>
          </Card>
          <Card className="zh-card text-center">
            <CardContent className="p-4">
              <Flame className="h-6 w-6 text-red-400 mx-auto mb-1 animate-pulse" />
              <div className="text-lg font-bold text-red-400">{clan.losses}</div>
              <div className="text-xs text-gray-400">خسائر</div>
            </CardContent>
          </Card>
          <Card className="zh-card text-center">
            <CardContent className="p-4">
              <Target className="h-6 w-6 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-400">{clan.winRate}%</div>
              <div className="text-xs text-gray-400">معدل الفوز</div>
            </CardContent>
          </Card>
          <Card className="zh-card text-center">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-green-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-400">{clan.members.length}</div>
              <div className="text-xs text-gray-400">عدد الأعضاء</div>
            </CardContent>
          </Card>
          <Card className="zh-card text-center">
            <CardContent className="p-4">
              <Calendar className="h-6 w-6 text-zh-gold mx-auto mb-1" />
              <div className="text-lg font-bold text-zh-gold">{formatDate(clan.founded)}</div>
              <div className="text-xs text-gray-400">تاريخ التأسيس</div>
            </CardContent>
          </Card>
        </section>

        {/* القائد والأعضاء */}
        <section className="zh-container grid md:grid-cols-4 gap-8 mb-10">
          {/* قائد العشيرة */}
          <Card className="zh-card col-span-1 text-center border-2 border-yellow-400 animate-border-glow-gold shadow-lg">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-2">
                <span className="relative">
                  <img src={clan.leader.avatar} alt={clan.leader.username} className="w-20 h-20 rounded-full border-4 border-yellow-400 animate-glow-gold" />
                  <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 text-yellow-400 animate-glow-gold" />
                </span>
                <span className="text-lg font-bold text-yellow-400">{clan.leader.username}</span>
                <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">القائد</span>
              </CardTitle>
            </CardHeader>
          </Card>
          {/* أعضاء العشيرة */}
          <Card className="zh-card col-span-3">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-zh-accent" /> الأعضاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {clan.members.map((member) => (
                  <div key={member.username} className="flex flex-col items-center bg-zh-secondary/30 rounded-xl p-3 shadow-md">
                    <img src={member.avatar} alt={member.username} className="w-14 h-14 rounded-full border-2 border-zh-border mb-1" />
                    <span className="font-bold text-white">{member.username}</span>
                    <span className={`text-xs px-2 py-1 rounded mt-1 ${member.role === 'Leader' ? 'bg-yellow-400/20 text-yellow-400' : member.role === 'Co-Leader' ? 'bg-zh-accent/20 text-zh-accent' : 'bg-gray-500/20 text-gray-300'}`}>{member.role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* الإنجازات */}
        <section className="zh-container mb-10">
          <Card className="zh-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-zh-gold" /> الإنجازات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {clan.achievements.map((ach) => (
                  <span key={ach.id} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-md ${ach.color} bg-zh-secondary/30 animate-glow`}>
                    <ach.icon className="h-5 w-5" /> {ach.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* سجل الحروب */}
        <section className="zh-container mb-16">
          <Card className="zh-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Swords className="h-5 w-5 text-zh-accent" /> سجل الحروب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 overflow-x-auto py-2">
                {clan.warHistory.map((war, idx) => (
                  <div key={war.id} className={`flex flex-col items-center min-w-[180px] p-4 rounded-xl border-2 ${war.result === 'Win' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'} shadow-md relative animate-glow`}>
                    <Flame className={`h-6 w-6 mb-2 ${war.result === 'Win' ? 'text-green-400' : 'text-red-400'} animate-pulse`} />
                    <span className="font-bold text-white mb-1">ضد {war.opponent}</span>
                    <span className="text-xs px-2 py-1 rounded bg-zh-secondary/40 text-zh-gold mb-1">{war.rounds}</span>
                    <span className={`font-bold ${war.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>{war.result === 'Win' ? 'فوز' : 'خسارة'}</span>
                    <span className="text-xs text-gray-400 mt-1">{formatDate(war.date)}</span>
                    {idx < clan.warHistory.length - 1 && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-1 bg-gradient-to-l from-green-400/60 to-transparent rounded-full md:block hidden" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
} 