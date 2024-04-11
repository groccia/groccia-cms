import type { Schema, Attribute } from '@strapi/strapi';

export interface ContentProductRail extends Schema.Component {
  collectionName: 'components_content_product_rails';
  info: {
    displayName: 'Product Rail';
    icon: 'cube';
    description: '';
  };
  attributes: {
    collection_handle: Attribute.String & Attribute.Required;
    title: Attribute.String & Attribute.Required;
    order: Attribute.Integer &
      Attribute.Unique &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface ContentTextIcon extends Schema.Component {
  collectionName: 'components_content_text_icons';
  info: {
    displayName: 'textIcon';
  };
  attributes: {
    icon: Attribute.Media;
    text: Attribute.Text & Attribute.Required;
  };
}

export interface LayoutFooter extends Schema.Component {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
    description: '';
  };
  attributes: {
    social_links: Attribute.Component<'links.social-links', true> &
      Attribute.Required;
    policy_links: Attribute.Component<'links.link', true> & Attribute.Required;
    about_company: Attribute.Component<'links.link', true>;
    store_list: Attribute.Component<'links.link', true>;
  };
}

export interface LayoutLogo extends Schema.Component {
  collectionName: 'components_layout_logos';
  info: {
    displayName: 'logo';
  };
  attributes: {
    img: Attribute.Media & Attribute.Required;
    text: Attribute.String;
  };
}

export interface LayoutNavBar extends Schema.Component {
  collectionName: 'components_layout_nav_bars';
  info: {
    displayName: 'NavBar';
    icon: 'pinMap';
    description: '';
  };
  attributes: {
    logo: Attribute.Component<'layout.logo'>;
  };
}

export interface LayoutPromoBar extends Schema.Component {
  collectionName: 'components_layout_promo_bars';
  info: {
    displayName: 'Announcement';
    description: '';
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
    url: Attribute.String;
    target: Attribute.Enumeration<['_blank', '_self', '_parent', '_top']> &
      Attribute.DefaultTo<'_blank'>;
  };
}

export interface LinksButtonLink extends Schema.Component {
  collectionName: 'components_links_button_links';
  info: {
    displayName: 'button-link';
    description: '';
  };
  attributes: {
    url: Attribute.String;
    text: Attribute.String;
    type: Attribute.Enumeration<['primary', 'secondary']>;
    target: Attribute.Enumeration<['_blank', '_self', '_parent', '_top']> &
      Attribute.Required &
      Attribute.DefaultTo<'_self'>;
  };
}

export interface LinksLink extends Schema.Component {
  collectionName: 'components_links_links';
  info: {
    displayName: 'link';
    icon: 'link';
    description: '';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    title: Attribute.String & Attribute.Required;
    target: Attribute.Enumeration<['_blank', '_self', '_parent', '_top']> &
      Attribute.DefaultTo<'_self'>;
  };
}

export interface LinksNestedLink extends Schema.Component {
  collectionName: 'components_links_nested_links';
  info: {
    displayName: 'Nested Link';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    url: Attribute.String;
    target: Attribute.Enumeration<['_blank', '_self', '_parent', '_top']> &
      Attribute.DefaultTo<'_self'>;
    child: Attribute.Component<'links.link', true>;
  };
}

export interface LinksSocialLinks extends Schema.Component {
  collectionName: 'components_links_social_links';
  info: {
    displayName: 'Social Links';
    icon: 'apps';
    description: '';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    new_tab: Attribute.Boolean & Attribute.DefaultTo<false>;
    title: Attribute.String & Attribute.Required;
    social_platform: Attribute.Enumeration<
      [
        'FACEBOOK',
        'INSTAGRAM',
        'SHOPEE',
        'TIKTOK',
        'YOUTUBE',
        'TWITTER',
        'WEBSITE'
      ]
    > &
      Attribute.Required;
  };
}

export interface MetaMetadata extends Schema.Component {
  collectionName: 'components_meta_metadata';
  info: {
    displayName: 'metadata';
    icon: 'archive';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text & Attribute.Required;
  };
}

export interface SectionsHeroImage extends Schema.Component {
  collectionName: 'components_sections_hero_images';
  info: {
    displayName: 'Hero Image';
    icon: 'landscape';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.Text;
    image: Attribute.Media;
    buttons: Attribute.Component<'links.button-link', true>;
  };
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 160;
      }>;
    metaImage: Attribute.Media;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    keywords: Attribute.Text;
    metaRobots: Attribute.String;
    structuredData: Attribute.JSON;
    metaViewport: Attribute.String;
    canonicalURL: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'content.product-rail': ContentProductRail;
      'content.text-icon': ContentTextIcon;
      'layout.footer': LayoutFooter;
      'layout.logo': LayoutLogo;
      'layout.nav-bar': LayoutNavBar;
      'layout.promo-bar': LayoutPromoBar;
      'links.button-link': LinksButtonLink;
      'links.link': LinksLink;
      'links.nested-link': LinksNestedLink;
      'links.social-links': LinksSocialLinks;
      'meta.metadata': MetaMetadata;
      'sections.hero-image': SectionsHeroImage;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
    }
  }
}
