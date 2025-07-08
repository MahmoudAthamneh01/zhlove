import { setRequestLocale } from 'next-intl/server';
import { TournamentsPageClient } from '@/components/tournaments/tournaments-client';

// Export static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default function TournamentsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  return <TournamentsPageClient />;
} 