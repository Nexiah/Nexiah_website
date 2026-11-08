import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Check } from 'lucide-react';
import { ThemeTag } from '@/components/ThemeTag';
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder';
import { BlocsTexte } from '@/components/BlocsTexte';
import { getAtelier, urlMedia } from '@/lib/strapi';
import { FormulaireDemande } from './FormulaireDemande';

export async function generateMetadata({ params }: PageProps<'/ateliers/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const atelier = await getAtelier(slug);
  if (!atelier) return { title: 'Atelier introuvable' };
  return {
    title: atelier.titre,
    description: atelier.resume,
    openGraph: atelier.image ? { images: [urlMedia(atelier.image.url)] } : undefined,
  };
}

export default function AtelierPage(props: PageProps<'/ateliers/[slug]'>) {
  return (
    <Suspense fallback={<div className="conteneur py-24 text-discret">Chargement de l&apos;atelier…</div>}>
      <FicheAtelier params={props.params} />
    </Suspense>
  );
}

async function FicheAtelier({ params }: Pick<PageProps<'/ateliers/[slug]'>, 'params'>) {
  const { slug } = await params;
  const atelier = await getAtelier(slug);
  if (!atelier) notFound();

  const infos = [
    ['Durée', atelier.duree],
    ['Participants', atelier.participants],
    ['Niveau', atelier.niveau],
    ...(atelier.tarifIndicatif ? [['Tarif', atelier.tarifIndicatif]] : []),
  ];

  return (
    <>
      <section className="bg-ciel">
        <div className="conteneur grid items-center gap-10 pb-12 pt-8 lg:grid-cols-2">
          <div className="flex flex-col gap-[18px]">
            <nav aria-label="Fil d'Ariane" className="text-[0.9rem]">
              <Link href="/catalogue" className="font-bold">← Retour au catalogue</Link>
            </nav>
            <div className="flex flex-wrap gap-2">
              {atelier.theme && <ThemeTag theme={atelier.theme} />}
              {atelier.publics.length > 0 && (
                <span className="rounded-full bg-white px-3 py-1 text-[0.78rem] font-bold text-texte">
                  {atelier.publics.map((p) => p.name).join(' · ')}
                </span>
              )}
            </div>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.1] tracking-tight">{atelier.titre}</h1>
            <p className="text-[1.1rem] text-texte">{atelier.resume}</p>
            <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {infos.map(([libelle, valeur]) => (
                <div key={libelle} className="rounded-2xl bg-white px-[18px] py-3.5">
                  <dt className="text-[0.85rem] text-discret">{libelle}</dt>
                  <dd className="font-bold">{valeur}</dd>
                </div>
              ))}
            </dl>
          </div>
          {atelier.image ? (
            <Image
              src={urlMedia(atelier.image.url)}
              alt={atelier.image.alternativeText ?? ''}
              width={atelier.image.width}
              height={atelier.image.height}
              sizes="(min-width: 1024px) 560px, 100vw"
              priority
              className="aspect-[4/3] w-full rounded-[28px] object-cover"
            />
          ) : (
            <PhotoPlaceholder className="aspect-[4/3] rounded-[28px]" label="Photo de l'atelier" />
          )}
        </div>
      </section>

      <section className="conteneur flex flex-wrap items-start gap-12 pb-24 pt-14">
        <div className="flex min-w-0 grow-[999] basis-[560px] flex-col gap-10">
          {atelier.description && atelier.description.length > 0 && (
            <div className="flex flex-col gap-3.5">
              <h2 className="text-[1.7rem] font-bold">L&apos;atelier</h2>
              <BlocsTexte blocs={atelier.description} />
            </div>
          )}

          {atelier.benefices.length > 0 && (
            <div className="flex flex-col gap-3.5">
              <h2 className="text-[1.7rem] font-bold">Bénéfices pour les participants</h2>
              <ul className="grid gap-x-7 gap-y-3 sm:grid-cols-2">
                {atelier.benefices.map((b) => (
                  <li key={b.id} className="flex gap-2.5">
                    <Check aria-hidden className="mt-1 size-[22px] shrink-0 text-[#1e6b3f]" strokeWidth={2.4} />
                    {b.texte}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {atelier.objectifs.length > 0 && (
            <div className="flex flex-col gap-3.5">
              <h2 className="text-[1.7rem] font-bold">Objectifs</h2>
              <ul className="flex list-disc flex-col gap-2 pl-6 text-texte">
                {atelier.objectifs.map((o) => <li key={o.id}>{o.texte}</li>)}
              </ul>
            </div>
          )}

          {(atelier.materielFourni.length > 0 || atelier.prerequis.length > 0) && (
            <div className="grid gap-5 sm:grid-cols-2">
              {atelier.materielFourni.length > 0 && (
                <div className="flex flex-col gap-3 rounded-carte bg-ciel p-7">
                  <h3 className="text-[1.25rem] font-bold">Nous apportons</h3>
                  <ul className="flex list-disc flex-col gap-1.5 pl-6 text-[0.95rem] text-texte">
                    {atelier.materielFourni.map((m) => <li key={m.id}>{m.texte}</li>)}
                  </ul>
                </div>
              )}
              {atelier.prerequis.length > 0 && (
                <div className="flex flex-col gap-3 rounded-carte bg-[#fff3d6] p-7">
                  <h3 className="text-[1.25rem] font-bold">À prévoir de votre côté</h3>
                  <ul className="flex list-disc flex-col gap-1.5 pl-6 text-[0.95rem] text-texte">
                    {atelier.prerequis.map((p) => <li key={p.id}>{p.texte}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2.5 rounded-carte border border-nuage p-7">
            <h2 className="text-[1.35rem] font-bold">Et ensuite ?</h2>
            <p className="text-texte">
              Nous revenons vers vous sous 48 h pour confirmer la date avec un intervenant disponible.
              Rien à payer en ligne : le règlement se fait après l&apos;atelier.
            </p>
          </div>
        </div>

        <aside
          id="demande"
          aria-label="Demande d'atelier"
          className="relative min-w-0 grow basis-[380px] rounded-[24px] border-2 border-marque bg-white p-8 shadow-[0_16px_40px_rgba(7,86,144,0.10)]"
        >
          <FormulaireDemande atelierId={atelier.documentId} titre={atelier.titre} />
        </aside>
      </section>
    </>
  );
}
