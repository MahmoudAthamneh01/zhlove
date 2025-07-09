'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// Generate static params for all supported locales
export function generateStaticParams() {
  return [
    { locale: 'ar' },
    { locale: 'en' }
  ];
}

export default function LocaleLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale as string;
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate that the incoming `locale` parameter is valid
    const validLocales = ['ar', 'en'];
    if (!validLocales.includes(locale)) {
      // Redirect to default locale if invalid
      window.location.href = '/ar/';
      return;
    }

    // Load messages dynamically
    const loadMessages = async () => {
      try {
        const messages = await import(`../../../messages/${locale}.json`);
        setMessages(messages.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to English
        const fallbackMessages = await import(`../../../messages/en.json`);
        setMessages(fallbackMessages.default);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [locale]);

  // Determine text direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  if (isLoading) {
    return (
      <html lang={locale} dir={dir} className="dark">
        <body className="min-h-screen bg-zh-black text-foreground font-sans antialiased">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white">Loading...</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang={locale} dir={dir} className="dark">
      <body className="min-h-screen bg-zh-black text-foreground font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}