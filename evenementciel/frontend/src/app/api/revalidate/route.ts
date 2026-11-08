import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';

/**
 * Appelé par un webhook Strapi (Paramètres → Webhooks) à chaque modification
 * de contenu, avec l'en-tête « x-revalidate-secret ». Le site se met à jour
 * immédiatement au lieu d'attendre l'expiration du cache.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
    return Response.json({ ok: false }, { status: 401 });
  }
  revalidateTag('contenu', 'max');
  return Response.json({ ok: true });
}
