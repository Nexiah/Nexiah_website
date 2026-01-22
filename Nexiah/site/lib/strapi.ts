/**
 * Client Strapi simple et réutilisable
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Effectue une requête vers l'API Strapi
 */
async function strapiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;

  try {
    // Créer un AbortController pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `Strapi API error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch'))) {
      throw new Error(
        `Impossible de se connecter à Strapi. URL: ${url}. Vérifiez que Strapi est démarré sur ${STRAPI_URL}`
      );
    }
    throw error;
  }
}

/**
 * Récupère une collection
 */
export async function getCollection<T>(collection: string, populate: string = '*') {
  return strapiFetch<{ data: T[] }>(`/${collection}?populate=${populate}`);
}

/**
 * Récupère un élément par ID
 */
export async function getItem<T>(collection: string, id: string | number, populate: string = '*') {
  return strapiFetch<{ data: T }>(`/${collection}/${id}?populate=${populate}`);
}

/**
 * Récupère un élément unique (première entrée)
 */
export async function getSingle<T>(collection: string, populate: string = '*') {
  return strapiFetch<{ data: T }>(`/${collection}?populate=${populate}`);
}
