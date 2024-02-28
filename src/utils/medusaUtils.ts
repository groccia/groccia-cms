import { factories } from '@strapi/strapi';
import { Common, Schema, Strapi } from '@strapi/strapi';
import { Context } from 'koa';
import _ from 'lodash';

async function hasSuperUser(strapi) {
  strapi.log.debug(`Checking if Superuser exists`);
  const superAdminRole = await strapi.service('admin::user').exists();
  return superAdminRole ? true : false;
}

function getFields(filename, dirName) {
  const fileNameParts = filename.split('/');
  const fileNameWithExtension = fileNameParts[fileNameParts.length - 1];
  const folderName = fileNameWithExtension.split('.')[0];
  const schema = require(`${dirName}/../content-types/${folderName}/schema.json`);
  return getRequiredKeys(schema.attributes);
}

function getRequiredKeys(attributes) {
  const keys = Object.keys(attributes);
  const requiredAttributes =
    process.env.NODE_ENV == 'test'
      ? ['id', 'medusa_id']
      : keys.filter((k) => !attributes[k].relation);
  return requiredAttributes;
}

function getFieldsWithoutRelationsAndMedia(attributes: Schema.Attributes) {
  const keys = Object.keys(attributes);
  const fields = keys.filter(
    (k) => !(attributes[k]['relation'] || attributes[k]['type'] == 'media')
  );
  return fields;
}

function getUniqueKeys(attributes: Schema.Attributes) {
  const keys = Object.keys(attributes);
  const uniqueAttributes = keys.filter(
    (k) =>
      !attributes[k]['relation'] && (attributes[k]['unique'] == true || attributes[k].type == 'uid')
  );
  return uniqueAttributes;
}

function handleError(strapi: Strapi, e) {
  const details = JSON.stringify(e?.details);
  strapi.log.error(`Error Occurred ${e?.name} ${e?.message}`);
  strapi.log.error(`Error Details ${details}`);
  strapi.log.error(`Stack trace ${e?.stack}`);
}

async function uploadFile(
  strapi: Strapi,
  uid: Common.UID.ContentType,
  fileData,
  processedData,
  fieldName = 'files'
) {
  const uploadService = strapi.service('plugin::upload.upload');

  const files = fileData.files ?? fileData['files.files'];

  try {
    const params = {
      id: processedData.id,
      model: uid,
      field: fieldName,
    };

    await uploadService.uploadToEntity(params, files);
    return processedData;
  } catch (e) {
    strapi.log.error('file upload failed');
    throw e;
  }
}

function findContentUid(name: string, strapi: Strapi) {
  let objectUid;
  name = name.replace('_', '-'); // Example: change from product_category to product-category

  const contentTypes = strapi.contentTypes;
  const contentTypeKeys = Object.keys(strapi.contentTypes);
  for (const key of contentTypeKeys) {
    const value = contentTypes[key];
    if (
      value.collectionName == name ||
      value.info.singularName == name ||
      value.info.pluralName == name
    ) {
      objectUid = `api::${value.info.singularName}.${value.info.singularName}`;
      return objectUid;
    }
  }
  return objectUid;
}

// eslint-disable-next-line valid-jsdoc
/**
 * retrieves the strapi id of the received medusa data and attaches it to the data.
 * @param {*} uid - the application uid
 * @param {*} strapi - the strapi Object
 * @param {*} dataReceived the medusa data
 * @returns
 */
async function attachOrCreateStrapiIdFromMedusaId(
  uid: Common.UID.ContentType,
  strapi: Strapi,
  dataReceived: Record<string, any>
) {
  if (!dataReceived) {
    return;
  }
  const keys = Object.keys(dataReceived);

  if (dataReceived?.medusa_id) {
    for (const key of keys) {
      if (Array.isArray(dataReceived[key])) {
        for (const element of dataReceived[key]) {
          const objectUid = findContentUid(key, strapi);
          if (objectUid) {
            // Recursive
            await attachOrCreateStrapiIdFromMedusaId(objectUid, strapi, element);
          }
        }
      } else if (dataReceived[key] instanceof Object) {
        const objectUid = findContentUid(key, strapi);
        if (objectUid) {
          // Recursive
          const result = await attachOrCreateStrapiIdFromMedusaId(
            objectUid,
            strapi,
            dataReceived[key]
          );
          dataReceived[key] = result.id;
        }
      } else if (key == 'medusa_id') {
        dataReceived[key] = dataReceived[key].toString();
      }
    }
    try {
      let strapiId = undefined;
      if (dataReceived?.medusa_id) {
        const medusa_id = dataReceived.medusa_id;
        try {
          strapiId = await getStrapiIdFromMedusaId(uid, strapi, medusa_id);
        } catch (e) {
          strapi.log.error(`${dataReceived.medusa_id} ${e.message}`);
        }
      }
      if (!strapiId) {
        try {
          const entityData = await getStrapiEntityByUniqueField(uid, strapi, dataReceived);
          strapiId = entityData?.id;
          if (!strapiId) {
            strapi.log.info(
              `Cannot find strapi id with unique fields, finding by medusa_id instead`
            );
            try {
              const entityData = await strapi.db.query(uid).findOne({
                select: ['id'],
                where: { medusa_id: dataReceived?.medusa_id },
              });
              strapiId = entityData?.id;
            } catch (e) {
              strapi.log.error(`Cannot find entity with medusa_id ${dataReceived?.medusa_id}`);
            }
          }
        } catch (e) {
          strapi.log.error(`unique field error${dataReceived?.medusa_id} ${e.message}`);
        }
      }
      try {
        if (!strapiId) {
          strapi.log.debug(`${uid} creating, ${JSON.stringify(dataReceived)}`);
          const newEntity = await strapi.entityService.create(uid, {
            data: { ...dataReceived },
            populate: '*',
          });
          dataReceived['id'] = newEntity.id;
        } else {
          dataReceived['id'] = strapiId;
        }
      } catch (e) {
        switch (e.name) {
          case 'ValidationError':
            strapi.log.error(
              `Cannot create ${uid}. Validation errors occured on ${
                dataReceived['medusa_id']
              }: ${e.details.errors.map((error) => error.message + ' ')}`
            );
            break;
          default:
            strapi.log.error(`unable to create ${uid} ${e.message} ${dataReceived['medusa_id']}`);
            break;
        }
        // throw e;
      }
    } catch (e) {
      strapi.log.error(`no such service  ${e.message} ${uid}`);
      throw e;
    }
    return dataReceived;
  }

  return dataReceived;
}

async function getStrapiEntityByUniqueField(
  uid: Common.UID.ContentType,
  strapi: Strapi,
  dataReceived: Record<string, any>
) {
  try {
    const model = strapi.contentType(uid);
    const uniqueFields = getUniqueKeys(model.attributes);

    for (const field of uniqueFields) {
      // we're not iterating over empty fields as they're not unique
      if (!dataReceived[field]) {
        continue;
      }

      const filters = {};
      filters[field] = dataReceived[field];

      try {
        const entity = await strapi.entityService.findMany(uid, {
          filters,
          // @ts-ignore
          fields: ['id', ...uniqueFields],
        });
        // @ts-ignore
        if (entity?.length > 0) {
          return entity[0];
        }
      } catch (e) {
        strapi.log.error(`Unique entity search error ${uid} ${e.message}`);
      }
    }
  } catch (e) {
    strapi.log.error(`Cannot find entity in ${uid} ${e.message}`);
  }
}

async function createNestedEntity(uid, strapi, dataReceived) {
  return attachOrCreateStrapiIdFromMedusaId(uid, strapi, dataReceived);
}

async function translateStrapiIdsToMedusaIds(uid, strapi, dataToSend) {
  if (!dataToSend) {
    return;
  }
  const keys = Object.keys(dataToSend);

  for (const key of keys) {
    if (dataToSend[key] instanceof Array) {
      for (const element of dataToSend[key]) {
        const objectUid = `api::${key}.${key}`;
        translateStrapiIdsToMedusaIds(objectUid, strapi, element);
      }
    } else if (dataToSend[key] instanceof Object) {
      const objectUid = `api::${key}.${key}`;
      translateStrapiIdsToMedusaIds(objectUid, strapi, dataToSend[key]);
    } else if (key == 'id') {
      try {
        const entity = await strapi.service(uid).findOne(dataToSend[key], uid, strapi);
        if (entity) {
          dataToSend['medusa_id'] = entity.medusa_id;
        }
      } catch (e) {
        strapi.log.error('error retrieving one ' + e.message);
      }

      return dataToSend;
    }
  }
  return dataToSend;
}

async function findByMedusaId(
  uid: Common.UID.ContentType,
  strapi: Strapi,
  medusa_id: string,
  fields
) {
  try {
    const entities = await strapi.entityService.findMany(uid, {
      fields,
      filters: { medusa_id },
    });
    return entities?.[0];
  } catch (e) {
    strapi.log.debug(e);
  }
}

async function getStrapiIdFromMedusaId(uid, strapi, medusa_id: string) {
  return (await findByMedusaId(uid, strapi, medusa_id, ['medusa_id', 'id']))?.id;
}

// Controller components
async function controllerFindOne(ctx: Context, strapi: Strapi, uid: Common.UID.ContentType) {
  const { id: medusa_id } = ctx.params;

  const model = strapi.contentType(uid);
  const fields = getFieldsWithoutRelationsAndMedia(model.attributes);

  strapi.log.debug(`Finding ${uid} with medusa_id ${medusa_id}`);
  try {
    const entity = await findByMedusaId(uid, strapi, medusa_id, fields);

    if (!(entity && entity.id)) {
      return ctx.notFound(ctx);
    }

    ctx.body = { data: entity };

    return ctx.body;
  } catch (e) {
    handleError(strapi, e);
    return ctx.internalServerError(ctx);
  }
}

async function controllerFindMany(ctx: Context, strapi: Strapi, uid: Common.UID.ContentType) {
  try {
    if (ctx.query.fields && !Array.isArray(ctx.query.fields)) {
      throw new Error('fields must be an array');
    }

    let query: Record<any, unknown> = {};

    // Fields and population
    if (ctx.query?.fields) {
      query.fields = ctx.query.fields.includes('medusa_id')
        ? [...ctx.query.fields]
        : [...ctx.query.fields, 'medusa_id'];
    } else {
      query.fields = ['*'];
    }

    // Pagination
    if (!ctx.query.pagination) {
      query.page = 1;
      query.pageSize = 25;
      query.withCount = true;
      // @ts-ignore
    } else if (ctx.query.pagination.start) {
      const page =
        Math.floor(
          // @ts-ignore
          parseInt(ctx.query.pagination.start ?? '0') / parseInt(ctx.query.pagination.limit ?? '25')
        ) + 1;

      query.page = page;
      // @ts-ignore
      query.pageSize = ctx.query.pagination.limit ?? 25;
      query.withCount = true;
    } else {
      query = {
        ...query,
        // @ts-ignore
        ...ctx.query.pagination,
      };
    }

    if (ctx.query?.filters) {
      query.filters = ctx.query.filters;
    }

    const entity = await strapi.entityService.findPage(uid, query);
    strapi.log.debug(`Requested ${uid} query: ${JSON.stringify(ctx.query)}`);

    if (!entity || entity.results?.length === 0) {
      return ctx.notFound(ctx);
    }
    // @ts-ignore
    ctx.query = query;
    ctx.body = { data: entity.results, meta: entity.pagination };

    return ctx.body;
  } catch (e) {
    handleError(strapi, e);
    return ctx.internalServerError(ctx);
  }
}

async function controllerCreate(ctx: Context, strapi: Strapi, uid: Common.UID.ContentType) {
  // Delete id field so it will not be conflicted with strapi id
  if (ctx.request.body['id']) delete ctx.request.body['id'];
  if (ctx.request.body['data']?.id) delete ctx.request.body['data']['id'];

  let processedData;

  let data = _.cloneDeep(ctx.request.body['data'] ?? ctx.request.body);
  strapi.log.debug(`Creating Medusa entity ${uid} on Strapi`, { data });
  try {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }

    let files;
    if (ctx.request['files']) {
      files = _.cloneDeep(ctx.request['files']);
      delete data.files;
    }

    processedData = await attachOrCreateStrapiIdFromMedusaId(uid, strapi, data);
    if (processedData && files) {
      processedData = await uploadFile(strapi, uid, files, processedData);
    }

    strapi.log.debug(`created element ${uid} ${JSON.stringify(processedData)}`);

    ctx.body = { data: processedData };

    return ctx.body;
  } catch (e) {
    handleError(strapi, e);
    return ctx.internalServerError(ctx);
  }
}

async function controllerDelete(ctx: Context, strapi: Strapi, uid: Common.UID.ContentType) {
  const { id: medusa_id } = ctx.params;
  try {
    const entityId = await getStrapiIdFromMedusaId(uid, strapi, medusa_id);
    if (!entityId) {
      return ctx.notFound(ctx);
    }
    const result = await strapi.entityService.delete(uid, entityId, { populate: '*' });
    if (result) {
      return (ctx.body = { deletedData: result });
    }
  } catch (e) {
    handleError(strapi, e);
    return ctx.internalServerError(ctx);
  }
}

async function controllerUpdate(ctx: Context, strapi: Strapi, uid: Common.UID.ContentType) {
  const { id: medusa_id } = ctx.params;

  // Delete id field so it will not be conflicted with strapi id
  if (ctx.request.body['id']) delete ctx.request.body['id'];
  if (ctx.request.body['data']?.id) delete ctx.request.body['data']['id'];

  const data = ctx.request.body['data'] || ctx.request.body;

  strapi.log.info(`Medusa is updating entity ${medusa_id} of type ${uid} in Strapi`, {
    data: data,
  });

  try {
    const entityId = await getStrapiIdFromMedusaId(uid, strapi, medusa_id);
    if (entityId) {
      strapi.log.debug('converting to strapi data - time: ' + Date.now());
      const processedData = await attachOrCreateStrapiIdFromMedusaId(uid, strapi, data);
      strapi.log.debug('converted to strapi data - time: ' + Date.now());
      delete processedData.medusa_id;
      strapi.log.debug('updating strapi data ' + uid + ' - time: ' + Date.now());
      let result = await strapi.entityService.update(uid, entityId, {
        data: { ...processedData },
      });
      strapi.log.debug('updated updated strapi data ' + uid + ' - time: ' + Date.now());
      ctx.body = {
        data: result,
      };

      return ctx.body;
    } else {
      strapi.log.warn(
        `Cannot update entity ${medusa_id} of type ${uid} as it doesn't exist in strapi`
      );
      return ctx.notFound(ctx);
    }
  } catch (e) {
    handleError(strapi, e);
    return ctx.internalServerError(ctx);
  }
}

function createMedusaDefaultController(uid) {
  return factories.createCoreController(uid, {
    async find(ctx) {
      return await controllerFindMany(ctx, strapi, uid);
    },
    async findOne(ctx) {
      return await controllerFindOne(ctx, strapi, uid);
    },
    async delete(ctx) {
      return await controllerDelete(ctx, strapi, uid);
    },
    async create(ctx) {
      return await controllerCreate(ctx, strapi, uid);
    },

    async update(ctx) {
      return await controllerUpdate(ctx, strapi, uid);
    },
  });
}

export default {
  hasSuperUser,
  handleError,
  getFields,
  findByMedusaId,
  createMedusaDefaultController,
  createNestedEntity,
  translateStrapiIdsToMedusaIds,
};
