import type { Core } from '@strapi/strapi';

/**
 * Données de démonstration reprises de la maquette Figma.
 * Ne s'exécute que si la base ne contient encore aucun thème.
 * Désactivable avec SEED_DEMO=false.
 */

const THEMES = [
  { name: 'Bien-être', couleurFond: '#E3F4EA', couleurTexte: '#1E6B3F', ordre: 1 },
  { name: 'Magie & spectacle', couleurFond: '#FCE7EC', couleurTexte: '#9C2346', ordre: 2 },
  { name: 'Créatif', couleurFond: '#FFF3D6', couleurTexte: '#7A5200', ordre: 3 },
  { name: 'Intergénérationnel', couleurFond: '#E2F1FB', couleurTexte: '#0B5A8A', ordre: 4 },
];

const PUBLICS = [
  { name: 'EHPAD', slug: 'ehpad', ordre: 1, description: 'Stimulation cognitive, bien-être et moments de joie adaptés à chaque résident.' },
  { name: 'Résidence autonomie', slug: 'residence-autonomie', ordre: 2, description: "Des ateliers qui entretiennent l'autonomie et renforcent la vie collective." },
  { name: 'Mairie & collectivité', slug: 'mairie', ordre: 3, description: 'Événements intergénérationnels et animations pour les seniors de votre commune.' },
  { name: 'Entreprise', slug: 'entreprise', ordre: 4, description: 'Team building, bien-être au travail et arbres de Noël pour vos équipes.' },
];

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, 'et').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const liste = (xs: string[]) => xs.map((texte) => ({ texte }));
const para = (text: string) => [{ type: 'paragraph', children: [{ type: 'text', text }] }];

const ATELIERS = [
  {
    titre: 'Atelier mémoire et réminiscence', theme: 'Bien-être', publics: ['ehpad', 'residence-autonomie'],
    duree: '1 h 30', participants: '8 à 12 personnes', tarifIndicatif: 'À partir de 180 €', misEnAvant: true,
    resume: "Photos, objets et musiques d'époque pour exercer la mémoire et partager ses souvenirs.",
    description: "Un atelier stimulant qui fait appel aux souvenirs et encourage le partage d'expériences. À travers des photos, objets et musiques d'époque, les participants exercent leur mémoire tout en créant du lien. Notre animateur guide la séance avec bienveillance et adaptation.",
    benefices: ['Stimulation cognitive et exercice de la mémoire', 'Liens sociaux renforcés entre participants', 'Valorisation de chacun et de son histoire', "Moments d'émotion et de partage"],
    objectifs: ['Maintenir et stimuler les capacités mnésiques', "Favoriser l'expression verbale et émotionnelle", 'Créer du lien social entre les participants', "Valoriser le vécu et l'identité de chacun"],
    materielFourni: ["Supports visuels d'époque (photos, affiches)", 'Objets du quotidien anciens', 'Extraits musicaux variés', 'Matériel de projection si besoin'],
    prerequis: ['Un espace calme et confortable', 'Des chaises disposées en cercle', 'Une possibilité de diffusion audio'],
  },
  {
    titre: 'Spectacle de magie interactive', theme: 'Magie & spectacle', publics: ['ehpad', 'residence-autonomie', 'mairie'],
    duree: '45 min', participants: '20 à 50 personnes', misEnAvant: true,
    resume: 'Des tours adaptés où les résidents deviennent acteurs, avec humour et émerveillement.',
    description: 'Un spectacle de magie captivant où les résidents deviennent acteurs. Tours adaptés, humour et émerveillement pour un moment de divertissement unique.',
    benefices: ['Divertissement garanti', 'Participation active', 'Moments de joie et de rires'],
  },
  {
    titre: 'Gym douce en musique', theme: 'Bien-être', publics: ['ehpad', 'residence-autonomie'], niveau: 'Adapté',
    duree: '1 h', participants: '10 à 15 personnes',
    resume: 'Mobilité, équilibre et coordination, à son rythme et dans la bonne humeur.',
    description: "Des exercices doux adaptés aux capacités de chacun, sur fond musical. Travail de la mobilité, de l'équilibre et de la coordination dans une ambiance conviviale.",
    benefices: ['Maintien de la mobilité', 'Prévention des chutes', 'Bien-être physique'],
  },
  {
    titre: 'Atelier peinture créative', theme: 'Créatif', publics: ['ehpad', 'residence-autonomie', 'mairie'],
    duree: '2 h', participants: '6 à 10 personnes',
    resume: 'Techniques simples et matériel fourni pour créer une œuvre dont on est fier.',
    description: 'Libérez votre créativité à travers la peinture. Techniques simples, matériel fourni, accompagnement personnalisé.',
    benefices: ['Expression artistique', 'Stimulation créative', 'Estime de soi'],
  },
  {
    titre: 'Rencontre intergénérationnelle', theme: 'Intergénérationnel', publics: ['mairie', 'residence-autonomie'],
    duree: '2 h', participants: '15 à 30 personnes', misEnAvant: true,
    resume: 'Jeux, ateliers créatifs et échanges de savoirs entre seniors et enfants.',
    description: 'Des activités partagées entre seniors et jeunes générations : ateliers créatifs, jeux traditionnels et échanges de savoirs pour créer des ponts entre les âges.',
    benefices: ['Lien social renforcé', 'Transmission de savoirs', "Lutte contre l'isolement"],
  },
  {
    titre: 'Olympiades inter-services', theme: 'Intergénérationnel', publics: ['entreprise'],
    duree: '3 h', participants: '30 à 100 personnes',
    resume: 'Épreuves ludiques par équipes pour renforcer la cohésion.',
    description: "Des épreuves ludiques et fédératrices par équipes : jeux d'adresse, énigmes, défis adaptés pour renforcer la cohésion et l'esprit d'équipe.",
    benefices: ['Team building', "Cohésion d'équipe", 'Moments conviviaux'],
  },
  {
    titre: 'Bien-être au travail', theme: 'Bien-être', publics: ['entreprise'],
    duree: '1 h 30', participants: '10 à 20 personnes',
    resume: 'Relaxation, respiration et gestion du stress, avec des outils pour le quotidien.',
    description: 'Techniques de relaxation, exercices de respiration et gestion du stress : un moment pour prendre soin de soi et repartir avec des outils pratiques.',
    benefices: ['Réduction du stress', 'Amélioration du bien-être', 'Outils pour le quotidien'],
  },
];

export async function seedDemo(strapi: Core.Strapi) {
  if (process.env.SEED_DEMO === 'false') return;
  if ((await strapi.documents('api::theme.theme').count({})) > 0) return;

  strapi.log.info('Création des données de démonstration…');

  const themes: Record<string, string> = {};
  for (const t of THEMES) {
    const doc = await strapi.documents('api::theme.theme').create({ data: { ...t, slug: slugify(t.name) } });
    themes[t.name] = doc.documentId;
  }
  const publics: Record<string, string> = {};
  for (const p of PUBLICS) {
    const doc = await strapi.documents('api::public-cible.public-cible').create({ data: p });
    publics[p.slug] = doc.documentId;
  }
  for (const a of ATELIERS) {
    await strapi.documents('api::atelier.atelier').create({
      status: 'published',
      data: {
        titre: a.titre,
        slug: slugify(a.titre),
        resume: a.resume,
        description: para(a.description) as never,
        duree: a.duree,
        participants: a.participants,
        niveau: (a.niveau ?? 'Tous niveaux') as never,
        tarifIndicatif: a.tarifIndicatif,
        misEnAvant: a.misEnAvant ?? false,
        theme: themes[a.theme],
        publics: a.publics.map((s) => publics[s]),
        benefices: liste(a.benefices ?? []),
        objectifs: liste(a.objectifs ?? []),
        materielFourni: liste(a.materielFourni ?? []),
        prerequis: liste(a.prerequis ?? []),
      },
    });
  }
  strapi.log.info(`${ATELIERS.length} ateliers de démonstration créés.`);
}
