'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAVIGATION = [
  { href: '/#publics', label: 'Nos publics' },
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/offres-pack', label: 'Offres pack' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

/** Liens du menu ; `pathname` sert à marquer la page courante. */
function LiensPrincipaux({ pathname }: { pathname: string }) {
  return (
    <>
      {NAVIGATION.map((item) => {
        const actif = item.href !== '/#publics' && pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={actif ? 'page' : undefined}
            className={actif ? 'text-marque underline decoration-2 underline-offset-[6px]' : 'text-encre no-underline hover:text-marque'}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function LiensAvecPageCourante() {
  return <LiensPrincipaux pathname={usePathname()} />;
}

export function Header() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-nuage bg-white">
      <div className="conteneur flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex shrink-0" onClick={() => setOuvert(false)}>
          <Image
            src="/logo-evenement-ciel.png"
            alt="Événement Ciel — Des idées, du talent !"
            width={303}
            height={110}
            priority
            className="h-[52px] w-auto rounded-md"
          />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 font-bold lg:flex">
          <Suspense fallback={<LiensPrincipaux pathname="" />}>
            <LiensAvecPageCourante />
          </Suspense>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/catalogue" className="btn-principal hidden sm:inline-flex">
            Demander un atelier
          </Link>
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-bouton text-encre lg:hidden"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOuvert((o) => !o)}
          >
            {ouvert ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      {ouvert && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-nuage lg:hidden">
          <ul className="conteneur flex flex-col py-3">
            {NAVIGATION.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block py-3 font-bold text-encre no-underline" onClick={() => setOuvert(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/catalogue" className="btn-principal w-full" onClick={() => setOuvert(false)}>
                Demander un atelier
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
