/**
 * Client Strapi pour Next.js
 * Gère la connexion à l'API Strapi avec gestion d'erreurs
 */

import { 
  StrapiQueryParams, 
  StrapiFilters, 
  StrapiMeta, 
  StrapiResponse, 
  StrapiCollectionResponse,
  StrapiGlobalData,
  StrapiMedia 
} from './types/strapi';

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

/**
 * Construit l'URL complète pour une requête Strapi
 */
export function getStrapiURL(path: string): string {
  // Enlève le slash initial s'il existe pour éviter les doubles slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${STRAPI_API_URL}/api/${cleanPath}`;
}

/**
 * Formate une URL d'image Strapi
 * Gère les cas où l'image est absente ou profondément imbriquée
 * Accepte aussi un objet cover complet pour extraire l'URL
 */
export function formatImageUrl(
  url: string | null | undefined | StrapiMedia,
  fallback?: string
): string {
  // Si c'est un objet cover complet, extraire l'URL
  if (url && typeof url === 'object') {
    // Cas: cover.data.attributes.url
    if (url.data?.attributes?.url) {
      url = url.data.attributes.url;
    }
    // Cas: cover.attributes.url (si pas de data)
    else if (url.attributes?.url) {
      url = url.attributes.url;
    }
    // Cas: cover.url (structure plate)
    else if (url.url) {
      url = url.url;
    }
    // Sinon, pas d'URL trouvée
    else {
      url = null;
    }
  }

  // Si pas d'URL, retourner un placeholder ou chaîne vide
  if (!url || typeof url !== 'string') {
    return fallback || '';
  }

  // Si l'URL est déjà complète, la retourner telle quelle
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Si l'URL commence par /, ajouter le préfixe de base Strapi
  if (url.startsWith('/')) {
    return `${STRAPI_API_URL}${url}`;
  }

  // Sinon, ajouter le préfixe avec un slash
  return `${STRAPI_API_URL}/${url}`;
}

/**
 * Effectue une requête vers l'API Strapi
 */
export async function fetchStrapi<T>(
  path: string,
  params?: StrapiQueryParams
): Promise<T | null> {
  try {
    let url = getStrapiURL(path);
    
    // Ajouter les paramètres de requête si fournis
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Utiliser le cache de Next.js en production
      next: { revalidate: 60 }, // Revalider toutes les 60 secondes
    });

    if (!response.ok) {
      // Récupérer le corps de l'erreur pour plus de détails
      let errorBody = '';
      try {
        const errorText = await response.text();
        errorBody = errorText;
      } catch (e) {
        // Ignorer les erreurs de lecture du body
      }
      
      // Ne pas throw si c'est une 404, retourner null
      if (response.status === 404) {
        return null;
      }
      
      // Pour les erreurs 400, retourner null au lieu de crasher
      if (response.status === 400) {
        return null;
      }
      
      // Pour les erreurs 403 (Forbidden), retourner null au lieu de crasher
      // Cela peut arriver si les permissions ne sont pas configurées dans Strapi
      if (response.status === 403) {
        return null;
      }
      
      throw new Error(
        `Strapi API error: ${response.status} ${response.statusText}. ${errorBody.substring(0, 200)}`
      );
    }

    return await response.json();
  } catch (error) {
    // Si c'est une erreur de connexion, retourner null au lieu de crasher
    if (error instanceof Error && error.message.includes('fetch')) {
      return null;
    }
    throw error;
  }
}

/**
 * Récupère une collection avec pagination et populate
 */
export async function getCollection<T>(
  collection: string,
  options?: {
    populate?: string;
    limit?: number;
    sort?: string;
    filters?: StrapiFilters;
  }
): Promise<StrapiCollectionResponse<T> | null> {
  const params: StrapiQueryParams = {};
  
  // Populate - format Strapi v4
  if (options?.populate) {
    if (options.populate === '*') {
      params.populate = '*';
    } else {
      // Pour un seul champ, utiliser le format simple
      params.populate = options.populate;
    }
  }
  
  // Pagination
  if (options?.limit) {
    params['pagination[limit]'] = options.limit;
  }
  
  // Sort - format Strapi v4
  if (options?.sort) {
    // Strapi v4 accepte soit "field:asc" soit "field:desc"
    // Mais il faut vérifier le format exact
    const sortParts = options.sort.split(':');
    if (sortParts.length === 2) {
      params.sort = `${sortParts[0]}:${sortParts[1]}`;
    } else {
      params.sort = options.sort;
    }
  }
  
  // Filtres
  if (options?.filters) {
    // Construire les filtres Strapi v4
    Object.entries(options.filters).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Filtre complexe comme { slug: { $eq: 'value' } }
        Object.entries(value).forEach(([operator, opValue]) => {
          params[`filters[${key}][${operator}]`] = opValue;
        });
      } else {
        // Filtre simple
        params[`filters[${key}]`] = value;
      }
    });
  }

  return await fetchStrapi<StrapiCollectionResponse<T>>(`/${collection}`, params);
}

/**
 * Récupère un élément par ID
 */
export async function getItem<T>(
  collection: string,
  id: string | number,
  populate: string = '*'
) {
  return fetchStrapi<{ data: T }>(`/${collection}/${id}`, { populate });
}

/**
 * Récupère le Single Type "Global" avec populate=*
 * Retourne les données avec les attributs extraits si nécessaire
 */
export async function getGlobal(): Promise<StrapiGlobalData | null> {
  try {
    const response = await fetchStrapi<StrapiResponse<StrapiGlobalData>>('/global', { populate: '*' });
    if (!response || !response.data) {
      return null;
    }
    
    const data = response.data;
    
    // Si les données sont dans attributes (structure Strapi standard)
    if (data.attributes && typeof data.attributes === 'object') {
      return {
        ...data.attributes,
        id: data.id,
        documentId: data.documentId,
      } as StrapiGlobalData;
    }
    
    // Sinon, retourner les données directement
    return data as StrapiGlobalData;
  } catch (error) {
    return null;
  }
}

/**
 * Récupère le Single Type "Home page" avec la Dynamic Zone content_sections
 * Format de populate pour Dynamic Zone Strapi v4: populate[content_sections][populate]=*
 */
export async function getHomePage() {
  try {
    // Format Strapi v4 pour populate une Dynamic Zone avec tous les composants
    // Utiliser fetchStrapi directement avec les paramètres formatés
    const url = getStrapiURL('/home-page');
    // Populate simple : populate[content_sections][populate]=* devrait récupérer tous les champs
    // Le populate=* devrait automatiquement récupérer tous les champs imbriqués
    const populateParam = 'populate[content_sections][populate]=*';
    const fullUrl = `${url}?${populateParam}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      // Gérer les erreurs comme dans fetchStrapi
      if (response.status === 404 || response.status === 403 || response.status === 400) {
        return null;
      }
      // Pour les erreurs 500, essayer avec un populate plus simple
      if (response.status === 500) {
        // Essayer avec populate=deep (si supporté) ou populate=*
        const simpleUrl = `${url}?populate=deep`;
        try {
          const simpleResponse = await fetch(simpleUrl, {
            headers: {
              'Content-Type': 'application/json',
            },
            next: { revalidate: 60 },
          });
          if (simpleResponse.ok) {
            const simpleData = await simpleResponse.json();
            if (simpleData && simpleData.data) {
              const responseData = simpleData.data;
              if (responseData.attributes && typeof responseData.attributes === 'object') {
                return {
                  ...responseData.attributes,
                  id: responseData.id,
                  documentId: responseData.documentId,
                };
              }
              return responseData;
            }
          }
        } catch (simpleError) {
          // Erreur silencieuse, retourner null
        }
      }
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      return null;
    }
    
    const responseData = data.data;
    
    // Si les données sont dans attributes (structure Strapi standard)
    if (responseData.attributes && typeof responseData.attributes === 'object') {
      return {
        ...responseData.attributes,
        id: responseData.id,
        documentId: responseData.documentId,
      };
    }
    
    // Sinon, retourner les données directement
    return responseData;
  } catch (error) {
    return null;
  }
}

/**
 * Récupère le Single Type "About" avec tous les champs
 */
export async function getAbout() {
  try {
    const url = getStrapiURL('/about');
    const populateParam = 'populate=*';
    const fullUrl = `${url}?${populateParam}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      // Gérer les erreurs comme dans fetchStrapi
      if (response.status === 404 || response.status === 403 || response.status === 400) {
        return null;
      }
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      return null;
    }
    
    const responseData = data.data;
    
    // Si les données sont dans attributes (structure Strapi standard)
    if (responseData.attributes && typeof responseData.attributes === 'object') {
      return {
        ...responseData.attributes,
        id: responseData.id,
        documentId: responseData.documentId,
      };
    }
    
    // Sinon, retourner les données directement
    return responseData;
  } catch (error) {
    return null;
  }
}

/**
 * Récupère le Single Type "Contact" avec tous les champs
 */
export async function getContact() {
  try {
    const url = getStrapiURL('/contact');
    const populateParam = 'populate=*';
    const fullUrl = `${url}?${populateParam}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      // Gérer les erreurs comme dans fetchStrapi
      if (response.status === 404 || response.status === 403 || response.status === 400) {
        return null;
      }
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      return null;
    }
    
    const responseData = data.data;
    
    // Si les données sont dans attributes (structure Strapi standard)
    if (responseData.attributes && typeof responseData.attributes === 'object') {
      return {
        ...responseData.attributes,
        id: responseData.id,
        documentId: responseData.documentId,
      };
    }
    
    // Sinon, retourner les données directement
    return responseData;
  } catch (error) {
    return null;
  }
}
