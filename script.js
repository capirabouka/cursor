// Configuration de Three.js pour les effets visuels
let scene, camera, renderer, particles;
const particleCount = 500;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('.fullscreen-section').appendChild(renderer.domElement);

    // Création des particules
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

        // Attribution aléatoire des couleurs
        const colorType = Math.floor(Math.random() * 3);
        if (colorType === 0) {
            // Noir
            colors[i * 3] = 0;
            colors[i * 3 + 1] = 0;
            colors[i * 3 + 2] = 0;
        } else if (colorType === 1) {
            // Violet
            colors[i * 3] = 0.5;
            colors[i * 3 + 1] = 0;
            colors[i * 3 + 2] = 0.5;
        } else {
            // Bleu ciel
            colors[i * 3] = 0.5;
            colors[i * 3 + 1] = 0.7;
            colors[i * 3 + 2] = 1;
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;
}

function animate() {
    requestAnimationFrame(animate);

    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

// Gestion du son
let audioContext;
let analyser;
let dataArray;

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

// Gestion du scroll
function handleScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop - sectionHeight / 3) {
            const currentId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Gestion des langues
function changeLanguage(lang) {
    const translations = {
        fr: {
            projects: 'Projets',
            musique: 'Musique',
            engagement: 'Engagement',
            contact: 'Contact'
        },
        en: {
            projects: 'Projects',
            musique: 'Music',
            engagement: 'Commitment',
            contact: 'Contact'
        },
        es: {
            projects: 'Proyectos',
            musique: 'Música',
            engagement: 'Compromiso',
            contact: 'Contacto'
        },
        ru: {
            projects: 'Проекты',
            musique: 'Музыка',
            engagement: 'Участие',
            contact: 'Контакт'
        }
    };

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const section = link.getAttribute('href').substring(1);
        if (translations[lang] && translations[lang][section]) {
            link.textContent = translations[lang][section];
        }
    });
}

// Initialisation du lecteur audio
function initAudioPlayer() {
    const audioPlayer = document.querySelector('.audio-player');
    const progressBar = document.querySelector('.progress-bar');
    const audioProgress = document.querySelector('.audio-progress');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const timeDisplay = document.querySelector('.time-display');

    if (audioPlayer && progressBar && audioProgress && playPauseBtn) {
        // Fonction pour mettre à jour la barre de progression
        function updateProgress() {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = percent + '%';
            
            // Mise à jour de l'affichage du temps
            const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
            const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
            const durationMinutes = Math.floor(audioPlayer.duration / 60);
            const durationSeconds = Math.floor(audioPlayer.duration % 60);
            
            timeDisplay.innerHTML = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        }

        // Gestion du clic sur la barre de progression
        audioProgress.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = pos * audioPlayer.duration;
        });

        // Gestion du bouton play/pause
        playPauseBtn.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                audioPlayer.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });

        // Mise à jour de la barre de progression pendant la lecture
        audioPlayer.addEventListener('timeupdate', updateProgress);

        // Réinitialisation de la barre de progression à la fin
        audioPlayer.addEventListener('ended', function() {
            progressBar.style.width = '0%';
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        });

        // Mise à jour initiale de l'affichage du temps
        audioPlayer.addEventListener('loadedmetadata', function() {
            const durationMinutes = Math.floor(audioPlayer.duration / 60);
            const durationSeconds = Math.floor(audioPlayer.duration % 60);
            timeDisplay.innerHTML = `0:00 / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        });
    }
}

// Initialisation
window.addEventListener('load', () => {
    initThreeJS();
    animate();
    initAudio();
    initAudioPlayer();
    window.addEventListener('scroll', handleScroll);
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Gestion du mode sombre
document.addEventListener('DOMContentLoaded', function() {
    const apocalypseButton = document.getElementById('apocalypseButton');
    
    // Forcer le mode clair au démarrage
    document.body.classList.remove('dark-mode');
    
    apocalypseButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });
}); 