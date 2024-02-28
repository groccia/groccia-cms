import { Strapi } from '@strapi/strapi';
import { bootstrapUtils } from './utils';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi.log.info(`Starting strapi in dir ${strapi.dirs.dist.config}`);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi }) {
    const shouldImportData = await bootstrapUtils.isFirstRun();

    if (shouldImportData) {
      strapi.log.info('First initialization of CMS, bootstrap and import data');
      await bootstrapUtils.importSeedData();
    } else {
      strapi.log.info('Skipping initializing and import data');
    }

    try {
      strapi.log.info('Bootstrap completed');
    } catch (err) {
      strapi.log.error(err);
    }
  },
};
