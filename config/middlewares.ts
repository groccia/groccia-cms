export default ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      frameguard: false,
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': [
            "'self'",
            'https:',
            'http:',
            `${env('MEDUSA_BACKEND_ADMIN', 'http://localhost:7000')}`,
          ],
          'frame-ancestors': [`${env('MEDUSA_BACKEND_ADMIN', 'http://localhost:7000')}`],
          'frame-src': [`${env('MEDUSA_BACKEND_ADMIN', 'http://localhost:7000')}`],
        },
        upgradeInsecureRequests: null,
      },
    },
  },
  {
    name: 'strapi::poweredBy',
    config: {
      poweredBy: 'Groccia',
    },
  },
  {
    name: 'strapi::cors',
    config: {
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
      origin: [
        env('MEDUSA_BACKEND_URL'),
        env('MEDUSA_BACKEND_ADMIN'),
        env('SELF_URL'),
        env('STOREFRONT_URL'),
      ],
      keepHeaderOnError: true,
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
