# 🔒 Système d'Administration et Tracking des Visiteurs

Ce système vous permet de suivre les visiteurs de votre site web avec un compteur de vues et de géolocalisation, accessible via une page d'administration cachée.

## 📁 Fichiers créés

- `admin-stats.html` - Page d'administration principale
- `admin-stats.js` - Logique de gestion des statistiques
- `admin-config.js` - Configuration de sécurité
- `visitor-tracker.js` - Script de tracking à intégrer dans vos pages
- `README-ADMIN.md` - Ce fichier d'instructions

## 🚀 Installation

### 1. Intégrer le tracking dans vos pages

Ajoutez cette ligne dans le `<head>` de toutes vos pages HTML :

```html
<script src="visitor-tracker.js"></script>
```

### 2. Accéder à l'administration

L'URL par défaut est : `/admin-stats.html`

**⚠️ IMPORTANT :** Changez l'URL secrète dans `admin-config.js` !

## 🔐 Sécurisation

### Changer l'URL secrète

1. Ouvrez `admin-config.js`
2. Modifiez la ligne : `secretPath: '/admin-stats-secret-2024'`
3. Choisissez une URL complexe et unique

### Ajouter un mot de passe

1. Dans `admin-config.js`, modifiez : `password: 'votre_mot_de_passe'`
2. Le mot de passe sera demandé à chaque accès

### Restreindre par IP (optionnel)

Ajoutez vos IPs autorisées dans `admin-config.js` :
```javascript
allowedIPs: ['192.168.1.1', '10.0.0.1']
```

## 📊 Fonctionnalités

### Statistiques collectées

- **Total des visites** - Nombre total de pages vues
- **Visiteurs uniques** - Basé sur l'adresse IP
- **Pays d'origine** - Géolocalisation par IP
- **Visites quotidiennes** - Statistiques journalières
- **Détails des visiteurs** - IP, localisation, timestamp
- **Temps passé** - Durée de visite par page
- **Clics sur liens** - Navigation des utilisateurs

### Services utilisés

- **IP** : api.ipify.org (gratuit)
- **Géolocalisation** : ipapi.co (gratuit, 1000 requêtes/jour)

## 🎯 Utilisation

### Accéder aux statistiques

1. Allez sur votre URL secrète (ex: `votresite.com/admin-stats-secret-2024`)
2. Si configuré, entrez votre mot de passe
3. Consultez vos statistiques en temps réel

### Exporter les données

- Cliquez sur "📥 Exporter" pour télécharger un fichier JSON
- Les données incluent toutes les statistiques collectées

### Actualisation automatique

- Les statistiques se mettent à jour toutes les 30 secondes
- Compteur en temps réel affiché en bas de page

## 🛠️ Personnalisation

### Modifier l'apparence

- Éditez le CSS dans `admin-stats.html`
- Thème actuel : style "Matrix" avec couleurs vertes
- Responsive design inclus

### Ajouter des métriques

- Modifiez `admin-stats.js` pour ajouter de nouveaux compteurs
- Les données sont stockées dans le localStorage du navigateur

### Intégrer avec un serveur

- Modifiez `visitor-tracker.js` pour envoyer les données à votre serveur
- Utilisez la fonction `sendToServer()` comme point de départ

## 🔒 Sécurité

### Bonnes pratiques

1. **Changez l'URL secrète** immédiatement
2. **Utilisez un mot de passe fort**
3. **Ne partagez jamais** l'URL d'administration
4. **Surveillez les accès** via les logs de votre serveur
5. **Sauvegardez régulièrement** les données exportées

### Limitations

- Les données sont stockées localement (localStorage)
- La géolocalisation par IP n'est pas 100% précise
- Les services gratuits ont des limites de requêtes

## 🚨 Dépannage

### Problèmes courants

**Les statistiques ne s'affichent pas**
- Vérifiez que `visitor-tracker.js` est bien inclus dans vos pages
- Ouvrez la console du navigateur pour voir les erreurs

**Géolocalisation incorrecte**
- Les services gratuits peuvent être imprécis
- Certains VPNs masquent la vraie localisation

**Page d'admin inaccessible**
- Vérifiez l'URL dans `admin-config.js`
- Assurez-vous que tous les fichiers sont présents

## 📈 Évolutions possibles

### Améliorations futures

- **Base de données** : Stockage persistant des données
- **API REST** : Interface programmatique
- **Graphiques** : Visualisations avancées avec Chart.js
- **Notifications** : Alertes par email/SMS
- **Filtres** : Recherche et tri des données
- **Export avancé** : CSV, Excel, PDF

### Intégrations

- **Google Analytics** : Synchronisation des données
- **Matomo** : Alternative open source
- **Slack/Discord** : Notifications en temps réel
- **Zapier** : Automatisation des workflows

## 📞 Support

Pour toute question ou problème :
1. Vérifiez ce README
2. Consultez la console du navigateur
3. Exportez vos données avant toute modification
4. Testez sur un environnement de développement

---

**⚠️ RAPPEL :** Changez immédiatement l'URL secrète et le mot de passe par défaut !
