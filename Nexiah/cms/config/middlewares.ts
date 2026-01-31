export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'", // Nécessaire pour certaines fonctionnalités de Strapi Admin
            'https://cdn.jsdelivr.net',
            'https://cdnjs.cloudflare.com',
          ],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io', // Recommandé par Strapi
            'https://cdn.jsdelivr.net',
            'https://cdnjs.cloudflare.com',
            'res.cloudinary.com',      // 👈 Ajout pour Cloudinary
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',      // 👈 Ajout pour Cloudinary (vidéos/audios)
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      headers: '*',
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
