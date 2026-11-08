import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const TYPES = ['EHPAD', 'Résidence autonomie', 'Mairie / collectivité', 'Entreprise', 'Autre'] as const;

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

/**
 * Le formulaire public n'appelle que `create`. On n'accepte que les champs
 * attendus : le statut, les notes internes et le prestataire restent réservés
 * à l'admin.
 */
export default factories.createCoreController('api::demande.demande', ({ strapi }) => ({
  async create(ctx) {
    const body = (ctx.request.body?.data ?? {}) as Record<string, unknown>;

    // Champ piège anti-spam : invisible pour un humain, rempli par les robots.
    if (str(body.siteWeb)) {
      ctx.status = 201;
      ctx.body = { data: { reference: 'ok' } };
      return;
    }

    const data = {
      typeEtablissement: str(body.typeEtablissement, 40),
      nomEtablissement: str(body.nomEtablissement),
      prenom: str(body.prenom, 80),
      nom: str(body.nom, 80),
      email: str(body.email, 160).toLowerCase(),
      telephone: str(body.telephone, 30),
      ville: str(body.ville, 120),
      dateSouhaitee: str(body.dateSouhaitee, 10),
      dateAlternative: str(body.dateAlternative, 10) || null,
      nombreParticipants: Number.parseInt(String(body.nombreParticipants ?? ''), 10),
      message: str(body.message, 3000) || null,
      consentement: body.consentement === true || body.consentement === 'true' || body.consentement === 'on',
    };

    const manquants = (['typeEtablissement', 'nomEtablissement', 'prenom', 'nom', 'email', 'telephone', 'ville', 'dateSouhaitee'] as const)
      .filter((k) => !data[k]);
    if (manquants.length) throw new errors.ValidationError(`Champs manquants : ${manquants.join(', ')}`);
    if (!TYPES.includes(data.typeEtablissement as (typeof TYPES)[number])) throw new errors.ValidationError("Type d'établissement invalide");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new errors.ValidationError('Email invalide');
    if (!isDate(data.dateSouhaitee)) throw new errors.ValidationError('Date souhaitée invalide');
    if (data.dateAlternative && !isDate(data.dateAlternative)) throw new errors.ValidationError('Date alternative invalide');
    if (!Number.isFinite(data.nombreParticipants) || data.nombreParticipants < 1) throw new errors.ValidationError('Nombre de participants invalide');
    if (!data.consentement) throw new errors.ValidationError('Le consentement est requis');

    const demande = await strapi.service('api::demande.demande').creerDepuisSite(data, str(body.atelier, 64) || null);

    ctx.status = 201;
    ctx.body = { data: { reference: demande.reference } };
  },
}));
