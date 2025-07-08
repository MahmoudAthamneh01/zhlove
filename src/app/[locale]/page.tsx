import { setRequestLocale } from 'next-intl/server';
import DynamicHomePageClient from '@/components/home/dynamic-home-client';

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
  
  return <DynamicHomePageClient />;
} 