// Script principal pour la page admin
class AdminStats {
    constructor() {
        this.stats = {
            totalVisits: 0,
            uniqueVisitors: 0,
            countriesCount: 0,
            todayVisits: 0
        };
        this.visitors = [];
        this.autoRefreshInterval = null;
        this.init();
    }

    init() {
        this.loadStats();
        this.loadVisitors();
        this.startAutoRefresh();
        this.updateLastUpdate();
        this.setupEventListeners();
    }

    loadStats() {
        // Charger les vraies statistiques des visiteurs
        if (window.realVisitorTracker) {
            const realStats = window.realVisitorTracker.getStats();
            if (realStats) {
                this.stats = {
                    totalVisits: realStats.totalVisits || 0,
                    uniqueVisitors: realStats.uniqueVisitors || 0,
                    countriesCount: realStats.countries ? realStats.countries.length : 0,
                    todayVisits: window.realVisitorTracker.getTodayVisits() || 0
                };
            } else {
                this.stats = {
                    totalVisits: 0,
                    uniqueVisitors: 0,
                    countriesCount: 0,
                    todayVisits: 0
                };
            }
        } else {
            // Fallback si le tracker n'est pas disponible
            this.stats = {
                totalVisits: 0,
                uniqueVisitors: 0,
                countriesCount: 0,
                todayVisits: 0
            };
        }
        
        this.updateStatsDisplay();
    }

    loadVisitors() {
        // Charger les vrais visiteurs
        if (window.realVisitorTracker) {
            const realStats = window.realVisitorTracker.getStats();
            if (realStats && realStats.visitors) {
                this.visitors = realStats.visitors;
            } else {
                this.visitors = [];
            }
        } else {
            this.visitors = [];
        }
        
        this.updateVisitorsDisplay();
    }

    generateSampleVisitors() {
        const countries = ['France', 'États-Unis', 'Allemagne', 'Royaume-Uni', 'Canada', 'Australie', 'Japon', 'Brésil', 'Inde', 'Russie'];
        const cities = ['Paris', 'New York', 'Berlin', 'Londres', 'Toronto', 'Sydney', 'Tokyo', 'São Paulo', 'Mumbai', 'Moscou'];
        
        const visitors = [];
        for (let i = 0; i < 20; i++) {
            const countryIndex = Math.floor(Math.random() * countries.length);
            const timestamp = Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000; // 7 derniers jours
            
            visitors.push({
                id: i + 1,
                country: countries[countryIndex],
                city: cities[countryIndex],
                timestamp: timestamp,
                ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                userAgent: this.getRandomUserAgent()
            });
        }
        
        return visitors.sort((a, b) => b.timestamp - a.timestamp);
    }

    getRandomUserAgent() {
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
            'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
        ];
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    updateStatsDisplay() {
        document.getElementById('total-visits').textContent = this.stats.totalVisits.toLocaleString();
        document.getElementById('unique-visitors').textContent = this.stats.uniqueVisitors.toLocaleString();
        document.getElementById('countries-count').textContent = this.stats.countriesCount.toLocaleString();
        document.getElementById('today-visits').textContent = this.stats.todayVisits.toLocaleString();
    }

    updateVisitorsDisplay() {
        const container = document.getElementById('visitors-container');
        if (!container) return;

        container.innerHTML = '';
        
        // Afficher les 10 derniers visiteurs
        const recentVisitors = this.visitors.slice(0, 10);
        
        recentVisitors.forEach(visitor => {
            const visitorElement = document.createElement('div');
            visitorElement.className = 'visitor-item';
            
            const date = new Date(visitor.timestamp);
            const timeString = date.toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            visitorElement.innerHTML = `
                <div class="visitor-info">
                    <div class="visitor-location">${visitor.city}, ${visitor.country}</div>
                    <div class="visitor-time">${timeString}</div>
                </div>
                <div class="visitor-ip">${visitor.ip}</div>
            `;
            
            container.appendChild(visitorElement);
        });
    }

    updateLastUpdate() {
        const now = new Date();
        document.getElementById('last-update').textContent = now.toLocaleString('fr-FR');
        
        // Calculer la prochaine mise à jour
        const nextUpdate = new Date(now.getTime() + ADMIN_CONFIG.AUTO_REFRESH_INTERVAL);
        document.getElementById('next-update').textContent = Math.ceil(ADMIN_CONFIG.AUTO_REFRESH_INTERVAL / 1000);
    }

    startAutoRefresh() {
        this.autoRefreshInterval = setInterval(() => {
            this.refreshStats();
        }, ADMIN_CONFIG.AUTO_REFRESH_INTERVAL);
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    refreshStats() {
        // Recharger les vraies données
        this.loadStats();
        this.loadVisitors();
        this.updateStatsDisplay();
        this.updateVisitorsDisplay();
        this.updateLastUpdate();
    }

    addNewVisitor() {
        const countries = ['France', 'États-Unis', 'Allemagne', 'Royaume-Uni', 'Canada', 'Australie', 'Japon', 'Brésil', 'Inde', 'Russie'];
        const cities = ['Paris', 'New York', 'Berlin', 'Londres', 'Toronto', 'Sydney', 'Tokyo', 'São Paulo', 'Mumbai', 'Moscou'];
        
        const countryIndex = Math.floor(Math.random() * countries.length);
        const newVisitor = {
            id: this.visitors.length + 1,
            country: countries[countryIndex],
            city: cities[countryIndex],
            timestamp: Date.now(),
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            userAgent: this.getRandomUserAgent()
        };
        
        this.visitors.unshift(newVisitor);
        
        // Limiter le nombre de visiteurs stockés
        if (this.visitors.length > 100) {
            this.visitors = this.visitors.slice(0, 100);
        }
    }

    saveStats() {
        localStorage.setItem('admin_stats', JSON.stringify(this.stats));
    }

    saveVisitors() {
        localStorage.setItem('admin_visitors', JSON.stringify(this.visitors));
    }

    setupEventListeners() {
        // Gestionnaire pour le bouton d'export
        const exportBtn = document.querySelector('button[onclick="exportData()"]');
        if (exportBtn) {
            exportBtn.onclick = () => this.exportData();
        }
        
        // Gestionnaire pour le bouton de nettoyage
        const clearBtn = document.querySelector('button[onclick="clearData()"]');
        if (clearBtn) {
            clearBtn.onclick = () => this.clearData();
        }
    }

    exportData() {
        let data;
        
        if (window.realVisitorTracker) {
            // Exporter les vraies données
            data = window.realVisitorTracker.exportData();
            data.securityStats = getSecurityStats();
        } else {
            // Fallback avec les données actuelles
            data = {
                stats: this.stats,
                visitors: this.visitors,
                exportDate: new Date().toISOString(),
                securityStats: getSecurityStats(),
                note: "Données limitées - tracker non disponible"
            };
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `real-visitor-stats-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Données réelles exportées avec succès !');
    }

    clearData() {
        if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
            localStorage.removeItem('admin_stats');
            localStorage.removeItem('admin_visitors');
            localStorage.removeItem('admin_access_attempts');
            
            // Recharger la page
            window.location.reload();
        }
    }

    destroy() {
        this.stopAutoRefresh();
    }
}

// Fonctions globales pour les boutons
function refreshStats() {
    if (window.adminStats) {
        window.adminStats.refreshStats();
    }
}

function exportData() {
    if (window.adminStats) {
        window.adminStats.exportData();
    }
}

function clearData() {
    if (window.adminStats) {
        window.adminStats.clearData();
    }
}

function changePassword() {
    changeSecretCode();
}

function generateNewSecretPath() {
    if (window.generateNewSecretPath) {
        window.generateNewSecretPath();
    }
}

// Initialiser les statistiques admin quand la page est chargée
let adminStats;
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que l'authentification soit vérifiée
    setTimeout(() => {
        if (document.querySelector('.container').style.display !== 'none') {
            adminStats = new AdminStats();
            window.adminStats = adminStats;
        }
    }, 1000);
});

// Nettoyer lors de la fermeture de la page
window.addEventListener('beforeunload', function() {
    if (adminStats) {
        adminStats.destroy();
    }
});
