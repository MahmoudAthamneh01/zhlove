'use client';

import { useTranslations } from 'next-intl';
import { MainLayout } from '@/components/layout/main-layout';
import { GamingCard } from '@/components/ui/gaming-card';
import { TournamentCountdown } from '@/components/ui/tournament-countdown';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Calendar,
  DollarSign,
  Gamepad2,
  Crown,
  Zap,
  Shield,
  Swords,
  Star
} from 'lucide-react';

export function TournamentsPageClient() {
  const t = useTranslations();

  const tournaments = [
    {
      id: 1,
      name: "ZH World Championship 2024",
      description: "The ultimate Zero Hour tournament with the world's best players",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      prize: "$10,000",
      participants: 128,
      maxParticipants: 256,
      type: "1v1",
      status: "registration",
      featured: true,
      host: "ZH-Love Official",
      rules: "Standard competitive rules",
      map: "Tournament Desert",
      streamer: "ProGamerTV"
    },
    {
      id: 2,
      name: "Weekly Blitz Tournament",
      description: "Fast-paced matches for quick victories",
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      prize: "$500",
      participants: 64,
      maxParticipants: 64,
      type: "1v1",
      status: "full",
      host: "ClanMasters",
      rules: "$10k start, 15min matches",
      map: "Flash Fire"
    },
    {
      id: 3,
      name: "Clan Wars: Season 3",
      description: "Epic 4v4 clan battles for supremacy",
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      prize: "$5,000 + Trophies",
      participants: 16,
      maxParticipants: 32,
      type: "4v4",
      status: "upcoming",
      host: "Elite Gaming League",
      rules: "Best of 5, clan format",
      map: "Various"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registration':
        return <Badge variant="success" className="animate-pulse">Open</Badge>;
      case 'full':
        return <Badge variant="warning">Full</Badge>;
      case 'ongoing':
        return <Badge variant="info">Live</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Coming Soon</Badge>;
      case 'finished':
        return <Badge variant="default">Ended</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '1v1':
        return <Gamepad2 className="h-4 w-4" />;
      case '2v2':
        return <Users className="h-4 w-4" />;
      case '4v4':
        return <Swords className="h-4 w-4" />;
      case 'FFA':
        return <Crown className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <AnimatedBackground variant="battle" className="relative -mt-20 pt-20">
        <div className="min-h-[400px] flex items-center justify-center py-16">
          <div className="zh-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Trophy className="h-16 w-16 text-zh-gold mx-auto mb-6" />
              <h1 className="text-5xl font-bold text-white mb-4">
                {t('tournaments.title')}
              </h1>
              <p className="text-xl text-zh-border max-w-2xl mx-auto">
                {t('tournaments.subtitle')}
              </p>
            </motion.div>
          </div>
        </div>
      </AnimatedBackground>

      {/* Featured Tournament */}
      <section className="py-12 -mt-20 relative z-10">
        <div className="zh-container">
          {tournaments.filter(t => t.featured).map((tournament) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GamingCard variant="achievement" glowColor="#F2C94C" className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-zh-gold" />
                  <span className="text-zh-gold font-medium">Featured Tournament</span>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Tournament Info */}
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      {tournament.name}
                    </h2>
                    <p className="text-zh-border mb-6">
                      {tournament.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-zh-gold" />
                        <span className="text-white">Prize Pool: <span className="text-zh-gold font-bold">{tournament.prize}</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-zh-accent" />
                        <span className="text-white">
                          {tournament.participants} / {tournament.maxParticipants} Players
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getTypeIcon(tournament.type)}
                        <span className="text-white">Format: {tournament.type}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="gold" size="lg" className="shadow-lg shadow-zh-gold/30">
                        <Zap className="mr-2 h-4 w-4" />
                        Register Now
                      </Button>
                      <Button variant="outline" size="lg">
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div>
                    <TournamentCountdown
                      endDate={tournament.startDate}
                      tournamentName={tournament.name}
                      prize={tournament.prize}
                    />
                  </div>
                </div>
              </GamingCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Active Tournaments */}
      <section className="py-12">
        <div className="zh-container">
          <motion.h2 
            className="text-3xl font-bold text-white mb-8 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Shield className="h-8 w-8 text-zh-accent" />
            Active Tournaments
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {tournaments.filter(t => !t.featured).map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GamingCard 
                  variant={tournament.status === 'full' ? 'rank' : 'default'}
                  glowColor={tournament.status === 'full' ? '#D85C5C' : '#3A9A5B'}
                  className="h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {tournament.name}
                      </h3>
                      <p className="text-sm text-zh-border">
                        {tournament.description}
                      </p>
                    </div>
                    {getStatusBadge(tournament.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-zh-border mb-1">Prize</div>
                      <div className="text-zh-gold font-bold">{tournament.prize}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zh-border mb-1">Format</div>
                      <div className="text-white flex items-center gap-1">
                        {getTypeIcon(tournament.type)}
                        {tournament.type}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zh-border mb-1">Players</div>
                      <div className="text-white">{tournament.participants}/{tournament.maxParticipants}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zh-border mb-1">Starts</div>
                      <div className="text-white flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {tournament.startDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {tournament.status === 'registration' && (
                      <Button variant="gaming" size="sm" className="flex-1">
                        Join Tournament
                      </Button>
                    )}
                    {tournament.status === 'full' && (
                      <Button variant="outline" size="sm" className="flex-1" disabled>
                        Registration Full
                      </Button>
                    )}
                    {tournament.status === 'upcoming' && (
                      <Button variant="secondary" size="sm" className="flex-1">
                        Notify Me
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </GamingCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Create Tournament CTA */}
      <section className="py-16">
        <div className="zh-container">
          <motion.div
            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-zh-accent/20 to-zh-blue/20 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zh-accent/10 to-zh-blue/10 animate-pulse" />
            <div className="relative z-10">
              <Crown className="h-12 w-12 text-zh-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Want to Host Your Own Tournament?
              </h3>
              <p className="text-zh-border mb-6 max-w-2xl mx-auto">
                Create custom tournaments for your community with our advanced tournament system
              </p>
              <Button variant="gaming" size="lg">
                Create Tournament
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
} 