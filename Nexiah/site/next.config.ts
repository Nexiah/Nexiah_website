import type { NextConfig } from "next";
import path from "path";

// Racine du projet Next.js (dossier contenant next.config.ts) — garantit que
// node_modules (tailwindcss, etc.) est résolu depuis site/, pas depuis le monorepo
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: projectRoot,
  },
  // Webpack : résolution des modules depuis le dossier site/
  webpack: (config, { defaultLoaders }) => {
    config.resolve = config.resolve ?? {};
    config.resolve.modules = [path.join(projectRoot, "node_modules"), ...(config.resolve.modules ?? [])];
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
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
        pathname: '/**',
      },
      // SimpleIcons CDN (TechStack)
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        pathname: '/**',
      },
    ],
    // Désactiver l'optimisation pour les images locales en développement
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
