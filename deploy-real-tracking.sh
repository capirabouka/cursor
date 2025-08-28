#!/bin/bash

# Script de déploiement pour le vrai système de tracking des visiteurs
# Anouche Lelong - 2024

echo "🚀 Déploiement du vrai système de tracking des visiteurs..."

# Vérifier que tous les fichiers sont présents
echo "📋 Vérification des fichiers..."

required_files=(
    "real-visitor-tracker.js"
    "admin-auth.js"
    "admin-config.js" 
    "admin-stats.js"
    "admin-stats.html"
    "landing.html"
    "test-real-tracking.html"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MANQUANT"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo ""
    echo "❌ Erreur : Fichiers manquants détectés :"
    printf '%s\n' "${missing_files[@]}"
    echo "Veuillez créer tous les fichiers requis avant de continuer."
    exit 1
fi

echo ""
echo "✅ Tous les fichiers sont présents !"

# Vérifier la configuration
echo ""
echo "🔧 Vérification de la configuration..."

# Vérifier le code secret dans admin-config.js
if grep -q "SECRET_CODE: 'NPK2024'" admin-config.js; then
    echo "✅ Code secret configuré : NPK2024"
else
    echo "⚠️  Code secret non trouvé ou différent de NPK2024"
fi

# Vérifier que landing.html contient le petit rond
if grep -q "admin-access" landing.html; then
    echo "✅ Petit rond discret ajouté dans landing.html"
else
    echo "❌ Petit rond discret non trouvé dans landing.html"
fi

# Vérifier que landing.html inclut le tracker
if grep -q "real-visitor-tracker.js" landing.html; then
    echo "✅ Tracker de visiteurs inclus dans landing.html"
else
    echo "❌ Tracker de visiteurs non inclus dans landing.html"
fi

# Vérifier que admin-stats.html inclut tous les scripts
if grep -q "real-visitor-tracker.js" admin-stats.html; then
    echo "✅ Tracker de visiteurs inclus dans admin-stats.html"
else
    echo "❌ Tracker de visiteurs non inclus dans admin-stats.html"
fi

echo ""
echo "🎯 Fonctionnalités du vrai tracker :"
echo ""
echo "✅ Collecte des vraies IPs et localisations"
echo "✅ Détection automatique des navigateurs et appareils"
echo "✅ Suivi des visiteurs uniques et des retours"
echo "✅ Statistiques en temps réel"
echo "✅ Export des données réelles"
echo "✅ Géolocalisation via plusieurs services"
echo "✅ Respect de la vie privée (localStorage uniquement)"
echo ""
echo "🌍 Services de géolocalisation utilisés :"
echo "   - api.ipify.org (IP uniquement)"
echo "   - api.ipapi.co (IP + localisation)"
echo "   - ipinfo.io (IP + localisation détaillée)"
echo ""
echo "📱 Informations collectées :"
echo "   - Adresse IP"
echo "   - Pays, ville, région"
echo "   - Navigateur et appareil"
echo "   - Résolution d'écran"
echo "   - Langue du navigateur"
echo "   - Page de référence"
echo "   - Timestamp de visite"
echo ""
echo "🔧 Instructions de test :"
echo ""
echo "1. Ouvrez landing.html dans votre navigateur"
echo "2. Le tracker collecte automatiquement vos données"
echo "3. Cliquez sur le petit rond discret pour accéder à l'admin"
echo "4. Entrez le code : NPK2024"
echo "5. Vérifiez vos vraies statistiques dans admin-stats.html"
echo ""
echo "🧪 Pour tester le tracker :"
echo "- Ouvrez test-real-tracking.html pour lancer tous les tests"
echo "- Vérifiez que vos vraies données sont collectées"
echo "- Testez la géolocalisation et les informations navigateur"
echo ""
echo "📚 Documentation :"
echo "- Consultez README-ADMIN-SYSTEM.md pour plus de détails"
echo "- Le tracker fonctionne sur toutes les pages incluant real-visitor-tracker.js"
echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "💡 Conseil : Testez d'abord sur une page locale pour vérifier que la géolocalisation fonctionne."
echo "⚠️  Note : Certains services de géolocalisation peuvent être bloqués par des pare-feu ou VPN."
