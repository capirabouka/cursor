document.addEventListener('DOMContentLoaded', function() {
    const matrixText = document.querySelector('.matrix-text');
    const originalText = matrixText.textContent;
    const apocalypseButton = document.getElementById('apocalypseButton');
    
    // Vider le contenu initial
    matrixText.textContent = '';
    matrixText.style.display = 'none';
    matrixText.style.opacity = '0';

    // Fonction pour animer le texte
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

    // Fonction pour réinitialiser le texte
    function resetText() {
        matrixText.style.display = 'none';
        matrixText.style.opacity = '0';
        matrixText.innerHTML = '';
    }

    // Observer pour le mode sombre
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (!document.body.classList.contains('dark-mode')) {
                    resetText();
                }
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    // Écouter le clic sur le bouton PUSH
    apocalypseButton.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            resetText();
            animateText();
        }
    });
}); 