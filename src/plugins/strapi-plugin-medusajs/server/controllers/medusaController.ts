import { Strapi } from '@strapi/strapi';
import { Context } from 'koa';

export default ({ strapi }: { strapi: Strapi }) => ({
  async createUser(ctx: Context) {
    console.log('Creating Medusajs user');
    strapi.log.info(ctx.request);
    ctx.body = await strapi
      .plugin('strapi-plugin-medusajs')
      .service('medusaService')
      .verifyOrCreateMedusaUser(ctx.request.body);

    return ctx.body;
  },
  async syncTables(ctx: Context) {
    ctx.body = await strapi
      .plugin('strapi-plugin-medusajs')
      .service('medusaService')
      .synchronizeWithMedusa({ strapi });
    return ctx.body;
  },
});
