import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::atelier.atelier', { only: ['find', 'findOne'] });
