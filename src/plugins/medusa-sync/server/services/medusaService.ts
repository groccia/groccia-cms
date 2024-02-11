import { Strapi } from '@strapi/strapi';
import { MedusaUserParams, StrapiSeedInterface } from '../types';
import { checkMedusaReady, createMedusaUser, signalMedusa } from './_utils';

let strapi: Strapi;

export function config(myStrapi: Strapi): void {
  strapi = myStrapi;
}

// TODO: Adding user-permissions plugins
export async function verifyOrCreateMedusaUser(medusaUser: MedusaUserParams): Promise<any> {
  const users = await strapi.plugins['user-permissions'].services.user.fetchAll({
    filters: {
      email: medusaUser.email,
    },
  });

  if (users.length) {
    return users[0];
  } else {
    return await createMedusaUser(medusaUser);
  }
}

export async function synchronizeWithMedusa(): Promise<boolean | undefined> {
  const medusaUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
  const medusaSeedHookUrl = `${medusaUrl}/strapi/hooks/seed`;

  await checkMedusaReady(medusaUrl);

  let seedData: StrapiSeedInterface;
  let pageNumber;

  try {
    strapi.log.info(`attempting to sync connect with medusa server on ${medusaSeedHookUrl}`);
    const signalData = await signalMedusa('SEED');
    seedData = signalData?.data as StrapiSeedInterface;
    pageNumber = seedData?.meta.pageNumber;
  } catch (error) {
    strapi.log.info(
      'Unable to Fetch Seed Data from Medusa server.Please check configuartion' +
        `${JSON.stringify(error)}`
    );
    return false;
  }

  if (!seedData) {
    return false;
  }

  let continueSeed;
  do {
    continueSeed = false;
    const products = seedData?.data?.products;
    const regions = seedData?.data?.regions;
    const shippingOptions = seedData?.data?.shippingOptions;
    const paymentProviders = seedData?.data?.paymentProviders;
    const fulfillmentProviders = seedData?.data?.fulfillmentProviders;
    const shippingProfiles = seedData?.data?.shippingProfiles;
    const productCollections = seedData?.data?.productCollections;
    const stores = seedData?.data?.stores;

    try {
      const servicesToSync = {
        'api::fulfillment-provider.fulfillment-provider': fulfillmentProviders,
        'api::payment-provider.payment-provider': paymentProviders,
        'api::region.region': regions,
        'api::shipping-option.shipping-option': shippingOptions,
        'api::shipping-profile.shipping-profile': shippingProfiles,
        'api::product-collection.product-collection': productCollections,
        'api::product.product': products,
        'api::store.store': stores,
      };
      const strapiApiServicedDataReceivedFromMedusa = Object.values(servicesToSync);
      const strapiApiServicesNames = Object.keys(servicesToSync);

      for (let i = 0; i < strapiApiServicesNames.length; i++) {
        if (
          strapiApiServicedDataReceivedFromMedusa[i] &&
          strapiApiServicedDataReceivedFromMedusa[i]?.length > 0
        ) {
          try {
            await strapi.services[strapiApiServicesNames[i]].bootstrap(
              strapiApiServicedDataReceivedFromMedusa[i]
            );
          } catch (e) {
            strapi.log.info('unable to bootstrap', JSON.stringify(e));
          }
        } else {
          strapi.log.info(
            `Nothing to sync ${strapiApiServicesNames[i]}  no data` +
              ` received in page ${pageNumber}`
          );
        }
      }
    } catch (error) {
      strapi.log.info(
        'Unable to Sync with to Medusa server. Please check data recieved',
        JSON.stringify(error)
      );
      return false;
    }

    if (seedData) {
      const dataSets = Object.keys(seedData.data);

      for (let j = 0; j < dataSets.length; j++) {
        if (seedData.meta.hasMore[dataSets[j]]) {
          continueSeed = true;

          try {
            strapi.log.info(`Continuing to sync: Page ${pageNumber + 1} `, medusaSeedHookUrl);
            seedData = (
              await signalMedusa('SEED', 200, {
                meta: { pageNumber: pageNumber + 1 },
              })
            )?.data as StrapiSeedInterface;
            pageNumber = seedData?.meta.pageNumber;
          } catch (e) {
            strapi.log.info(
              'Unable to Sync with to Medusa server. Please check data recieved',
              JSON.stringify(e)
            );
            return false;
          }
          break;
        }
      }
    }
  } while (continueSeed);

  strapi.log.info('SYNC FINISHED');
	const result = (await signalMedusa('SYNC COMPLETED'))?.status == 200;
	return result;
}
