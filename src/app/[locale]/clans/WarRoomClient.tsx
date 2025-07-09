'use client';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Swords, Clock, Users, Trophy, Shield, Flame, MapPin, Zap, MessageSquare } from 'lucide-react';
import { useRef, useState } from 'react';

// Helper functions for avatars and logos
const getClanLogo = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=281B39&color=fff&size=128&rounded=true`;
const getPlayerAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1D1834&color=F2C94C&size=96&rounded=true&bold=true`;
const mapImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

export default function WarRoomClient() {
  return (
    <section className="relative py-16">
      <AnimatedBackground variant="battle" className="rounded-2xl shadow-2xl overflow-hidden">
        {/* Animated Fog Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="w-full h-full animate-fog bg-[url('/assets/fog.png')] bg-repeat opacity-20" />
        </div>
        </div>
        <div className="zh-container relative z-20">
          <div className="bg-zh-primary/80 backdrop-blur-lg rounded-2xl p-8 border border-zh-accent/30 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <Swords className="h-10 w-10 text-zh-accent animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Clan War Room</h2>
              <span className="ml-4 px-4 py-1 rounded-full bg-zh-accent/20 text-zh-accent font-bold text-sm flex items-center gap-2 animate-pulse">
                LIVE
                {/* Soundwave Animation */}
                <span className="flex items-end gap-0.5 h-4">
                  <span className="w-0.5 h-2 bg-zh-accent animate-soundwave1" />
                  <span className="w-0.5 h-3 bg-zh-accent animate-soundwave2" />
                  <span className="w-0.5 h-1 bg-zh-accent animate-soundwave3" />
                </span>
              </span>
              {/* Ambient Sound Toggle */}
              <AmbientSoundToggle />
            </div>
            {/* Tactical Map & Teams */}
            <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
              {/* Team A */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <img src={getClanLogo('Zero Hour Legends')} alt="Zero Hour Legends" className="w-20 h-20 rounded-full border-4 border-zh-accent shadow-lg animate-glow" />
                  {/* Animated Glowing Border */}
                  <span className="absolute inset-0 rounded-full border-4 border-zh-accent animate-border-glow pointer-events-none" />
                </div>
                <div className="text-lg font-bold text-white">Zero Hour Legends</div>
                <div className="flex gap-2 mt-2">
                  <img src={getPlayerAvatar('ChinaCommander')} className="w-10 h-10 rounded-full border-2 border-zh-border" />
                  <img src={getPlayerAvatar('RedDragon')} className="w-10 h-10 rounded-full border-2 border-zh-border" />
                  <img src={getPlayerAvatar('GLAWarrior')} className="w-10 h-10 rounded-full border-2 border-zh-border" />
                  <img src={getPlayerAvatar('TankDestroyer')} className="w-10 h-10 rounded-full border-2 border-zh-border" />
                </div>
              </div>
              {/* Tactical Map */}
              <div className="flex flex-col items-center relative">
                <MapPin className="h-12 w-12 text-zh-gold mb-2 animate-bounce z-10" />
                <div className="bg-zh-secondary/80 rounded-xl p-4 shadow-lg border border-zh-border flex flex-col items-center relative overflow-hidden">
                  <div className="text-white font-bold mb-2">Tournament Desert</div>
                  <div className="relative">
                    <img src={mapImage} alt="Map" className="w-48 h-32 object-cover rounded-lg border border-zh-border mb-2" />
                    {/* Radar SVG Overlay */}
                    <svg className="absolute inset-0 w-full h-full animate-radar z-20" viewBox="0 0 192 128" fill="none">
                      <circle cx="96" cy="64" r="60" stroke="#F2C94C" strokeWidth="2" opacity="0.2" />
                      <circle cx="96" cy="64" r="40" stroke="#F2C94C" strokeWidth="1.5" opacity="0.15" />
                      <circle cx="96" cy="64" r="20" stroke="#F2C94C" strokeWidth="1" opacity="0.1" />
                      <path d="M96 64 L176 64" stroke="#F2C94C" strokeWidth="2" opacity="0.3">
                        <animateTransform attributeName="transform" type="rotate" from="0 96 64" to="360 96 64" dur="2s" repeatCount="indefinite" />
                      </path>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 text-zh-accent font-bold">
                    <Clock className="h-5 w-5" />
                    <span>Starts in: <span className="text-white">00:12:34</span></span>
                  </div>
                </div>
              </div>
              {/* Team B */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <img src={getClanLogo('Desert Eagles')} alt="Desert Eagles" className="w-20 h-20 rounded-full border-4 border-zh-gold shadow-lg animate-glow-gold" />
                  {/* Animated Glowing Border */}
                  <span className="absolute inset-0 rounded-full border-4 border-zh-gold animate-border-glow-gold pointer-events-none" />
                </div>
                <div className="text-lg font-bold text-white">Desert Eagles</div>
                <div className="flex gap-2 mt-2">
                  <img src={getPlayerAvatar('DesertCommander')} className="w-10 h-10 rounded-full border-2 border-zh-border" />
                  <img src={getPlayerAvatar('SandStorm')} className="w-10 h-10 rounded-full border-2 border-zh-border" />
                  <img src={getPlayerAvatar('Falcon')} className="w-10 h-10 rounded-full border-2 border-zh-border" />
                  <img src={getPlayerAvatar('EagleEye')} className="w-10 h-10 rounded-full border-2 border-zh-border" />
                </div>
              </div>
            </div>
            {/* Battle Stats */}
            <div className="grid md:grid-cols-4 gap-6 text-center mb-4">
              <div className="bg-zh-secondary/60 rounded-lg p-4 shadow border border-zh-border">
                <Trophy className="h-6 w-6 text-zh-gold mx-auto mb-2 animate-bounce" />
                <div className="text-2xl font-bold text-white">2</div>
                <div className="text-xs text-zh-border">Rounds Won</div>
              </div>
              <div className="bg-zh-secondary/60 rounded-lg p-4 shadow border border-zh-border">
                <Flame className="h-6 w-6 text-zh-red mx-auto mb-2 animate-pulse" />
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-xs text-zh-border">Current Streak</div>
              </div>
              <div className="bg-zh-secondary/60 rounded-lg p-4 shadow border border-zh-border">
                <Zap className="h-6 w-6 text-zh-accent mx-auto mb-2 animate-spin" />
                <div className="text-2xl font-bold text-white">4v4</div>
                <div className="text-xs text-zh-border">Battle Type</div>
              </div>
              <div className="bg-zh-secondary/60 rounded-lg p-4 shadow border border-zh-border">
                <Shield className="h-6 w-6 text-zh-blue mx-auto mb-2 animate-pulse" />
                <div className="text-2xl font-bold text-white">Best of 5</div>
                <div className="text-xs text-zh-border">Format</div>
              </div>
            </div>
            {/* Battle Log / Timeline */}
            <div className="bg-zh-secondary/70 rounded-lg p-4 mb-6 max-w-3xl mx-auto shadow border border-zh-border">
              <div className="font-bold text-white mb-2 flex items-center gap-2">
                <Flame className="h-5 w-5 text-zh-accent animate-pulse" />
                Battle Log
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-zh-accent"><Swords className="h-4 w-4 animate-bounce" /> Round 1 started - Tournament Desert</li>
                <li className="flex items-center gap-2 text-zh-gold"><Trophy className="h-4 w-4 animate-bounce" /> Desert Eagles won Round 1</li>
                <li className="flex items-center gap-2 text-zh-accent"><Swords className="h-4 w-4 animate-bounce" /> Round 2 started - Tournament Desert</li>
                <li className="flex items-center gap-2 text-zh-gold"><Trophy className="h-4 w-4 animate-bounce" /> Desert Eagles won Round 2</li>
                <li className="flex items-center gap-2 text-zh-red"><Flame className="h-4 w-4 animate-pulse" /> Zero Hour Legends on a streak!</li>
              </ul>
            </div>
            {/* Real-time Chat Preview */}
            <div className="bg-zh-secondary/80 rounded-lg p-4 mb-8 max-w-2xl mx-auto shadow border border-zh-border">
              <div className="font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-zh-accent animate-pulse" />
                War Room Chat
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <img src={getPlayerAvatar('ChinaCommander')} className="w-7 h-7 rounded-full border border-zh-border" />
                  <span className="text-zh-accent font-bold">ChinaCommander:</span>
                  <span className="text-white">GLA rush incoming, get ready!</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={getPlayerAvatar('DesertCommander')} className="w-7 h-7 rounded-full border border-zh-border" />
                  <span className="text-zh-gold font-bold">DesertCommander:</span>
                  <span className="text-white">Hold the left flank!</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={getPlayerAvatar('RedDragon')} className="w-7 h-7 rounded-full border border-zh-border" />
                  <span className="text-zh-accent font-bold">RedDragon:</span>
                  <span className="text-white">Copy that, moving units.</span>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <button className="zh-btn zh-btn-gaming flex items-center gap-2 animate-pulse">
                <Swords className="h-5 w-5" />
                Enter War Room
              </button>
              <button className="zh-btn zh-btn-outline flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                View War History
              </button>
              <button className="zh-btn zh-btn-outline flex items-center gap-2">
                <Users className="h-5 w-5" />
                Spectate
              </button>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    </section>
  );
}

function AmbientSoundToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  return (
    <button
      className={`ml-2 px-2 py-1 rounded bg-zh-secondary/60 border border-zh-border text-xs text-white flex items-center gap-1 hover:bg-zh-secondary/80 transition ${playing ? 'ring-2 ring-zh-accent' : ''}`}
      onClick={() => {
        setPlaying((p) => {
          if (!audioRef.current) return !p;
          if (p) { audioRef.current.pause(); } else { audioRef.current.play(); }
          return !p;
        });
      }}
      title={playing ? 'Mute ambient' : 'Play ambient'}
      type="button"
    >
      <span>{playing ? '🔊' : '🔈'}</span> Ambient
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b8b6b7.mp3" loop preload="auto" style={{ display: 'none' }} />
    </button>
  );
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