import Link from 'next/link';
import { Briefcase, Check, Heart, Home as HomeIcon, Landmark, Quote } from 'lucide-react';
import { AtelierCard } from '@/components/AtelierCard';
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder';
import { getAteliersMisEnAvant, getPublics } from '@/lib/strapi';
import { SITE } from '@/lib/site';

const ICONES_PUBLICS: Record<string, typeof Heart> = {
  ehpad: Heart,
  'residence-autonomie': HomeIcon,
  mairie: Landmark,
  entreprise: Briefcase,
};

const ETAPES = [
  { titre: 'Choisissez un atelier', texte: 'Parcourez le catalogue ou demandez-nous conseil.' },
  { titre: 'Indiquez votre date', texte: 'Envoyez votre demande avec la date souhaitée et le nombre de participants.' },
  { titre: 'Nous confirmons sous 48 h', texte: "Nous trouvons l'intervenant disponible et revenons vers vous." },
  { titre: "L'atelier a lieu", texte: "L'intervenant vient avec son matériel. Vous réglez après l'animation." },
];

const GARANTIES = [
  { titre: 'Intervenants qualifiés', texte: 'Formés à la bientraitance et à la pédagogie.' },
  { titre: 'Sur-mesure', texte: 'Adapté à votre budget, vos locaux et votre public.' },
  { titre: 'Assurance RC professionnelle', texte: 'Chaque intervention est couverte.' },
  { titre: 'Protocoles sanitaires respectés', texte: 'Matériel adapté et certifié.' },
  { titre: 'Ponctuel ou régulier', texte: "Une date unique ou un programme à l'année." },
  { titre: "Échange avec l'intervenant", texte: "Un appel visio avant l'atelier si besoin." },
];

export default async function Accueil() {
  const [publics, ateliers] = await Promise.all([getPublics(), getAteliersMisEnAvant()]);

  return (
    <>
      {/* Hero */}
      <section className="bg-ciel">
        <div className="conteneur grid items-center gap-14 py-20 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="self-start rounded-full border border-nuage bg-white px-3.5 py-1.5 text-[0.85rem] font-bold text-marque">
              Animations pour seniors, collectivités et entreprises
            </span>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.08] tracking-tight sm:text-[3.1rem]">
              Des ateliers qui créent du lien, là où vous êtes.
            </h1>
            <p className="max-w-[34em] text-[1.1rem] text-texte">
              Depuis {SITE.anneesExperience} ans, nous concevons des animations créatives et bienveillantes pour les EHPAD,
              résidences autonomie, mairies et entreprises. Choisissez un atelier, indiquez votre date : on s&apos;occupe du reste.
            </p>
            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link href="/catalogue" className="btn-principal">Voir le catalogue</Link>
              <Link href="/contact?objet=catalogue" className="btn-secondaire">Recevoir le catalogue PDF</Link>
            </div>
            <dl className="flex flex-wrap gap-8 pt-4">
              {[
                [`${SITE.anneesExperience} ans`, "d'expérience"],
                [SITE.animationsRealisees, 'animations réalisées'],
                [SITE.etablissementsPartenaires, 'établissements partenaires'],
              ].map(([chiffre, libelle]) => (
                <div key={libelle} className="flex flex-col-reverse">
                  <dt className="text-[0.85rem] text-discret">{libelle}</dt>
                  <dd className="font-titre text-[1.8rem] font-bold leading-tight text-marque">{chiffre}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <PhotoPlaceholder className="aspect-[4/3] rounded-[28px]" label="Photo : un intervenant en atelier" />
            <div className="absolute -bottom-6 left-0 flex items-center gap-3.5 rounded-[18px] bg-white px-5 py-4 shadow-[0_12px_32px_rgba(19,41,61,0.12)] sm:-left-5">
              <span className="flex size-11 items-center justify-center rounded-bouton bg-soleil text-encre">
                <Check aria-hidden className="size-[22px]" />
              </span>
              <span className="flex flex-col leading-snug">
                <strong>Réponse sous 48 h</strong>
                <span className="text-[0.85rem] text-discret">Paiement après l&apos;atelier</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Publics */}
      <section id="publics" className="conteneur scroll-mt-24 pb-10 pt-24">
        <div className="mb-10 flex max-w-[720px] flex-col gap-3">
          <h2 className="titre-section">Pour qui intervenons-nous ?</h2>
          <p className="text-[1.05rem] text-texte">Des animations pensées pour chaque public, partout en France, en Suisse et en Belgique.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {publics.map((p) => {
            const Icone = ICONES_PUBLICS[p.slug] ?? Heart;
            return (
              <Link
                key={p.documentId}
                href={`/catalogue?public=${p.slug}`}
                className="group flex flex-col gap-3 rounded-carte border border-nuage bg-white p-7 text-encre no-underline transition-colors hover:border-marque hover:text-encre"
              >
                <span className="flex size-[52px] items-center justify-center rounded-[14px] bg-ciel text-marque">
                  <Icone aria-hidden className="size-[26px]" />
                </span>
                <strong className="font-titre text-[1.35rem]">{p.name}</strong>
                {p.description && <span className="text-[0.95rem] text-texte">{p.description}</span>}
                <span className="mt-auto font-bold text-marque group-hover:underline">Voir les animations →</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Aperçu catalogue */}
      <section className="conteneur py-[72px]">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-[680px] flex-col gap-3">
            <h2 className="titre-section">Des ateliers pour tous les goûts</h2>
            <p className="text-[1.05rem] text-texte">Bien-être, spectacles, créativité, rencontres entre générations : des animations clés en main.</p>
          </div>
          <Link href="/catalogue" className="font-bold">Tout le catalogue →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ateliers.map((a) => (
            <AtelierCard key={a.documentId} atelier={a} avecResume={false} />
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-ciel">
        <div className="conteneur py-[88px]">
          <div className="mb-10 flex max-w-[720px] flex-col gap-3">
            <h2 className="titre-section">Comment ça marche</h2>
            <p className="text-[1.05rem] text-texte">Pas de paiement en ligne, pas d&apos;engagement : vous demandez, nous confirmons.</p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map((e, i) => (
              <li key={e.titre} className="flex flex-col gap-2.5 rounded-carte bg-white p-7">
                <span
                  aria-hidden
                  className={`flex size-11 items-center justify-center rounded-full font-titre text-[1.1rem] font-extrabold ${i === ETAPES.length - 1 ? 'bg-soleil text-encre' : 'bg-marque text-white'}`}
                >
                  {i + 1}
                </span>
                <strong className="text-[1.1rem]">{e.titre}</strong>
                <span className="text-[0.95rem] text-texte">{e.texte}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Garanties */}
      <section className="conteneur grid items-start gap-14 py-[88px] lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-4">
          <h2 className="titre-section">Pourquoi nous faire confiance</h2>
          <p className="text-[1.05rem] text-texte">
            {SITE.anneesExperience} ans de savoir-faire auprès des publics fragiles, et des exigences à la hauteur des établissements de santé.
          </p>
        </div>
        <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {GARANTIES.map((g) => (
            <li key={g.titre} className="flex gap-3">
              <Check aria-hidden className="mt-1 size-6 shrink-0 text-marque" strokeWidth={2.4} />
              <span>
                <strong>{g.titre}</strong>
                <br />
                <span className="text-[0.95rem] text-texte">{g.texte}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Témoignages — TODO client : vrais témoignages (pourra venir de Strapi) */}
      <section className="bg-ciel">
        <div className="conteneur py-[88px]">
          <h2 className="titre-section mb-9">Ils nous font confiance</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <figure key={n} className="flex flex-col gap-5 rounded-carte bg-white p-8">
                <Quote aria-hidden className="size-8 fill-soleil text-soleil" />
                <blockquote className="text-[1.05rem]">[Témoignage d&apos;un établissement client, 2 à 3 phrases.]</blockquote>
                <figcaption className="text-[0.9rem] text-discret">
                  <strong className="text-encre">[Prénom, fonction]</strong>
                  <br />[Nom de l&apos;établissement]
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Bandeau conseil */}
      <section className="conteneur py-[88px]">
        <div className="grid items-center gap-8 rounded-[28px] bg-marque p-10 text-white sm:p-14 lg:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            <h2 className="text-[2rem] font-bold leading-tight text-white">Vous hésitez entre plusieurs ateliers ?</h2>
            <p className="text-[1.05rem] text-[#e2eef8]">
              Parlez-nous de votre public et de vos contraintes : nous vous conseillons gratuitement, sans engagement.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5 lg:justify-end">
            <Link href="/contact?objet=conseil" className="btn-soleil">Être conseillé</Link>
            <Link href="/contact?objet=catalogue" className="btn border-2 border-white text-white hover:bg-white/10 hover:text-white">
              Recevoir le catalogue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
