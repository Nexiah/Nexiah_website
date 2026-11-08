/**
 * Informations générales du site.
 * TODO client : remplacer les valeurs entre crochets.
 * (Pourra devenir un « single type » Strapi si le client veut les modifier lui-même.)
 */
export const SITE = {
  nom: 'Événement Ciel',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  anneesExperience: 16,
  animationsRealisees: '4 655',
  etablissementsPartenaires: '650',
  telephone: '[Téléphone]',
  email: 'contact@evenementciel.net',
  adresse: '[Adresse]',
};
