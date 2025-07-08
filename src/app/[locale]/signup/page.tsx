'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { UserPlus, Lock, Mail, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.username) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          name: formData.name || formData.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      
      // Auto-login after successful registration
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push(`/${locale}`);
          router.refresh();
        }
      }, 1500);

    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <MainLayout>
        <AnimatedBackground variant="subtle" className="min-h-screen flex items-center justify-center py-12">
          <div className="zh-container max-w-md">
            <Card className="zh-card border-zh-accent/20 shadow-xl">
              <CardContent className="text-center py-12">
                <div className="mx-auto mb-4 w-16 h-16 bg-zh-accent rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to ZH-Love!</h2>
                <p className="text-zh-border mb-6">
                  Your account has been created successfully. You're being signed in...
                </p>
                <div className="w-8 h-8 border-2 border-zh-accent/20 border-t-zh-accent rounded-full animate-spin mx-auto" />
              </CardContent>
            </Card>
          </div>
        </AnimatedBackground>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <AnimatedBackground variant="subtle" className="min-h-screen flex items-center justify-center py-12">
        <div className="zh-container max-w-md">
          <Card className="zh-card border-zh-accent/20 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-zh-accent rounded-full flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                {t('auth.signup.title', { default: 'Join ZH-Love' })}
              </CardTitle>
              <p className="text-zh-border">
                {t('auth.signup.subtitle', { default: 'Create your gaming account' })}
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
                      name="email"
                      placeholder={t('auth.email', { default: 'Email' })}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zh-border" />
                    <Input
                      type="text"
                      name="username"
                      placeholder={t('auth.username', { default: 'Username' })}
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-12"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zh-border" />
                    <Input
                      type="text"
                      name="name"
                      placeholder={t('auth.fullName', { default: 'Full Name (Optional)' })}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-12"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zh-border" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder={t('auth.password', { default: 'Password' })}
                      value={formData.password}
                      onChange={handleInputChange}
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
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zh-border" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder={t('auth.confirmPassword', { default: 'Confirm Password' })}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-12 pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-border hover:text-zh-accent transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                      {t('auth.signup.creating', { default: 'Creating Account...' })}
                    </div>
                  ) : (
                    t('auth.signup.createAccount', { default: 'Create Account' })
                  )}
                </Button>
                
                <div className="text-center">
                  <div className="text-zh-border text-sm">
                    {t('auth.haveAccount', { default: 'Already have an account?' })}{' '}
                    <Link 
                      href="/login" 
                      className="text-zh-accent hover:text-zh-gold transition-colors font-medium"
                    >
                      {t('auth.signIn', { default: 'Sign in' })}
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