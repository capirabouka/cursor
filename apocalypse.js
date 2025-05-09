document.addEventListener('DOMContentLoaded', function() {
    const apocalypseButton = document.getElementById('apocalypseButton');
    const alarmEffect = document.querySelector('.alarm-effect');
    const alarmSound = document.getElementById('alarmSound');
    
    console.log('Bouton:', apocalypseButton);
    console.log('Effet:', alarmEffect);
    console.log('Son:', alarmSound);
    
    if (apocalypseButton) {
        apocalypseButton.addEventListener('click', function() {
            console.log('Bouton cliqué');
            
            // Changer la couleur du texte
            apocalypseButton.classList.toggle('active');
            
            // Jouer/Arrêter le son et activer/désactiver le mode sombre
            if (apocalypseButton.classList.contains('active')) {
                try {
                    alarmSound.currentTime = 0;
                    alarmSound.play();
                    alarmEffect.classList.add('active');
                    document.body.classList.add('dark-mode');
                } catch (error) {
                    console.error('Erreur lors de la lecture:', error);
                }
            } else {
                console.log('Désactivation');
                alarmSound.pause();
                alarmSound.currentTime = 0;
                alarmEffect.classList.remove('active');
                document.body.classList.remove('dark-mode');
            }
        });
    }
}); 