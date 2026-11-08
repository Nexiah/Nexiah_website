import qs from 'qs';
import { cacheLife, cacheTag } from 'next/cache';

/**
 * Accès à l'API Strapi. Les lectures sont mises en cache (« use cache ») et
 * invalidées par le webhook Strapi → /api/revalidate (tag « contenu »).
 */

export const STRAPI_URL = (process.env.STRAPI_URL ?? 'http://localhost:1337').replace(/\/$/, '');

export type Theme = {
  documentId: string;
  name: string;
  slug: string;
  couleurFond: string;
  couleurTexte: string;
};

export type PublicCible = {
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
};

type Media = { url: string; alternativeText: string | null; width: number; height: number };
type ElementListe = { id: number; texte: string };
export type Bloc = { type: string; children?: Bloc[]; text?: string; level?: number; format?: string; url?: string; bold?: boolean; italic?: boolean };

export type Atelier = {
  documentId: string;
  titre: string;
  slug: string;
  resume: string;
  description: Bloc[] | null;
  image: Media | null;
  theme: Theme | null;
  publics: PublicCible[];
  duree: string;
  participants: string;
  niveau: string;
  tarifIndicatif: string | null;
  benefices: ElementListe[];
  objectifs: ElementListe[];
  materielFourni: ElementListe[];
  prerequis: ElementListe[];
  misEnAvant: boolean;
};

async function strapiGet<T>(path: string, query: object = {}): Promise<T> {
  const url = `${STRAPI_URL}/api/${path}?${qs.stringify(query, { encodeValuesOnly: true })}`;
  const res = await fetch(url, {
    headers: process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {},
  });
  if (!res.ok) throw new Error(`Strapi ${res.status} sur ${path}`);
  const json = (await res.json()) as { data: T };
  return json.data;
}

const POPULATE_CARTE = {
  image: { fields: ['url', 'alternativeText', 'width', 'height'] },
  theme: true,
  publics: { sort: ['ordre:asc'] },
};

export async function getThemes() {
  'use cache';
  cacheLife('minutes');
  cacheTag('contenu');
  return strapiGet<Theme[]>('themes', { sort: ['ordre:asc'], pagination: { pageSize: 100 } });
}

export async function getPublics() {
  'use cache';
  cacheLife('minutes');
  cacheTag('contenu');
  return strapiGet<PublicCible[]>('publics-cibles', { sort: ['ordre:asc'], pagination: { pageSize: 100 } });
}

export async function getAteliers(filtres: { public?: string; theme?: string } = {}) {
  'use cache';
  cacheLife('minutes');
  cacheTag('contenu');
  const filters: Record<string, unknown> = {};
  if (filtres.public) filters.publics = { slug: { $eq: filtres.public } };
  if (filtres.theme) filters.theme = { slug: { $eq: filtres.theme } };
  return strapiGet<Atelier[]>('ateliers', {
    filters,
    populate: POPULATE_CARTE,
    sort: ['titre:asc'],
    pagination: { pageSize: 200 },
  });
}

export async function getAteliersMisEnAvant() {
  'use cache';
  cacheLife('minutes');
  cacheTag('contenu');
  return strapiGet<Atelier[]>('ateliers', {
    filters: { misEnAvant: { $eq: true } },
    populate: POPULATE_CARTE,
    pagination: { pageSize: 3 },
  });
}

export async function getAtelier(slug: string) {
  'use cache';
  cacheLife('minutes');
  cacheTag('contenu');
  const res = await strapiGet<Atelier[]>('ateliers', {
    filters: { slug: { $eq: slug } },
    populate: { ...POPULATE_CARTE, benefices: true, objectifs: true, materielFourni: true, prerequis: true },
    pagination: { pageSize: 1 },
  });
  return res[0] ?? null;
}

export function urlMedia(url: string) {
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}
