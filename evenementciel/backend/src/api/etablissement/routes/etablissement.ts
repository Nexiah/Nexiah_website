import { factories } from '@strapi/strapi';

// Pas d'accès public en V1. L'espace client (V2) ajoutera des routes authentifiées.
export default factories.createCoreRouter('api::etablissement.etablissement', { only: [] });
