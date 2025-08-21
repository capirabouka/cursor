// Configuration de sécurité pour la page d'administration
const ADMIN_CONFIG = {
    // URL secrète pour accéder à l'admin (changez ceci !)
    secretPath: '/admin-stats-secret-2024',
    
    // Mot de passe optionnel (laissez vide pour désactiver)
    password: '',
    
    // Liste des IPs autorisées (optionnel, laissez vide pour désactiver)
    allowedIPs: [],
    
    // Clé de session (changez ceci !)
    sessionKey: 'admin_session_2024_secret_key',
    
    // Durée de la session en heures
    sessionDuration: 24,
    
    // Services de géolocalisation à utiliser
    geoServices: {
        ipService: 'https://api.ipify.org?format=json',
        locationService: 'https://ipapi.co/json/'
    },
    
    // Limites de stockage
    limits: {
        maxVisitors: 1000,
        maxPageViews: 1000,
        maxLinkClicks: 100
    }
};

// Fonction de vérification d'accès
function checkAdminAccess() {
    // Vérifier si on est sur la page d'admin
    if (!window.location.pathname.includes('admin-stats')) {
        return true;
    }
    
    // Vérifier la session
    const session = getSession();
    if (session && session.expires > Date.now()) {
        return true;
    }
    
    // Vérifier le mot de passe si configuré
    if (ADMIN_CONFIG.password) {
        const inputPassword = prompt('Mot de passe requis pour accéder à l\'administration:');
        if (inputPassword === ADMIN_CONFIG.password) {
            createSession();
            return true;
        } else {
            alert('Accès refusé');
            window.location.href = '/';
            return false;
        }
    }
    
    // Vérifier l'IP si configuré
    if (ADMIN_CONFIG.allowedIPs.length > 0) {
        // Cette vérification nécessite un serveur backend
        // Pour l'instant, on utilise seulement la session
    }
    
    return true;
}

// Gestion des sessions
function createSession() {
    const session = {
        created: Date.now(),
        expires: Date.now() + (ADMIN_CONFIG.sessionDuration * 60 * 60 * 1000)
    };
    localStorage.setItem(ADMIN_CONFIG.sessionKey, JSON.stringify(session));
}

function getSession() {
    try {
        const session = localStorage.getItem(ADMIN_CONFIG.sessionKey);
        return session ? JSON.parse(session) : null;
    } catch (error) {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem(ADMIN_CONFIG.sessionKey);
}

// Fonction de déconnexion
function logout() {
    clearSession();
    alert('Session fermée');
    window.location.href = '/';
}

// Vérifier l'accès au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAccess()) {
        return;
    }
    
    // Ajouter le bouton de déconnexion si on est sur la page admin
    if (window.location.pathname.includes('admin-stats')) {
        addLogoutButton();
    }
});

function addLogoutButton() {
    const header = document.querySelector('.header');
    if (header) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = '🚪 Déconnexion';
        logoutBtn.className = 'btn';
        logoutBtn.style.position = 'absolute';
        logoutBtn.style.top = '20px';
        logoutBtn.style.right = '20px';
        logoutBtn.onclick = logout;
        
        header.style.position = 'relative';
        header.appendChild(logoutBtn);
    }
}

// Fonction pour changer le mot de passe
function changePassword() {
    const newPassword = prompt('Nouveau mot de passe:');
    if (newPassword && newPassword.length >= 4) {
        ADMIN_CONFIG.password = newPassword;
        alert('Mot de passe mis à jour');
        // En production, sauvegardez ceci dans un fichier de configuration sécurisé
    } else {
        alert('Mot de passe invalide (minimum 4 caractères)');
    }
}

// Fonction pour générer une nouvelle URL secrète
function generateNewSecretPath() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '/admin-';
    for (let i = 0; i < 20; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    ADMIN_CONFIG.secretPath = result;
    alert(`Nouvelle URL secrète: ${result}\n\n⚠️ Notez-la et changez-la dans le fichier admin-config.js !`);
}

// Exposer les fonctions globalement
window.ADMIN_CONFIG = ADMIN_CONFIG;
window.changePassword = changePassword;
window.generateNewSecretPath = generateNewSecretPath;
