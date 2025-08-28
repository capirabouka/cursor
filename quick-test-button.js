// Script de test rapide pour le bouton admin
console.log('🔍 Test du bouton admin en cours...');

// Attendre que la page soit chargée
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page chargée, test du bouton admin...');
    
    // Chercher le bouton admin
    const adminButton = document.querySelector('.admin-access');
    
    if (adminButton) {
        console.log('✅ Bouton admin trouvé !');
        console.log('📍 Position:', adminButton.getBoundingClientRect());
        console.log('🎨 Styles appliqués:', window.getComputedStyle(adminButton));
        
        // Vérifier que la fonction existe
        if (typeof showAdminAccess === 'function') {
            console.log('✅ Fonction showAdminAccess() trouvée');
            
            // Tester le clic
            console.log('🧪 Test du clic sur le bouton...');
            adminButton.click();
            
        } else {
            console.error('❌ Fonction showAdminAccess() non trouvée !');
        }
        
    } else {
        console.error('❌ Bouton admin non trouvé !');
        
        // Chercher tous les éléments avec la classe admin-access
        const allAdminElements = document.querySelectorAll('.admin-access');
        console.log('🔍 Éléments trouvés avec la classe admin-access:', allAdminElements.length);
        
        // Chercher dans le HTML
        const htmlContent = document.documentElement.innerHTML;
        if (htmlContent.includes('admin-access')) {
            console.log('✅ Classe admin-access trouvée dans le HTML');
        } else {
            console.error('❌ Classe admin-access non trouvée dans le HTML');
        }
        
        if (htmlContent.includes('showAdminAccess')) {
            console.log('✅ Fonction showAdminAccess trouvée dans le HTML');
        } else {
            console.error('❌ Fonction showAdminAccess non trouvée dans le HTML');
        }
    }
    
    // Vérifier le CSS
    const styleSheets = document.styleSheets;
    console.log('📚 Feuilles de style chargées:', styleSheets.length);
    
    // Chercher les règles CSS pour admin-access
    let adminAccessRules = [];
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules;
            if (rules) {
                for (let j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText && rules[j].selectorText.includes('admin-access')) {
                        adminAccessRules.push(rules[j]);
                    }
                }
            }
        } catch (e) {
            console.log('⚠️ Impossible d\'accéder aux règles CSS de la feuille', i);
        }
    }
    
    if (adminAccessRules.length > 0) {
        console.log('✅ Règles CSS trouvées pour admin-access:', adminAccessRules.length);
        adminAccessRules.forEach((rule, index) => {
            console.log(`   Règle ${index + 1}:`, rule.selectorText, rule.cssText);
        });
    } else {
        console.error('❌ Aucune règle CSS trouvée pour admin-access');
    }
});

// Fonction de test manuel
function testAdminButton() {
    console.log('🧪 Test manuel du bouton admin...');
    
    const adminButton = document.querySelector('.admin-access');
    if (adminButton) {
        console.log('✅ Bouton trouvé, test du clic...');
        adminButton.click();
    } else {
        console.error('❌ Bouton non trouvé');
    }
}

// Fonction de test de la fonction
function testShowAdminFunction() {
    console.log('🧪 Test de la fonction showAdminAccess...');
    
    if (typeof showAdminAccess === 'function') {
        console.log('✅ Fonction trouvée, test d\'appel...');
        try {
            showAdminAccess();
        } catch (error) {
            console.error('❌ Erreur lors de l\'appel:', error);
        }
    } else {
        console.error('❌ Fonction showAdminAccess non trouvée');
    }
}

// Ajouter les fonctions de test à la console
console.log('🔧 Fonctions de test disponibles:');
console.log('   testAdminButton() - Test du bouton');
console.log('   testShowAdminFunction() - Test de la fonction');
console.log('   showAdminAccess() - Appel direct de la fonction');

console.log('📋 Instructions de test:');
console.log('1. Ouvrez la console du navigateur (F12)');
console.log('2. Regardez les messages ci-dessus');
console.log('3. Utilisez les fonctions de test si nécessaire');
console.log('4. Vérifiez que le petit rond est visible et cliquable');
