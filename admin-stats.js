// Script d'administration pour le compteur de vues et géolocalisation
class VisitorTracker {
    constructor() {
        this.stats = this.loadStats();
        this.updateInterval = null;
        this.countdownInterval = null;
        this.init();
    }

    init() {
        this.updateDisplay();
        this.startAutoRefresh();
        this.updateLastUpdate();
        this.startCountdown();
    }

    loadStats() {
        const saved = localStorage.getItem('visitorStats');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            totalVisits: 0,
            uniqueVisitors: new Set(),
            visitors: [],
            countries: new Set(),
            lastVisit: null,
            created: new Date().toISOString()
        };
    }

    saveStats() {
        const statsToSave = {
            ...this.stats,
            uniqueVisitors: Array.from(this.stats.uniqueVisitors),
            countries: Array.from(this.stats.countries)
        };
        localStorage.setItem('visitorStats', JSON.stringify(statsToSave));
    }

    addVisitor(visitorData) {
        // Ajouter la visite
        this.stats.totalVisits++;
        
        // Ajouter le visiteur unique
        this.stats.uniqueVisitors.add(visitorData.ip);
        
        // Ajouter le pays
        if (visitorData.country) {
            this.stats.countries.add(visitorData.country);
        }
        
        // Ajouter les détails du visiteur
        this.stats.visitors.unshift({
            ...visitorData,
            timestamp: new Date().toISOString()
        });
        
        // Garder seulement les 100 derniers visiteurs
        if (this.stats.visitors.length > 100) {
            this.stats.visitors = this.stats.visitors.slice(0, 100);
        }
        
        this.stats.lastVisit = new Date().toISOString();
        this.saveStats();
        this.updateDisplay();
    }

    updateDisplay() {
        // Mettre à jour les statistiques principales
        document.getElementById('total-visits').textContent = this.stats.totalVisits;
        document.getElementById('unique-visitors').textContent = this.stats.uniqueVisitors.size;
        document.getElementById('countries-count').textContent = this.stats.countries.size;
        
        // Calculer les visites d'aujourd'hui
        const today = new Date().toDateString();
        const todayVisits = this.stats.visitors.filter(visitor => 
            new Date(visitor.timestamp).toDateString() === today
        ).length;
        document.getElementById('today-visits').textContent = todayVisits;
        
        // Mettre à jour la liste des visiteurs
        this.updateVisitorsList();
        
        // Mettre à jour la carte
        this.updateMap();
    }

    updateVisitorsList() {
        const container = document.getElementById('visitors-container');
        const recentVisitors = this.stats.visitors.slice(0, 20); // 20 derniers
        
        if (recentVisitors.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Aucun visiteur pour le moment</p>';
            return;
        }
        
        container.innerHTML = recentVisitors.map(visitor => `
            <div class="visitor-item">
                <div class="visitor-info">
                    <div class="visitor-location">
                        ${visitor.country || 'Inconnu'} ${visitor.city ? `- ${visitor.city}` : ''}
                    </div>
                    <div class="visitor-time">
                        ${new Date(visitor.timestamp).toLocaleString('fr-FR')}
                    </div>
                </div>
                <div class="visitor-ip">${visitor.ip}</div>
            </div>
        `).join('');
    }

    updateMap() {
        const mapContainer = document.getElementById('world-map');
        const countries = Array.from(this.stats.countries);
        
        if (countries.length === 0) {
            mapContainer.innerHTML = '<p>Aucune donnée de localisation disponible</p>';
            return;
        }
        
        // Créer une représentation simple de la carte
        const mapContent = `
            <div style="text-align: center;">
                <h4>Pays des visiteurs:</h4>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 20px;">
                    ${countries.map(country => `
                        <span style="
                            background: rgba(0, 255, 65, 0.2); 
                            padding: 5px 10px; 
                            border-radius: 15px; 
                            border: 1px solid #00ff41;
                            font-size: 0.9em;
                        ">${country}</span>
                    `).join('')}
                </div>
                <p style="margin-top: 20px; color: #888;">
                    Total: ${countries.length} pays différents
                </p>
            </div>
        `;
        
        mapContainer.innerHTML = mapContent;
    }

    startAutoRefresh() {
        // Actualiser toutes les 30 secondes
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
            this.updateLastUpdate();
        }, 30000);
    }

    startCountdown() {
        this.countdownInterval = setInterval(() => {
            const now = new Date();
            const nextUpdate = new Date(now.getTime() + 30000); // 30 secondes
            const timeLeft = Math.ceil((nextUpdate - now) / 1000);
            document.getElementById('next-update').textContent = timeLeft;
        }, 1000);
    }

    updateLastUpdate() {
        const now = new Date();
        document.getElementById('last-update').textContent = now.toLocaleString('fr-FR');
    }

    destroy() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.countdownInterval) clearInterval(this.countdownInterval);
    }
}

// Fonctions globales pour les boutons
function refreshStats() {
    tracker.updateDisplay();
    tracker.updateLastUpdate();
}

function exportData() {
    const dataStr = JSON.stringify(tracker.stats, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `visitor-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function clearData() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
        localStorage.removeItem('visitorStats');
        location.reload();
    }
}

// Initialiser le tracker
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new VisitorTracker();
});

// Nettoyer à la fermeture de la page
window.addEventListener('beforeunload', () => {
    if (tracker) {
        tracker.destroy();
    }
});
