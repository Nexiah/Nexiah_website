# Guide de configuration Git et GitHub

## Étape 1 : Configurer Git (si pas déjà fait)

```bash
# Configurer votre nom (remplacez par votre nom)
git config --global user.name "Votre Nom"

# Configurer votre email (remplacez par votre email GitHub)
git config --global user.email "votre.email@example.com"
```

## Étape 2 : Ajouter tous les fichiers au dépôt

```bash
# Depuis le dossier /Users/jonasmateus/Projects
git add .
```

## Étape 3 : Faire le premier commit

```bash
git commit -m "Initial commit: Strapi + Next.js setup"
```

## Étape 4 : Créer un dépôt sur GitHub

1. Allez sur https://github.com
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Donnez un nom à votre dépôt (ex: `strapi-nextjs-project`)
4. **Ne cochez PAS** "Initialize this repository with a README" (on a déjà un README)
5. Cliquez sur **"Create repository"**

## Étape 5 : Connecter votre dépôt local à GitHub

GitHub vous donnera des commandes. Utilisez celles-ci :

```bash
# Ajouter le remote GitHub (remplacez USERNAME et REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Vérifier que c'est bien connecté
git remote -v

# Pousser votre code vers GitHub
git branch -M main
git push -u origin main
```

## Commandes Git utiles

```bash
# Voir l'état des fichiers
git status

# Ajouter des fichiers modifiés
git add .

# Faire un commit
git commit -m "Description de vos changements"

# Pousser vers GitHub
git push

# Récupérer les changements depuis GitHub
git pull
```

## Note importante

Les fichiers `.env.local` et `node_modules/` sont automatiquement ignorés grâce au `.gitignore`, donc ils ne seront pas envoyés sur GitHub (c'est normal et sécurisé).
