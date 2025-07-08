import { setRequestLocale } from 'next-intl/server';
import ClansClient from './ClansClient';

export default function ClansPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  return <ClansClient />;
}

/* Tailwind Animations (add to your global CSS if not present):
.animate-fog { animation: fogMove 60s linear infinite; }
@keyframes fogMove { 0% { background-position: 0 0; } 100% { background-position: 1000px 0; } }
.animate-glow { box-shadow: 0 0 24px 4px #3A9A5B, 0 0 0 0 #000; animation: glowPulse 2s infinite alternate; }
@keyframes glowPulse { 0% { box-shadow: 0 0 24px 4px #3A9A5B; } 100% { box-shadow: 0 0 40px 8px #3A9A5B; } }
.animate-glow-gold { box-shadow: 0 0 24px 4px #F2C94C, 0 0 0 0 #000; animation: glowGoldPulse 2s infinite alternate; }
@keyframes glowGoldPulse { 0% { box-shadow: 0 0 24px 4px #F2C94C; } 100% { box-shadow: 0 0 40px 8px #F2C94C; } }
.animate-border-glow { animation: borderGlow 2s infinite alternate; }
@keyframes borderGlow { 0% { box-shadow: 0 0 0 0 #3A9A5B; } 100% { box-shadow: 0 0 16px 4px #3A9A5B; } }
.animate-border-glow-gold { animation: borderGlowGold 2s infinite alternate; }
@keyframes borderGlowGold { 0% { box-shadow: 0 0 0 0 #F2C94C; } 100% { box-shadow: 0 0 16px 4px #F2C94C; } }
.animate-soundwave1 { animation: soundwave1 1s infinite linear; }
@keyframes soundwave1 { 0%, 100% { height: 8px; } 50% { height: 16px; } }
.animate-soundwave2 { animation: soundwave2 1s infinite linear; }
@keyframes soundwave2 { 0%, 100% { height: 16px; } 50% { height: 8px; } }
.animate-soundwave3 { animation: soundwave3 1s infinite linear; }
@keyframes soundwave3 { 0%, 100% { height: 12px; } 50% { height: 20px; } }
.animate-radar { animation: radarSweep 2s linear infinite; }
@keyframes radarSweep { 0% { opacity: 0.3; } 100% { opacity: 0.1; } }
*/ 