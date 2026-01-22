# Projet Nexiah

Projet Strapi + Next.js pour Nexiah.

## Structure

```
Nexiah/
├── cms/      # Backend Strapi (CMS headless)
└── site/     # Frontend Next.js
```

## Prérequis

- Node.js >= 20.0.0
- npm >= 6.0.0

## Installation

```bash
# Installer les dépendances pour Strapi
cd cms
npm install

# Installer les dépendances pour Next.js
cd ../site
npm install
```

## Démarrage

### Strapi (CMS)
```bash
cd Nexiah/cms
npm run dev
```
Strapi sera accessible sur http://localhost:1337

### Next.js (Site)
```bash
cd Nexiah/site
npm run dev
```
Next.js sera accessible sur http://localhost:3000

## Configuration

1. Créer un fichier `.env.local` dans `Nexiah/site/` avec :
   ```
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   ```

2. Configurer les permissions dans Strapi Admin :
   - Settings → Users & Permissions → Roles → Public
   - Activer les permissions pour vos collections
