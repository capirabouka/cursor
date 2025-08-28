# 🔒 Système d'Authentification Admin

## Vue d'ensemble

Ce système permet d'accéder à une page d'administration sécurisée depuis `landing.html` via un petit rond discret dans la barre de navigation.

## 🎯 Fonctionnalités

### Accès discret
- **Petit rond discret** : Un petit point de 8px de diamètre, très discret, placé à droite du lien "Contact" dans la navigation
- **Hover effect** : Le rond devient plus visible au survol (opacité et taille augmentent)
- **Code secret** : `NPK2024` (8 caractères)

### Sécurité
- **Authentification** : Code secret requis pour accéder à la page admin
- **Session** : Session de 30 minutes après authentification réussie
- **Protection** : Limitation des tentatives de connexion (5 échecs = blocage 15 min)
- **Logs** : Enregistrement de toutes les tentatives d'accès

### Interface admin
- **Dashboard** : Statistiques des visiteurs, cartes, contrôles
- **Déconnexion** : Bouton de déconnexion en haut à droite
- **Export** : Export des données en JSON
- **Actualisation** : Mise à jour automatique toutes les 30 secondes

## 📁 Fichiers créés

1. **`admin-auth.js`** - Système d'authentification principal
2. **`admin-config.js`** - Configuration et paramètres de sécurité
3. **`admin-stats.js`** - Gestion des statistiques et interface admin
4. **`admin-stats.html`** - Page d'administration (déjà existante, modifiée)

## 🔑 Comment utiliser

### 1. Accès depuis landing.html
- Cliquez sur le petit rond discret à droite de "Contact" dans la navigation
- Entrez le code : `NPK2024`
- Vous êtes redirigé vers `admin-stats.html`

### 2. Page d'administration
- **Authentification automatique** : Si vous avez déjà saisi le code, vous êtes automatiquement connecté
- **Session** : Restez connecté pendant 30 minutes
- **Déconnexion** : Cliquez sur le bouton rouge "🚪 Déconnexion"

### 3. Fonctionnalités admin
- **Statistiques** : Voir les visites, visiteurs uniques, pays, etc.
- **Visiteurs** : Liste des derniers visiteurs avec localisation
- **Export** : Télécharger toutes les données en JSON
- **Nettoyage** : Effacer toutes les données (irréversible)

## ⚙️ Configuration

### Changer le code secret
```javascript
// Dans admin-config.js
SECRET_CODE: 'VOTRE_CODE_ICI'
```

### Paramètres de sécurité
```javascript
// Dans admin-config.js
MAX_LOGIN_ATTEMPTS: 5,           // Tentatives max avant blocage
LOCKOUT_DURATION: 15 * 60 * 1000, // Durée du blocage (15 min)
SESSION_TIMEOUT: 30 * 60 * 1000,  // Durée de session (30 min)
```

## 🚨 Sécurité

### Limitations
- **Frontend uniquement** : L'authentification se fait côté client
- **localStorage** : Les sessions sont stockées localement
- **Code en clair** : Le code secret est visible dans le code source

### Recommandations pour la production
- **Backend** : Implémenter l'authentification côté serveur
- **HTTPS** : Utiliser HTTPS pour sécuriser les communications
- **Hachage** : Hasher les mots de passe/codes
- **Rate limiting** : Limiter les tentatives côté serveur

## 🎨 Personnalisation

### Style du rond discret
```css
/* Dans landing.html */
.admin-access {
    width: 8px;                    /* Taille du rond */
    height: 8px;
    background: rgba(255, 255, 255, 0.3); /* Couleur discrète */
    border-radius: 50%;            /* Forme ronde */
    cursor: pointer;               /* Curseur pointer */
    transition: all 0.3s ease;     /* Animation */
    margin: 0 0.5rem;             /* Espacement */
}
```

### Interface de connexion
```css
/* Dans admin-auth.js */
.login-box {
    background: rgba(0, 0, 0, 0.8);  /* Fond sombre */
    border: 2px solid #00ff41;        /* Bordure verte */
    border-radius: 15px;              /* Coins arrondis */
}
```

## 🔧 Dépannage

### Problèmes courants
1. **Code non reconnu** : Vérifiez que vous tapez exactement `NPK2024`
2. **Page blanche** : Vérifiez que tous les fichiers JS sont bien chargés
3. **Erreurs console** : Ouvrez la console du navigateur pour voir les erreurs

### Vérifications
- Tous les fichiers sont-ils présents ?
- Les chemins dans les `<script>` sont-ils corrects ?
- Le navigateur supporte-t-il ES6 et localStorage ?

## 📱 Responsive

Le système est entièrement responsive et fonctionne sur :
- **Desktop** : Interface complète
- **Tablet** : Adaptation automatique
- **Mobile** : Interface optimisée pour petits écrans

## 🔄 Mise à jour

Pour mettre à jour le système :
1. Modifiez les fichiers de configuration
2. Testez sur une page de développement
3. Déployez en production
4. Vérifiez que l'authentification fonctionne

---

**Note** : Ce système est conçu pour un usage personnel ou de démonstration. Pour un usage en production, renforcez la sécurité selon vos besoins.
