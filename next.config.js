const withNextIntl = require('next-intl/plugin')(
  './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export if explicitly requested
  ...(process.env.STATIC_EXPORT === 'true' && { output: 'export' }),
  
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
