import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { AtelierCard } from '@/components/AtelierCard';
import { getAteliers, getPublics, getThemes } from '@/lib/strapi';
import { Filtres } from './Filtres';

export const metadata: Metadata = {
  title: "Catalogue d'ateliers",
  description: "Tous nos ateliers et animations pour EHPAD, résidences autonomie, mairies et entreprises. Filtrez par public et par thème, puis demandez l'atelier à la date de votre choix.",
};

export default function CataloguePage({ searchParams }: PageProps<'/catalogue'>) {
  return (
    <>
      <section className="bg-ciel">
        <div className="conteneur flex flex-col gap-7 pb-10 pt-14">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-[2.6rem] font-extrabold leading-tight tracking-tight">Notre catalogue d&apos;ateliers</h1>
            <p className="text-[1.1rem] text-texte">Choisissez un atelier, puis envoyez votre demande avec la date souhaitée.</p>
          </div>
          <Suspense fallback={<div className="h-[84px]" />}>
            <BarreFiltres searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      <section className="conteneur pb-24 pt-10">
        <Suspense fallback={<p className="text-discret">Chargement des ateliers…</p>}>
          <ListeAteliers searchParams={searchParams} />
        </Suspense>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-[24px] bg-marque p-10 text-white">
          <div className="flex max-w-[640px] flex-col gap-1.5">
            <strong className="font-titre text-[1.6rem] leading-tight">Vous ne trouvez pas l&apos;atelier idéal ?</strong>
            <span className="text-[#e2eef8]">Décrivez votre projet : nous vous proposons une animation sur mesure.</span>
          </div>
          <Link href="/contact?objet=conseil" className="btn-soleil">Être conseillé</Link>
        </div>
      </section>
    </>
  );
}

type Recherche = Pick<PageProps<'/catalogue'>, 'searchParams'>;

const lire = (v: string | string[] | undefined) => (typeof v === 'string' && v ? v : undefined);

async function BarreFiltres({ searchParams }: Recherche) {
  const sp = await searchParams;
  const [publics, themes] = await Promise.all([getPublics(), getThemes()]);
  return (
    <Filtres
      key={`${lire(sp.public) ?? ''}|${lire(sp.theme) ?? ''}`}
      publics={publics.map((p) => ({ value: p.slug, label: p.name }))}
      themes={themes.map((t) => ({ value: t.slug, label: t.name }))}
      publicActif={lire(sp.public) ?? ''}
      themeActif={lire(sp.theme) ?? ''}
    />
  );
}

async function ListeAteliers({ searchParams }: Recherche) {
  const sp = await searchParams;
  const ateliers = await getAteliers({ public: lire(sp.public), theme: lire(sp.theme) });

  if (ateliers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-carte bg-ciel p-10 text-center">
        <strong className="text-[1.1rem]">Aucun atelier ne correspond à ces filtres.</strong>
        <Link href="/catalogue" className="btn-secondaire">Voir tous les ateliers</Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-[0.95rem] text-discret" aria-live="polite">
        {ateliers.length} {ateliers.length > 1 ? 'ateliers' : 'atelier'}
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ateliers.map((a) => (
          <AtelierCard key={a.documentId} atelier={a} />
        ))}
      </div>
    </>
  );
}
