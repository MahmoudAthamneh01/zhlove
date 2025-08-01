const withNextIntl = require('next-intl/plugin')(
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for frontend-only deployment
  output: 'export',
  
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  assetPrefix: '',

  // Disable server-side features since we're deploying frontend only
  experimental: {
    appDir: true,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  transpilePackages: ['next-intl'],
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
};

module.exports = withNextIntl(nextConfig);
