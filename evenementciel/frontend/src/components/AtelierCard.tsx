import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import { type Atelier, urlMedia } from '@/lib/strapi';
import { ThemeTag } from './ThemeTag';
import { PhotoPlaceholder } from './PhotoPlaceholder';

export function AtelierCard({ atelier, avecResume = true }: { atelier: Atelier; avecResume?: boolean }) {
  const lien = `/ateliers/${atelier.slug}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-carte border border-nuage bg-white">
      {atelier.image ? (
        <Image
          src={urlMedia(atelier.image.url)}
          alt={atelier.image.alternativeText ?? ''}
          width={atelier.image.width}
          height={atelier.image.height}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="h-48 w-full object-cover"
        />
      ) : (
        <PhotoPlaceholder className="h-48" />
      )}
      <div className="flex grow flex-col gap-3 p-6">
        <div className="flex flex-wrap gap-2">
          {atelier.theme && <ThemeTag theme={atelier.theme} />}
          {atelier.publics.length > 0 && (
            <span className="rounded-full bg-[#f2f4f7] px-3 py-1 text-[0.78rem] font-bold text-texte">
              {atelier.publics.map((p) => p.name).join(' · ')}
            </span>
          )}
        </div>
        <h3 className="text-[1.25rem] font-bold leading-snug">
          <Link href={lien} className="text-encre no-underline hover:text-marque">
            {atelier.titre}
          </Link>
        </h3>
        {avecResume && <p className="text-[0.95rem] text-texte">{atelier.resume}</p>}
        <div className="mt-auto flex flex-wrap gap-5 pt-1 text-[0.9rem] text-discret">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-[18px] text-marque" />
            <span className="sr-only">Durée :</span>
            {atelier.duree}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users aria-hidden className="size-[18px] text-marque" />
            <span className="sr-only">Participants :</span>
            {atelier.participants}
          </span>
        </div>
        <Link href={lien} className="btn-principal mt-2" aria-label={`Demander l'atelier « ${atelier.titre} »`}>
          Demander cet atelier
        </Link>
      </div>
    </article>
  );
}
