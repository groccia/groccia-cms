import { uploadProviderLocal, uploadProviderS3 } from './env/local/plugins';

export default ({ env }) => ({
  seo: {
    enabled: true,
  },
  'content-versioning': {
    enabled: true,
  },
  'users-permissions': {
    enabled: true,
    config: {
      jwt: {
        expiresIn: '1h',
      },
      jwtSecret: env('JWT_SECRET', 'test-jwt'),
      ratelimit:
        env('NODE_ENV') == 'test'
          ? {
              interval: 60000,
              max: 100000,
            }
          : {
              headers: true,
            },
    },
  },
  upload: {
    enabled: true,
    config: env('NODE_ENV') == 'test' ? uploadProviderLocal() : uploadProviderS3(env),
  },
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
    },
  },
  menus: {
    config: { maxDepth: 2 },
  },
  documentation: {
    config: {
      'x-strapi-config': {
        plugins: ['menus', 'upload', 'users-permissions'],
      },
    },
  },
});
