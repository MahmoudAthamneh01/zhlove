import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import GameInfoClient from './GameInfoClient';

// Export static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default function GameInfoPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  return (
    <MainLayout>
      <GameInfoClient locale={locale} />
    </MainLayout>
  );
} 