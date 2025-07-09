import React from 'react';
import { cn } from '@/lib/utils';

interface XPProgressBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  className?: string;
  showNumbers?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export function XPProgressBar({
  currentXP,
  maxXP,
  level,
  className,
  showNumbers = true,
  variant = 'default'
}: XPProgressBarProps) {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);
  
  const getNextLevelXP = () => {
    return maxXP - currentXP;
  };

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="text-sm font-bold text-zh-accent">Lv.{level}</span>
        <div className="flex-1 bg-zh-container rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-zh-accent to-zh-gold transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showNumbers && (
          <span className="text-xs text-zh-border">
            {currentXP.toLocaleString()}/{maxXP.toLocaleString()}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-zh-accent">Level {level}</span>
            <span className="text-sm text-zh-border">
              ({getNextLevelXP().toLocaleString()} XP to next level)
            </span>
          </div>
          {showNumbers && (
            <span className="text-sm text-zh-border">
              {currentXP.toLocaleString()}/{maxXP.toLocaleString()} XP
            </span>
          )}
        </div>
        
        <div className="relative bg-zh-container rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-zh-accent via-zh-gold to-zh-accent transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        
        <div className="text-center">
          <span className="text-xs text-zh-border">
            {percentage.toFixed(1)}% Complete
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-zh-accent">Level {level}</span>
        {showNumbers && (
          <span className="text-sm text-zh-border">
            {currentXP.toLocaleString()}/{maxXP.toLocaleString()}
          </span>
        )}
      </div>
      
      <div className="relative bg-zh-container rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-zh-accent to-zh-gold transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
} 