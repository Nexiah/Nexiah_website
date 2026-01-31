/**
 * Types TypeScript stricts pour les données Strapi
 * Remplace tous les `any` par des interfaces typées
 */

// Types pour les requêtes Strapi
export interface StrapiQueryParams {
  populate?: string;
  'pagination[limit]'?: number;
  'pagination[start]'?: number;
  sort?: string;
  [key: string]: string | number | boolean | undefined;
}

// Types pour les filtres Strapi
export interface StrapiFilterOperator {
  $eq?: string | number | boolean;
  $ne?: string | number | boolean;
  $lt?: number;
  $lte?: number;
  $gt?: number;
  $gte?: number;
  $contains?: string;
  $containsi?: string;
  $in?: (string | number)[];
  $notIn?: (string | number)[];
  $null?: boolean;
  $notNull?: boolean;
  $between?: [number, number];
  $startsWith?: string;
  $endsWith?: string;
}

export type StrapiFilters = Record<string, string | number | boolean | StrapiFilterOperator>;

// Type pour la meta Strapi (pagination, etc.)
export interface StrapiMeta {
  pagination?: {
    page?: number;
    pageSize?: number;
    pageCount?: number;
    total?: number;
  };
  [key: string]: unknown;
}

// Type pour les réponses Strapi standard
export interface StrapiResponse<T> {
  data: T;
  meta?: StrapiMeta;
}

// Type pour les réponses de collection Strapi
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta?: StrapiMeta;
}

// Type pour les données Global Strapi
export interface StrapiGlobalData {
  id?: number;
  documentId?: string;
  siteName?: string;
  SiteName?: string;
  logo?: StrapiMedia;
  navigation?: StrapiNavigationItem[] | unknown;
  [key: string]: unknown;
}

// Structure d'une image/média Strapi
export interface StrapiMedia {
  id?: number;
  documentId?: string;
  url?: string;
  alternativeText?: string | null;
  name?: string;
  // Format standard Strapi v4/v5
  data?: {
    id?: number;
    attributes?: {
      url: string;
      alternativeText?: string | null;
      name?: string;
      width?: number;
      height?: number;
      formats?: Record<string, unknown>;
    };
  };
  // Format alternatif (direct attributes)
  attributes?: {
    url: string;
    alternativeText?: string | null;
    name?: string;
  };
}

// Structure d'un bloc Strapi Blocks (Rich Text)
export interface StrapiBlock {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'code' | 'link';
  level?: number; // Pour les headings (1-6)
  format?: 'ordered' | 'unordered'; // Pour les listes
  children?: StrapiBlockChild[];
  text?: string;
  url?: string;
  [key: string]: any; // Pour les propriétés additionnelles
}

export interface StrapiBlockChild {
  type: 'text' | 'link' | 'inline';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  url?: string;
  children?: StrapiBlockChild[];
  [key: string]: any;
}

// Type pour bio_content (peut être string, array de blocs, ou null)
export type StrapiBlocksContent = string | StrapiBlock[] | null | undefined;

// Structure d'un item de navigation
export interface StrapiNavigationItem {
  id?: number;
  href?: string;
  Href?: string;
  url?: string;
  Url?: string;
  label?: string;
  Label?: string;
  name?: string;
  Name?: string;
}

// Structure d'une section de contenu (Dynamic Zone)
export interface StrapiContentSection {
  __component: string;
  id?: number | string;
  [key: string]: unknown; // Pour les propriétés spécifiques à chaque section (utiliser unknown au lieu de any)
}

// Structure d'un projet Strapi
export interface StrapiProject {
  id: number;
  documentId?: string;
  Title?: string;
  title?: string;
  Slug?: string;
  slug?: string;
  Summary?: string;
  summary?: string;
  Description?: string;
  description?: string;
  Content?: any;
  content?: any;
  Challenge?: string | StrapiBlocksContent;
  challenge?: string | StrapiBlocksContent;
  Solution?: string | StrapiBlocksContent;
  solution?: string | StrapiBlocksContent;
  Automation?: string | StrapiBlocksContent;
  automation?: string | StrapiBlocksContent;
  Results?: string | StrapiBlocksContent;
  results?: string | StrapiBlocksContent;
  Category?: string;
  category?: string;
  Cover?: StrapiMedia | string;
  cover?: StrapiMedia;
  sections?: Array<{
    __component: string;
    Challenge?: string | StrapiBlocksContent;
    Solution?: string | StrapiBlocksContent;
    Automation?: string | StrapiBlocksContent;
    Results?: string | StrapiBlocksContent;
    Result?: string | StrapiBlocksContent;
    content?: string | StrapiBlocksContent;
    text?: string | StrapiBlocksContent;
    [key: string]: any;
  }>;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  // Format alternatif avec attributes (si Strapi v4 standard)
  attributes?: {
    title: string;
    slug: string;
    summary?: string;
    description?: string;
    content?: any;
    challenge?: string | StrapiBlocksContent;
    solution?: string | StrapiBlocksContent;
    automation?: string | StrapiBlocksContent;
    results?: {
      performance?: string;
      users?: string;
      satisfaction?: string;
    } | string | StrapiBlocksContent;
    categories?: {
      data?: Array<{
        attributes?: {
          name: string;
        };
      }>;
    };
    cover?: StrapiMedia;
    publishedAt?: string;
    createdAt?: string;
  };
}
