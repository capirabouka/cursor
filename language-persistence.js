// Système de persistance de la langue
class LanguageManager {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'fr';
        this.init();
    }

    // Récupérer la langue stockée dans localStorage
    getStoredLanguage() {
        return localStorage.getItem('selectedLanguage');
    }

    // Sauvegarder la langue dans localStorage
    setStoredLanguage(lang) {
        localStorage.setItem('selectedLanguage', lang);
        this.currentLang = lang;
    }

    // Traduire la page avec la langue donnée
    translatePage(lang) {
        if (!translations || !translations[lang]) {
            console.warn(`Traductions non disponibles pour la langue: ${lang}`);
            return;
        }

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Mettre à jour le bouton de langue
        const languageButton = document.querySelector('.language-button');
        if (languageButton) {
            languageButton.textContent = lang.toUpperCase();
        }

        // Sauvegarder la langue
        this.setStoredLanguage(lang);
        
        console.log(`Langue appliquée: ${lang}`);
    }

    // Initialiser le gestionnaire de langue
    init() {
        // Appliquer la langue stockée au chargement de la page
        this.translatePage(this.currentLang);

        // Configurer les événements de clic pour les liens de langue
        document.addEventListener('DOMContentLoaded', () => {
            // Appliquer la langue une seconde fois pour s'assurer qu'elle est bien appliquée
            setTimeout(() => {
                this.translatePage(this.currentLang);
            }, 100);

            const languageLinks = document.querySelectorAll('.language-dropdown a');
            
            languageLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = link.getAttribute('data-lang');
                    this.translatePage(lang);
                });
            });
        });
    }

    // Obtenir la langue actuelle
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Initialiser le gestionnaire de langue globalement
window.languageManager = new LanguageManager(); 