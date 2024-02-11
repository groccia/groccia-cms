export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  rateLimit: process.env.NODE_ENV == 'test' ? { enabled: false } : { interval: 60000, max: 100000 },
});
