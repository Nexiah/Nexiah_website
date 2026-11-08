'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { envoyerDemande, type EtatDemande } from './actions';

const TYPES = ['EHPAD', 'Résidence autonomie', 'Mairie / collectivité', 'Entreprise', 'Autre'];

export function FormulaireDemande({ atelierId, titre }: { atelierId: string; titre: string }) {
  const [etat, action, envoi] = useActionState<EtatDemande, FormData>(envoyerDemande, { statut: 'initial' });

  if (etat.statut === 'envoye') {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#e3f4ea] text-[#1e6b3f]">
          <CircleCheck aria-hidden className="size-7" />
        </span>
        <h2 className="text-[1.6rem] font-bold leading-tight">Demande bien reçue !</h2>
        <p className="text-texte">
          Merci. Nous recherchons un intervenant disponible à votre date et revenons vers vous sous 48 h.
          Un email de confirmation vient de vous être envoyé.
        </p>
        {etat.reference && (
          <p className="text-[0.9rem] text-discret">
            Référence de votre demande : <strong className="text-encre">{etat.reference}</strong>
          </p>
        )}
        <Link href="/catalogue" className="btn-principal">Voir d&apos;autres ateliers</Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-1">
        <h2 className="text-[1.6rem] font-bold leading-tight">Demander cet atelier</h2>
        <span className="text-[0.9rem] text-discret">Réponse sous 48 h · sans engagement</span>
      </div>

      {etat.statut === 'erreur' && (
        <p role="alert" className="flex gap-2 rounded-bouton bg-[#fdecec] p-3.5 text-[0.9rem] text-[#8a1c1c]">
          <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
          {etat.message}
        </p>
      )}

      <input type="hidden" name="atelier" value={atelierId} />
      {/* Champ piège : masqué aux humains, rempli par les robots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Site web
          <input type="text" name="siteWeb" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="libelle">
        Type d&apos;établissement *
        <select name="typeEtablissement" required defaultValue="" className="champ">
          <option value="" disabled>Choisissez…</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="libelle">
        Nom de l&apos;établissement *
        <input name="nomEtablissement" required autoComplete="organization" className="champ" />
      </label>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className="libelle">
          Prénom *
          <input name="prenom" required autoComplete="given-name" className="champ" />
        </label>
        <label className="libelle">
          Nom *
          <input name="nom" required autoComplete="family-name" className="champ" />
        </label>
      </div>
      <label className="libelle">
        Email *
        <input name="email" type="email" required autoComplete="email" className="champ" />
      </label>
      <label className="libelle">
        Téléphone *
        <input name="telephone" type="tel" required autoComplete="tel" className="champ" />
      </label>
      <label className="libelle">
        Ville de l&apos;intervention *
        <input name="ville" required autoComplete="address-level2" className="champ" />
      </label>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className="libelle">
          Date souhaitée *
          <input name="dateSouhaitee" type="date" required className="champ" />
        </label>
        <label className="libelle">
          Autre date possible
          <input name="dateAlternative" type="date" className="champ" />
        </label>
      </div>
      <label className="libelle">
        Nombre de participants *
        <input name="nombreParticipants" type="number" min={1} required inputMode="numeric" className="champ" />
      </label>
      <label className="libelle">
        Message
        <textarea name="message" rows={3} placeholder="Public, contraintes, horaires…" className="champ resize-y" />
      </label>
      <label className="flex items-start gap-2.5 text-[0.85rem] text-texte">
        <input name="consentement" type="checkbox" required className="mt-0.5 size-[22px] shrink-0 accent-marque" />
        <span>
          J&apos;accepte que mes données soient utilisées pour traiter ma demande « {titre} ».{' '}
          <Link href="/confidentialite">Politique de confidentialité</Link>
        </span>
      </label>
      <button type="submit" disabled={envoi} className="btn-principal min-h-14 text-[1.05rem] disabled:opacity-60">
        {envoi ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </button>
      <span className="text-center text-[0.8rem] text-discret">* champs obligatoires</span>
    </form>
  );
}
