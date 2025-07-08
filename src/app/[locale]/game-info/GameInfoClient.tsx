'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  ChevronRight,
  Flag,
  Users,
  Crown,
  Shield,
  Zap,
  Car,
  Bomb,
  Rocket,
  Eye,
  Play,
  Lightbulb,
  Map,
  Medal,
  Plane
} from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

// Types
interface GameInfoPage {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    name: string;
  };
}

interface General {
  id: string;
  name: string;
  speciality: string;
  description: string;
  icon: any;
  color: string;
}

interface Army {
  id: string;
  name: string;
  description: string;
  color: string;
  flag: string;
  icon: any;
  generals: General[];
}

interface Strategy {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  faction: string;
  icon: any;
}

export default function GameInfoClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const [selectedArmy, setSelectedArmy] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [pages, setPages] = useState<GameInfoPage[]>([]);
  const [loading, setLoading] = useState(true);

  // Army data with detailed information
  const armies: Army[] = [
    {
      id: 'usa',
      name: 'United States',
      description: 'Advanced technology and air superiority',
      color: 'from-blue-600 to-blue-400',
      flag: '🇺🇸',
      icon: Flag,
      generals: [
        {
          id: 'usa-air-force',
          name: 'Air Force General',
          speciality: 'Air Superiority',
          description: 'Masters of the skies with advanced aircraft',
          icon: Plane,
          color: 'text-blue-400'
        },
        {
          id: 'usa-laser',
          name: 'Laser General',
          speciality: 'Laser Technology',
          description: 'Cutting-edge laser weapons and defenses',
          icon: Zap,
          color: 'text-cyan-400'
        },
        {
          id: 'usa-superweapon',
          name: 'Superweapon General',
          speciality: 'Superweapons',
          description: 'Devastating superweapons and heavy firepower',
          icon: Rocket,
          color: 'text-red-400'
        }
      ]
    },
    {
      id: 'china',
      name: 'China',
      description: 'Overwhelming numbers and nuclear power',
      color: 'from-red-600 to-red-400',
      flag: '🇨🇳',
      icon: Flag,
      generals: [
        {
          id: 'china-tank',
          name: 'Tank General',
          speciality: 'Armored Warfare',
          description: 'Heavy tanks and armored divisions',
          icon: Car,
          color: 'text-orange-400'
        },
        {
          id: 'china-nuclear',
          name: 'Nuclear General',
          speciality: 'Nuclear Power',
          description: 'Radioactive weapons and nuclear technology',
          icon: Bomb,
          color: 'text-green-400'
        },
        {
          id: 'china-infantry',
          name: 'Infantry General',
          speciality: 'Human Wave',
          description: 'Massive infantry forces and red guard',
          icon: Users,
          color: 'text-red-400'
        }
      ]
    },
    {
      id: 'gla',
      name: 'Global Liberation Army',
      description: 'Guerrilla tactics and resourcefulness',
      color: 'from-green-600 to-green-400',
      flag: '🏴',
      icon: Flag,
      generals: [
        {
          id: 'gla-stealth',
          name: 'Stealth General',
          speciality: 'Stealth Operations',
          description: 'Invisible units and surprise attacks',
          icon: Eye,
          color: 'text-purple-400'
        },
        {
          id: 'gla-toxin',
          name: 'Toxin General',
          speciality: 'Chemical Warfare',
          description: 'Toxic weapons and contamination',
          icon: Shield,
          color: 'text-green-400'
        },
        {
          id: 'gla-demolitions',
          name: 'Demolitions General',
          speciality: 'Explosives',
          description: 'Explosives and sabotage specialists',
          icon: Bomb,
          color: 'text-yellow-400'
        }
      ]
    }
  ];

  // Strategy data
  const strategies: Strategy[] = [
    {
      id: 'early-rush',
      title: 'Early Rush',
      description: 'Overwhelm your opponent with early aggression',
      difficulty: 'beginner',
      category: 'offensive',
      faction: 'all',
      icon: Rocket
    },
    {
      id: 'air-superiority',
      title: 'Air Superiority',
      description: 'Control the skies and dominate from above',
      difficulty: 'intermediate',
      category: 'control',
      faction: 'usa',
      icon: Plane
    },
    {
      id: 'nuclear-strategy',
      title: 'Nuclear Strategy',
      description: 'Harness the power of the atom',
      difficulty: 'advanced',
      category: 'economic',
      faction: 'china',
      icon: Bomb
    },
    {
      id: 'guerrilla-tactics',
      title: 'Guerrilla Tactics',
      description: 'Strike from the shadows and disappear',
      difficulty: 'intermediate',
      category: 'stealth',
      faction: 'gla',
      icon: Eye
    }
  ];

  useEffect(() => {
    fetchGameInfo();
  }, [locale]);

  const fetchGameInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pages?type=game-info&language=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages);
      }
    } catch (error) {
      console.error('Error fetching game info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-zh-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white mb-4">
            {t('gameInfo.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('gameInfo.subtitle')}
          </p>
        </div>

        {/* Game Timeline */}
        <Card className="zh-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-zh-accent" />
              {t('gameInfo.timeline.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-zh-accent">2003</div>
                <div className="text-white font-semibold">{t('gameInfo.timeline.original')}</div>
                <div className="text-gray-400 text-sm">{t('gameInfo.timeline.originalDesc')}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-zh-accent">2013</div>
                <div className="text-white font-semibold">{t('gameInfo.timeline.zh')}</div>
                <div className="text-gray-400 text-sm">{t('gameInfo.timeline.zhDesc')}</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-zh-accent">2024</div>
                <div className="text-white font-semibold">{t('gameInfo.timeline.community')}</div>
                <div className="text-gray-400 text-sm">{t('gameInfo.timeline.communityDesc')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Army Showcase */}
        <Card className="zh-card">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Flag className="w-6 h-6 text-zh-accent" />
              {t('gameInfo.armies.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {armies.map((army) => (
                <div
                  key={army.id}
                  className={`cursor-pointer transition-all duration-300 rounded-lg p-6 bg-gradient-to-r ${army.color} ${
                    selectedArmy === army.id ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-lg'
                  }`}
                  onClick={() => setSelectedArmy(selectedArmy === army.id ? null : army.id)}
                >
                  <div className="text-center space-y-4">
                    <div className="text-4xl">{army.flag}</div>
                    <div className="text-white font-bold text-xl">{army.name}</div>
                    <div className="text-gray-100 text-sm">{army.description}</div>
                    
                    {selectedArmy === army.id && (
                      <div className="mt-6 space-y-3 animate-fadeIn">
                        <div className="text-white font-semibold">{t('gameInfo.armies.generals')}:</div>
                        {army.generals.map((general) => (
                          <div key={general.id} className="bg-white/20 rounded-lg p-3 flex items-center gap-3">
                            <general.icon className={`w-5 h-5 ${general.color}`} />
                            <div className="flex-1 text-left">
                              <div className="text-white font-medium text-sm">{general.name}</div>
                              <div className="text-gray-200 text-xs">{general.speciality}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strategy Guide */}
        <Card className="zh-card">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-zh-accent" />
              {t('gameInfo.strategies.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="zh-container cursor-pointer hover:border-zh-accent/50 transition-all duration-300 group"
                  onClick={() => setSelectedStrategy(strategy)}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <strategy.icon className="w-6 h-6 text-zh-accent" />
                      <Badge className={`text-xs text-white ${getDifficultyColor(strategy.difficulty)}`}>
                        {t(`gameInfo.strategies.difficulty.${strategy.difficulty}`)}
                      </Badge>
                    </div>
                    <div className="text-white font-semibold group-hover:text-zh-accent transition-colors">
                      {strategy.title}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {strategy.description}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {t(`gameInfo.strategies.category.${strategy.category}`)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {strategy.faction === 'all' ? t('gameInfo.strategies.allFactions') : strategy.faction.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Champions Section */}
        <Card className="zh-card">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Medal className="w-6 h-6 text-zh-accent" />
              {t('gameInfo.champions.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'TheMista', title: 'World Champion 2023', wins: 127, image: '/api/placeholder/64/64' },
                { name: 'Lyx', title: 'European Champion', wins: 89, image: '/api/placeholder/64/64' },
                { name: 'Sybert', title: 'Asian Champion', wins: 156, image: '/api/placeholder/64/64' }
              ].map((champion, index) => (
                <div key={index} className="zh-container text-center space-y-3">
                  <img 
                    src={champion.image} 
                    alt={champion.name}
                    className="w-16 h-16 rounded-full mx-auto"
                  />
                  <div>
                    <div className="text-white font-bold">{champion.name}</div>
                    <div className="text-zh-accent text-sm">{champion.title}</div>
                    <div className="text-gray-400 text-xs">{champion.wins} wins</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CMS Content */}
        {pages.length > 0 && (
          <div className="space-y-6">
            {pages.map((page) => (
              <Card key={page.id} className="zh-card">
                <CardHeader>
                  <CardTitle className="text-white">{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-gray-300 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <Card className="zh-card">
          <CardContent className="text-center space-y-6 py-12">
            <h2 className="text-3xl font-bold text-white">
              {t('gameInfo.cta.title')}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('gameInfo.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-zh-accent hover:bg-zh-accent/80 text-white">
                <Play className="w-4 h-4 mr-2" />
                {t('gameInfo.cta.download')}
              </Button>
              <Button variant="outline" className="border-zh-accent text-zh-accent hover:bg-zh-accent hover:text-white">
                <Users className="w-4 h-4 mr-2" />
                {t('gameInfo.cta.community')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Detail Modal */}
      {selectedStrategy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="zh-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <selectedStrategy.icon className="w-6 h-6 text-zh-accent" />
                  {selectedStrategy.title}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedStrategy(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge className={`text-white ${getDifficultyColor(selectedStrategy.difficulty)}`}>
                  {t(`gameInfo.strategies.difficulty.${selectedStrategy.difficulty}`)}
                </Badge>
                <Badge variant="outline">
                  {t(`gameInfo.strategies.category.${selectedStrategy.category}`)}
                </Badge>
                <Badge variant="outline">
                  {selectedStrategy.faction === 'all' ? t('gameInfo.strategies.allFactions') : selectedStrategy.faction.toUpperCase()}
                </Badge>
              </div>
              
              <div className="text-gray-300">
                {selectedStrategy.description}
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-semibold">{t('gameInfo.strategies.steps')}:</h4>
                <div className="space-y-2 text-gray-300">
                  <div>1. {t('gameInfo.strategies.step1')}</div>
                  <div>2. {t('gameInfo.strategies.step2')}</div>
                  <div>3. {t('gameInfo.strategies.step3')}</div>
                  <div>4. {t('gameInfo.strategies.step4')}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Button 
                  className="w-full bg-zh-accent hover:bg-zh-accent/80"
                  onClick={() => setSelectedStrategy(null)}
                >
                  {t('gameInfo.strategies.close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 