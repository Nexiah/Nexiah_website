# Documentation technique – Architecture du projet

Document destiné à un nouveau développeur. Le projet est un **monorepo** : le frontend vit dans `site/`, le CMS Strapi dans `cms/` (à la racine du repo parent).

---

## Tech Stack

### Frameworks & runtime
- **Next.js 16** (App Router) – SSR, génération de pages, API Routes
- **React 19**
- **TypeScript 5**

### UI & style
- **Tailwind CSS 4** – utilitaires, thème via `app/globals.css` et variables CSS
- **shadcn/ui** (style New York) – composants basés sur Radix UI (Button, Card, Form, Sheet, etc.)
- **Framer Motion** – animations (sections, listes, modales)
- **Lucide React** – icônes
- **Polices** : Geist Sans & Geist Mono (`next/font/google`)

### Formulaires & validation
- **React Hook Form** – gestion des formulaires
- **Zod** – schémas de validation
- **@hookform/resolvers** – liaison Zod / RHF

### Backend & données
- **Strapi v5** (dans `cms/`) – Headless CMS, API REST
- **Cloudinary** – médias (via plugin Strapi) ; URLs d’images complètes renvoyées par Strapi
- Pas de state management global (état local + données serveur)

### Outils
- **ESLint** + **eslint-config-next**
- **PostCSS** + **@tailwindcss/postcss**
- **Turbopack** (dev) ; Webpack pour le build

---

## Structure du projet

```
site/
├── app/                    # App Router Next.js
│   ├── layout.tsx          # Layout racine, métadonnées, polices, getGlobal()
│   ├── page.tsx            # Home : getHomePage(), renderSection(), sections dynamiques
│   ├── globals.css         # Tailwind, thème (variables CSS), @theme
│   ├── global-error.tsx    # Boundary d’erreur global (Client)
│   ├── about/
│   │   ├── page.tsx        # Page À propos (Server), getAbout()
│   │   └── AboutContent.tsx # Contenu (Client), rendu blocs Strapi
│   ├── contact/
│   │   ├── page.tsx        # Page Contact (Server), getContact()
│   │   └── ContactContent.tsx
│   ├── work/
│   │   ├── page.tsx        # Liste projets (Server), getCollection(projects)
│   │   └── [slug]/page.tsx # Détail projet (Server), getCollection + notFound()
│   └── api/
│       └── projects/
│           └── route.ts    # GET /api/projects – proxy Strapi (getCollection)
├── components/
│   ├── sections/           # Sections de page (Hero, Services, Process, etc.)
│   │   ├── *Server.tsx     # Composants serveur qui fetchent et passent les props
│   │   └── *.tsx           # Composants d’affichage (souvent Client pour motion)
│   ├── layout/
│   │   └── Footer.tsx
│   ├── ui/                 # Composants shadcn (button, card, form, sheet, …)
│   ├── forms/
│   │   └── contact-form.tsx # Formulaire contact (Client, Web3Forms)
│   └── ClientHydrationFix.tsx # Correctif hydratation (suppression attributs extensions)
├── lib/
│   ├── strapi.ts           # Client API Strapi : fetchStrapi, getCollection, getGlobal, getHomePage, getAbout, getContact, formatImageUrl
│   ├── types/
│   │   └── strapi.ts       # Interfaces Strapi (StrapiResponse, StrapiProject, StrapiMedia, blocs, etc.)
│   ├── icons.ts            # getLucideIcon(name) – résolution nom → composant Lucide
│   └── utils.ts            # cn() (clsx + tailwind-merge)
├── public/                 # Assets statiques
├── next.config.ts          # output standalone, turbopack.root, images.remotePatterns, webpack resolve
├── components.json         # Config shadcn
├── postcss.config.mjs
└── tsconfig.json           # Alias @/* → ./*
```

### Rôle des dossiers clés

- **`app/`** : routes, layouts, métadonnées. Les `page.tsx` sont des Server Components qui appellent `lib/strapi` et passent les données aux composants.
- **`components/sections/`** : une section = souvent un couple Server (fetch) + Client (affichage + animations), ex. `NavbarServer` → `Navbar`, `FeaturedWorkServer` → `FeaturedWork`.
- **`components/ui/`** : composants réutilisables type shadcn (pas de fetch).
- **`lib/`** : logique partagée ; **`lib/strapi.ts`** est le point d’entrée unique pour Strapi ; **`lib/types/strapi.ts`** centralise les types des réponses Strapi.

---

## Flux de données (Frontend ↔ Strapi)

### Schéma général

- Les **pages** (`app/**/page.tsx`) et les **composants serveur** (`*Server.tsx`) appellent les fonctions de **`lib/strapi.ts`**.
- Aucun appel direct à `fetch(STRAPI_URL)` depuis les composants ; tout passe par `getStrapiURL`, `fetchStrapi`, `getCollection`, `getGlobal`, `getHomePage`, `getAbout`, `getContact`, et `formatImageUrl`.

### Fichiers clés pour l’API

| Fichier | Rôle |
|--------|------|
| **`lib/strapi.ts`** | `getStrapiURL()`, `formatImageUrl()`, `fetchStrapi()`, `getCollection()`, `getGlobal()`, `getHomePage()`, `getAbout()`, `getContact()`. Gestion d’erreurs (retour `null`, try/catch). Cache Next : `next: { revalidate: 60 }` sur les fetch. |
| **`lib/types/strapi.ts`** | Types des réponses et entités Strapi (StrapiResponse, StrapiCollectionResponse, StrapiProject, StrapiMedia, StrapiGlobalData, blocs, etc.). |
| **`app/api/projects/route.ts`** | Route GET `/api/projects` : utilise `getCollection<StrapiProject>('projects', …)` et renvoie le JSON (proxy pour le front si besoin). |

### Variables d’environnement

- **`NEXT_PUBLIC_STRAPI_API_URL`** : base de l’API Strapi (ex. `http://localhost:1337` ou `https://admin.nexiah.fr`). Utilisée dans `lib/strapi.ts`.
- **`NEXT_PUBLIC_WEB3FORMS_KEY`** : clé pour le formulaire de contact (envoi vers Web3Forms), utilisée dans `components/forms/contact-form.tsx`.

### Images

- Les URLs d’images viennent de Strapi (ou Cloudinary). **`formatImageUrl()`** normalise les chemins relatifs (préfixe Strapi) et laisse inchangées les URLs absolues (Cloudinary, etc.).
- **`next.config.ts`** → `images.remotePatterns` : localhost (Strapi), admin.nexiah.fr, res.cloudinary.com, cdn.simpleicons.org. Toutes les images passent par **`next/image`** (`<Image />`).

---

## Patterns & conventions

### Composants Server vs Client

- **Server par défaut** : tout composant sans `"use client"` est un Server Component (pages, layout, NavbarServer, FeaturedWorkServer, Footer, etc.).
- **Client** : `"use client"` uniquement quand nécessaire :
  - hooks (useState, useEffect, usePathname, useRouter),
  - événements (onClick, onSubmit),
  - bibliothèques client (Framer Motion, Radix UI interactif, react-hook-form).
- **Pattern courant** : un **Server** fetche les données et rend un **Client** avec les props (ex. `NavbarServer` → `Navbar`, `FeaturedWorkServer` → `FeaturedWork`).

### Style (Tailwind)

- **Uniquement des classes utilitaires** ; pas de `style={{ … }}` pour le layout/couleurs.
- **`app/globals.css`** : `@import "tailwindcss"`, `@plugin "@tailwindcss/typography"`, `@theme inline` avec variables (primary, muted, radius, etc.) pour shadcn.
- **`lib/utils.ts`** : `cn(...)` pour fusionner des classes (clsx + tailwind-merge).
- Préférer les tokens du thème (`bg-primary`, `text-muted-foreground`, `rounded-lg`) aux valeurs arbitraires ; éviter les valeurs magiques type `w-[356px]` sans nécessité.

### Types (TypeScript / interfaces)

- **Pas de `any`** : les réponses Strapi sont typées via **`lib/types/strapi.ts`** (StrapiProject, StrapiMedia, StrapiGlobalData, blocs, etc.).
- **Null safety** : accès optionnel (`data?.attributes?.title`) et fallbacks partout où Strapi peut renvoyer null ou structure vide.
- **Props des sections** : interfaces explicites (ex. `HeroProps`, `ServicesProps`) avec champs optionnels et noms alignés sur Strapi (PascalCase / camelCase gérés dans le mapping).
- **Formulaires** : types dérivés de schémas Zod (`z.infer<typeof contactFormSchema>`).

### Rendu des sections (home)

- **`app/page.tsx`** : récupère `getHomePage()` → `content_sections` (Dynamic Zone).  
- **`renderSection(section, index)`** : selon `section.__component` (`section.hero`, `section.expertise`, `section.step`, `section.argument`, `section.tool`/`section.tools`), rend le bon composant (Hero, Services, Process, Arguments, TechStack) avec les props mappées.  
- Si aucune section Strapi : affichage en **fallback** (sections statiques + `FeaturedWorkServer`).  
- **FeaturedWork** et le lien « Réalisations » dans la navbar ne s’affichent que s’il existe au moins un projet (vérification via `getCollection('projects', { limit: 1 })`).

### Erreurs et repli

- **`app/global-error.tsx`** : boundary d’erreur global (Client), remplace le layout en cas d’erreur.
- **Strapi** : les fonctions dans `lib/strapi.ts` ne remontent pas d’erreur fatale ; elles retournent `null` et les pages utilisent des fallbacks (sections vides, `notFound()` pour un projet inexistant).

---

## Authentification

- **Aucune authentification utilisateur** côté frontend (pas de login, pas de session, pas de middleware d’auth).
- L’API Strapi est consommée en **lecture seule** (pas de token dans les requêtes depuis le site) ; les permissions sont gérées côté Strapi (rôle Public pour les collections exposées).
- Le formulaire de contact envoie les données à **Web3Forms** (service externe) via `NEXT_PUBLIC_WEB3FORMS_KEY` ; ce n’est pas une auth, mais une clé API pour le service d’envoi d’emails.

---

## Backend (hors `site/`)

- **`cms/`** : application Strapi v5 (single types : global, home-page, about, contact ; collection type : project).  
- Content-Types définis dans `cms/src/api/*/content-types/*/schema.json`.  
- Upload médias : **Cloudinary** (plugin Strapi).  
- Pour le développement : lancer Strapi (`cms/`) et le site (`site/`) ; le site pointe vers l’API via `NEXT_PUBLIC_STRAPI_API_URL`.
