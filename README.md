# Projets

Ce dépôt contient plusieurs projets, chacun dans son propre dossier.

## Structure

```
.
├── Nexiah/       # Projet Nexiah
│   ├── cms/      # Backend Strapi
│   └── site/     # Frontend Next.js
└── README.md
```

## Projet Nexiah

### Prérequis

- Node.js >= 20.0.0
- npm >= 6.0.0

### Installation

```bash
# Installer les dépendances pour Strapi
cd Nexiah/cms
npm install

# Installer les dépendances pour Next.js
cd ../site
npm install
```

### Démarrage

#### Strapi (CMS)
```bash
cd Nexiah/cms
npm run dev
```
Strapi sera accessible sur http://localhost:1337

#### Next.js (Site)
```bash
cd Nexiah/site
npm run dev
```
Next.js sera accessible sur http://localhost:3000

### Configuration

1. Créer un fichier `.env.local` dans `Nexiah/site/` avec :
   ```
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   ```

2. Configurer les permissions dans Strapi Admin :
   - Settings → Users & Permissions → Roles → Public
   - Activer les permissions pour vos collections
