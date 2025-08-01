import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { GamingCard } from '@/components/ui/gaming-card';
import { 
  Users, 
  Trophy, 
  MessageSquare, 
  Gamepad2,
  Target,
  Zap,
  Crown,
  Shield,
  Star
} from 'lucide-react';
import Link from 'next/link';

// Export static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default function HomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative -mt-20 pt-20 bg-gradient-to-br from-zh-primary via-zh-secondary to-zh-container">
        <div className="min-h-[600px] flex items-center justify-center py-20">
          <div className="zh-container text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-zh-accent to-zh-gold bg-clip-text text-transparent">
              ZH-Love
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
              The Ultimate Command & Conquer: Generals Zero Hour Community
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button 
                  variant="gaming" 
                  size="lg" 
                  className="min-w-[200px] text-lg shadow-lg"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Join Now
                </Button>
              </Link>
              
              <Link href="/forum">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="min-w-[200px] text-lg border-white text-white hover:bg-white hover:text-black"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Explore Forum
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-zh-secondary">
        <div className="zh-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Community Stats
            </h2>
            <p className="text-zh-border text-lg">
              Join thousands of players worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GamingCard className="text-center">
              <Users className="h-8 w-8 text-zh-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-zh-border">Players</div>
            </GamingCard>
            
            <GamingCard className="text-center">
              <Trophy className="h-8 w-8 text-zh-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-zh-border">Tournaments</div>
            </GamingCard>
            
            <GamingCard className="text-center">
              <Shield className="h-8 w-8 text-zh-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="text-zh-border">Clans</div>
            </GamingCard>
            
            <GamingCard className="text-center">
              <MessageSquare className="h-8 w-8 text-zh-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-zh-border">Posts</div>
            </GamingCard>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="zh-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose ZH-Love?
            </h2>
            <p className="text-zh-border text-lg">
              Everything you need for the ultimate Zero Hour experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <GamingCard className="text-center h-full">
              <Crown className="h-12 w-12 text-zh-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Join Clans
              </h3>
              <p className="text-zh-border">
                Create or join clans with up to 4 players and compete in clan wars
              </p>
            </GamingCard>
            
            <GamingCard className="text-center h-full">
              <Trophy className="h-12 w-12 text-zh-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Tournaments
              </h3>
              <p className="text-zh-border">
                Participate in regular tournaments with prizes and recognition
              </p>
            </GamingCard>
            
            <GamingCard className="text-center h-full">
              <Target className="h-12 w-12 text-zh-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Rankings
              </h3>
              <p className="text-zh-border">
                Track your progress with our comprehensive ranking system
              </p>
            </GamingCard>
            
            <GamingCard className="text-center h-full">
              <MessageSquare className="h-12 w-12 text-zh-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Community
              </h3>
              <p className="text-zh-border">
                Connect with players worldwide in our active forums
              </p>
            </GamingCard>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-zh-secondary">
        <div className="zh-container text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Dominate?
          </h2>
          <p className="text-xl text-zh-border mb-8 max-w-2xl mx-auto">
            Join the largest Zero Hour community and start your journey to becoming a legend
          </p>
          
          <Link href="/signup">
            <Button 
              variant="gaming" 
              size="lg" 
              className="text-lg px-8 py-4"
            >
              <Gamepad2 className="mr-2 h-5 w-5" />
              Start Playing Now
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
} 