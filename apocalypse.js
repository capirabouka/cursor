document.addEventListener('DOMContentLoaded', function() {
    const apocalypseButton = document.getElementById('apocalypseButton');
    const alarmEffect = document.querySelector('.alarm-effect');
    const alarmSound = document.getElementById('alarmSound');
    const progressBar = document.querySelector('.apocalypse-progress-bar');
    const buttonContainer = document.querySelector('.apocalypse-button-container');
    const matrixText = document.querySelector('.matrix-text');
    const originalText = matrixText.textContent;
    
    // Vider le contenu initial du texte Matrix
    matrixText.textContent = '';
    matrixText.style.display = 'none';
    matrixText.style.opacity = '0';

    // Fonction pour animer le texte Matrix
    function animateText() {
        matrixText.style.display = 'block';
        matrixText.style.opacity = '1';
        
        let delay = 0;
        const chars = originalText.split('');
        
        chars.forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char';
            span.style.opacity = '0';
            matrixText.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
            }, delay);
            
            delay += 100;
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