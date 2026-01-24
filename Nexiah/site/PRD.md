# PRD : Nexiah - Services Product Builder

## 1. État actuel du projet
* **Repo :** Initialisé (Git/GitHub connectés).
* **Backend :** Strapi CMS tourne en local (`http://localhost:1337`).
* **Frontend :** Next.js 16.1.4 (App Router) installé.
* **Environnement :** Développement local (Localhost).
* **Objectif immédiat :** Développement du Frontend (UI/UX) avec contenu hardcodé dans un premier temps (MVP).

## 2. Vision & Positionnement
**Nexiah** est le partenaire technique des PME et Solopreneurs.
**Proposition de valeur :** "Je construis votre Application Web et j'automatise votre Business."

**Stratégie de l'offre ("À la carte") :**
Les clients doivent comprendre qu'ils peuvent engager Nexiah pour :
1.  **Tout le cycle :** De l'idée à l'automatisation.
2.  **Un besoin précis :** Juste du développement, ou juste une automatisation sur des outils existants.

**Design System :**
* **Vibe :** "Clean Tech", Rassurant, Lumineux, Structuré.
* **Palette :** Fond Blanc (#ffffff) ou Crème très léger (#fdfdfd). Texte sombre (#0f172a). Accents Indigo/Bleu "Product".
* **Interdit :** Dark mode par défaut, effets "Matrix/Hacker", jargon technique type "Vibe-coding".

## 3. Stack Technique (Strict)
* **Frontend :** Next.js 16.1.4.
* **Langage :** TypeScript.
* **Styling :** Tailwind CSS + **Shadcn/ui**.
* **Icons :** Lucide React.
* **Animations :** Framer Motion (Apparitions douces, Hover effects).
* **Font :** Inter, Geist Sans ou une sans-serif moderne similaire.

## 4. Architecture et Contenu (Sitemap)

### A. Navbar
* **Logo :** Nexiah (Texte simple + Icône géométrique).
* **Liens :** Services, Réalisations, A propos, Contact.
* **CTA :** "Réserver un appel" (Outline/Ghost Style).

### B. Homepage ("/")

#### 1. Hero Section
* **Layout :** Centré, épuré.
* **H1 :** `Je construis votre <span class="text-primary">Application Web</span> et j'automatise votre <span class="text-primary">Business</span>.`
* **Sous-titre :** "Plus qu'un développeur. Je transforme votre vision en outils performants (Web & Mobile) et je connecte vos logiciels pour supprimer vos tâches manuelles."
* **CTA Principal :** "Discuter de votre projet" (Vers Cal.com).
* **CTA Secondaire :** "Voir mes réalisations".

#### 2. Services Section ("Expertise à la carte")
* **Titre Section :** "Une expertise globale, disponible à la carte."
* **Sous-titre :** "Intervention ciblée ou projet complet : je m'adapte à vos besoins."
* **Grid :** 3 Cartes (Cards Shadcn) de même hauteur.
    * **Carte 1 : Conception & Stratégie** (Icon: Map/Waypoints)
        * *Texte :* "Transformez votre idée en plan d'action. Cadrage, specs et stratégie pour partir sur des bases solides."
    * **Carte 2 : Développement Web** (Icon: Code/Laptop)
        * *Texte :* "Sites et applications sur-mesure. Développement rapide et performant pour lancer votre produit sans attendre."
    * **Carte 3 : Automatisation** (Icon: Zap/Workflow)
        * *Texte :* "Gagnez du temps. Je connecte vos outils existants pour automatiser vos tâches manuelles et répétitives."

#### 3. Tech Stack (Preuve d'autorité)
* Marquee défilant ou Grille statique propre.
* Logos : Next.js, React, Strapi, n8n, OpenAI, Stripe.

#### 4. Featured Work (Portfolio)
* Titre : "Dernières réalisations".
* Grille de 3 projets (Images mockups pour l'instant).

### C. Pages Secondaires (Structure future)
* `/services` : Détail des offres.
* `/work` : Portfolio complet (connecté à Strapi plus tard).
* `/contact` : Formulaire + Cal.com embed.

## 5. Instructions de Développement (Cursor Rules)

1.  **Setup UI :**
    * Vérifie la présence de Shadcn/ui. S'il manque, installe-le (`npx shadcn@latest init`).
    * Installe les dépendances : `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.
2.  **Composants :**
    * Crée des composants modulaires dans `components/sections/` (ex: `Hero.tsx`, `Services.tsx`).
    * Utilise les composants Shadcn (`ui/button`, `ui/card`, `ui/badge`) pour la cohérence.
3.  **Contenu :**
    * Utilise **strictement** les textes fournis dans la section 4 ci-dessus. Pas de Lorem Ipsum.
4.  **Responsive :**
    * Mobile-first. Padding généreux sur desktop.