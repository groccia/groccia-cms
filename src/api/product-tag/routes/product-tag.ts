/**
 * product-tag router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::product-tag.product-tag', {
  prefix: '',
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  except: [],
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    findOne: {},
    create: {},
    update: {},
    delete: {},
  },
});
