'use server';

import { STRAPI_URL } from '@/lib/strapi';

export type EtatDemande =
  | { statut: 'initial' }
  | { statut: 'envoye'; reference: string }
  | { statut: 'erreur'; message: string };

const CHAMPS = [
  'atelier',
  'typeEtablissement',
  'nomEtablissement',
  'prenom',
  'nom',
  'email',
  'telephone',
  'ville',
  'dateSouhaitee',
  'dateAlternative',
  'nombreParticipants',
  'message',
  'siteWeb', // champ piège anti-spam
] as const;

/**
 * Envoie la demande à Strapi. La validation complète est faite côté Strapi
 * (contrôleur demande) : ici on relaie simplement les champs du formulaire.
 */
export async function envoyerDemande(_prev: EtatDemande, formData: FormData): Promise<EtatDemande> {
  const data: Record<string, unknown> = {};
  for (const champ of CHAMPS) {
    const v = formData.get(champ);
    if (typeof v === 'string') data[champ] = v;
  }
  data.consentement = formData.get('consentement') === 'on';

  try {
    const res = await fetch(`${STRAPI_URL}/api/demandes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    const json = (await res.json().catch(() => null)) as
      | { data?: { reference?: string }; error?: { message?: string } }
      | null;
    if (!res.ok) {
      return { statut: 'erreur', message: json?.error?.message ?? "La demande n'a pas pu être envoyée." };
    }
    return { statut: 'envoye', reference: json?.data?.reference ?? '' };
  } catch {
    return { statut: 'erreur', message: 'Le service est momentanément indisponible. Merci de réessayer ou de nous appeler.' };
  }
}
