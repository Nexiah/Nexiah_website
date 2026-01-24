import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
    // Désactiver l'optimisation pour les images locales en développement
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
