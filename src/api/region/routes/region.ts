/**
 * region router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::region.region', {
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
