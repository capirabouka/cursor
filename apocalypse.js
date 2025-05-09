document.addEventListener('DOMContentLoaded', function() {
    const apocalypseButton = document.getElementById('apocalypseButton');
    const alarmEffect = document.querySelector('.alarm-effect');
    const alarmSound = document.getElementById('alarmSound');
    const progressBar = document.querySelector('.apocalypse-progress-bar');
    const buttonContainer = document.querySelector('.apocalypse-button-container');
    
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
            } else {
                console.log('Désactivation');
                alarmSound.pause();
                alarmSound.currentTime = 0;
                alarmEffect.classList.remove('active');
                document.body.classList.remove('dark-mode');
                progressBar.style.width = '0%';
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