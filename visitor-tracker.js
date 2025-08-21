// Script de tracking des visiteurs - À intégrer dans toutes les pages
class VisitorTracker {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const visitorData = await this.collectVisitorData();
            this.saveVisitorData(visitorData);
        } catch (error) {
            console.log('Erreur lors du tracking:', error);
        }
    }

    async collectVisitorData() {
        const data = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer || 'direct',
            currentPage: window.location.pathname,
            ip: await this.getIPAddress(),
            location: await this.getLocation()
        };

        return data;
    }

    async getIPAddress() {
        try {
            // Utiliser un service gratuit pour obtenir l'IP
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    async getLocation() {
        try {
            // Utiliser un service gratuit pour la géolocalisation par IP
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            return {
                country: data.country_name || 'Inconnu',
                city: data.city || 'Inconnu',
                region: data.region || 'Inconnu',
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone
            };
        } catch (error) {
            return {
                country: 'Inconnu',
                city: 'Inconnu',
                region: 'Inconnu'
            };
        }
    }

    saveVisitorData(visitorData) {
        try {
            // Sauvegarder dans le localStorage
            const existingData = JSON.parse(localStorage.getItem('visitorStats') || '{}');
            
            if (!existingData.visitors) {
                existingData.visitors = [];
            }
            
            // Ajouter le nouveau visiteur
            existingData.visitors.unshift(visitorData);
            
            // Garder seulement les 1000 derniers visiteurs
            if (existingData.visitors.length > 1000) {
                existingData.visitors = existingData.visitors.slice(0, 1000);
            }
            
            // Mettre à jour les statistiques
            existingData.totalVisits = (existingData.totalVisits || 0) + 1;
            existingData.lastVisit = new Date().toISOString();
            
            // Ajouter aux visiteurs uniques
            if (!existingData.uniqueVisitors) {
                existingData.uniqueVisitors = new Set();
            }
            existingData.uniqueVisitors.add(visitorData.ip);
            
            // Ajouter le pays
            if (!existingData.countries) {
                existingData.countries = new Set();
            }
            if (visitorData.location && visitorData.location.country) {
                existingData.countries.add(visitorData.location.country);
            }
            
            // Convertir les Sets en Arrays pour le localStorage
            const dataToSave = {
                ...existingData,
                uniqueVisitors: Array.from(existingData.uniqueVisitors),
                countries: Array.from(existingData.countries)
            };
            
            localStorage.setItem('visitorStats', JSON.stringify(dataToSave));
            
            // Optionnel: Envoyer les données à un serveur si nécessaire
            this.sendToServer(visitorData);
            
        } catch (error) {
            console.log('Erreur lors de la sauvegarde:', error);
        }
    }

    async sendToServer(visitorData) {
        // Cette fonction peut être utilisée pour envoyer les données à votre serveur
        // Par exemple, pour une analyse plus approfondie
        try {
            // Exemple d'envoi à un endpoint (à configurer selon vos besoins)
            // await fetch('/api/track-visitor', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(visitorData)
            // });
        } catch (error) {
            // Silencieux - ne pas bloquer l'expérience utilisateur
        }
    }
}

// Initialiser le tracker automatiquement
document.addEventListener('DOMContentLoaded', () => {
    new VisitorTracker();
});

// Également tracker les changements de page (pour les SPA)
if (window.history && window.history.pushState) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
        originalPushState.apply(this, args);
        // Tracker le changement de page
        setTimeout(() => {
            new VisitorTracker();
        }, 100);
    };
}

// Tracker les clics sur les liens
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href) {
        // Tracker les clics sur les liens
        const linkData = {
            type: 'link_click',
            url: e.target.href,
            text: e.target.textContent,
            timestamp: new Date().toISOString()
        };
        
        try {
            const existingData = JSON.parse(localStorage.getItem('visitorStats') || '{}');
            if (!existingData.linkClicks) {
                existingData.linkClicks = [];
            }
            existingData.linkClicks.unshift(linkData);
            
            // Garder seulement les 100 derniers clics
            if (existingData.linkClicks.length > 100) {
                existingData.linkClicks = existingData.linkClicks.slice(0, 100);
            }
            
            localStorage.setItem('visitorStats', JSON.stringify(existingData));
        } catch (error) {
            // Silencieux
        }
    }
});

// Tracker le temps passé sur la page
let pageStartTime = Date.now();
window.addEventListener('beforeunload', () => {
    const timeSpent = Date.now() - pageStartTime;
    
    try {
        const existingData = JSON.parse(localStorage.getItem('visitorStats') || '{}');
        if (!existingData.pageViews) {
            existingData.pageViews = [];
        }
        
        existingData.pageViews.push({
            page: window.location.pathname,
            timeSpent: timeSpent,
            timestamp: new Date().toISOString()
        });
        
        // Garder seulement les 1000 dernières vues
        if (existingData.pageViews.length > 1000) {
            existingData.pageViews = existingData.pageViews.slice(-1000);
        }
        
        localStorage.setItem('visitorStats', JSON.stringify(existingData));
    } catch (error) {
        // Silencieux
    }
});
