// Système d'authentification pour la page admin
class AdminAuth {
    constructor() {
        this.secretCode = 'NPK2024';
        this.sessionKey = 'admin_session';
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.init();
    }

    init() {
        // Vérifier si l'utilisateur est déjà authentifié
        if (!this.isAuthenticated()) {
            this.showLoginForm();
        } else {
            this.showAdminContent();
        }
    }

    isAuthenticated() {
        const session = this.getSession();
        if (!session) return false;
        
        // Vérifier si la session n'a pas expiré
        if (Date.now() - session.timestamp > this.sessionTimeout) {
            this.clearSession();
            return false;
        }
        
        return true;
    }

    getSession() {
        const sessionStr = localStorage.getItem(this.sessionKey);
        return sessionStr ? JSON.parse(sessionStr) : null;
    }

    setSession() {
        const session = {
            timestamp: Date.now(),
            authenticated: true
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
    }

    clearSession() {
        localStorage.removeItem(this.sessionKey);
    }

    authenticate(code) {
        if (code === this.secretCode) {
            this.setSession();
            this.showAdminContent();
            return true;
        }
        return false;
    }

    logout() {
        this.clearSession();
        this.showLoginForm();
    }

    showLoginForm() {
        // Masquer le contenu admin
        const adminContent = document.querySelector('.container');
        if (adminContent) {
            adminContent.style.display = 'none';
        }

        // Créer et afficher le formulaire de connexion
        this.createLoginForm();
    }

    createLoginForm() {
        // Supprimer l'ancien formulaire s'il existe
        const existingForm = document.getElementById('admin-login-form');
        if (existingForm) {
            existingForm.remove();
        }

        const loginForm = document.createElement('div');
        loginForm.id = 'admin-login-form';
        loginForm.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <h1>🔒 Accès Admin</h1>
                    <p>Veuillez entrer le code d'accès</p>
                    <div class="login-input-group">
                        <input type="password" id="admin-code" placeholder="Code d'accès" maxlength="8">
                        <button onclick="adminAuth.attemptLogin()">Accéder</button>
                    </div>
                    <div class="login-error" id="login-error"></div>
                    <div class="login-hint">
                        <small>Code à 8 caractères</small>
                    </div>
                </div>
            </div>
        `;

        // Ajouter le style CSS
        this.addLoginStyles();

        // Ajouter le formulaire au body
        document.body.appendChild(loginForm);

        // Focus sur l'input
        setTimeout(() => {
            const input = document.getElementById('admin-code');
            if (input) input.focus();
        }, 100);

        // Permettre l'utilisation de la touche Entrée
        document.getElementById('admin-code').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.attemptLogin();
            }
        });
    }

    attemptLogin() {
        const code = document.getElementById('admin-code').value;
        const errorDiv = document.getElementById('login-error');
        
        if (this.authenticate(code)) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        } else {
            errorDiv.textContent = 'Code incorrect';
            errorDiv.style.display = 'block';
            document.getElementById('admin-code').value = '';
            document.getElementById('admin-code').focus();
        }
    }

    showAdminContent() {
        // Supprimer le formulaire de connexion
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.remove();
        }

        // Afficher le contenu admin
        const adminContent = document.querySelector('.container');
        if (adminContent) {
            adminContent.style.display = 'block';
        }

        // Ajouter un bouton de déconnexion
        this.addLogoutButton();
    }

    addLogoutButton() {
        // Vérifier si le bouton de déconnexion existe déjà
        if (document.getElementById('logout-btn')) return;

        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.className = 'btn logout-btn';
        logoutBtn.innerHTML = '🚪 Déconnexion';
        logoutBtn.onclick = () => this.logout();

        // Ajouter le bouton dans le header
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(logoutBtn);
        }
    }

    addLoginStyles() {
        if (document.getElementById('admin-login-styles')) return;

        const style = document.createElement('style');
        style.id = 'admin-login-styles';
        style.textContent = `
            .login-container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
            }

            .login-box {
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #00ff41;
                border-radius: 15px;
                padding: 40px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
            }

            .login-box h1 {
                color: #00ff41;
                margin-bottom: 20px;
                font-size: 2em;
                text-shadow: 0 0 10px #00ff41;
            }

            .login-box p {
                color: #ffffff;
                margin-bottom: 30px;
                font-size: 1.1em;
            }

            .login-input-group {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-bottom: 20px;
            }

            .login-input-group input {
                padding: 15px;
                border: 2px solid #00ff41;
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.7);
                color: #00ff41;
                font-size: 1.1em;
                text-align: center;
                letter-spacing: 2px;
                font-family: 'Courier New', monospace;
            }

            .login-input-group input:focus {
                outline: none;
                border-color: #00ff88;
                box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
            }

            .login-input-group button {
                padding: 15px 30px;
                background: transparent;
                border: 2px solid #00ff41;
                color: #00ff41;
                border-radius: 8px;
                font-size: 1.1em;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
            }

            .login-input-group button:hover {
                background: #00ff41;
                color: #000;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 255, 65, 0.4);
            }

            .login-error {
                color: #ff4444;
                margin-bottom: 15px;
                font-size: 0.9em;
                display: none;
            }

            .login-hint {
                color: #666;
                font-size: 0.8em;
            }

            .logout-btn {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 0, 0, 0.2) !important;
                border-color: #ff4444 !important;
                color: #ff4444 !important;
            }

            .logout-btn:hover {
                background: #ff4444 !important;
                color: #000 !important;
            }

            @media (max-width: 768px) {
                .login-box {
                    padding: 30px 20px;
                    margin: 20px;
                }

                .login-box h1 {
                    font-size: 1.8em;
                }

                .login-input-group input,
                .login-input-group button {
                    padding: 12px;
                    font-size: 1em;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Initialiser l'authentification quand la page est chargée
let adminAuth;
document.addEventListener('DOMContentLoaded', function() {
    adminAuth = new AdminAuth();
});

// Fonction globale pour l'authentification
function attemptAdminLogin() {
    if (adminAuth) {
        adminAuth.attemptLogin();
    }
}
