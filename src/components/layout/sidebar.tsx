'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { 
  Home,
  Info,
  HelpCircle,
  MessageSquare,
  Trophy,
  Play,
  BarChart3,
  Users,
  User,
  Mail,
  Settings,
  Shield,
  Gamepad2,
  Crown,
  Zap,
  LifeBuoy,
  Film,
  Swords,
  X,
  Activity,
  Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const fullPathname = usePathname();
  // Remove locale prefix from the full pathname to get the base path
  const pathname = fullPathname.startsWith(`/${locale}`) 
    ? fullPathname.substring(locale.length + 1)
    : fullPathname;

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const navItems = {
    main: [
      { href: '/', label: t('navigation.home'), icon: Home },
      { href: '/game-info', label: t('navigation.gameInfo'), icon: Info },
      { href: '/support', label: t('navigation.support'), icon: HelpCircle },
    ],
    community: [
      { href: '/forum', label: t('navigation.forum'), icon: MessageSquare },
      { href: '/tournaments', label: t('navigation.tournaments'), icon: Trophy },
      { href: '/streamers', label: t('navigation.streamers'), icon: Play },
      { href: '/replays', label: t('navigation.replays'), icon: Gamepad2 },
    ],
    gameplay: [
      { href: '/rankings', label: t('navigation.rankings'), icon: BarChart3 },
      { href: '/clans', label: t('navigation.clans'), icon: Users },
    ],
    user: [
      { href: '/profile', label: t('navigation.profile'), icon: User },
      { href: '/messages', label: t('navigation.messages'), icon: Mail },
      { href: '/settings', label: t('navigation.settings'), icon: Settings },
    ],
    admin: [
      { href: '/admin', label: t('navigation.admin'), icon: Shield },
    ],
  };

  const NavSection = ({ title, items, onLinkClick }: { title?: string; items: typeof navItems.main; onLinkClick?: () => void; }) => (
    <div className="space-y-1 pb-4 mb-4 border-b border-zh-border/30">
      {title && <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>}
      {items.map((item) => {
        const itemHref = `/${locale}${item.href}`;
        const isActive = fullPathname === itemHref;
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={onLinkClick}
          >
            <Link href={itemHref}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
  
  const sidebarContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zh-border/30 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={isMobile ? onClose : undefined}>
          <Swords className="h-8 w-8 text-zh-accent" />
          <span className="font-bold text-xl text-white">ZH-Love</span>
        </Link>
        {isMobile && <Button variant="ghost" size="icon" onClick={onClose}><X className="h-6 w-6" /></Button>}
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <NavSection items={navItems.main} onLinkClick={isMobile ? onClose : undefined} />
        <NavSection title="Community" items={navItems.community} onLinkClick={isMobile ? onClose : undefined} />
        <NavSection title="Gameplay" items={navItems.gameplay} onLinkClick={isMobile ? onClose : undefined} />
        <NavSection title="Your Account" items={navItems.user} onLinkClick={isMobile ? onClose : undefined} />
        <NavSection title="Admin" items={navItems.admin} onLinkClick={isMobile ? onClose : undefined} />
      </nav>
      
      <div className="px-4 py-4 border-t border-zh-border/30 mt-auto">
        <h3 className="text-xs font-semibold text-zh-border uppercase mb-3">Live Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Gamepad2 className="h-4 w-4 text-zh-accent" />
              <span>Players Online</span>
            </div>
            <span className="font-bold text-white">1,247</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Activity className="h-4 w-4 text-zh-blue" />
              <span>Active Matches</span>
            </div>
            <span className="font-bold text-white">156</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Server className="h-4 w-4 text-zh-gold" />
              <span>Active Tournaments</span>
            </div>
            <span className="font-bold text-white">8</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className={cn("fixed top-0 h-full w-64 zh-sidebar z-40 hidden md:block", dir === 'ltr' ? 'left-0' : 'right-0')}>
        {sidebarContent(false)}
      </aside>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <motion.aside className={cn("relative w-64 h-full zh-sidebar", dir === 'rtl' ? 'ml-auto' : '')} initial={{ x: dir === 'ltr' ? "-100%" : "100%" }} animate={{ x: "0%" }} exit={{ x: dir === 'ltr' ? "-100%" : "100%" }} transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}>
              {sidebarContent(true)}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 