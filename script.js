// Configuration de Three.js pour les effets visuels
let scene, camera, renderer, particles;
const particleCount = 1000;

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

        colors[i * 3] = Math.random();
        colors[i * 3 + 1] = Math.random();
        colors[i * 3 + 2] = Math.random();
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

    particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;

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

// Animation de la vague sonore
function createSoundWave() {
    const wave = document.querySelector('.sound-wave');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = wave.offsetWidth;
    canvas.height = wave.offsetHeight;
    wave.appendChild(canvas);

    let perturbationPhase = 0;
    let perturbationActive = false;
    let perturbationTimer = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        // Gestion de la perturbation
        perturbationTimer += 0.01;
        
        // Déclencher une nouvelle perturbation toutes les 8 secondes
        if (perturbationTimer > 8 && !perturbationActive) {
            perturbationActive = true;
            perturbationPhase = 0;
            perturbationTimer = 0;
        }

        // Animer la perturbation
        if (perturbationActive) {
            perturbationPhase += 0.005; // Ralentir l'animation
            if (perturbationPhase >= 1) {
                perturbationActive = false;
            }
        }

        for (let i = 0; i < canvas.width; i++) {
            let y = canvas.height / 2 + Math.sin(i * 0.1 + Date.now() * 0.01) * 20;
            
            // Ajouter la perturbation progressive
            if (perturbationActive) {
                // Fonction d'easing pour un effet plus naturel
                const easeInOut = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
                const intensity = easeInOut(perturbationPhase);
                
                y += Math.sin(i * 0.5 + perturbationPhase * Math.PI * 2) * 10 * intensity +
                     Math.cos(i * 0.3 + perturbationPhase * Math.PI) * 8 * intensity +
                     Math.sin(i * 0.8 + perturbationPhase * Math.PI * 1.5) * 5 * intensity;
            }
            
            ctx.lineTo(i, y);
        }

        // Dessiner l'effet de glow pendant la perturbation
        if (perturbationActive) {
            const easeInOut = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
            const intensity = easeInOut(perturbationPhase);
            
            ctx.strokeStyle = `rgba(255, 0, 255, ${0.3 * intensity})`;
            ctx.lineWidth = 4;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            for (let i = 0; i < canvas.width; i++) {
                let y = canvas.height / 2 + Math.sin(i * 0.1 + Date.now() * 0.01) * 20;
                if (perturbationActive) {
                    y += Math.sin(i * 0.5 + perturbationPhase * Math.PI * 2) * 10 * intensity +
                         Math.cos(i * 0.3 + perturbationPhase * Math.PI) * 8 * intensity +
                         Math.sin(i * 0.8 + perturbationPhase * Math.PI * 1.5) * 5 * intensity;
                }
                ctx.lineTo(i, y);
            }
        }

        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 2;
        ctx.stroke();
        requestAnimationFrame(animate);
    }

    animate();
}

// Gestion du scroll
function handleScroll() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Gestion du changement de langue
const translations = {
    fr: {
        // Navigation
        installations: "Installations",
        musique: "Musique",
        engagement: "Engagement",
        contact: "Contact",
        
        // Sections
        about: "À propos",
        projects: "Projets",
        voiceOfEdge: "The Voice of the Edge",
        voiceDescription: "Un recueil de voix internationales, capturant l'infinité des scénarios possibles pour la fin du monde.",
        immersiveExperience: "Expérience Immersive",
        
        // Sous-titres
        subtitle: "Anouche Lelong",
        subtitle2: "Installations • Musique • Engagement",
        
        // À propos
        aboutIntro: "Cet espace présente l'essentiel de mon travail artistique, à travers une sélection de projets, une réflexion sur ma démarche, et des fragments en constante évolution.",
        aboutDescription1: "Artiste pluridisciplinaire, je travaille à partir du son, de la matière et du vide. Mes installations interrogent les rapports de pouvoir, les mécanismes d'oppression et les mouvements d'exil, tout en laissant une place essentielle à la perception libre du spectateur.",
        aboutDescription2: "Ce site fonctionne comme une chambre d'écho de mes recherches : un lieu de tension, d'expérimentation et d'inscription dans le réel. Il accueille des projets passés, en cours, et à venir.",
        aboutConclusion: "Ici, les choses vibrent avant de s'effondrer, ou peut-être malgré tout.",
        
        // Contact
        mail: "Mail",
        telegram: "Telegram",
        
        // Projets
        "The Voice of the Edge": "The Voice of the Edge",
        "The Voice of the Edge Description 1": "Dans ce projet sonore collectif, j'ai invité des personnes venues des quatre coins du monde à imaginer leur propre scénario d'apocalypse. Mais pas avec des mots — avec des sons.",
        "The Voice of the Edge Description 2": "Chacun·e a pris le temps de mimer vocalement ce à quoi ressemblerait, pour lui ou elle, le bruit de la fin. Explosion, silence, râle, rires, grondements, soupirs... De cette matière brute, j'ai composé une symphonie absurde, fragile et chaotique, qui rassemble ces visions personnelles du déclin.",
        "The Voice of the Edge Description 3": "L'installation est accompagnée d'un robot aspirateur qui, de façon mécanique et dérisoire, fait s'effondrer des tours de Kapla. Une métaphore désorientée du monde qui s'écroule, mais sans haine, sans rage, comme une farce cosmique à laquelle on assiste, un peu bête, un peu ému·e.",
        "La symphonie du Déclin": "La symphonie du Déclin",
        "La symphonie du Déclin Description 1": "Dans ce projet sonore collectif, j'ai invité des personnes venues des quatre coins du monde à imaginer leur propre scénario d'apocalypse. Mais pas avec des mots — avec des sons.",
        "La symphonie du Déclin Description 2": "Chacun·e a pris le temps de mimer vocalement ce à quoi ressemblerait, pour lui ou elle, le bruit de la fin. Explosion, silence, râle, rires, grondements, soupirs... De cette matière brute, j'ai composé une symphonie absurde, fragile et chaotique, qui rassemble ces visions personnelles du déclin.",
        "La symphonie du Déclin Description 3": "L'installation est accompagnée d'un robot aspirateur qui, de façon mécanique et dérisoire, fait s'effondrer des tours de Kapla. Une métaphore désorientée du monde qui s'écroule, mais sans haine, sans rage, comme une farce cosmique à laquelle on assiste, un peu bête, un peu ému·e.",
        "Terminal": "Terminal",
        "Terminal Description": "Deux passeports — l'un français, l'autre russe — imprimés à l'échelle monumentale et affichés dans des espaces publics, naturels ou frontaliers, racontent l'histoire d'un couple séparé non par le lien mais par l'architecture invisible du pouvoir. Ce projet interroge la violence tranquille des bureaucraties migratoires : comment l'amour, pourtant apolitique dans son essence, devient entravé par des documents d'État, symboles d'appartenance, de privilège ou d'exclusion. En déplaçant ces objets administratifs hors de leur contexte — à l'aéroport, dans la rue, en pleine nature — l'œuvre confronte le regard public à l'arbitraire des frontières et à la matérialité des inégalités globales. Elle révèle le passeport non comme un simple outil d'identification, mais comme une technologie politique du tri, une preuve silencieuse que le droit de circuler, de s'aimer ou de vivre ensemble reste un privilège géopolitique, non un droit universel.",
        "Le bruit de la chute": "Le bruit de la chute",
        "Le bruit de la chute Description": "Le bruit de la chute met en scène deux effondrements — une maison en feu, une montagne qui s'écroule — dont les sons, pourtant, sont fabriqués à la main, hors champ. En dévoilant la construction de l'illusion, je m'inscris dans une tradition critique de l'image : celle qui ne montre pas seulement, mais interroge ce qu'elle fait croire. Depuis les premières projections d'ombres jusqu'aux flux numériques, nous ne cessons de confondre ce que nous voyons avec ce que nous savons. Ce projet travaille cette faille-là.",
        
        // Titres des vidéos
        "Achode Karibian": "Achode Karibian",
        "Amir Zakariazadeh": "Amir Zakariazadeh",
        "Angie Stifler": "Angie Stifler",
        "Ani Khitapszyan": "Ani Khitapszyan",
        "Anna Gordeeva": "Anna Gordeeva",
        "Anton Adrienko": "Anton Adrienko",
        "Aram Zurabyan": "Aram Zurabyan",
        "Bela Poghosyan": "Bela Poghosyan",
        "Betty Karibian": "Betty Karibian",
        "Bogdan Zubov": "Bogdan Zubov",
        "Camille": "Camille",
        "Hakob Balayan": "Hakob Balayan",
        "Jean": "Jean",
        "Joana Millet": "Joana Millet",
        "Kolay Shatalov": "Kolay Shatalov",
        "Leon Gaskin": "Leon Gaskin",
        "Liza Drudi": "Liza Drudi",
        "Luna Sybil": "Luna Sybil",
        "Mariana": "Mariana",
        "Chambre d'écho": "Chambre d'écho",
        "Chambre d'écho Description": "Chambre d'écho est une installation sonore immersive qui explore les résonances de la mémoire collective. À travers une série de dispositifs acoustiques, le public est invité à interagir avec des fragments sonores qui se transforment et se déforment au fil des échos.",
        "Résonnances Disloquées": "Résonnances Disloquées",
        "Résonnances Disloquées Description": "J'ai toujours eu peur de la fin du monde. À travers mon travail, je questionne ce qui déclenche une fin, ce qui l'annonce, ce qu'elle laisse derrière elle. J'imagine ses formes, ses bruits, ses échos. Je cherche à comprendre non pas comment tout s'effondre, mais comment nous l'entendons, le percevons, parfois même le mettons en scène.",
        "Frontières et Identités": "Frontières et Identités"
    },
    en: {
        // Navigation
        installations: "Installations",
        musique: "Music",
        engagement: "Commitment",
        contact: "Contact",
        
        // Sections
        about: "About",
        projects: "Projects",
        voiceOfEdge: "The Voice of the Edge",
        voiceDescription: "A collection of international voices, capturing the infinity of possible scenarios for the end of the world.",
        immersiveExperience: "Immersive Experience",
        
        // Subtitles
        subtitle: "Anouche Lelong",
        subtitle2: "Installations • Music • Commitment",
        
        // About
        aboutIntro: "This space presents the essence of my artistic work, through a selection of projects, reflections on my approach, and constantly evolving fragments.",
        aboutDescription1: "As a multidisciplinary artist, I work with sound, matter, and void. My installations question power relations, mechanisms of oppression, and movements of exile, while leaving an essential space for the viewer's free perception.",
        aboutDescription2: "This site functions as an echo chamber for my research: a place of tension, experimentation, and inscription in reality. It hosts past, current, and future projects.",
        aboutConclusion: "Here, things vibrate before collapsing, or perhaps despite everything.",
        
        // Contact
        mail: "Mail",
        telegram: "Telegram",
        
        // Projects
        "The Voice of the Edge": "The Voice of the Edge",
        "The Voice of the Edge Description 1": "In this collective sound project, I invited people from all over the world to imagine their own apocalypse scenario. But not with words — with sounds.",
        "The Voice of the Edge Description 2": "Each person took the time to vocally mimic what the end would sound like to them. Explosion, silence, groan, laughter, rumble, sigh... From this raw material, I composed an absurd, fragile, and chaotic symphony that brings together these personal visions of decline.",
        "The Voice of the Edge Description 3": "The installation is accompanied by a robot vacuum that, in a mechanical and derisory way, makes Kapla towers collapse. A disoriented metaphor of the world collapsing, but without hatred, without rage, like a cosmic farce that we witness, a bit stupid, a bit moved.",
        "La symphonie du Déclin": "The Symphony of Decline",
        "La symphonie du Déclin Description 1": "In this collective sound project, I invited people from all over the world to imagine their own apocalypse scenario. But not with words — with sounds.",
        "La symphonie du Déclin Description 2": "Each person took the time to vocally mimic what the end would sound like to them. Explosion, silence, groan, laughter, rumble, sigh... From this raw material, I composed an absurd, fragile, and chaotic symphony that brings together these personal visions of decline.",
        "La symphonie du Déclin Description 3": "The installation is accompanied by a robot vacuum that, in a mechanical and derisory way, makes Kapla towers collapse. A disoriented metaphor of the world collapsing, but without hatred, without rage, like a cosmic farce that we witness, a bit stupid, a bit moved.",
        "Terminal": "Terminal",
        "Terminal Description": "Two passports — one French, one Russian — printed at a monumental scale and displayed in public, natural, or border spaces, tell the story of a couple separated not by their bond but by the invisible architecture of power. This project questions the quiet violence of migration bureaucracies: how love, though apolitical in its essence, becomes constrained by state documents, symbols of belonging, privilege, or exclusion. By moving these administrative objects out of their context — to the airport, the street, the wilderness — the work confronts the public gaze with the arbitrariness of borders and the materiality of global inequalities. It reveals the passport not as a mere identification tool, but as a political technology of sorting, a silent proof that the right to move, to love, or to live together remains a geopolitical privilege, not a universal right.",
        "Le bruit de la chute": "The Sound of Falling",
        "Le bruit de la chute Description": "The Sound of Falling stages two collapses — a burning house, a crumbling mountain — whose sounds, however, are handcrafted, off-screen. By revealing the construction of the illusion, I situate myself within a critical tradition of the image: one that not only shows but questions what it makes us believe. From the first shadow projections to digital streams, we continuously confuse what we see with what we know. This project works on that very gap.",
        
        // Video titles
        "Achode Karibian": "Achode Karibian",
        "Amir Zakariazadeh": "Amir Zakariazadeh",
        "Angie Stifler": "Angie Stifler",
        "Ani Khitapszyan": "Ani Khitapszyan",
        "Anna Gordeeva": "Anna Gordeeva",
        "Anton Adrienko": "Anton Adrienko",
        "Aram Zurabyan": "Aram Zurabyan",
        "Bela Poghosyan": "Bela Poghosyan",
        "Betty Karibian": "Betty Karibian",
        "Bogdan Zubov": "Bogdan Zubov",
        "Camille": "Camille",
        "Hakob Balayan": "Hakob Balayan",
        "Jean": "Jean",
        "Joana Millet": "Joana Millet",
        "Kolay Shatalov": "Kolay Shatalov",
        "Leon Gaskin": "Leon Gaskin",
        "Liza Drudi": "Liza Drudi",
        "Luna Sybil": "Luna Sybil",
        "Mariana": "Mariana",
        "Chambre d'écho": "Echo Chamber",
        "Chambre d'écho Description": "Echo Chamber is an immersive sound installation that explores the resonances of collective memory. Through a series of acoustic devices, the audience is invited to interact with sound fragments that transform and distort through echoes.",
        "Résonnances Disloquées": "Dislocated Resonances",
        "Résonnances Disloquées Description": "I have always been afraid of the end of the world. Through my work, I question what triggers an end, what announces it, what it leaves behind. I imagine its forms, its sounds, its echoes. I seek to understand not how everything collapses, but how we hear it, perceive it, sometimes even stage it.",
        "Frontières et Identités": "Borders and Identities"
    },
    es: {
        // Navigation
        installations: "Instalaciones",
        musique: "Música",
        engagement: "Compromiso",
        contact: "Contacto",
        
        // Sections
        about: "Sobre mí",
        projects: "Proyectos",
        voiceOfEdge: "The Voice of the Edge",
        voiceDescription: "Una colección de voces internacionales, capturando la infinidad de escenarios posibles para el fin del mundo.",
        immersiveExperience: "Experiencia Inmersiva",
        
        // Subtítulos
        subtitle: "Anouche Lelong",
        subtitle2: "Instalaciones • Música • Compromiso",
        
        // Sobre mí
        aboutIntro: "Este espacio presenta lo esencial de mi trabajo artístico, a través de una selección de proyectos, una reflexión sobre mi enfoque y fragmentos en constante evolución.",
        aboutDescription1: "Como artista multidisciplinaria, trabajo a partir del sonido, la materia y el vacío. Mis instalaciones cuestionan las relaciones de poder, los mecanismos de opresión y los movimientos de exilio, dejando un espacio esencial para la percepción libre del espectador.",
        aboutDescription2: "Este sitio funciona como una cámara de eco de mis investigaciones: un lugar de tensión, experimentación e inscripción en lo real. Acoge proyectos pasados, presentes y futuros.",
        aboutConclusion: "Aquí, las cosas vibran antes de colapsar, o quizás a pesar de todo.",
        
        // Contacto
        mail: "Correo",
        telegram: "Telegram",
        
        // Proyectos
        "The Voice of the Edge": "The Voice of the Edge",
        "The Voice of the Edge Description 1": "En este proyecto sonoro colectivo, invité a personas de todo el mundo a imaginar su propio escenario de apocalipsis. Pero no con palabras — con sonidos.",
        "The Voice of the Edge Description 2": "Cada persona tomó el tiempo para imitar vocalmente cómo sería para ellos el sonido del fin. Explosión, silencio, gemido, risas, rugidos, suspiros... De esta materia prima, compuse una sinfonía absurda, frágil y caótica, que reúne estas visiones personales del declive.",
        "The Voice of the Edge Description 3": "La instalación está acompañada por un robot aspirador que, de manera mecánica y despreciable, hace colapsar torres de Kapla. Una metáfora desorientada del mundo que se derrumba, pero sin odio, sin rabia, como una farsa cósmica a la que asistimos, un poco estúpida, un poco conmovida.",
        "La symphonie du Déclin": "La Sinfonía del Declive",
        "La symphonie du Déclin Description 1": "En este proyecto sonoro colectivo, invité a personas de todo el mundo a imaginar su propio escenario de apocalipsis. Pero no con palabras — con sonidos.",
        "La symphonie du Déclin Description 2": "Cada persona tomó el tiempo para imitar vocalmente cómo sería para ellos el sonido del fin. Explosión, silencio, gemido, risas, rugidos, suspiros... De esta materia prima, compuse una sinfonía absurda, frágil y caótica, que reúne estas visiones personales del declive.",
        "La symphonie du Déclin Description 3": "La instalación está acompañada por un robot aspirador que, de manera mecánica y despreciable, hace colapsar torres de Kapla. Una metáfora desorientada del mundo que se derrumba, pero sin odio, sin rabia, como una farsa cósmica a la que asistimos, un poco estúpida, un poco conmovida.",
        "Terminal": "Terminal",
        "Terminal Description": "Dos pasaportes — uno francés, otro ruso — impresos a escala monumental y expuestos en espacios públicos, naturales o fronterizos, cuentan la historia de una pareja separada no por su vínculo sino por la arquitectura invisible del poder. Este proyecto cuestiona la violencia silenciosa de las burocracias migratorias: cómo el amor, aunque apolítico en su esencia, se ve obstaculizado por documentos estatales, símbolos de pertenencia, privilegio o exclusión. Al desplazar estos objetos administrativos fuera de su contexto — al aeropuerto, la calle, la naturaleza — la obra confronta la mirada pública con la arbitrariedad de las fronteras y la materialidad de las desigualdades globales. Revela el pasaporte no como una mera herramienta de identificación, sino como una tecnología política de clasificación, una prueba silenciosa de que el derecho a circular, a amar o a vivir juntos sigue siendo un privilegio geopolítico, no un derecho universal.",
        "Le bruit de la chute": "El Sonido de la Caída",
        "Le bruit de la chute Description": "El Sonido de la Caída presenta dos derrumbes — una casa en llamas, una montaña que se desmorona — cuyos sonidos, sin embargo, son fabricados a mano, fuera de campo. Al revelar la construcción de la ilusión, me inscribo en una tradición crítica de la imagen: aquella que no solo muestra, sino que cuestiona lo que hace creer. Desde las primeras proyecciones de sombras hasta los flujos digitales, no dejamos de confundir lo que vemos con lo que sabemos. Este proyecto trabaja en esa falla.",
        
        // Títulos de videos
        "Achode Karibian": "Achode Karibian",
        "Amir Zakariazadeh": "Amir Zakariazadeh",
        "Angie Stifler": "Angie Stifler",
        "Ani Khitapszyan": "Ani Khitapszyan",
        "Anna Gordeeva": "Anna Gordeeva",
        "Anton Adrienko": "Anton Adrienko",
        "Aram Zurabyan": "Aram Zurabyan",
        "Bela Poghosyan": "Bela Poghosyan",
        "Betty Karibian": "Betty Karibian",
        "Bogdan Zubov": "Bogdan Zubov",
        "Camille": "Camille",
        "Hakob Balayan": "Hakob Balayan",
        "Jean": "Jean",
        "Joana Millet": "Joana Millet",
        "Kolay Shatalov": "Kolay Shatalov",
        "Leon Gaskin": "Leon Gaskin",
        "Liza Drudi": "Liza Drudi",
        "Luna Sybil": "Luna Sybil",
        "Mariana": "Mariana",
        "Chambre d'écho": "Cámara de Eco",
        "Chambre d'écho Description": "Cámara de Eco es una instalación sonora inmersiva que explora las resonancias de la memoria colectiva. A través de una serie de dispositivos acústicos, el público es invitado a interactuar con fragmentos sonoros que se transforman y se deforman a través de los ecos.",
        "Résonnances Disloquées": "Resonancias Dislocadas",
        "Résonnances Disloquées Description": "Siempre he tenido miedo del fin del mundo. A través de mi trabajo, cuestiono lo que desencadena un fin, lo que lo anuncia, lo que deja atrás. Imagino sus formas, sus sonidos, sus ecos. Busco entender no cómo todo se derrumba, sino cómo lo escuchamos, lo percibimos, a veces incluso lo escenificamos.",
        "Frontières et Identités": "Fronteras e Identidades"
    },
    ru: {
        // Navigation
        installations: "Инсталляции",
        musique: "Музыка",
        engagement: "Участие",
        contact: "Контакт",
        
        // Sections
        about: "О себе",
        projects: "Проекты",
        voiceOfEdge: "The Voice of the Edge",
        voiceDescription: "Сборник международных голосов, отражающих бесконечность возможных сценариев конца света.",
        immersiveExperience: "Иммерсивный опыт",
        
        // Подзаголовки
        subtitle: "Ануш Лёлонг",
        subtitle2: "Инсталляции • Музыка • Участие",
        
        // О себе
        aboutIntro: "Это пространство представляет суть моей художественной работы через подборку проектов, размышления о моем подходе и постоянно развивающиеся фрагменты.",
        aboutDescription1: "Как мультидисциплинарный художник, я работаю со звуком, материей и пустотой. Мои инсталляции исследуют властные отношения, механизмы угнетения и движения изгнания, оставляя важное пространство для свободного восприятия зрителя.",
        aboutDescription2: "Этот сайт функционирует как эхо-камера моих исследований: место напряжения, экспериментов и воплощения в реальности. Он принимает прошлые, текущие и будущие проекты.",
        aboutConclusion: "Здесь вещи вибрируют перед тем, как рухнуть, или, возможно, вопреки всему.",
        
        // Контакт
        mail: "Почта",
        telegram: "Telegram",
        
        // Проекты
        "The Voice of the Edge": "The Voice of the Edge",
        "The Voice of the Edge Description 1": "В этом коллективном звуковом проекте я пригласила людей со всего мира представить свой собственный сценарий апокалипсиса. Но не словами — звуками.",
        "The Voice of the Edge Description 2": "Каждый человек нашел время, чтобы вокально изобразить, как для него звучит конец. Взрыв, тишина, стон, смех, грохот, вздох... Из этого сырого материала я создала абсурдную, хрупкую и хаотичную симфонию, объединяющую эти личные видения упадка.",
        "The Voice of the Edge Description 3": "Инсталляция сопровождается роботом-пылесосом, который механически и ничтожно заставляет рушиться башни из Kapla. Дезориентированная метафора мира, который рушится, но без ненависти, без ярости, как космический фарс, на который мы смотрим, немного глупо, немного тронуто.",
        "La symphonie du Déclin": "Симфония Упадка",
        "La symphonie du Déclin Description 1": "В этом коллективном звуковом проекте я пригласила людей со всего мира представить свой собственный сценарий апокалипсиса. Но не словами — звуками.",
        "La symphonie du Déclin Description 2": "Каждый человек нашел время, чтобы вокально изобразить, как для него звучит конец. Взрыв, тишина, стон, смех, грохот, вздох... Из этого сырого материала я создала абсурдную, хрупкую и хаотичную симфонию, объединяющую эти личные видения упадка.",
        "La symphonie du Déclin Description 3": "Инсталляция сопровождается роботом-пылесосом, который механически и ничтожно заставляет рушиться башни из Kapla. Дезориентированная метафора мира, который рушится, но без ненависти, без ярости, как космический фарс, на который мы смотрим, немного глупо, немного тронуто.",
        "Terminal": "Терминал",
        "Terminal Description": "Два паспорта — французский и российский — напечатанные в монументальном масштабе и размещенные в общественных, природных или пограничных пространствах, рассказывают историю пары, разделенной не связью, а невидимой архитектурой власти. Этот проект исследует тихое насилие миграционных бюрократий: как любовь, хотя и аполитичная по своей сути, становится ограниченной государственными документами, символами принадлежности, привилегии или исключения. Перемещая эти административные объекты за пределы их контекста — в аэропорт, на улицу, в дикую природу — работа сталкивает публичный взгляд с произволом границ и материальностью глобального неравенства. Она раскрывает паспорт не как простой инструмент идентификации, а как политическую технологию сортировки, безмолвное доказательство того, что право передвигаться, любить или жить вместе остается геополитической привилегией, а не универсальным правом.",
        "Le bruit de la chute": "Звук Падения",
        "Le bruit de la chute Description": "Звук Падения представляет два обрушения — горящий дом, обваливающаяся гора — чьи звуки, однако, созданы вручную, за кадром. Раскрывая построение иллюзии, я вписываюсь в критическую традицию образа: ту, которая не только показывает, но и ставит под вопрос то, во что она заставляет верить. От первых теневых проекций до цифровых потоков мы постоянно путаем то, что видим, с тем, что знаем. Этот проект работает над этим разрывом.",
        
        // Заголовки видео
        "Achode Karibian": "Ачод Карибян",
        "Amir Zakariazadeh": "Амир Закариазе",
        "Angie Stifler": "Энджи Стифлер",
        "Ani Khitapszyan": "Ани Хитапсян",
        "Anna Gordeeva": "Анна Гордеева",
        "Anton Adrienko": "Антон Адриенко",
        "Aram Zurabyan": "Арам Зурабян",
        "Bela Poghosyan": "Бела Погосян",
        "Betty Karibian": "Бетти Карибян",
        "Bogdan Zubov": "Богдан Зубов",
        "Camille": "Камиль",
        "Hakob Balayan": "Акоп Балян",
        "Jean": "Жан",
        "Joana Millet": "Жоана Милле",
        "Kolay Shatalov": "Колай Шаталов",
        "Leon Gaskin": "Леон Гаскин",
        "Liza Drudi": "Лиза Друди",
        "Luna Sybil": "Луна Сибил",
        "Mariana": "Мариана",
        "Chambre d'écho": "Эхо-камера",
        "Chambre d'écho Description": "Эхо-камера — это иммерсивная звуковая инсталляция, исследующая резонансы коллективной памяти. Через серию акустических устройств зрители приглашаются к взаимодействию со звуковыми фрагментами, которые трансформируются и искажаются через эхо.",
        "Résonnances Disloquées": "Разобщённые Резонансы",
        "Résonnances Disloquées Description": "Я всегда боялась конца света. В своей работе я исследую, что вызывает конец, что его предвещает, что он оставляет после себя. Я представляю его формы, звуки, эхо. Я стремлюсь понять не то, как всё разрушается, а то, как мы это слышим, воспринимаем, иногда даже ставим на сцене.",
        "Frontières et Identités": "Границы и Идентичности"
    }
};

function changeLanguage(lang) {
    // Mettre à jour le texte du bouton de langue
    const languageButton = document.querySelector('.language-button');
    languageButton.textContent = lang.toUpperCase();
    
    // Mettre à jour les textes des éléments
    const elementsToTranslate = {
        '.nav-link[href="#installations"]': translations[lang].installations,
        '.nav-link[href="#musique"]': translations[lang].musique,
        '.nav-link[href="#engagement"]': translations[lang].engagement,
        '.nav-link[href="#contact"]': translations[lang].contact,
        '#about h2': translations[lang].about,
        '#projects h2': translations[lang].projects,
        '#voice-of-edge h2': translations[lang].voiceOfEdge,
        '#voice-of-edge p': translations[lang].voiceDescription,
        '#immersive-experience h2': translations[lang].immersiveExperience,
        '#about-intro': translations[lang].aboutIntro,
        '#about-description1': translations[lang].aboutDescription1,
        '#about-description2': translations[lang].aboutDescription2,
        '#about-conclusion': translations[lang].aboutConclusion,
        '.contact-item:nth-child(1)': translations[lang].mail,
        '.contact-item:nth-child(2)': translations[lang].telegram,
        '.nav-link[href="#projects"]': translations[lang].projects,
        '.subtitle:first-of-type': translations[lang].subtitle,
        '.subtitle:last-of-type': translations[lang].subtitle2,
        '.project-item:nth-child(3) .project-description': translations[lang]["Terminal Description"],
        'Chambre d\'écho': translations[lang]["Chambre d'écho"],
        'Chambre d\'écho Description': translations[lang]["Chambre d'écho Description"],
        '.project-group-title:first-of-type': translations[lang]["Résonnances Disloquées"],
        '.group-description': translations[lang]["Résonnances Disloquées Description"],
        '.project-group-title:last-of-type': translations[lang]["Frontières et Identités"]
    };
    
    // Mettre à jour les textes des éléments
    for (const [selector, text] of Object.entries(elementsToTranslate)) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }
    
    // Mettre à jour les titres et descriptions des projets
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        const title = item.querySelector('h3');
        const originalTitle = title.textContent.trim();
        
        // Mettre à jour le titre
        if (translations[lang][originalTitle]) {
            title.textContent = translations[lang][originalTitle];
        }
        
        // Mettre à jour les descriptions
        const descriptions = item.querySelectorAll('.project-content .project-description');
        descriptions.forEach((description, index) => {
            const translationKey = `${originalTitle} Description ${index + 1}`;
            if (translations[lang][translationKey]) {
                description.textContent = translations[lang][translationKey];
            }
        });
    });
    
    // Mettre à jour les titres des vidéos
    const videoTitles = document.querySelectorAll('.video-title');
    videoTitles.forEach(title => {
        const originalText = title.textContent.trim();
        if (translations[lang][originalText]) {
            title.textContent = translations[lang][originalText];
        }
    });
    
    // Mettre à jour les descriptions des vidéos
    const videoDescriptions = document.querySelectorAll('.video-description');
    videoDescriptions.forEach(description => {
        const originalText = description.textContent.trim();
        if (translations[lang][originalText]) {
            description.textContent = translations[lang][originalText];
        }
    });
}

// Ajouter les gestionnaires d'événements pour le changement de langue
document.addEventListener('DOMContentLoaded', function() {
    const languageLinks = document.querySelectorAll('.language-dropdown a');
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
});

// Gestion du lecteur audio personnalisé
function initAudioPlayer() {
    console.log('Initialisation du lecteur audio...');
    
    const audio = document.querySelector('.audio-player');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const progressBar = document.querySelector('.progress-bar');
    const timeDisplay = document.querySelector('.time-display');

    if (!audio) {
        console.error('Élément audio non trouvé');
        return;
    }
    if (!playPauseBtn) {
        console.error('Bouton play/pause non trouvé');
        return;
    }

    console.log('Lecteur audio trouvé:', audio);
    console.log('Source audio:', audio.querySelector('source').src);

    // Désactiver la lecture automatique
    audio.autoplay = false;
    audio.preload = "auto";

    // Formatage du temps
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Mise à jour de l'affichage du temps
    function updateTimeDisplay() {
        if (audio.duration) {
            const currentTime = formatTime(audio.currentTime);
            const totalTime = formatTime(audio.duration);
            timeDisplay.innerHTML = `<span>${currentTime}</span> / <span>${totalTime}</span>`;
        }
    }

    // Gestion du bouton play/pause
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            // Réinitialiser la position de lecture si nécessaire
            if (audio.ended) {
                audio.currentTime = 0;
            }
            audio.play()
                .then(() => {
                    console.log('Lecture démarrée');
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                    playPauseBtn.classList.add('playing');
                })
                .catch(error => {
                    console.error('Erreur de lecture:', error);
                    alert('Pour écouter l\'audio, veuillez d\'abord cliquer n\'importe où sur la page, puis cliquer sur le bouton play.');
                });
        } else {
            audio.pause();
            console.log('Mise en pause');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playPauseBtn.classList.remove('playing');
        }
    });

    // Mise à jour de la barre de progression et du temps
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            updateTimeDisplay();
        }
    });

    // Mise à jour initiale du temps total
    audio.addEventListener('loadedmetadata', () => {
        updateTimeDisplay();
    });

    // Gestion du clic sur la barre de progression
    const progressContainer = document.querySelector('.audio-progress');
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pos * audio.duration;
        });
    }

    // Réinitialisation à la fin de la lecture
    audio.addEventListener('ended', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        progressBar.style.width = '0%';
        timeDisplay.innerHTML = '<span>0:00</span> / <span>0:00</span>';
        playPauseBtn.classList.remove('playing');
    });

    // Gestion des erreurs
    audio.addEventListener('error', (e) => {
        console.error('Erreur audio:', e);
        playPauseBtn.style.opacity = '0.5';
        playPauseBtn.style.cursor = 'not-allowed';
    });

    // Vérification de la disponibilité du fichier audio
    audio.addEventListener('canplay', () => {
        playPauseBtn.style.opacity = '1';
        playPauseBtn.style.cursor = 'pointer';
    });
}

// Initialisation
window.addEventListener('load', () => {
    initThreeJS();
    initAudio();
    animate();
    createSoundWave();
    handleScroll();
    initAudioPlayer();
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}); 