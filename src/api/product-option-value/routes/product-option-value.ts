/**
 * product-option-value router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::product-option-value.product-option-value', {
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
