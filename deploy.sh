#!/bin/bash

echo "🚀 Démarrage du déploiement Netlify..."
echo "📁 Vérification des fichiers..."

# Vérifier que les fichiers essentiels existent
if [ ! -f "index.html" ]; then
    echo "❌ Erreur: index.html manquant"
    exit 1
fi

if [ ! -f "musique.html" ]; then
    echo "❌ Erreur: musique.html manquant"
    exit 1
fi

if [ ! -d "MUSIQUES" ]; then
    echo "❌ Erreur: dossier MUSIQUES manquant"
    exit 1
fi

if [ ! -f "netlify.toml" ]; then
    echo "❌ Erreur: netlify.toml manquant"
    exit 1
fi

echo "✅ Tous les fichiers essentiels sont présents"
echo "📊 Taille du dossier MUSIQUES:"
du -sh MUSIQUES/

echo ""
echo "🎵 Fichiers audio trouvés:"
find MUSIQUES/ -name "*.mp3" -o -name "*.wav" -o -name "*.aif" -o -name "*.aiff" | wc -l

echo ""
echo "📋 Instructions pour le déploiement:"
echo "1. Allez sur https://app.netlify.com"
echo "2. Cliquez sur votre site anouchelelong.com"
echo "3. Allez dans l'onglet 'Deploys'"
echo "4. Cliquez sur 'Deploy manually'"
echo "5. Glissez-déposez TOUS les fichiers de ce dossier"
echo "6. Attendez 10-15 minutes pour le déploiement"
echo ""
echo "🔗 Votre site sera accessible sur: https://anouchelelong.com"
echo "🎵 La page musique sera sur: https://anouchelelong.com/musique.html" 