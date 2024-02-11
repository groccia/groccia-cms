export default ({ env }) => ({
  seo: {
    enabled: true,
  },
  'content-versioning': {
    enabled: true,
  },
  'medusa-sync': {
    enabled: true,
    resolve: './src/plugins/medusa-sync',
  },
  'users-permissions': {
    enabled: true,
    config: {
      jwt: {
        expiresIn: '1h',
      },
      jwtSecret: env('JWT_SECRET', 'test-jwt'),
      ratelimit:
        process.env.NODE_ENV == 'test'
          ? {
              interval: 60000,
              max: 100000,
            }
          : {
              headers: true,
            },
    },
  },
});
