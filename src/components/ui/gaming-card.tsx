'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setRotateX((y - centerY) / 10);
    setRotateY((centerX - x) / 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const variants = {
    default: 'bg-zh-primary border-zh-border',
    rank: 'bg-gradient-to-br from-zh-primary to-zh-secondary border-zh-gold',
    achievement: 'bg-gradient-to-tr from-zh-gold/20 to-zh-primary border-zh-gold',
    battle: 'bg-gradient-to-br from-zh-red/20 to-zh-primary border-zh-red'
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-lg overflow-hidden",
        interactive && "cursor-pointer",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}40 0%, transparent 70%)`,
          filter: 'blur(20px)'
        }}
      />
      
      {/* Card content */}
      <div className={cn(
        "relative p-6 border rounded-lg backdrop-blur-sm",
        variants[variant],
        "shadow-lg hover:shadow-xl transition-shadow duration-300"
      )}>
        {/* Inner glow border */}
        <div className="absolute inset-0 rounded-lg opacity-50 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 30%, ${glowColor}20 50%, transparent 70%)`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
} 