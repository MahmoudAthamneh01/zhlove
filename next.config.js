const withNextIntl = require('next-intl/plugin')(
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optimize build for Vercel
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Ensure consistent module resolution
  transpilePackages: ['next-intl'],
  // Optimize for production
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
}

module.exports = withNextIntl(nextConfig); 