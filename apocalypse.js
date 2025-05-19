document.addEventListener('DOMContentLoaded', function() {
    const apocalypseButton = document.getElementById('apocalypseButton');
    const alarmEffect = document.querySelector('.alarm-effect');
    const alarmSound = document.getElementById('alarmSound');
    const progressBar = document.querySelector('.apocalypse-progress-bar');
    const buttonContainer = document.querySelector('.apocalypse-button-container');
    const matrixText = document.querySelector('.matrix-text');
    
    // Stocker le texte original
    const originalText = matrixText.innerHTML;
    
    // Vider le contenu initial du texte Matrix
    matrixText.textContent = '';
    matrixText.style.display = 'none';
    matrixText.style.opacity = '0';

    // Fonction pour animer le texte Matrix
    function animateText() {
        matrixText.style.display = 'block';
        matrixText.style.opacity = '1';
        
        // Créer un conteneur pour le texte
        const textContainer = document.createElement('div');
        textContainer.className = 'matrix-text-container';
        matrixText.appendChild(textContainer);
        
        // Diviser le texte en paragraphes
        const paragraphs = originalText.split('\n\n');
        
        paragraphs.forEach((paragraph, pIndex) => {
            const p = document.createElement('p');
            p.className = 'matrix-paragraph';
            textContainer.appendChild(p);
            
            // Diviser le paragraphe en caractères
            const chars = paragraph.split('');
            
            chars.forEach((char, cIndex) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'matrix-char';
                span.style.opacity = '0';
                p.appendChild(span);
                
                // Calculer le délai pour chaque caractère (augmenté à 100ms par caractère)
                const delay = (pIndex * 2000) + (cIndex * 100);
                
                setTimeout(() => {
                    span.style.opacity = '1';
                    // Ajouter un effet de glitch aléatoire
                    if (Math.random() > 0.9) {
                        span.style.textShadow = '0 0 5px #00cc00';
                        setTimeout(() => {
                            span.style.textShadow = 'none';
                        }, 100);
                    }
                }, delay);
            });
        });
    }

    // Fonction pour réinitialiser le texte Matrix
    function resetText() {
        matrixText.style.display = 'none';
        matrixText.style.opacity = '0';
        matrixText.innerHTML = '';
    }
    
    console.log('Bouton:', apocalypseButton);
    console.log('Effet:', alarmEffect);
    console.log('Son:', alarmSound);
    
    if (apocalypseButton) {
        apocalypseButton.addEventListener('click', function() {
            console.log('Bouton cliqué');
            
            // Changer la couleur du texte
            apocalypseButton.classList.toggle('active');
            buttonContainer.classList.toggle('active');
            
            // Jouer/Arrêter le son et activer/désactiver le mode sombre
            if (apocalypseButton.classList.contains('active')) {
                alarmSound.currentTime = 0;
                const playPromise = alarmSound.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        console.log('La musique a commencé');
                    })
                    .catch(error => {
                        console.error('Erreur lors de la lecture:', error);
                    });
                }
                
                alarmEffect.classList.add('active');
                document.body.classList.add('dark-mode');
                resetText();
                animateText();
            } else {
                console.log('Désactivation');
                alarmSound.pause();
                alarmSound.currentTime = 0;
                alarmEffect.classList.remove('active');
                document.body.classList.remove('dark-mode');
                progressBar.style.width = '0%';
                resetText();
            }
        });
    }

    // Mettre à jour la barre de progression
    if (alarmSound) {
        alarmSound.addEventListener('timeupdate', function() {
            if (alarmSound.duration) {
                const progress = (alarmSound.currentTime / alarmSound.duration) * 100;
                progressBar.style.width = progress + '%';
            }
        });
    }
}); 