// strapi/plugin-upload
import { getDefaultRoleAssumerWithWebIdentity } from '@aws-sdk/client-sts';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

const uploadProviderLocal = () => {
  return {
    providerOptions: {
      localServer: {
        maxage: 300000,
      },
    },
  };
};

const uploadProviderS3 = (env) => {
  return {
    provider: 'aws-s3',
    sizeLimit: 250 * 1024 * 1024,
    providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      credentialDefaultProvider: !env('AWS_ACCESS_KEY_ID')
        ? defaultProvider({
            roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(),
          })
        : undefined,
      region: env('AWS_S3_REGION'),
      params: {
        Bucket: env('AWS_S3_BUCKET'),
      },
    },
    actionOptions: {
      upload: {},
      uploadStream: {},
      delete: {},
    },
    breakpoints: {
      xlarge: 1920,
      large: 1000,
      medium: 750,
      small: 500,
      xsmall: 64,
    },
  };
};

export { uploadProviderLocal, uploadProviderS3 };
