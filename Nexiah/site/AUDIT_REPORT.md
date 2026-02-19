# Rapport d'audit technique – Zero Tolerance

**Date :** 2026-02-02  
**Référence :** [AUDIT_PROTOCOL.md](/Users/jonasmateus/Projects/AUDIT_PROTOCOL.md)  
**Périmètre :** Frontend `site/` (Next.js 16, App Router), Backend `cms/` (Strapi v5)

---

## Résumé exécutif

| Catégorie | Critique | Important | Mineur |
|-----------|----------|-----------|--------|
| Performance & Rendu | 2 | 3 | 2 |
| Architecture Next.js | 0 | 0 | 1 |
| Qualité Code & TypeScript | 0 | 12 | 0 |
| CSS & UI (Tailwind) | 0 | 1 | 0 |
| Backend Strapi | 0 | 0 | 1 |
| Intégration | 0 | 0 | 0 |
| **Total** | **2** | **16** | **4** |

---

## Problèmes critiques

| Fichier | Ligne (approx) | Sévérité | Problème détecté | Suggestion technique |
|---------|----------------|----------|------------------|----------------------|
| [app/about/AboutContent.tsx](app/about/AboutContent.tsx) | 84, 89, 115 | Critique | `key={childIndex}` et `key={\`${blockId}-item-${itemIndex}\`}` – index utilisé comme key dans les listes de blocs | Utiliser un ID stable par bloc/enfant (ex. hash du contenu ou `block.id` si fourni par Strapi) |
| [components/sections/Trust.tsx](components/sections/Trust.tsx) | 67 | Critique | `key={point.title}` – risque de collision si deux points ont le même titre | Utiliser `point.id` ou combinaison stable (ex. `title` + index seulement si liste non réordonnable) |

---

## Problèmes importants

### Performance & Rendu (images)

| Fichier | Ligne (approx) | Sévérité | Problème détecté | Suggestion technique |
|---------|----------------|----------|------------------|----------------------|
| [components/sections/Services.tsx](components/sections/Services.tsx) | 134 | Important | `<img>` utilisé pour localhost au lieu de `<Image />` | Utiliser `<Image />` avec `unoptimized` pour les URLs localhost pour cohérence et LCP |
| [components/sections/TechStack.tsx](components/sections/TechStack.tsx) | 193, 211 | Important | `<img>` pour localhost et pour SimpleIcons CDN | Remplacer par `<Image />` (next/image) avec `width`, `height`, `alt` ; pour SimpleIcons, ajouter le domaine dans `remotePatterns` si besoin |
| [components/ui/project-grid.tsx](components/ui/project-grid.tsx) | 79 | Important | `<img>` pour localhost | Remplacer par `<Image />` avec `unoptimized` |
| [app/about/AboutContent.tsx](app/about/AboutContent.tsx) | 207 | Important | `<img>` pour photo de profil (localhost) | Remplacer par `<Image />` |
| [app/work/[slug]/page.tsx](app/work/[slug]/page.tsx) | 358 | Important | `<img>` pour cover (localhost) | Remplacer par `<Image />` |

### Qualité Code & TypeScript (`any`)

| Fichier | Ligne (approx) | Sévérité | Problème détecté | Suggestion technique |
|---------|----------------|----------|------------------|----------------------|
| [components/sections/FeaturedWorkServer.tsx](components/sections/FeaturedWorkServer.tsx) | 20-24 | Important | `(itemData as any)` pour Title, Slug, etc. | Typage explicite avec interface dérivée de `StrapiProject` / attributes |
| [components/sections/NavbarServer.tsx](components/sections/NavbarServer.tsx) | 73-74 | Important | `(nav as any).links` / `(nav as any).items` | Définir une interface pour la structure `navigation` (ex. `{ links?: StrapiNavigationItem[] }`) |
| [app/about/AboutContent.tsx](app/about/AboutContent.tsx) | 80 | Important | `child as any` dans le rendu des blocs | Typage strict pour les enfants de blocs (StrapiBlockChild) |
| [app/work/[slug]/page.tsx](app/work/[slug]/page.tsx) | 203-309 | Important | Nombreux `(projectData as any)` et `(section as any)` | Extraire les champs via une fonction/helper typée ou étendre `StrapiProject` |
| [lib/types/strapi.ts](lib/types/strapi.ts) | 105, 117, 155-156, 178, 189 | Important | `[key: string]: any` et `content?: any` | Remplacer par `unknown` ou interfaces plus précises pour les blocs |
| [lib/icons.ts](lib/icons.ts) | 49, 68 | Important | `(LucideIcons as any)[variant]` | Utiliser un type d’index typé (ex. `keyof typeof LucideIcons`) |

### Keys stables (fallback sur index)

| Fichier | Ligne (approx) | Sévérité | Problème détecté | Suggestion technique |
|---------|----------------|----------|------------------|----------------------|
| [components/sections/Services.tsx](components/sections/Services.tsx) | 118 | Important | `stableId` utilise `index` en fallback : `` `expertise-${...}-${index}` `` | Préférer un identifiant Strapi (`expertise.id`) ou combinaison sans index (ex. title + icon_name) |
| [components/sections/TechStack.tsx](components/sections/TechStack.tsx) | 181 | Important | `uniqueKey` inclut `Math.floor(index / tools.length)` – dépendance à l’index | Utiliser `tool.id` ou `tool.tool_name` + un suffixe stable si besoin de duplication |

### CSS & Tailwind

| Fichier | Ligne (approx) | Sévérité | Problème détecté | Suggestion technique |
|---------|----------------|----------|------------------|----------------------|
| [app/contact/ContactContent.tsx](app/contact/ContactContent.tsx) | 73 | Important | `h-[37.5rem]` – valeur arbitraire | Remplacer par une classe du design system (ex. `h-[600px]` ou `min-h-[theme(spacing.96)]`) |

---

## Problèmes mineurs

| Fichier | Ligne (approx) | Sévérité | Problème détecté | Suggestion technique |
|---------|----------------|----------|------------------|----------------------|
| [app/page.tsx](app/page.tsx) | 271 | Mineur | `contentSections.map((section, index) => renderSection(section, index))` – la key est sur l’élément retourné par `renderSection` (OK) ; s’assurer que `section.id` est toujours renseigné côté Strapi pour éviter le fallback avec index | Documenter ou garantir la présence de `id` dans les sections de la Dynamic Zone |
| [components/sections/Arguments.tsx](components/sections/Arguments.tsx) | 91 | Mineur | `stableId` utilise `index` en dernier recours : `` `argument-${...}-${iconName \|\| index}` `` | Idéalement utiliser `argument.id` Strapi uniquement |
| [components/ui/project-grid.tsx](components/ui/project-grid.tsx) | 27 | Mineur | `stableKey` utilise `index` en fallback – acceptable si `slug` toujours présent | S’assurer que les projets Strapi ont un `slug` unique |
| [cms/](cms/) | schemas | Mineur | Global (Strapi) : le schéma lu n’inclut pas `navigation` ; le frontend utilise `globalData?.navigation` | Vérifier en admin Strapi que le type Global expose bien un champ `navigation` (plugin ou extension) ; sinon aligner le schéma |

---

## Points conformes ou déjà en place

- **Hooks :** Les `useEffect` (Navbar, ClientHydrationFix) ont un tableau de dépendances `[]` explicite et approprié.
- **Pas de `console.log`** dans le code applicatif (hors `console.error` dans l’API route projects).
- **Fetch / cache :** Les appels Strapi utilisent `next: { revalidate: 60 }` ; pas de token en dur (usage de `process.env.NEXT_PUBLIC_STRAPI_API_URL`, `NEXT_PUBLIC_WEB3FORMS_KEY`).
- **Fail-safe :** `getHomePage`, `getGlobal`, `getAbout`, `getContact`, `getCollection` sont dans des try/catch et retournent `null` ou gèrent l’erreur ; les pages utilisent des fallbacks (ex. `contentSections = []`, `notFound()` pour projet absent).
- **Null safety :** Usage cohérent de `?.` et fallbacks (ex. `globalData?.siteName`, `response?.data`).
- **Backend :** Aucun token ou secret en dur dans le code ; schémas sans relation circulaire évidente ; Contact n’expose pas de donnée sensible (email_placeholder = texte de placeholder).

---

## Conclusion

Le projet est globalement en bon état : pas de dette critique bloquante, bonne gestion des erreurs et du cache côté Strapi, et pas d’exposition de secrets. Les deux points **critiques** à traiter en priorité sont l’usage d’**index dans les keys** (AboutContent, Trust), pour éviter des bugs de rendu et de réconciliation React. Vient ensuite la **removal des `<img>`** au profit de `next/image` partout (Important), puis la **réduction des `any`** (types Strapi et helpers) pour améliorer la maintenabilité et limiter les régressions. Les points mineurs (fallbacks sur index dans quelques keys, valeur Tailwind arbitraire, schéma Global) peuvent être traités progressivement. Recommandation : corriger d’abord les keys et les images, puis typage Strapi et lib/icons.
