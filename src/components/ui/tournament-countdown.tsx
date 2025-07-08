'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock, Trophy, Zap } from 'lucide-react';

interface TournamentCountdownProps {
  endDate: Date;
  tournamentName: string;
  prize?: string;
  className?: string;
}

export function TournamentCountdown({
  endDate,
  tournamentName,
  prize,
  className
}: TournamentCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <motion.div
      className={cn(
        "relative p-6 rounded-lg bg-gradient-to-br from-zh-primary to-zh-secondary border border-zh-gold/30",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-zh-gold/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%'
            }}
            animate={{
              y: [null, '-100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-zh-gold" />
              {tournamentName}
            </h3>
            {prize && (
              <p className="text-sm text-zh-gold mt-1">Prize Pool: {prize}</p>
            )}
          </div>
          <Clock className="h-8 w-8 text-zh-gold animate-pulse" />
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-3">
          {timeUnits.map((unit, index) => (
            <div key={unit.label} className="text-center">
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                <div className="absolute inset-0 bg-zh-gold/20 blur-md" />
                <div className="relative bg-zh-primary/80 backdrop-blur-sm border border-zh-gold/50 rounded-lg p-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={unit.value}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold text-zh-gold"
                    >
                      {unit.value.toString().padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                  <div className="text-xs text-zh-border mt-1">{unit.label}</div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Status */}
        <motion.div 
          className="mt-4 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {timeLeft.days === 0 && timeLeft.hours < 24 ? (
            <span className="text-zh-red font-medium flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              Starting Soon!
            </span>
          ) : (
            <span className="text-zh-accent text-sm">Registration Open</span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
} 