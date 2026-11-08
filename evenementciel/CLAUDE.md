# CLAUDE.md — Événement Ciel (refonte evenementciel.net)

Contexte et règles du projet, pour Claude Code. Lire aussi `README.md`.

## Le métier en bref
- Événement Ciel propose des ateliers et animations à la demande pour des **EHPAD, résidences autonomie, mairies/collectivités et entreprises**.
- Le visiteur choisit un atelier et envoie une **demande** avec une date souhaitée. Ce n'est **pas** une réservation sur calendrier : le client appelle ensuite ses prestataires, puis confirme.
- **Aucun paiement en ligne** : le règlement se fait après l'atelier. Ne pas ajouter de Stripe ni de panier.
- Les prestataires sont gérés dans le CRM du client, pas sur le site.
- V2 prévue : **espace client** (connexion d'un établissement, suivi de ses demandes, historique).

## Structure
- `backend/` : Strapi 5 (TypeScript). SQLite en local (`.tmp/data.db`), PostgreSQL en prod.
- `frontend/` : Next.js 16 (App Router, `cacheComponents` + `partialPrefetching` activés) et Tailwind 4.
  - **Next 16 a des changements importants** : lire `frontend/AGENTS.md` et la doc dans `frontend/node_modules/next/dist/docs/` avant d'écrire du code Next.

## Lancer en local
```bash
cd backend && npm run develop     # http://localhost:1337/admin
cd frontend && npm run dev        # http://localhost:3000
```
Vérifications avant de livrer : `npm run build` dans chaque dossier, et `npm run lint` dans `frontend`.

## Back-end (Strapi)
- Types : `atelier`, `theme`, `public-cible`, `demande`, `etablissement`, et le composant `atelier.element-liste`.
- Les noms de champs sont **en français, en camelCase** (`dateSouhaitee`, `nomEtablissement`…). Garder cette convention.
- Routes publiques **restreintes** (`only: [...]` dans `routes/*.ts`) : lecture seule pour atelier, thème et public, `create` seul pour demande. Rien de public pour établissement.
- Permissions du rôle Public : déclarées dans `src/bootstrap/permissions.ts`. Pour exposer une nouvelle action, l'ajouter là, ne pas compter sur un réglage fait à la main dans l'admin.
- `POST /api/demandes` passe par un contrôleur personnalisé (`api/demande/controllers/demande.ts`) qui filtre, valide et gère un champ piège `siteWeb`. Le statut, les notes internes et le prestataire ne sont **jamais** modifiables depuis le site.
- La logique métier est dans le service (`api/demande/services/demande.ts`) : référence `D-AAAA-NNNN`, établissement retrouvé ou créé, emails via SMTP (journalisés si `SMTP_HOST` est vide).
- Données de démo : `src/bootstrap/seed.ts`, créées seulement si la base n'a aucun thème (`SEED_DEMO=false` pour désactiver).
- Champs `uid` (slug) : le Document Service ne les génère pas, il faut les fournir à la création par code.

## Front (Next.js)
- Les données passent par `src/lib/strapi.ts` : fonctions avec `'use cache'`, `cacheLife('minutes')` et `cacheTag('contenu')`. Le webhook Strapi → `/api/revalidate` invalide le tag.
- Ce qui lit `searchParams`, `params` ou `usePathname()` doit être **dans un `<Suspense>`**, sinon le build échoue (cacheComponents).
- Pas de `new Date()` ni d'autre valeur dépendant de l'heure dans un composant serveur prérendu.
- Les formulaires utilisent des Server Actions avec `useActionState` (voir `app/ateliers/[slug]/`).
- Les filtres du catalogue sont dans l'URL (`?public=…&theme=…`) et s'affichent en **listes déroulantes** (demande du client).
- Les infos du site (coordonnées, chiffres clés) sont dans `src/lib/site.ts`.

## Design
- Source : canvas Claude Design « Événement Ciel — refonte du site », dans le projet claude.ai « Site Evenementciel ».
- **Tout le thème est dans `frontend/src/app/globals.css`** (bloc `@theme` et `@utility`) : couleurs (`marque` #075690, `soleil` #F5B82E, `ciel`, `nuage`, `encre`, `texte`, `discret`), polices, arrondis. Ne pas coder de couleurs en dur dans les composants quand un token existe.
- Classes utilitaires maison : `conteneur`, `btn-principal`, `btn-secondaire`, `btn-soleil`, `champ`, `libelle`, `titre-section`.
- Polices auto-hébergées (`@fontsource`) : Bricolage Grotesque pour les titres, Atkinson Hyperlegible pour le texte. **Pas de Google Fonts** (RGPD).
- Couleurs des tags de thème : stockées dans Strapi (`couleurFond`, `couleurTexte`).

## Accessibilité (public senior et personnel d'EHPAD)
- Texte de base 18 px. Contrastes AA minimum. Cibles cliquables ≥ 44 px.
- Libellés toujours visibles au-dessus des champs. Focus visible (contour jaune).
- Vrais `<button>`, `<a>` et `<label>`. `aria-hidden` sur les icônes décoratives.

## Langue
Le site, les libellés de l'admin, les messages d'erreur et les commentaires du code sont en **français**.

## Reste à faire (V1)
- [ ] Formulaire de contact (conseil, demande de catalogue PDF) : page `/contact`, avec envoi vers Strapi.
- [ ] Contenus des pages À propos, Offres pack, mentions légales, confidentialité (textes du client).
- [ ] Témoignages : passer de textes en dur à un type Strapi.
- [ ] Photos des ateliers (dans l'admin Strapi).
- [ ] Coordonnées réelles dans `src/lib/site.ts`.
- [ ] `sitemap.xml` et `robots.txt` côté front.
- [ ] Webhook CRM du client et webhook de revalidation.
- [ ] Déploiement : Strapi + PostgreSQL (hébergement en Europe), front Next.js. Strapi doit être joignable pendant le build du front.

## V2 (plus tard)
Espace client : comptes Users & Permissions rattachés à un `etablissement`, routes authentifiées qui ne renvoient que les demandes de l'établissement de l'utilisateur.
