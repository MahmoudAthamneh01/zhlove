'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MainLayout } from '@/components/layout/main-layout';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { User, Lock, Mail, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  params: { locale: string };
}

export default function LoginPage({ params: { locale } }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const t = useTranslations();
  const { data: session } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push(`/${locale}`);
    }
  }, [session, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Redirect to home with current locale
        router.push(`/${locale}`);
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <AnimatedBackground variant="subtle" className="min-h-screen flex items-center justify-center py-12">
        <div className="zh-container max-w-md">
          <Card className="zh-card border-zh-accent/20 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-zh-accent rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                {t('auth.login.title', { default: 'Welcome Back' })}
              </CardTitle>
              <p className="text-zh-border">
                {t('auth.login.subtitle', { default: 'Sign in to your ZH-Love account' })}
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zh-border" />
                    <Input
                      type="email"
                      placeholder={t('auth.email', { default: 'Email' })}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zh-border" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.password', { default: 'Password' })}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-border hover:text-zh-accent transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="gaming"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {t('auth.login.signingIn', { default: 'Signing In...' })}
                    </div>
                  ) : (
                    t('auth.login.signIn', { default: 'Sign In' })
                  )}
                </Button>
                
                <div className="text-center space-y-3">
                  <Link 
                    href="/forgot-password" 
                    className="text-zh-accent hover:text-zh-gold transition-colors text-sm"
                  >
                    {t('auth.forgotPassword', { default: 'Forgot your password?' })}
                  </Link>
                  
                  <div className="text-zh-border text-sm">
                    {t('auth.noAccount', { default: "Don't have an account?" })}{' '}
                    <Link 
                      href={`/${locale}/signup`}
                      className="text-zh-accent hover:text-zh-gold transition-colors font-medium"
                    >
                      {t('auth.signUp', { default: 'Sign up' })}
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AnimatedBackground>
    </MainLayout>
  );
} 