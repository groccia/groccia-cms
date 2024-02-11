import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';

export default ({ strapi }: { strapi: Strapi }) => ({
  async createUser(ctx: Context) {
    console.log('Creating Medusajs user');
    ctx.body = await strapi
      .plugin('medusa-sync')
      .service('medusaService')
      .verifyOrCreateMedusaUser(ctx.request.body);

    return ctx.body;
  },
  async syncTables(ctx: Context) {
    ctx.body = await strapi
      .plugin('medusa-sync')
      .service('medusaService')
      .synchronizeWithMedusa({ strapi });
    return ctx.body;
  },
});
