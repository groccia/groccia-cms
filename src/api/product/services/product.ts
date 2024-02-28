/**
 * product service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::product.product', ({ strapi }) => ({
  async bootstrap(data) {
    strapi.log.info('Syncing product');
  },
}));
