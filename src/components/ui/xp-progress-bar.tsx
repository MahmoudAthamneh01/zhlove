'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface XPProgressBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  showAnimation?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function XPProgressBar({
  currentXP,
  maxXP,
  level,
  showAnimation = true,
  className,
  size = 'md'
}: XPProgressBarProps) {
  const percentage = (currentXP / maxXP) * 100;
  
  const sizes = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn("relative", className)}>
      {/* Level badge */}
      <motion.div 
        className="absolute -top-2 -left-2 z-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-zh-gold blur-md opacity-50" />
          <div className="relative bg-gradient-to-br from-zh-gold to-yellow-600 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center border-2 border-zh-gold shadow-lg">
            {level}
          </div>
        </div>
      </motion.div>

      {/* Progress bar container */}
      <div className={cn(
        "relative bg-zh-primary rounded-full overflow-hidden border border-zh-border shadow-inner",
        sizes[size],
        "mt-4"
      )}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zh-accent to-transparent animate-pulse" />
        </div>

        {/* Progress fill */}
        <motion.div
          className="relative h-full bg-gradient-to-r from-zh-accent via-zh-accent to-zh-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: showAnimation ? 1.5 : 0,
            ease: "easeOut"
          }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />

          {/* Glow effect at the end */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[150%] bg-white blur-md opacity-60" />
        </motion.div>
      </div>

      {/* XP text */}
      <motion.div 
        className={cn(
          "absolute right-0 top-4 text-zh-border font-medium",
          textSizes[size]
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
      </motion.div>

      {/* Level up particles effect */}
      {percentage >= 100 && showAnimation && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5 }}
        >
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-zh-gold rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '50%'
              }}
              animate={{
                y: [0, -50 - Math.random() * 50],
                opacity: [1, 0],
                scale: [1, 0]
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                delay: Math.random() * 0.3
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
} 