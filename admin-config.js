// Configuration admin
const ADMIN_CONFIG = {
    // Code d'accès secret (8 caractères)
    SECRET_CODE: 'NPK2024',
    
    // Paramètres de session
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    
    // Paramètres de sécurité
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    
    // Paramètres de l'interface
    AUTO_REFRESH_INTERVAL: 30 * 1000, // 30 secondes
    
    // Messages d'erreur
    MESSAGES: {
        CODE_INCORRECT: 'Code incorrect',
        TOO_MANY_ATTEMPTS: 'Trop de tentatives. Réessayez dans 15 minutes.',
        SESSION_EXPIRED: 'Session expirée. Veuillez vous reconnecter.',
        ACCESS_DENIED: 'Accès refusé'
    }
};

// Fonction pour changer le code secret
function changeSecretCode() {
    const newCode = prompt('Nouveau code secret (8 caractères) :');
    if (newCode && newCode.length === 8) {
        if (confirm('Êtes-vous sûr de vouloir changer le code secret ?')) {
            ADMIN_CONFIG.SECRET_CODE = newCode;
            alert('Code secret modifié avec succès !');
        }
    } else if (newCode !== null) {
        alert('Le code doit faire exactement 8 caractères');
    }
}

// Fonction pour générer une nouvelle URL secrète
function generateNewSecretPath() {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const newPath = `admin-${timestamp}-${randomString}.html`;
    
    if (confirm(`Nouvelle URL secrète générée : ${newPath}\n\nVoulez-vous créer ce fichier ?`)) {
        // Ici on pourrait créer un nouveau fichier admin avec un nouveau code
        alert('Fonctionnalité en développement');
    }
}

// Fonction pour vérifier la sécurité
function checkSecurity() {
    const session = JSON.parse(localStorage.getItem('admin_session') || '{}');
    const now = Date.now();
    
    if (session.timestamp && (now - session.timestamp > ADMIN_CONFIG.SESSION_TIMEOUT)) {
        localStorage.removeItem('admin_session');
        return false;
    }
    
    return true;
}

// Fonction pour logger les tentatives d'accès
function logAccessAttempt(success, ip = 'unknown') {
    const attempts = JSON.parse(localStorage.getItem('admin_access_attempts') || '[]');
    const now = Date.now();
    
    // Nettoyer les anciennes tentatives
    const recentAttempts = attempts.filter(attempt => 
        now - attempt.timestamp < ADMIN_CONFIG.LOCKOUT_DURATION
    );
    
    recentAttempts.push({
        timestamp: now,
        success: success,
        ip: ip
    });
    
    localStorage.setItem('admin_access_attempts', JSON.stringify(recentAttempts));
    
    // Vérifier si on doit bloquer l'accès
    const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
    if (failedAttempts.length >= ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS) {
        return false; // Accès bloqué
    }
    
    return true; // Accès autorisé
}

// Fonction pour obtenir les statistiques de sécurité
function getSecurityStats() {
    const attempts = JSON.parse(localStorage.getItem('admin_access_attempts') || '[]');
    const now = Date.now();
    
    const recentAttempts = attempts.filter(attempt => 
        now - attempt.timestamp < 24 * 60 * 60 * 1000 // 24 heures
    );
    
    return {
        totalAttempts: recentAttempts.length,
        failedAttempts: recentAttempts.filter(a => !a.success).length,
        successfulAttempts: recentAttempts.filter(a => a.success).length,
        lastAttempt: recentAttempts.length > 0 ? new Date(recentAttempts[recentAttempts.length - 1].timestamp) : null
    };
}

// Fonction pour nettoyer les logs anciens
function cleanupOldLogs() {
    const attempts = JSON.parse(localStorage.getItem('admin_access_attempts') || '[]');
    const now = Date.now();
    
    // Garder seulement les logs des 7 derniers jours
    const recentAttempts = attempts.filter(attempt => 
        now - attempt.timestamp < 7 * 24 * 60 * 60 * 1000
    );
    
    localStorage.setItem('admin_access_attempts', JSON.stringify(recentAttempts));
}

// Nettoyer les anciens logs au chargement
document.addEventListener('DOMContentLoaded', function() {
    cleanupOldLogs();
});

// Exporter les fonctions pour utilisation globale
window.ADMIN_CONFIG = ADMIN_CONFIG;
window.changeSecretCode = changeSecretCode;
window.generateNewSecretPath = generateNewSecretPath;
window.checkSecurity = checkSecurity;
window.logAccessAttempt = logAccessAttempt;
window.getSecurityStats = getSecurityStats;
