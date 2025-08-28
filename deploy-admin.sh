#!/bin/bash

# Script de déploiement pour le système d'authentification admin
# Anouche Lelong - 2024

echo "🚀 Déploiement du système d'authentification admin..."

# Vérifier que tous les fichiers sont présents
echo "📋 Vérification des fichiers..."

required_files=(
    "admin-auth.js"
    "admin-config.js" 
    "admin-stats.js"
    "admin-stats.html"
    "landing.html"
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

# Vérifier que admin-stats.html inclut les scripts
if grep -q "admin-auth.js" admin-stats.html; then
    echo "✅ Script admin-auth.js inclus dans admin-stats.html"
else
    echo "❌ Script admin-auth.js non inclus dans admin-stats.html"
fi

echo ""
echo "🎯 Instructions de test :"
echo ""
echo "1. Ouvrez landing.html dans votre navigateur"
echo "2. Cherchez le petit rond discret à droite de 'Contact' dans la navigation"
echo "3. Cliquez dessus et entrez le code : NPK2024"
echo "4. Vous devriez être redirigé vers admin-stats.html"
echo ""
echo "🔧 Pour tester le système complet :"
echo "- Ouvrez test-admin.html pour lancer tous les tests"
echo "- Vérifiez que admin-stats.html fonctionne avec l'authentification"
echo ""
echo "📚 Documentation :"
echo "- Consultez README-ADMIN-SYSTEM.md pour plus de détails"
echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "💡 Conseil : Testez d'abord sur une page locale avant de déployer en production."
