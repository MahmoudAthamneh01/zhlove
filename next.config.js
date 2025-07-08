const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment configuration
  env: {
    _next_intl_trailing_slash: 'true'
  },
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    domains: ['localhost', 'yourdomain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Output configuration for hosting
  output: 'standalone',
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig); 