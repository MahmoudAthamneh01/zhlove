import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '@/components/providers/session-provider';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZH-Love - Command & Conquer: Generals Zero Hour Community',
  description: 'The largest Arabic & global community for Command & Conquer: Generals Zero Hour. Join tournaments, track rankings, participate in forums, and connect with players worldwide.',
  keywords: ['Command & Conquer', 'Generals Zero Hour', 'Gaming Community', 'Tournaments', 'Rankings', 'Arabic Gaming'],
  authors: [{ name: 'ZH-Love Team' }],
  creator: 'ZH-Love',
  publisher: 'ZH-Love',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zh-love.com'),
  openGraph: {
    title: 'ZH-Love - C&C Generals Zero Hour Community',
    description: 'Join the ultimate gaming community for Command & Conquer: Generals Zero Hour',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_SA', 'en_US'],
    siteName: 'ZH-Love',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZH-Love - C&C Generals Zero Hour Community',
    description: 'Join the ultimate gaming community for Command & Conquer: Generals Zero Hour',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
} 