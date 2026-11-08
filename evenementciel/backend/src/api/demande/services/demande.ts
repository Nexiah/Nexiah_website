import { factories } from '@strapi/strapi';

type DonneesDemande = {
  typeEtablissement: string;
  nomEtablissement: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  dateSouhaitee: string;
  dateAlternative: string | null;
  nombreParticipants: number;
  message: string | null;
  consentement: boolean;
};

const formatDate = (iso: string | null) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', { dateStyle: 'long' }) : '—';

const echapper = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export default factories.createCoreService('api::demande.demande', ({ strapi }) => ({
  /** Référence lisible : D-2026-0042 */
  async prochaineReference() {
    const annee = new Date().getFullYear();
    const total = await strapi.documents('api::demande.demande').count({
      filters: { reference: { $startsWith: `D-${annee}-` } },
    });
    return `D-${annee}-${String(total + 1).padStart(4, '0')}`;
  },

  /** Retrouve l'établissement par nom + ville, sinon le crée. */
  async trouverOuCreerEtablissement(d: DonneesDemande) {
    const existants = await strapi.documents('api::etablissement.etablissement').findMany({
      filters: { nom: { $eqi: d.nomEtablissement }, ville: { $eqi: d.ville } },
      limit: 1,
    });
    if (existants.length) return existants[0];
    return strapi.documents('api::etablissement.etablissement').create({
      data: {
        nom: d.nomEtablissement,
        type: d.typeEtablissement as never,
        ville: d.ville,
        telephone: d.telephone,
        email: d.email,
      },
    });
  },

  async creerDepuisSite(d: DonneesDemande, atelierDocumentId: string | null) {
    const atelier = atelierDocumentId
      ? ((await strapi.documents('api::atelier.atelier').findOne({
          documentId: atelierDocumentId,
          status: 'published',
          fields: ['titre'],
        })) as { documentId: string; titre: string } | null)
      : null;

    const etablissement = await this.trouverOuCreerEtablissement(d);
    const reference = await this.prochaineReference();

    const demande = await strapi.documents('api::demande.demande').create({
      data: {
        ...d,
        typeEtablissement: d.typeEtablissement as never,
        reference,
        statut: 'Nouvelle',
        atelier: atelier?.documentId,
        etablissement: etablissement.documentId,
      },
    });

    // Les emails ne doivent jamais faire échouer l'enregistrement de la demande.
    this.envoyerEmails(d, reference, atelier?.titre ?? 'Atelier sur mesure').catch((err: unknown) =>
      strapi.log.error(`Emails de la demande ${reference} non envoyés : ${String(err)}`),
    );

    return demande;
  },

  async envoyerEmails(d: DonneesDemande, reference: string, titreAtelier: string) {
    const notif = process.env.EMAIL_NOTIFICATION_TO;
    if (!process.env.SMTP_HOST) {
      strapi.log.info(`[demande ${reference}] SMTP non configuré : emails non envoyés.`);
      return;
    }
    const email = strapi.plugin('email').service('email');

    await email.send({
      to: d.email,
      subject: `Votre demande d'atelier ${reference} — Événement Ciel`,
      html: `<p>Bonjour ${echapper(d.prenom)},</p>
<p>Nous avons bien reçu votre demande pour <strong>${echapper(titreAtelier)}</strong> le ${formatDate(d.dateSouhaitee)}.</p>
<p>Nous recherchons un intervenant disponible et revenons vers vous sous 48&nbsp;h.</p>
<p>Référence de votre demande : <strong>${reference}</strong></p>
<p>À bientôt,<br>L'équipe Événement Ciel</p>`,
    });

    if (notif) {
      await email.send({
        to: notif,
        replyTo: d.email,
        subject: `Nouvelle demande ${reference} : ${titreAtelier}`,
        html: `<h2>Nouvelle demande ${reference}</h2>
<ul>
<li><strong>Atelier :</strong> ${echapper(titreAtelier)}</li>
<li><strong>Établissement :</strong> ${echapper(d.nomEtablissement)} (${echapper(d.typeEtablissement)}), ${echapper(d.ville)}</li>
<li><strong>Contact :</strong> ${echapper(d.prenom)} ${echapper(d.nom)} — ${echapper(d.email)} — ${echapper(d.telephone)}</li>
<li><strong>Date souhaitée :</strong> ${formatDate(d.dateSouhaitee)} · autre date : ${formatDate(d.dateAlternative)}</li>
<li><strong>Participants :</strong> ${d.nombreParticipants}</li>
</ul>
<p>${d.message ? echapper(d.message).replace(/\n/g, '<br>') : '<em>Pas de message</em>'}</p>`,
      });
    }
  },
}));
