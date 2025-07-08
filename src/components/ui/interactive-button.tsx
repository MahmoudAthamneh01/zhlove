'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './button';

interface InteractiveButtonProps extends ButtonProps {
  glowColor?: string;
  soundEnabled?: boolean;
  rippleEffect?: boolean;
}

export function InteractiveButton({
  children,
  className,
  glowColor = '#3A9A5B',
  soundEnabled = false,
  rippleEffect = true,
  onClick,
  ...props
}: InteractiveButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on client side only
  React.useEffect(() => {
    if (soundEnabled && typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/button-click.mp3');
      audioRef.current.volume = 0.3;
    }
  }, [soundEnabled]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Play sound effect
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore audio play errors (e.g., autoplay policy)
      });
    }

    // Create ripple effect
    if (rippleEffect && buttonRef.current) {
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    // Call original onClick
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.div
      className="relative inline-block"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect container */}
      <div
        className="absolute inset-0 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{
          background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
        }}
      />
      
      {/* Button with ripple container */}
      <Button
        ref={buttonRef}
        className={cn(
          "relative overflow-hidden",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        
        <style jsx>{`
          :global(.ripple) {
            position: absolute;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 600ms linear;
            background-color: rgba(255, 255, 255, 0.5);
          }
          
          @keyframes ripple {
            from {
              width: 0;
              height: 0;
              opacity: 1;
            }
            to {
              width: 500px;
              height: 500px;
              opacity: 0;
            }
          }
        `}</style>
      </Button>
    </motion.div>
  );
} 