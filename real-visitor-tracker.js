// Vrai tracker de visiteurs - Collecte des données réelles
class RealVisitorTracker {
    constructor() {
        this.stats = this.loadStats();
        this.currentVisitor = null;
        this.sessionId = this.getOrCreateSessionId();
        this.deviceFingerprint = this.generateDeviceFingerprint();
        this.init();
    }

    init() {
        this.trackCurrentVisit();
        this.setupPeriodicUpdates();
    }

    getOrCreateSessionId() {
        // Créer ou récupérer un ID de session persistant
        let sessionId = localStorage.getItem('visitor_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitor_session_id', sessionId);
        }
        return sessionId;
    }

    generateDeviceFingerprint() {
        // Créer une empreinte unique de l'appareil
        const components = [
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            screen.width + 'x' + screen.height,
            screen.colorDepth,
            navigator.hardwareConcurrency || 'unknown',
            navigator.deviceMemory || 'unknown',
            new Date().getTimezoneOffset(),
            navigator.cookieEnabled ? '1' : '0',
            navigator.doNotTrack || '0'
        ];
        
        // Créer un hash simple de ces composants
        const fingerprint = components.join('|');
        return this.simpleHash(fingerprint);
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    async trackCurrentVisit() {
        try {
            // Collecter les vraies informations du visiteur
            const visitorData = await this.collectVisitorData();
            
            // Vérifier si c'est un nouveau visiteur ou une actualisation
            if (this.isNewVisitor(visitorData)) {
                this.addNewVisitor(visitorData);
            } else if (this.isNewSession(visitorData)) {
                this.updateExistingVisitor(visitorData, true); // Nouvelle session
            } else {
                this.updateExistingVisitor(visitorData, false); // Même session
            }

            // Sauvegarder les statistiques
            this.saveStats();
            
            // Mettre à jour l'affichage si on est sur la page admin
            this.updateAdminDisplay();
            
        } catch (error) {
            console.error('Erreur lors du tracking:', error);
        }
    }

    async collectVisitorData() {
        const now = Date.now();
        
        // Informations de base
        const visitorData = {
            timestamp: now,
            date: new Date(now).toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language || 'unknown',
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer || 'direct',
            currentPage: window.location.pathname,
            sessionId: this.sessionId,
            deviceFingerprint: this.deviceFingerprint,
            isRefresh: this.isPageRefresh()
        };

        // Essayer d'obtenir la vraie IP et localisation
        try {
            const ipData = await this.getIPAndLocation();
            visitorData.ip = ipData.ip;
            visitorData.country = ipData.country;
            visitorData.city = ipData.city;
            visitorData.region = ipData.region;
            visitorData.timezone = ipData.timezone;
        } catch (error) {
            console.log('Impossible d\'obtenir la localisation:', error);
            visitorData.ip = 'unknown';
            visitorData.country = 'unknown';
            visitorData.city = 'unknown';
        }

        // Informations sur le navigateur
        visitorData.browser = this.detectBrowser();
        visitorData.device = this.detectDevice();
        visitorData.isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);

        return visitorData;
    }

    isPageRefresh() {
        // Détecter si c'est un refresh de page
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            return navigation.type === 'reload';
        }
        
        // Fallback : vérifier si on vient de la même page
        const currentUrl = window.location.href;
        const lastUrl = sessionStorage.getItem('last_visited_url');
        sessionStorage.setItem('last_visited_url', currentUrl);
        
        return lastUrl === currentUrl;
    }

    async getIPAndLocation() {
        try {
            // Utiliser plusieurs services pour la fiabilité
            const services = [
                'https://api.ipify.org?format=json',
                'https://api.ipapi.co/json/',
                'https://ipinfo.io/json'
            ];

            for (const service of services) {
                try {
                    const response = await fetch(service, { 
                        method: 'GET',
                        mode: 'cors',
                        timeout: 5000
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        
                        if (service.includes('ipify')) {
                            return {
                                ip: data.ip,
                                country: 'unknown',
                                city: 'unknown',
                                region: 'unknown',
                                timezone: 'unknown'
                            };
                        } else if (service.includes('ipapi')) {
                            return {
                                ip: data.ip || data.query,
                                country: data.country_name || 'unknown',
                                city: data.city || 'unknown',
                                region: data.region_name || 'unknown',
                                timezone: data.timezone || 'unknown'
                            };
                        } else if (service.includes('ipinfo')) {
                            return {
                                ip: data.ip,
                                country: data.country || 'unknown',
                                city: data.city || 'unknown',
                                region: data.region || 'unknown',
                                timezone: data.timezone || 'unknown'
                            };
                        }
                    }
                } catch (error) {
                    console.log(`Service ${service} échoué:`, error);
                    continue;
                }
            }
            
            throw new Error('Aucun service de géolocalisation disponible');
            
        } catch (error) {
            throw error;
        }
    }

    detectBrowser() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        
        return 'Unknown';
    }

    detectDevice() {
        const userAgent = navigator.userAgent;
        
        if (/iPad/.test(userAgent)) return 'iPad';
        if (/iPhone/.test(userAgent)) return 'iPhone';
        if (/Android/.test(userAgent)) return 'Android';
        if (/Windows/.test(userAgent)) return 'Windows';
        if (/Mac/.test(userAgent)) return 'Mac';
        if (/Linux/.test(userAgent)) return 'Linux';
        
        return 'Unknown';
    }

    isNewVisitor(visitorData) {
        // Logique simplifiée : compter uniquement les adresses IP différentes
        const existingVisitor = this.stats.visitors.find(v => 
            v.ip === visitorData.ip && v.ip !== 'unknown'
        );
        
        return !existingVisitor;
    }

    isNewSession(visitorData) {
        // Vérifier si c'est une nouvelle session (même IP, nouvelle session)
        const existingVisitor = this.stats.visitors.find(v => 
            v.ip === visitorData.ip && v.ip !== 'unknown'
        );
        
        if (existingVisitor) {
            // Vérifier si la session a changé
            return existingVisitor.sessionId !== visitorData.sessionId;
        }
        
        return false;
    }

    addNewVisitor(visitorData) {
        // Ajouter le nouveau visiteur
        this.stats.visitors.unshift({
            id: this.stats.visitors.length + 1,
            ...visitorData,
            visitCount: 1,
            firstVisit: visitorData.timestamp,
            lastVisit: visitorData.timestamp,
            sessions: [visitorData.sessionId],
            pagesVisited: [visitorData.currentPage]
        });

        // Incrémenter les compteurs
        this.stats.totalVisits++;
        this.stats.uniqueVisitors++;
        
        // Ajouter le pays s'il est nouveau
        if (visitorData.country && visitorData.country !== 'unknown') {
            if (!this.stats.countries.includes(visitorData.country)) {
                this.stats.countries.push(visitorData.country);
            }
        }

        // Limiter le nombre de visiteurs stockés
        if (this.stats.visitors.length > 1000) {
            this.stats.visitors = this.stats.visitors.slice(0, 1000);
        }

        // Mettre à jour la dernière visite
        this.stats.lastVisit = visitorData.timestamp;
        
        console.log('🆕 Nouveau visiteur détecté:', {
            device: visitorData.device,
            browser: visitorData.browser,
            ip: visitorData.ip,
            fingerprint: visitorData.deviceFingerprint
        });
    }

    updateExistingVisitor(visitorData, isNewSession = false) {
        // Trouver le visiteur existant basé sur l'IP uniquement
        const existingVisitor = this.stats.visitors.find(v => 
            v.ip === visitorData.ip && v.ip !== 'unknown'
        );

        if (existingVisitor) {
            // Mettre à jour les informations
            existingVisitor.lastVisit = visitorData.timestamp;
            existingVisitor.visitCount = (existingVisitor.visitCount || 1) + 1;
            existingVisitor.pagesVisited = existingVisitor.pagesVisited || [];
            
            // Ajouter la page actuelle si elle n'est pas déjà visitée
            if (!existingVisitor.pagesVisited.includes(visitorData.currentPage)) {
                existingVisitor.pagesVisited.push(visitorData.currentPage);
            }

            // Gérer les sessions
            if (isNewSession && !existingVisitor.sessions.includes(visitorData.sessionId)) {
                existingVisitor.sessions.push(visitorData.sessionId);
                console.log('🔄 Nouvelle session pour un visiteur existant');
            }

            // Ne pas incrémenter le total des visites pour les refreshes
            if (!visitorData.isRefresh) {
                this.stats.totalVisits++;
                console.log('📊 Visite mise à jour (pas de refresh)');
            } else {
                console.log('🔄 Refresh détecté - pas de nouvelle visite comptée');
            }
        }

        // Mettre à jour la dernière visite
        this.stats.lastVisit = visitorData.timestamp;
    }

    loadStats() {
        try {
            const saved = localStorage.getItem('real_visitor_stats');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des stats:', error);
        }

        // Statistiques par défaut (vraies)
        return {
            totalVisits: 0,
            uniqueVisitors: 0,
            countries: [],
            visitors: [],
            lastVisit: null,
            created: Date.now(),
            lastUpdated: Date.now()
        };
    }

    saveStats() {
        try {
            this.stats.lastUpdated = Date.now();
            localStorage.setItem('real_visitor_stats', JSON.stringify(this.stats));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des stats:', error);
        }
    }

    updateAdminDisplay() {
        // Mettre à jour l'affichage admin si on est sur la page admin
        if (window.location.pathname.includes('admin-stats.html')) {
            // Déclencher une mise à jour de l'affichage
            if (window.adminStats) {
                window.adminStats.refreshStats();
            }
        }
    }

    setupPeriodicUpdates() {
        // Mettre à jour les stats toutes les 5 minutes (pas à chaque refresh)
        setInterval(() => {
            // Ne pas tracker automatiquement, seulement si demandé
            console.log('⏰ Mise à jour périodique des stats');
        }, 5 * 60 * 1000);
    }

    // Fonctions utilitaires pour l'admin
    getStats() {
        return this.stats;
    }

    getTodayVisits() {
        const today = new Date().toDateString();
        return this.stats.visitors.filter(v => 
            new Date(v.lastVisit).toDateString() === today
        ).length;
    }

    getThisWeekVisits() {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return this.stats.visitors.filter(v => v.lastVisit > weekAgo).length;
    }

    getThisMonthVisits() {
        const monthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        return this.stats.visitors.filter(v => v.lastVisit > monthAgo).length;
    }

    getRefreshCount() {
        // Compter combien de refreshes ont été détectés
        return this.stats.visitors.filter(v => v.isRefresh).length;
    }

    // Fonction pour forcer la détection d'un nouveau visiteur (test)
    forceNewVisitorDetection() {
        // Générer une nouvelle empreinte d'appareil
        this.deviceFingerprint = this.generateDeviceFingerprint();
        console.log('🔄 Nouvelle empreinte d\'appareil générée:', this.deviceFingerprint);
        
        // Forcer un nouveau tracking
        this.trackCurrentVisit();
    }

    exportData() {
        return {
            stats: this.stats,
            exportDate: new Date().toISOString(),
            summary: {
                totalVisits: this.stats.totalVisits,
                uniqueVisitors: this.stats.uniqueVisitors,
                countriesCount: this.stats.countries.length,
                todayVisits: this.getTodayVisits(),
                thisWeekVisits: this.getThisWeekVisits(),
                thisMonthVisits: this.getThisMonthVisits(),
                refreshCount: this.getRefreshCount()
            }
        };
    }
}

// Initialiser le tracker
let realVisitorTracker;
document.addEventListener('DOMContentLoaded', function() {
    realVisitorTracker = new RealVisitorTracker();
    window.realVisitorTracker = realVisitorTracker;
});

// Fonction globale pour accéder au tracker
function getRealVisitorStats() {
    return realVisitorTracker ? realVisitorTracker.getStats() : null;
}

function exportRealVisitorData() {
    return realVisitorTracker ? realVisitorTracker.exportData() : null;
}

// Fonction de test pour forcer la détection d'un nouveau visiteur
function forceNewVisitor() {
    if (realVisitorTracker) {
        realVisitorTracker.forceNewVisitorDetection();
    }
}
