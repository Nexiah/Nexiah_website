# Événement Ciel — site evenementciel.net

Refonte du site d'Événement Ciel : catalogue d'ateliers pour EHPAD, résidences
autonomie, collectivités et entreprises, avec **demande d'atelier en ligne**
(sans paiement : le règlement se fait après l'atelier).

| Dossier     | Rôle                                   | Techno                    |
|-------------|----------------------------------------|---------------------------|
| `backend/`  | Contenus + demandes (back-office)      | Strapi 5, SQLite / PostgreSQL |
| `frontend/` | Site public                            | Next.js 16, Tailwind 4    |

## Démarrer en local

Node 20 ou 22 requis.

```bash
# 1. Strapi (http://localhost:1337/admin)
cd backend
cp .env.example .env          # puis remplacer les « tobemodified »
npm install
npm run develop               # crée l'admin au premier lancement

# 2. Site (http://localhost:3000), dans un autre terminal
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Au premier démarrage, Strapi :
- donne au rôle **Public** l'accès en lecture aux ateliers, thèmes et publics, et le droit de **créer** une demande (rien d'autre) ;
- crée des **ateliers de démonstration** repris de la maquette (désactivable avec `SEED_DEMO=false`).

## Modèle de contenu (Strapi)

- **Atelier** : titre, résumé, description, photo, thème, publics, durée, participants, niveau, tarif indicatif, bénéfices, objectifs, matériel fourni, prérequis, « mis en avant » (accueil).
- **Thème** : nom + couleurs du tag (modifiables par le client).
- **Public** : EHPAD, résidence autonomie, mairie, entreprise.
- **Demande** : référence `D-AAAA-NNNN`, statut (*Nouvelle → Recherche prestataire → Confirmée → Réalisée → Payée / Annulée*), atelier, établissement, contact, dates, participants, message, prestataire, notes internes.
- **Établissement** : créé ou retrouvé automatiquement (nom + ville) à chaque demande. Base de l'espace client (V2).

Le formulaire public ne peut pas fixer le statut, les notes ni le prestataire : le contrôleur `demande` filtre les champs, valide les données et ignore les robots (champ piège `siteWeb`).

## Emails

À chaque demande : accusé de réception au demandeur + notification au client
(`EMAIL_NOTIFICATION_TO`). Renseigner un SMTP dans `backend/.env` (Brevo, OVH, Resend…).
Sans `SMTP_HOST`, les emails sont seulement journalisés.

## Mise à jour du site après une modification dans Strapi

Les pages sont mises en cache (rafraîchies au plus toutes les minutes). Pour une mise à jour immédiate :
Strapi → *Paramètres → Webhooks* → URL `https://<site>/api/revalidate`, en-tête
`x-revalidate-secret: <REVALIDATE_SECRET>`, événements *Entry* (create, update, delete, publish, unpublish).

Le même mécanisme de webhook peut pousser les nouvelles demandes vers le CRM du client.

## Design

Toutes les couleurs, polices et arrondis sont dans `frontend/src/app/globals.css` (bloc `@theme`).
Polices auto-hébergées (pas d'appel à Google Fonts) : Bricolage Grotesque (titres), Atkinson Hyperlegible (texte).

## À fournir par le client

Photos des ateliers, témoignages, coordonnées (`frontend/src/lib/site.ts`), textes des pages
*À propos*, *Offres pack*, *Contact*, mentions légales et politique de confidentialité.

## Production

- Strapi : `DATABASE_CLIENT=postgres` + `DATABASE_URL`, hébergement Node (VPS, Railway, Render, Strapi Cloud…), en Europe de préférence (RGPD).
- Front : `STRAPI_URL` doit pointer vers l'API ; Strapi doit être joignable **pendant le build** du front.
