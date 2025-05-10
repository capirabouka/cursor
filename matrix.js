document.addEventListener('DOMContentLoaded', () => {
    const matrixText = document.querySelector('.matrix-text');
    const text = matrixText.textContent;
    matrixText.textContent = '';
    
    // Créer les spans pour chaque caractère
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        matrixText.appendChild(span);
    });

    // Observer les changements de mode sombre
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (document.body.classList.contains('dark-mode')) {
                    animateMatrixText();
                } else {
                    resetMatrixText();
                }
            }
        });
    });

    observer.observe(document.body, { attributes: true });

    function animateMatrixText() {
        matrixText.classList.add('visible');
        const chars = matrixText.querySelectorAll('.char');
        
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.classList.add('visible');
            }, index * 50); // Délai de 50ms entre chaque caractère
        });
    }

    function resetMatrixText() {
        matrixText.classList.remove('visible');
        const chars = matrixText.querySelectorAll('.char');
        chars.forEach(char => char.classList.remove('visible'));
    }
}); 