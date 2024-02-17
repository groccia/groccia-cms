import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCountryCountry extends Schema.CollectionType {
  collectionName: 'countries';
  info: {
    singularName: 'country';
    pluralName: 'countries';
    displayName: 'Country';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    iso_2: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 2;
      }>;
    iso_3: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 3;
      }>;
    num_code: Attribute.Integer & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    display_name: Attribute.String & Attribute.Required;
    region: Attribute.Relation<
      'api::country.country',
      'manyToOne',
      'api::region.region'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::country.country',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::country.country',
      'manyToMany',
      'api::country.country'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiCurrencyCurrency extends Schema.CollectionType {
  collectionName: 'currencies';
  info: {
    singularName: 'currency';
    pluralName: 'currencies';
    displayName: 'Currency';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    code: Attribute.UID &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 3;
      }>;
    symbol: Attribute.String & Attribute.Required;
    symbol_native: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    regions: Attribute.Relation<
      'api::currency.currency',
      'oneToMany',
      'api::region.region'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::currency.currency',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::currency.currency',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::currency.currency',
      'manyToMany',
      'api::currency.currency'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiFulfillmentProviderFulfillmentProvider
  extends Schema.CollectionType {
  collectionName: 'fulfillment_providers';
  info: {
    singularName: 'fulfillment-provider';
    pluralName: 'fulfillment-providers';
    displayName: 'Fulfillment Provider';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    is_installed: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    regions: Attribute.Relation<
      'api::fulfillment-provider.fulfillment-provider',
      'manyToMany',
      'api::region.region'
    >;
    shipping_options: Attribute.Relation<
      'api::fulfillment-provider.fulfillment-provider',
      'manyToMany',
      'api::shipping-option.shipping-option'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::fulfillment-provider.fulfillment-provider',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::fulfillment-provider.fulfillment-provider',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::fulfillment-provider.fulfillment-provider',
      'manyToMany',
      'api::fulfillment-provider.fulfillment-provider'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiGlobalGlobal extends Schema.SingleType {
  collectionName: 'globals';
  info: {
    singularName: 'global';
    pluralName: 'globals';
    displayName: 'Global';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    favicon: Attribute.Media &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    navbar: Attribute.Component<'layout.nav-bar'> &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    footer: Attribute.Component<'layout.footer'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    announcement_bar: Attribute.Component<'layout.promo-bar', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::global.global',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::global.global',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::global.global',
      'oneToMany',
      'api::global.global'
    >;
    locale: Attribute.String;
  };
}

export interface ApiHomepageHomepage extends Schema.SingleType {
  collectionName: 'homepages';
  info: {
    singularName: 'homepage';
    pluralName: 'homepages';
    displayName: 'Home Page';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    hero_carousel: Attribute.Component<'sections.hero-image', true> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    localizations: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::homepage.homepage'
    >;
    locale: Attribute.String;
  };
}

export interface ApiMoneyAmountMoneyAmount extends Schema.CollectionType {
  collectionName: 'money_amounts';
  info: {
    singularName: 'money-amount';
    pluralName: 'money-amounts';
    displayName: 'Money Amount';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    amount: Attribute.BigInteger & Attribute.Required;
    currency_code: Attribute.UID &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 3;
      }>;
    sale_amount: Attribute.BigInteger;
    product_variants: Attribute.Relation<
      'api::money-amount.money-amount',
      'oneToMany',
      'api::product-variant.product-variant'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::money-amount.money-amount',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::money-amount.money-amount',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::money-amount.money-amount',
      'manyToMany',
      'api::money-amount.money-amount'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiPaymentProviderPaymentProvider
  extends Schema.CollectionType {
  collectionName: 'payment_providers';
  info: {
    singularName: 'payment-provider';
    pluralName: 'payment-providers';
    displayName: 'Payment Provider';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID &
      Attribute.SetPluginOptions<{
        versions: {
          versioned: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::payment-provider.payment-provider',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::payment-provider.payment-provider',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::payment-provider.payment-provider',
      'manyToMany',
      'api::payment-provider.payment-provider'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductProduct extends Schema.CollectionType {
  collectionName: 'products';
  info: {
    singularName: 'product';
    pluralName: 'products';
    displayName: 'Product';
  };
  options: {
    timestamps: true;
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    title: Attribute.Text & Attribute.Required;
    subtitle: Attribute.Text;
    description: Attribute.Text;
    handle: Attribute.Text;
    is_giftcard: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    status: Attribute.Enumeration<
      ['draft', 'proposed', 'published', 'rejected']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'published'>;
    thumbnail: Attribute.String;
    discountable: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    weight: Attribute.Decimal;
    product_length: Attribute.Decimal;
    width: Attribute.Decimal;
    height: Attribute.Decimal;
    hs_code: Attribute.String;
    origin_country: Attribute.String;
    mid_code: Attribute.String;
    material: Attribute.String;
    metadata: Attribute.JSON;
    metafields: Attribute.JSON;
    product_variants: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::product-variant.product-variant'
    >;
    product_options: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::product-option.product-option'
    >;
    product_type: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::product-type.product-type'
    >;
    product_tags: Attribute.Relation<
      'api::product.product',
      'manyToMany',
      'api::product-tag.product-tag'
    >;
    product_metafield: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'api::product-metafield.product-metafield'
    >;
    product_medias: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::product-media.product-media'
    >;
    product_collection: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::product-collection.product-collection'
    >;
    product_categories: Attribute.Relation<
      'api::product.product',
      'manyToMany',
      'api::product-category.product-category'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product.product',
      'manyToMany',
      'api::product.product'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductCategoryProductCategory
  extends Schema.CollectionType {
  collectionName: 'product_categories';
  info: {
    singularName: 'product-category';
    pluralName: 'product-categories';
    displayName: 'Product Category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    medusa_id: Attribute.UID;
    name: Attribute.String & Attribute.Required;
    handle: Attribute.String;
    metadata: Attribute.JSON;
    products: Attribute.Relation<
      'api::product-category.product-category',
      'manyToMany',
      'api::product.product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-category.product-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-category.product-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductCollectionProductCollection
  extends Schema.CollectionType {
  collectionName: 'product_collections';
  info: {
    singularName: 'product-collection';
    pluralName: 'product-collections';
    displayName: 'Product Collection';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    title: Attribute.String & Attribute.Required;
    handle: Attribute.String;
    metadata: Attribute.JSON;
    products: Attribute.Relation<
      'api::product-collection.product-collection',
      'oneToMany',
      'api::product.product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-collection.product-collection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-collection.product-collection',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product-collection.product-collection',
      'manyToMany',
      'api::product-collection.product-collection'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductLegalProductLegal extends Schema.CollectionType {
  collectionName: 'product_legals';
  info: {
    singularName: 'product-legal';
    pluralName: 'product-legals';
    displayName: 'Product Legal';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID &
      Attribute.SetPluginOptions<{
        versions: {
          versioned: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-legal.product-legal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-legal.product-legal',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product-legal.product-legal',
      'manyToMany',
      'api::product-legal.product-legal'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductMediaProductMedia extends Schema.CollectionType {
  collectionName: 'product_medias';
  info: {
    singularName: 'product-media';
    pluralName: 'product-medias';
    displayName: 'Product Media';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID & Attribute.Required;
    filename: Attribute.String & Attribute.Required;
    files: Attribute.Media;
    media_url: Attribute.Text;
    metadata: Attribute.JSON;
    product: Attribute.Relation<
      'api::product-media.product-media',
      'manyToOne',
      'api::product.product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-media.product-media',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-media.product-media',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product-media.product-media',
      'manyToMany',
      'api::product-media.product-media'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductMetafieldProductMetafield
  extends Schema.CollectionType {
  collectionName: 'product_metafields';
  info: {
    singularName: 'product-metafield';
    pluralName: 'product-metafields';
    displayName: 'Product Metafield';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    value: Attribute.JSON;
    metadata: Attribute.JSON;
    product: Attribute.Relation<
      'api::product-metafield.product-metafield',
      'oneToOne',
      'api::product.product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-metafield.product-metafield',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-metafield.product-metafield',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product-metafield.product-metafield',
      'manyToMany',
      'api::product-metafield.product-metafield'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductOptionProductOption extends Schema.CollectionType {
  collectionName: 'product_options';
  info: {
    singularName: 'product-option';
    pluralName: 'product-options';
    displayName: 'Product Option';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    title: Attribute.String & Attribute.Required;
    metadata: Attribute.JSON;
    product_option_values: Attribute.Relation<
      'api::product-option.product-option',
      'manyToOne',
      'api::product-option-value.product-option-value'
    >;
    product: Attribute.Relation<
      'api::product-option.product-option',
      'manyToOne',
      'api::product.product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-option.product-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-option.product-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product-option.product-option',
      'manyToMany',
      'api::product-option.product-option'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductOptionValueProductOptionValue
  extends Schema.CollectionType {
  collectionName: 'product_option_values';
  info: {
    singularName: 'product-option-value';
    pluralName: 'product-option-values';
    displayName: 'Product Option Value';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID &
      Attribute.SetPluginOptions<{
        versions: {
          versioned: true;
        };
      }>;
    value: Attribute.String;
    metadata: Attribute.JSON;
    product_variants: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'oneToMany',
      'api::product-variant.product-variant'
    >;
    product_option: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'oneToMany',
      'api::product-option.product-option'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'manyToMany',
      'api::product-option-value.product-option-value'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductTagProductTag extends Schema.CollectionType {
  collectionName: 'product_tags';
  info: {
    singularName: 'product-tag';
    pluralName: 'product-tags';
    displayName: 'Product Tag';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    value: Attribute.String & Attribute.Required;
    metadata: Attribute.JSON;
    products: Attribute.Relation<
      'api::product-tag.product-tag',
      'manyToMany',
      'api::product.product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-tag.product-tag',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-tag.product-tag',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product-tag.product-tag',
      'manyToMany',
      'api::product-tag.product-tag'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductTypeProductType extends Schema.CollectionType {
  collectionName: 'product_types';
  info: {
    singularName: 'product-type';
    pluralName: 'product-types';
    displayName: 'Product Type';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    value: Attribute.String;
    metadata: Attribute.JSON;
    products: Attribute.Relation<
      'api::product-type.product-type',
      'oneToMany',
      'api::product.product'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-type.product-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-type.product-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product-type.product-type',
      'manyToMany',
      'api::product-type.product-type'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiProductVariantProductVariant extends Schema.CollectionType {
  collectionName: 'product_variants';
  info: {
    singularName: 'product-variant';
    pluralName: 'product-variants';
    displayName: 'Product Variant';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    title: Attribute.String & Attribute.Required;
    sku: Attribute.UID;
    barcode: Attribute.UID;
    ean: Attribute.UID;
    upc: Attribute.UID;
    variant_rank: Attribute.Integer &
      Attribute.Private &
      Attribute.DefaultTo<0>;
    inventory_quantity: Attribute.Integer & Attribute.Required;
    allow_backorder: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    manage_inventory: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    hs_code: Attribute.String;
    origin_country: Attribute.String;
    mid_code: Attribute.String;
    material: Attribute.String;
    weight: Attribute.Decimal;
    height: Attribute.Decimal;
    width: Attribute.Decimal;
    product_variant_length: Attribute.Decimal;
    metadata: Attribute.JSON;
    product: Attribute.Relation<
      'api::product-variant.product-variant',
      'manyToOne',
      'api::product.product'
    >;
    product_option_value: Attribute.Relation<
      'api::product-variant.product-variant',
      'manyToOne',
      'api::product-option-value.product-option-value'
    >;
    money_amount: Attribute.Relation<
      'api::product-variant.product-variant',
      'manyToOne',
      'api::money-amount.money-amount'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-variant.product-variant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::product-variant.product-variant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::product-variant.product-variant',
      'manyToMany',
      'api::product-variant.product-variant'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiRegionRegion extends Schema.CollectionType {
  collectionName: 'regions';
  info: {
    singularName: 'region';
    pluralName: 'regions';
    displayName: 'Region';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    name: Attribute.String & Attribute.Required;
    tax_rate: Attribute.Decimal & Attribute.Required;
    tax_code: Attribute.String;
    metadata: Attribute.JSON;
    countries: Attribute.Relation<
      'api::region.region',
      'oneToMany',
      'api::country.country'
    >;
    currency: Attribute.Relation<
      'api::region.region',
      'manyToOne',
      'api::currency.currency'
    >;
    shipping_options: Attribute.Relation<
      'api::region.region',
      'manyToMany',
      'api::shipping-option.shipping-option'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::region.region',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::region.region',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::region.region',
      'manyToMany',
      'api::region.region'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiShippingOptionShippingOption extends Schema.CollectionType {
  collectionName: 'shipping_options';
  info: {
    singularName: 'shipping-option';
    pluralName: 'shipping-options';
    displayName: 'Shipping Option';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    name: Attribute.String;
    price_type: Attribute.Enumeration<['flat_rate', 'calculated']> &
      Attribute.Required;
    amount: Attribute.Decimal;
    is_return: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    admin_only: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    data: Attribute.JSON;
    metadata: Attribute.JSON;
    regions: Attribute.Relation<
      'api::shipping-option.shipping-option',
      'manyToMany',
      'api::region.region'
    >;
    shipping_option_requirements: Attribute.Relation<
      'api::shipping-option.shipping-option',
      'manyToMany',
      'api::shipping-option-requirement.shipping-option-requirement'
    >;
    shipping_profiles: Attribute.Relation<
      'api::shipping-option.shipping-option',
      'manyToMany',
      'api::shipping-profile.shipping-profile'
    >;
    fulfillment_providers: Attribute.Relation<
      'api::shipping-option.shipping-option',
      'manyToMany',
      'api::fulfillment-provider.fulfillment-provider'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shipping-option.shipping-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shipping-option.shipping-option',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::shipping-option.shipping-option',
      'manyToMany',
      'api::shipping-option.shipping-option'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiShippingOptionRequirementShippingOptionRequirement
  extends Schema.CollectionType {
  collectionName: 'shipping_option_requirements';
  info: {
    singularName: 'shipping-option-requirement';
    pluralName: 'shipping-option-requirements';
    displayName: 'Shipping Option Requirement';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    requirement_type: Attribute.Enumeration<['min_subtotal', 'max_subtotal']>;
    amount: Attribute.Decimal;
    shipping_options: Attribute.Relation<
      'api::shipping-option-requirement.shipping-option-requirement',
      'manyToMany',
      'api::shipping-option.shipping-option'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shipping-option-requirement.shipping-option-requirement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shipping-option-requirement.shipping-option-requirement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::shipping-option-requirement.shipping-option-requirement',
      'manyToMany',
      'api::shipping-option-requirement.shipping-option-requirement'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiShippingProfileShippingProfile
  extends Schema.CollectionType {
  collectionName: 'shipping_profiles';
  info: {
    singularName: 'shipping-profile';
    pluralName: 'shipping-profiles';
    displayName: 'Shipping Profile';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID;
    name: Attribute.String;
    type: Attribute.Enumeration<['default', 'gift_card', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'default'>;
    metadata: Attribute.JSON;
    shipping_options: Attribute.Relation<
      'api::shipping-profile.shipping-profile',
      'manyToMany',
      'api::shipping-option.shipping-option'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::shipping-profile.shipping-profile',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::shipping-profile.shipping-profile',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::shipping-profile.shipping-profile',
      'manyToMany',
      'api::shipping-profile.shipping-profile'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ApiStoreStore extends Schema.CollectionType {
  collectionName: 'stores';
  info: {
    singularName: 'store';
    pluralName: 'stores';
    displayName: 'Store';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    versions: {
      versioned: true;
    };
  };
  attributes: {
    medusa_id: Attribute.UID &
      Attribute.SetPluginOptions<{
        versions: {
          versioned: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::store.store',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::store.store',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    versions: Attribute.Relation<
      'api::store.store',
      'manyToMany',
      'api::store.store'
    >;
    vuid: Attribute.String;
    versionNumber: Attribute.Integer & Attribute.DefaultTo<1>;
    versionComment: Attribute.String;
    isVisibleInListView: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::i18n.locale': PluginI18NLocale;
      'api::country.country': ApiCountryCountry;
      'api::currency.currency': ApiCurrencyCurrency;
      'api::fulfillment-provider.fulfillment-provider': ApiFulfillmentProviderFulfillmentProvider;
      'api::global.global': ApiGlobalGlobal;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::money-amount.money-amount': ApiMoneyAmountMoneyAmount;
      'api::payment-provider.payment-provider': ApiPaymentProviderPaymentProvider;
      'api::product.product': ApiProductProduct;
      'api::product-category.product-category': ApiProductCategoryProductCategory;
      'api::product-collection.product-collection': ApiProductCollectionProductCollection;
      'api::product-legal.product-legal': ApiProductLegalProductLegal;
      'api::product-media.product-media': ApiProductMediaProductMedia;
      'api::product-metafield.product-metafield': ApiProductMetafieldProductMetafield;
      'api::product-option.product-option': ApiProductOptionProductOption;
      'api::product-option-value.product-option-value': ApiProductOptionValueProductOptionValue;
      'api::product-tag.product-tag': ApiProductTagProductTag;
      'api::product-type.product-type': ApiProductTypeProductType;
      'api::product-variant.product-variant': ApiProductVariantProductVariant;
      'api::region.region': ApiRegionRegion;
      'api::shipping-option.shipping-option': ApiShippingOptionShippingOption;
      'api::shipping-option-requirement.shipping-option-requirement': ApiShippingOptionRequirementShippingOptionRequirement;
      'api::shipping-profile.shipping-profile': ApiShippingProfileShippingProfile;
      'api::store.store': ApiStoreStore;
    }
  }
}
