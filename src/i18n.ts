import { getRequestConfig } from 'next-intl/server';
import { requestLocale } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en' as const;

export default getRequestConfig(async () => {
  // Get the locale from the request
  const locale = await requestLocale();
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 