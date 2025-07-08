'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const nextLocale = locale === 'en' ? 'ar' : 'en';

  // Remove the current locale from the pathname and prepend the next locale
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)(\/|$)/, '/');
  const nextHref = `/${nextLocale}${pathWithoutLocale}`;

  return (
    <Button asChild variant="ghost" size="icon">
      <Link href={nextHref}>
        <Globe className="h-5 w-5" />
      </Link>
    </Button>
  );
} 