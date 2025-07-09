import React from 'react';

interface AnimatedBackgroundProps {
  variant?: 'hero' | 'subtle' | 'battle';
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedBackground({ 
  variant = 'hero', 
  className = '', 
  children 
}: AnimatedBackgroundProps) {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'hero':
        return 'bg-gradient-to-br from-zh-primary via-zh-secondary to-zh-container';
      case 'battle':
        return 'bg-gradient-to-br from-red-900 via-zh-secondary to-zh-container';
      case 'subtle':
        return 'bg-gradient-to-br from-zh-secondary to-zh-container';
      default:
        return 'bg-gradient-to-br from-zh-primary via-zh-secondary to-zh-container';
    }
  };

  return (
    <div className={`relative overflow-hidden ${getBackgroundStyle()} ${className}`}>
      {/* Animated particles effect with CSS only */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-zh-accent rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-zh-gold rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-zh-accent rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-zh-gold rounded-full animate-pulse delay-3000"></div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 