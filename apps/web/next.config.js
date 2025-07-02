const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@utils'] = path.resolve(__dirname, '../../../packages/utils');
    config.watchOptions = {
      ignored: ['**/.git/**', '**/node_modules/**', '**/.next/**'],
    };
    return config;
  },
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
