'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, Bell, User, Swords, Home, LogOut, Shield } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { useTranslations } from 'next-intl';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const t = useTranslations('navigation');
  const { data: session, status } = useSession();
  const params = useParams();
  const locale = params.locale as string;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zh-border/60 bg-zh-primary/80 backdrop-blur-sm">
      <div className="zh-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Swords className="h-6 w-6 text-zh-accent" />
            <span className="font-bold text-lg text-white">ZH-Love</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>

          <LanguageSwitcher />

          {session ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              
              {/* User Menu */}
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-sm text-white">
                  {session.user.name || session.user.username}
                </span>
                
                {session.user.role === 'admin' && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/${locale}/admin`}>
                      <Shield className="h-4 w-4 text-red-400" />
                    </Link>
                  </Button>
                )}
                
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/${locale}/profile`}>
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href={`/${locale}/login`}>{t('login')}</Link>
              </Button>
              <Button variant="gaming" asChild>
                <Link href={`/${locale}/signup`}>{t('register')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 