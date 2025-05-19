// Configuration de l'animation
const config = {
    particleCount: 200,
    particleSize: 3,
    particleColor: '#9d4edd',
    soundFrequency: 440,
    soundDuration: 2000
};

console.log('Animation script loaded');

// Création du canvas pour l'animation
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '1000';
canvas.style.pointerEvents = 'none';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let particles = [];
let audioContext;
let oscillator;
let gainNode;

// Initialisation de l'animation
function init() {
    console.log('Initializing animation');
    // Redimensionner le canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Créer les particules
    for (let i = 0; i < config.particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * config.particleSize + 1,
            speedX: (Math.random() - 0.5) * 4,
            speedY: (Math.random() - 0.5) * 4,
            opacity: 0
        });
    }

    // Initialiser l'audio
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(config.soundFrequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        console.log('Audio initialized');
    } catch (e) {
        console.error('Audio initialization failed:', e);
    }
}

// Animation des particules
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        // Mettre à jour la position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Rebondir sur les bords
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Dessiner la particule
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(157, 78, 221, ${particle.opacity})`;
        ctx.fill();
    });
    
    requestAnimationFrame(animate);
}

// Fonction pour démarrer l'animation
function startAnimation() {
    console.log('Starting animation');
    // Faire apparaître les particules progressivement
    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.02;
        particles.forEach(particle => {
            particle.opacity = opacity;
        });
        if (opacity >= 1) clearInterval(fadeIn);
    }, 20);

    // Démarrer le son
    try {
        oscillator.start();
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
    } catch (e) {
        console.error('Sound playback failed:', e);
    }

    // Faire disparaître les particules après 2 secondes
    setTimeout(() => {
        let opacity = 1;
        const fadeOut = setInterval(() => {
            opacity -= 0.02;
            particles.forEach(particle => {
                particle.opacity = opacity;
            });
            if (opacity <= 0) {
                clearInterval(fadeOut);
                canvas.remove();
            }
        }, 20);
    }, 2000);
}

// Démarrer l'animation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting animation');
    init();
    animate();
    startAnimation();
}); 