import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable hot reloading in development
  reactStrictMode: true,

  // Improve development experience
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Optimize for development with Turbopack
  turbopack: {
    // Configure file watching and resolving
    resolveAlias: {
      // Add any custom aliases if needed
    },
  },

  // Configure webpack for better hot reloading
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve hot reloading performance
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
