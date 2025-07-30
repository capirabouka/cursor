# Déploiement Netlify - Guide Rapide

## Étapes pour déployer sur Netlify :

### 1. Préparer le projet
- Tous les fichiers sont prêts dans ce dossier
- Le fichier `netlify.toml` est configuré pour optimiser les fichiers audio
- La page d'accueil est `index.html`

### 2. Déployer sur Netlify
1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur "Sign up" ou connectez-vous
3. Cliquez sur "Add new site" → "Deploy manually"
4. Glissez-déposez tout le contenu de ce dossier dans la zone de déploiement
5. Attendez le déploiement (peut prendre quelques minutes à cause des gros fichiers audio)

### 3. Configuration automatique
- Le site sera accessible via une URL Netlify (ex: `https://random-name.netlify.app`)
- Vous pouvez personnaliser l'URL dans les paramètres du site
- Les fichiers audio seront optimisés pour le streaming

### 4. Avantages de Netlify
- ✅ Support des gros fichiers (275MB de musique)
- ✅ CDN global pour un chargement rapide
- ✅ HTTPS automatique
- ✅ Déploiement instantané
- ✅ Pas de limite de bande passante

### 5. Structure du projet
```
├── index.html (page d'accueil)
├── musique.html (page musique avec lecteur audio)
├── MUSIQUES/ (dossier avec tous les fichiers audio)
├── assets/ (images et autres ressources)
├── netlify.toml (configuration Netlify)
└── ... (autres fichiers)
```

### 6. Test après déploiement
- Vérifiez que la page d'accueil se charge
- Testez le lecteur audio sur la page musique
- Vérifiez que tous les fichiers audio se chargent correctement 