import type { Core } from '@strapi/strapi';
import { configurerPermissionsPubliques } from './bootstrap/permissions';
import { seedDemo } from './bootstrap/seed';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await configurerPermissionsPubliques(strapi);
    await seedDemo(strapi);
  },
};
