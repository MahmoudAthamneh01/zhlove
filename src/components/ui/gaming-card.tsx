import React from 'react';
import { cn } from '@/lib/utils';

interface GamingCardProps {
  className?: string;
  glowColor?: string;
  children: React.ReactNode;
  interactive?: boolean;
  variant?: 'default' | 'rank' | 'achievement' | 'battle';
}

export function GamingCard({ 
  className, 
  glowColor = '#3A9A5B',
  children,
  interactive = true,
  variant = 'default'
}: GamingCardProps) {
  const variants = {
    default: 'bg-zh-primary border-zh-border',
    rank: 'bg-gradient-to-br from-zh-primary to-zh-secondary border-zh-gold',
    achievement: 'bg-gradient-to-tr from-zh-gold/20 to-zh-primary border-zh-gold',
    battle: 'bg-gradient-to-br from-zh-red/20 to-zh-primary border-zh-red'
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden",
        interactive && "cursor-pointer hover:scale-105 transition-transform duration-300",
        className
      )}
    >
      {/* Card content */}
      <div className={cn(
        "relative p-6 border rounded-lg backdrop-blur-sm",
        variants[variant],
        "shadow-lg hover:shadow-xl transition-shadow duration-300"
      )}>
        {/* Inner glow border */}
        <div className="absolute inset-0 rounded-lg opacity-50 pointer-events-none bg-gradient-to-br from-transparent via-zh-accent/10 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
} 