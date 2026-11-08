import Image from 'next/image';
import Link from 'next/link';

/* Coordonnées à compléter par le client (voir SITE dans src/lib/site.ts). */
import { SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="bg-pied text-pied-texte">
      <div className="conteneur grid gap-10 py-16 text-[0.9rem] sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Image src="/logo-evenement-ciel.png" alt="Événement Ciel" width={303} height={110} className="h-12 w-auto self-start rounded-md" />
          <p>Animations créatives et sociales depuis {SITE.anneesExperience} ans.</p>
        </div>
        <nav aria-label="Nos publics" className="flex flex-col gap-2">
          <strong className="text-white">Nos publics</strong>
          <Link href="/catalogue?public=ehpad" className="text-pied-texte">EHPAD</Link>
          <Link href="/catalogue?public=residence-autonomie" className="text-pied-texte">Résidences autonomie</Link>
          <Link href="/catalogue?public=mairie" className="text-pied-texte">Mairies &amp; collectivités</Link>
          <Link href="/catalogue?public=entreprise" className="text-pied-texte">Entreprises</Link>
        </nav>
        <nav aria-label="Ressources" className="flex flex-col gap-2">
          <strong className="text-white">Ressources</strong>
          <Link href="/catalogue" className="text-pied-texte">Catalogue</Link>
          <Link href="/offres-pack" className="text-pied-texte">Offres pack</Link>
          <Link href="/a-propos" className="text-pied-texte">Qui sommes-nous ?</Link>
          <Link href="/contact" className="text-pied-texte">Contact</Link>
        </nav>
        <div className="flex flex-col gap-2">
          <strong className="text-white">Contact</strong>
          <span>{SITE.telephone}</span>
          <a href={`mailto:${SITE.email}`} className="text-pied-texte">{SITE.email}</a>
          <span>{SITE.adresse}</span>
        </div>
      </div>
      <div className="conteneur flex flex-wrap justify-between gap-3 border-t border-[#2a4259] py-6 text-[0.85rem]">
        <span>© Événement Ciel</span>
        <span className="flex gap-5">
          <Link href="/mentions-legales" className="text-pied-texte">Mentions légales</Link>
          <Link href="/confidentialite" className="text-pied-texte">Confidentialité</Link>
        </span>
      </div>
    </footer>
  );
}
