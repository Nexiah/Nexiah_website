import { factories } from '@strapi/strapi';

// Seule la création est exposée : les demandes se consultent dans l'admin Strapi.
export default factories.createCoreRouter('api::demande.demande', { only: ['create'] });
