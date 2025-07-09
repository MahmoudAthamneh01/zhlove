/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Hostinger deployment
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

  // Disable static generation for problematic pages
  experimental: {
    missingSuspenseWithCSRError: false,
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

module.exports = nextConfig;
