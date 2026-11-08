import type { Schema, Struct } from '@strapi/strapi';

export interface AtelierElementListe extends Struct.ComponentSchema {
  collectionName: 'components_atelier_elements_liste';
  info: {
    displayName: '\u00C9l\u00E9ment de liste';
    icon: 'bulletList';
  };
  attributes: {
    texte: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'atelier.element-liste': AtelierElementListe;
    }
  }
}
