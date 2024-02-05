import type { Schema, Attribute } from '@strapi/strapi';

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
    logo: Attribute.Component<'layout.logo'> & Attribute.Required;
    socialLinks: Attribute.Component<'links.social-links', true> &
      Attribute.Required;
    legalLinks: Attribute.Component<'links.link', true> & Attribute.Required;
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
    openInNewTab: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface LinksButtonLink extends Schema.Component {
  collectionName: 'components_links_button_links';
  info: {
    displayName: 'button-link';
  };
  attributes: {
    url: Attribute.String;
    openInNewTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String;
    type: Attribute.Enumeration<['primary', 'secondary']>;
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
    openInNewTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String & Attribute.Required;
  };
}

export interface LinksSocialLinks extends Schema.Component {
  collectionName: 'components_links_social_links';
  info: {
    displayName: 'Social Links';
    icon: 'apps';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    openInNewTab: Attribute.Boolean & Attribute.DefaultTo<false>;
    text: Attribute.String & Attribute.Required;
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
      'content.text-icon': ContentTextIcon;
      'layout.footer': LayoutFooter;
      'layout.logo': LayoutLogo;
      'layout.nav-bar': LayoutNavBar;
      'layout.promo-bar': LayoutPromoBar;
      'links.button-link': LinksButtonLink;
      'links.link': LinksLink;
      'links.social-links': LinksSocialLinks;
      'meta.metadata': MetaMetadata;
      'sections.hero-image': SectionsHeroImage;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
    }
  }
}
