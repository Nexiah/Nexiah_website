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
            'https://cdn.jsdelivr.net',
            'https://cdnjs.cloudflare.com',
          ],
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
