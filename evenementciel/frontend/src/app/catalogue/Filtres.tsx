'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type Option = { value: string; label: string };

/**
 * Filtres en listes déroulantes. Les filtres sont dans l'URL (?public=…&theme=…) :
 * une page filtrée peut être partagée ou mise en favori.
 * Sans JavaScript, le bouton « Filtrer » envoie le formulaire.
 */
export function Filtres({
  publics,
  themes,
  publicActif,
  themeActif,
}: {
  publics: Option[];
  themes: Option[];
  publicActif: string;
  themeActif: string;
}) {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();

  const appliquer = (form: HTMLFormElement) => {
    const donnees = new FormData(form);
    const params = new URLSearchParams();
    for (const cle of ['public', 'theme']) {
      const v = donnees.get(cle);
      if (typeof v === 'string' && v) params.set(cle, v);
    }
    const qs = params.toString();
    demarrer(() => router.replace(qs ? `/catalogue?${qs}` : '/catalogue', { scroll: false }));
  };

  return (
    <form
      action="/catalogue"
      method="get"
      onChange={(e) => appliquer(e.currentTarget)}
      onSubmit={(e) => {
        e.preventDefault();
        appliquer(e.currentTarget);
      }}
      className="flex flex-wrap items-end gap-4"
      aria-busy={enCours}
    >
      <label className="libelle w-full sm:w-[320px]">
        Public
        <select name="public" defaultValue={publicActif} className="champ cursor-pointer">
          <option value="">Tous les publics</option>
          {publics.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className="libelle w-full sm:w-[320px]">
        Thème
        <select name="theme" defaultValue={themeActif} className="champ cursor-pointer">
          <option value="">Tous les thèmes</option>
          {themes.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <noscript>
        <button type="submit" className="btn-principal">Filtrer</button>
      </noscript>
      {(publicActif || themeActif) && (
        <Link href="/catalogue" scroll={false} className="inline-flex min-h-[50px] items-center px-2 font-bold underline underline-offset-4">
          Réinitialiser
        </Link>
      )}
    </form>
  );
}
