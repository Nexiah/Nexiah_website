import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Pour le développement local
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Pour ton Strapi en production (Coolify)
      {
        protocol: 'https',
        hostname: 'admin.nexiah.fr', // 👈 REMPLACE par ton domaine api.nexiah...
        port: '',
        pathname: '/uploads/**',
      },
      // Pour Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // 👈 Ajout du wildcard pour autoriser tout le stockage Cloudinary
      },
    ],
    // Désactiver l'optimisation pour les images locales en développement
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
