import { createUserWithAdminRole, hasAuthorRole } from '../bootstrap';
import { MedusaData, MedusaUserParams, StrapiSeedInterface } from '../types';
import _ from 'lodash';
import { default as axios } from 'axios';
import * as jwt from 'jsonwebtoken';

/* Medusa related utils */

export async function createMedusaUser(medusaUser: MedusaUserParams): Promise<any> {
  let medusaRole;

  strapi.log.info('Creating new Medusa user');
  try {
    medusaRole = await hasMedusaRole();
  } catch (error) {
    strapi.log.error("medusa role doesn't exist", (error as Error).message);
  }

  const params = _.cloneDeep(medusaUser);
  params.role = medusaRole;

  try {
    const user = await strapi.plugins['users-permissions'].services.user.add(params);
    if (user && user.id) {
      strapi.log.info(
        `User ${params.username} ${params.email} created successfully with id ${user.id}`
      );

      strapi.log.info(`Attaching admin author role to ${params.username} ${params.email}`);

      const authorRole = await hasAuthorRole();
      if (authorRole) {
        const adminRolesService = strapi.service('admin::role');
        const authorRole = await adminRolesService.findOne({
          name: 'Author',
        });
        try {
          const result = await createUserWithAdminRole(params, authorRole);
          if (result) {
            strapi.log.info(`Attached admin author role to ${params.username} ${params.email}`);
          }
        } catch (e) {
          strapi.log.info(
            `Unable to attach admin author role to ${params.username} ${params.email}`
          );
        }
      }

      return user;
    } else {
      strapi.log.error(`Failed to create user  ${params.username} ${params.email} `);
      return false;
    }
  } catch (error) {
    strapi.log.error((error as Error).message);
    return false;
  }
}

export async function hasMedusaRole(): Promise<number | undefined> {
  strapi.log.debug('Checking if "Medusa" role exists');

  try {
    const result = await strapi.query('plugin::users-permissions.role').findOne({
      where: { name: 'Medusa' },
    }); /** all users created via medusa will be medusas */
    if (result) {
      strapi.log.info('Found role named Medusa');
      return result.id;
    }
    return;
  } catch (e) {
    strapi.log.error('Not Found role named Medusa');
    return;
  }
}

// Integration with Medusa
export async function checkMedusaReady(
  medusaUrl: string,
  timeout = 30e3,
  attempts = 1000
): Promise<number> {
  let medusaReady = false;
  while (!medusaReady && !(process.env.NODE_ENV == 'test') && attempts--) {
    try {
      const response = await axios.head(`${medusaUrl}/health`);
      medusaReady = response.status < 300 && response.status >= 200;
      if (medusaReady) {
        break;
      }
      await new Promise((r) => setTimeout(r, timeout));
    } catch (e) {
      strapi.log.info(
        'Unable to connect to Medusa server. Please make sure Medusa server is up and running',
        JSON.stringify(e)
      );
    }
  }
  return attempts;
}

export async function signalMedusa(
  message = 'Ok',
  code = 200,
  data?: Record<string, any>,
  origin: 'medusa' | 'strapi' = 'strapi'
): Promise<MedusaData | undefined> {
  const medusaUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
  const medusaSignalHookUrl = `${medusaUrl}/strapi/hooks/strapi-signal`;

  const messageData = {
    message,
    code,
    data,
    origin,
  };

  if ((await checkMedusaReady(medusaUrl)) == 0) {
    strapi.log.error('abandoning, medusa server not running');
    return;
  }

  try {
    const signedMessage = jwt.sign(messageData, process.env.MEDUSA_STRAPI_SECRET || 'no-secret');
    if (process.env.NODE_ENV == 'test' && message == 'SEED') {
      const t: StrapiSeedInterface = {
        meta: {
          pageNumber: 1,
          pageLimit: 0,
          hasMore: { products: false },
        },
        data: { products: [] },
      };
      return {
        status: 200,
        data: t,
      };
    }
    if (process.env.NODE_ENV == 'test') {
      return {
        status: 200,
        data: {},
      };
    }

    const result = await axios.post(medusaSignalHookUrl, {
      signedMessage: signedMessage,
    });
    return {
      status: result.status,
      data: result.data,
    };
  } catch (error) {
    if (process.env.NODE_ENV != 'test') {
      strapi.log.error(`unable to send message to medusa server  ${(error as Error).message}`);
    } else {
      strapi.log.warn(
        `unable to send message to medusa server test mode  ${(error as Error).message}`
      );
    }
  }
}

export async function deleteAllEntries(): Promise<void> {
  const plugins = await strapi.plugins['users-permissions'].services[
    'users-permissions'
  ].initialize();

  const permissions = await strapi.plugins['users-permissions'].services[
    'users-permissions'
  ].getActions(plugins);

  //  const controllers = permissions[permission].controllers
  // flush only apis
  const apisToFlush = Object.keys(permissions).filter((value) => {
    return value.startsWith('api::') != false;
  });

  for (const key of apisToFlush) {
    const controllers = permissions[key].controllers;
    for (const controller of Object.keys(controllers)) {
      const uid: any = `${key}.${controller}`;
      try {
        await strapi.query(uid).deleteMany();
        strapi.log.info(`flushed entity ${uid}`);
      } catch (error) {
        strapi.log.error('unable to flush entity ' + uid, JSON.stringify(error));
      }
    }
  }

  strapi.log.info('All existing entries deleted');
}

export function enabledCrudOnModels(controllers: any): void {
  Object.keys(controllers).forEach((key) => {
    strapi.log.info(`Enabling CRUD permission on model "${key}" for role "Medusa"`);
    Object.keys(controllers[key]).forEach((action) => {
      controllers[key][action].enabled = true;
    });
  });
}

export async function createMedusaRole(permissions: any): Promise<number | undefined> {
  try {
    const medusaRoleId = await hasMedusaRole();
    if (medusaRoleId) {
      return medusaRoleId;
    }
  } catch (e) {
    const error = e as Error;
    strapi.log.warn(
      'Unable to determine with medusa role exists: ' + error.message + ':' + error.stack
    );
  }

  strapi.log.debug('Creating "Medusa" role');
  const role = {
    name: 'Medusa',
    description: 'reusing medusa role',
    permissions,
    users: [],
  };
  try {
    const roleCreation = await strapi.plugins['users-permissions'].services.role.createRole(role);
    if (roleCreation && roleCreation.length) {
      strapi.log.info('Role - "Medusa" created successfully');
      return roleCreation[0].role.id;
    }
  } catch (e) {
    const error = e as Error;
    strapi.log.warn('Unable to create with medusa role: ' + error.message + ':' + error.stack);
    return -1;
  }
}
