import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::public-cible.public-cible', { only: ['find', 'findOne'] });
