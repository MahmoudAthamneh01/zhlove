'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { 
  Trophy, 
  Target, 
  Zap, 
  Shield,
  Swords,
  Medal,
  TrendingUp,
  Star
} from 'lucide-react';

interface PlayerCardProps {
  player: {
    username: string;
    avatar: string;
    level: number;
    rank: string;
    rankIcon?: string;
    clan?: string;
    clanRole?: string;
    stats: {
      wins: number;
      losses: number;
      winRate: number;
      totalGames: number;
      favoriteGeneral?: string;
    };
    badges: Array<{
      id: string;
      name: string;
      icon: React.ReactNode;
      rarity: 'common' | 'rare' | 'epic' | 'legendary';
    }>;
  };
  variant?: 'compact' | 'full' | 'preview';
  className?: string;
}

export function PlayerCard({ player, variant = 'full', className }: PlayerCardProps) {
  const getRankGradient = (rank: string) => {
    const rankGradients: Record<string, string> = {
      'Bronze': 'from-amber-600 to-amber-800',
      'Silver': 'from-gray-300 to-gray-500',
      'Gold': 'from-yellow-400 to-yellow-600',
      'Platinum': 'from-gray-200 to-gray-400',
      'Diamond': 'from-cyan-400 to-blue-500',
      'Master': 'from-purple-500 to-pink-500',
      'Grandmaster': 'from-red-500 to-orange-500',
      'Legend': 'from-yellow-400 via-orange-500 to-red-500'
    };
    return rankGradients[rank] || 'from-gray-500 to-gray-700';
  };

  const getBadgeColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-gradient-to-r from-yellow-400 to-orange-500'
    };
    return colors[rarity] || 'bg-gray-500';
  };

  if (variant === 'compact') {
    return (
      <motion.div
        className={cn(
          "relative p-4 rounded-lg bg-zh-primary border border-zh-border hover:border-zh-accent transition-all",
          className
        )}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={player.avatar} 
              alt={player.username}
              className="w-12 h-12 rounded-full border-2 border-zh-accent"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zh-gold rounded-full flex items-center justify-center text-xs font-bold text-black">
              {player.level}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white">{player.username}</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className={`bg-gradient-to-r ${getRankGradient(player.rank)} bg-clip-text text-transparent font-medium`}>
                {player.rank}
              </span>
              {player.clan && (
                <>
                  <span className="text-zh-border">•</span>
                  <span className="text-zh-accent">{player.clan}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-zh-border">Win Rate</div>
            <div className="text-lg font-bold text-zh-accent">{player.stats.winRate}%</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative rounded-xl overflow-hidden",
        variant === 'preview' ? 'max-w-sm' : 'max-w-md',
        className
      )}
      initial={{ opacity: 0, rotateY: -180 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Background with rank gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRankGradient(player.rank)} opacity-20`} />
      
      {/* Card content */}
      <div className="relative bg-zh-primary/90 backdrop-blur-sm border border-zh-border p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.img 
                src={player.avatar} 
                alt={player.username}
                className="w-20 h-20 rounded-full border-3 border-zh-accent shadow-lg"
                whileHover={{ scale: 1.1 }}
              />
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-zh-gold text-black font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {player.level}
              </motion.div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{player.username}</h3>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRankGradient(player.rank)} text-white text-sm font-medium shadow-lg`}>
                  {player.rank}
                </div>
                {player.clan && (
                  <Badge variant="secondary" className="text-xs">
                    {player.clanRole && <Shield className="h-3 w-3 mr-1" />}
                    {player.clan}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="bg-zh-secondary/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="h-6 w-6 text-zh-gold mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{player.stats.wins}</div>
            <div className="text-xs text-zh-border">Victories</div>
          </motion.div>
          
          <motion.div 
            className="bg-zh-secondary/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Target className="h-6 w-6 text-zh-accent mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{player.stats.winRate}%</div>
            <div className="text-xs text-zh-border">Win Rate</div>
          </motion.div>
          
          <motion.div 
            className="bg-zh-secondary/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Swords className="h-6 w-6 text-zh-blue mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{player.stats.totalGames}</div>
            <div className="text-xs text-zh-border">Total Games</div>
          </motion.div>
          
          <motion.div 
            className="bg-zh-secondary/50 rounded-lg p-3 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="h-6 w-6 text-zh-red mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">
              {player.stats.wins > player.stats.losses ? '+' : ''}{player.stats.wins - player.stats.losses}
            </div>
            <div className="text-xs text-zh-border">W/L Diff</div>
          </motion.div>
        </div>

        {/* Badges */}
        {player.badges.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-zh-border mb-2">Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {player.badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  className={cn(
                    "relative w-10 h-10 rounded-full flex items-center justify-center",
                    getBadgeColor(badge.rarity),
                    badge.rarity === 'legendary' && 'shadow-lg shadow-yellow-500/50'
                  )}
                  title={badge.name}
                >
                  {badge.icon}
                  {badge.rarity === 'legendary' && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Star className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-yellow-300" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite General */}
        {player.stats.favoriteGeneral && variant === 'full' && (
          <div className="mt-4 pt-4 border-t border-zh-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zh-border">Favorite General</span>
              <span className="text-sm font-medium text-zh-accent">{player.stats.favoriteGeneral}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 