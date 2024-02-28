import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import homepageData from '../../data/singleType/homepage.json';

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  });
  const initHasRun = await pluginStore.get({ key: 'initHasRun' });
  await pluginStore.set({ key: 'initHasRun', value: true });
  return !initHasRun;
}

// File
function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
}

function getFileData(fileName) {
  const filePath = path.join(__dirname, '../../../data/uploads', fileName);

  // Parse the file metadata
  const size = getFileSizeInBytes(filePath);
  const ext = fileName.split('.').pop();
  const mimeType = mime.lookup(ext);

  return {
    path: filePath,
    name: fileName,
    size,
    type: mimeType,
  };
}

async function checkFileExistsBeforeUpload(inputFile) {
  const fileWhereName = await strapi.query('plugin::upload.file').findOne({
    where: {
      name: inputFile,
    },
  });

  if (fileWhereName) {
    return fileWhereName;
  } else {
    // File doesn't exist, upload it
    const fileData = getFileData(inputFile);
    const [file] = await uploadFile(fileData, inputFile);

    return file;
  }
}

async function uploadFile(file, name) {
  return strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: file,
      data: {
        fileInfo: {
          alternativeText: `An image uploaded to Strapi called ${name}`,
          caption: name,
          name,
        },
      },
    });
}

async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRoles = await strapi.entityService.findMany('plugin::users-permissions.role', {
    filters: { type: 'public' },
  });

  const actionUIDsToCreate = [];
  Object.keys(newPermissions).forEach((controller) =>
    newPermissions[controller].forEach((action) => {
      actionUIDsToCreate.push(`api::${controller}.${controller}.${action}`);
    })
  );

  for (const publicRole of publicRoles) {
    const rolePermissions = await strapi.entityService.load(
      'plugin::users-permissions.role',
      { id: publicRole.id },
      'permissions'
    );

    for (const actionUID of actionUIDsToCreate) {
      let existedPermission = null;

      for (const rolePermission of rolePermissions) {
        if (rolePermission.action === actionUID) {
          existedPermission = rolePermission;
          break;
        }
      }

      if (!existedPermission) {
        const createdPermission = await strapi.entityService.create(
          'plugin::users-permissions.permission',
          { data: { action: actionUID, role: publicRole.id } }
        );

        strapi.log.info(
          `Created new permission ${createdPermission.action} for role ${publicRole.name}`
        );
      } else {
        strapi.log.info(
          `Permission ${existedPermission.action} already existed on role ${publicRole.name}`
        );
      }
    }
  }
}

async function createEntry({ model, entry }) {
  try {
    // Actually create the entry in Strapi
    await strapi.entityService.create(`api::${model}.${model}` as any, {
      data: entry,
    });
  } catch (error) {
    if (error.name == 'ValidationError') {
      strapi.log.warn(
        `createEntry failed, please check your entry data attribute for validation (unique, maximum,...) - ${JSON.stringify(
          error?.details.errors,
          null,
          2
        )}`
      );
    } else {
      strapi.log.error(
        `createEntry failed for model ${model} - ${JSON.stringify(error?.details.errors, null, 2)}`
      );
    }
  }
}

async function importSeedData() {
  await setPublicPermissions({
    global: ['find', 'findOne'],
    homepage: ['find', 'findOne'],
  });

  await importGlobal();
  await importHomepage();
}

async function importGlobal() {
  // const favicon = await checkFileExistsBeforeUpload(['favicon.png']);
}

async function importHomepage() {
  const hero_carousel = [];
  for (const carousel of homepageData.hero_carousel) {
    const image = await checkFileExistsBeforeUpload(carousel.image);
    hero_carousel.push({ ...carousel, image });
  }
  await createEntry({ model: 'homepage', entry: { hero_carousel } });
}

export default { isFirstRun, importSeedData };
