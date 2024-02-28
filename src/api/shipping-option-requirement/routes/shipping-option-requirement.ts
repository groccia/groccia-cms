/**
 * shipping-option-requirement router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter(
  'api::shipping-option-requirement.shipping-option-requirement',
  {
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
  }
);
