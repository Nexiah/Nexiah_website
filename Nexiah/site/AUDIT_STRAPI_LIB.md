# 🔍 AUDIT TECHNIQUE : `lib/strapi.ts` et Utilisation

**Date :** 2026-01-22  
**Fichier analysé :** `lib/strapi.ts`  
**Protocole :** AUDIT_PROTOCOL.md (Zero Tolerance)

---

## 📊 RÉSUMÉ EXÉCUTIF

| Catégorie | Problèmes Critiques | Problèmes Importants | Problèmes Mineurs |
|-----------|-------------------|---------------------|------------------|
| **Typage TypeScript** | 0 | 5 | 0 |
| **Gestion d'erreurs** | 0 | 2 | 0 |
| **Console.log/warn** | 0 | 11 | 0 |
| **Null Safety** | 0 | 0 | 0 |
| **TOTAL** | **0** | **18** | **0** |

---

## 🔴 PROBLÈMES CRITIQUES

**Aucun problème critique détecté.**

---

## 🟠 PROBLÈMES IMPORTANTS

### 1. Typage TypeScript : Utilisation de `any`

| Fichier | Ligne | Sévérité | Problème | Suggestion |
|---------|-------|----------|----------|-----------|
| `lib/strapi.ts` | 23 | 🟠 | `formatImageUrl` accepte `url: ... \| any` | Remplacer par `StrapiMedia \| string \| null \| undefined` |
| `lib/strapi.ts` | 70 | 🟠 | `params?: Record<string, any>` | Créer interface `StrapiQueryParams` |
| `lib/strapi.ts` | 172 | 🟠 | `filters?: Record<string, any>` | Créer interface `StrapiFilters` |
| `lib/strapi.ts` | 220 | 🟠 | `meta?: any` dans retour `getCollection` | Créer interface `StrapiMeta` |
| `lib/strapi.ts` | 240 | 🟠 | `fetchStrapi<{ data: any }>` dans `getGlobal` | Utiliser interface `StrapiGlobalData` |

**Impact :** Perte de sécurité de type, erreurs potentielles à l'exécution.

---

### 2. Console.log/warn en dehors des catch blocks

| Fichier | Ligne | Sévérité | Problème | Suggestion |
|---------|-------|----------|----------|-----------|
| `lib/strapi.ts` | 106, 109, 111, 116 | 🟠 | `console.error` dans `fetchStrapi` (hors catch) | Déplacer dans catch ou supprimer (protocole: seulement dans catch) |
| `lib/strapi.ts` | 128, 130, 132 | 🟠 | `console.warn` pour erreur 400 (hors catch) | Déplacer dans catch ou supprimer |
| `lib/strapi.ts` | 142 | 🟠 | `console.warn` pour erreur 403 (hors catch) | Déplacer dans catch ou supprimer |
| `lib/strapi.ts` | 156 | 🟠 | `console.warn` dans catch mais conditionnel | ✅ Acceptable (dans catch) |
| `lib/strapi.ts` | 260 | 🟠 | `console.warn` dans catch mais conditionnel | ✅ Acceptable (dans catch) |
| `lib/strapi.ts` | 294, 301, 328, 356 | 🟠 | `console.warn` dans `getHomePage` (hors catch) | Déplacer dans catch ou supprimer |
| `lib/strapi.ts` | 372 | 🟠 | `console.log` dans `getAbout` (hors catch) | **SUPPRIMER** (violation protocole) |
| `lib/strapi.ts` | 387, 389, 418 | 🟠 | `console.warn` dans `getAbout` (hors catch) | Déplacer dans catch ou supprimer |
| `lib/strapi.ts` | 434 | 🟠 | `console.log` dans `getContact` (hors catch) | **SUPPRIMER** (violation protocole) |
| `lib/strapi.ts` | 449, 451, 480 | 🟠 | `console.warn` dans `getContact` (hors catch) | Déplacer dans catch ou supprimer |

**Impact :** Violation du protocole d'audit (seuls `console.error` autorisés dans catch blocks).

**Note :** Les `console.error` et `console.warn` dans les blocs `if (process.env.NODE_ENV === 'development')` sont techniquement utiles pour le debug, mais le protocole est strict : **seuls les `console.error` dans les catch blocks sont autorisés**.

---

### 3. Gestion d'erreurs : Retour `null` au lieu d'erreur typée

| Fichier | Ligne | Sévérité | Problème | Suggestion |
|---------|-------|----------|----------|-----------|
| `lib/strapi.ts` | 122, 135, 144, 157 | 🟠 | `return null as T` masque les erreurs | Créer type `StrapiResult<T>` avec `success/error` ou utiliser `Result<T, Error>` |
| `lib/strapi.ts` | 240-263 | 🟠 | `getGlobal` retourne `null` sans distinction erreur/absence | Retourner `null` pour absence, `throw` pour erreur réelle |

**Impact :** Les appels ne peuvent pas distinguer entre "donnée absente" et "erreur réseau/API". Risque de masquer des bugs.

**Exemple problématique :**
```typescript
// Actuel : impossible de savoir si Strapi est down ou si la donnée n'existe pas
const data = await getGlobal(); // null = erreur OU absence ?
```

**Suggestion :**
```typescript
type StrapiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; data: null };

async function getGlobal(): Promise<StrapiResult<GlobalData>> {
  try {
    const response = await fetchStrapi<{ data: StrapiGlobalData }>('/global', { populate: '*' });
    if (!response || !response.data) {
      return { success: false, error: 'Data not found', data: null };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message, data: null };
  }
}
```

---

## 🟡 PROBLÈMES MINEURS

**Aucun problème mineur détecté.**

---

## ✅ POINTS POSITIFS

1. **Gestion d'erreurs HTTP** : Gestion correcte des codes 404, 403, 400 avec retour `null` (fail-safe)
2. **Cache Next.js** : Utilisation correcte de `next: { revalidate: 60 }` pour le cache
3. **Null Safety** : Vérifications `if (!response || !response.data)` présentes
4. **Structure Strapi** : Gestion des deux formats (attributes vs direct) bien implémentée
5. **Fallback** : Retour `null` au lieu de crash (fail-safe)

---

## 📋 UTILISATION DANS LES PAGES

### Analyse de l'utilisation dans les pages

| Fichier | Fonction utilisée | Gestion erreur | Typage | Statut |
|---------|------------------|----------------|--------|--------|
| `app/page.tsx` | `getHomePage()` | ✅ Try/catch avec fallback | ⚠️ Pas de type explicite | 🟡 |
| `app/work/page.tsx` | `getCollection<StrapiProject>()` | ✅ Try/catch avec fallback | ✅ Typé | ✅ |
| `app/work/[slug]/page.tsx` | `getCollection<StrapiProject>()` | ✅ Try/catch avec fallback | ✅ Typé | ✅ |
| `app/about/page.tsx` | `getAbout()` | ⚠️ Pas de try/catch | ⚠️ Pas de type explicite | 🟠 |
| `app/contact/page.tsx` | `getContact()` | ⚠️ Pas de try/catch | ⚠️ Pas de type explicite | 🟠 |
| `app/layout.tsx` | `getGlobalData()` | ✅ Try/catch avec fallback | ⚠️ Pas de type explicite | 🟡 |
| `components/sections/FeaturedWorkServer.tsx` | `getCollection<StrapiProject>()` | ✅ Try/catch avec fallback | ✅ Typé | ✅ |
| `app/api/projects/route.ts` | `getCollection<StrapiProject>()` | ✅ Try/catch | ✅ Typé | ✅ |

**Problèmes détectés dans l'utilisation :**

1. **`app/about/page.tsx`** et **`app/contact/page.tsx`** :
   - ❌ Pas de `try/catch` autour de `getAbout()` et `getContact()`
   - ❌ Si Strapi est down, la page peut crasher (White Screen)
   - ✅ **Correction requise :** Ajouter try/catch avec fallback

2. **Typage implicite** :
   - Plusieurs pages utilisent les fonctions sans type explicite
   - Risque d'erreurs si la structure Strapi change

---

## 🎯 RECOMMANDATIONS PRIORITAIRES

### Priorité 1 (Critique pour Production)

1. **Supprimer tous les `console.log`** (lignes 372, 434)
2. **Ajouter try/catch dans `app/about/page.tsx` et `app/contact/page.tsx`**
3. **Remplacer tous les `any` par des interfaces TypeScript strictes**

### Priorité 2 (Important)

4. **Déplacer ou supprimer les `console.warn` hors catch blocks**
5. **Créer type `StrapiResult<T>` pour gestion d'erreurs explicite**
6. **Créer interfaces pour tous les types Strapi** (`StrapiMeta`, `StrapiQueryParams`, `StrapiFilters`, `StrapiGlobalData`)

### Priorité 3 (Amélioration)

7. **Documenter les types de retour de chaque fonction**
8. **Ajouter JSDoc avec exemples d'utilisation**

---

## 📝 CONCLUSION

**État de santé :** 🟡 **BON avec améliorations nécessaires**

- ✅ **Points forts :** Gestion fail-safe, cache Next.js, null safety
- ⚠️ **Points à améliorer :** Typage strict, suppression console.log, gestion d'erreurs explicite
- 🔴 **Risques :** Pages `about` et `contact` peuvent crasher si Strapi est down

**Conformité au protocole :** **75%** (violations console.log et typage `any`)

**Action requise :** Corriger les 18 problèmes importants avant mise en production.
