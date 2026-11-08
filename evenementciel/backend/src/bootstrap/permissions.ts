import type { Core } from '@strapi/strapi';

/** Ce que le site public (rôle « Public ») a le droit d'appeler. */
const PUBLIC_ACTIONS = [
  'api::theme.theme.find',
  'api::theme.theme.findOne',
  'api::public-cible.public-cible.find',
  'api::public-cible.public-cible.findOne',
  'api::atelier.atelier.find',
  'api::atelier.atelier.findOne',
  'api::demande.demande.create',
];

export async function configurerPermissionsPubliques(strapi: Core.Strapi) {
  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!role) return;

  const existantes = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({ where: { role: role.id } });
  const deja = new Set(existantes.map((p: { action: string }) => p.action));

  for (const action of PUBLIC_ACTIONS) {
    if (deja.has(action)) continue;
    await strapi.db.query('plugin::users-permissions.permission').create({ data: { action, role: role.id } });
    strapi.log.info(`Permission publique ajoutée : ${action}`);
  }
}
