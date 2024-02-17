import { uploadProviderLocal, uploadProviderS3 } from './env/local/plugins';

export default ({ env }) => ({
  seo: {
    enabled: true,
  },
  'content-versioning': {
    enabled: true,
  },
  'strapi-plugin-medusajs': {
    enabled: true,
    resolve: './src/plugins/strapi-plugin-medusajs',
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
});
