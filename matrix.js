document.addEventListener('DOMContentLoaded', function() {
    const matrixText = document.querySelector('.matrix-text');
    const text = matrixText.textContent;
    matrixText.textContent = '';
    
    // Observer pour le mode sombre
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    animateText();
                } else {
                    resetText();
                }
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    function animateText() {
        matrixText.classList.add('visible');
        let delay = 0;
        const chars = text.split('');
        
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char';
            matrixText.appendChild(span);
            
            // Ajouter un délai aléatoire pour chaque caractère
            delay += Math.random() * 50;
            
            setTimeout(() => {
                span.classList.add('visible');
                
                // Ajouter un effet de corruption aléatoire
                if (Math.random() < 0.1) {
                    span.classList.add('corrupted');
                    setTimeout(() => {
                        span.classList.remove('corrupted');
                    }, Math.random() * 1000 + 500);
                }
                
                // Ajouter des glitches aléatoires
                if (Math.random() < 0.05) {
                    const originalText = span.textContent;
                    const glitchChars = '!@#$%^&*()_+{}:"<>?|';
                    const glitchInterval = setInterval(() => {
                        span.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    }, 50);
                    
                    setTimeout(() => {
                        clearInterval(glitchInterval);
                        span.textContent = originalText;
                    }, Math.random() * 200 + 100);
                }
            }, delay);
        });
    }

    function resetText() {
        matrixText.classList.remove('visible');
        matrixText.innerHTML = '';
        matrixText.textContent = text;
    }
}); 