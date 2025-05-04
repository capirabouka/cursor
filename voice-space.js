let scene, camera, renderer;
let videoPoints = [];
let isPlaying = false;
let audioContext;
let audioElements = [];
let raycaster, mouse;
let selectedPoint = null;
let particles;
let cameraTarget = null;
let cameraAnimation = null;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cameraRotation = { x: 0, y: 0 };
let isAudioInitialized = false;

const videos = [
    { src: 'videos-/Achode Karibian.mp4', title: 'Achode Karibian', description: '' },
    { src: 'videos-/Amir Zakariazadeh.mp4', title: 'Amir Zakariazadeh', description: '' },
    { src: 'videos-/Angie Stifler.mp4', title: 'Angie Stifler', description: '' },
    { src: 'videos-/Ani Khitapszyan.mp4', title: 'Ani Khitapszyan', description: '' },
    { src: 'videos-/Anna Gordeeva.mp4', title: 'Anna Gordeeva', description: '' },
    { src: 'videos-/Anton Adrienko.mp4', title: 'Anton Adrienko', description: '' },
    { src: 'videos-/Aram Zurabyan.mp4', title: 'Aram Zurabyan', description: '' },
    { src: 'videos-/Bela Poghosyan.mp4', title: 'Bela Poghosyan', description: '' },
    { src: 'videos-/Betty Karibian.mp4', title: 'Betty Karibian', description: '' },
    { src: 'videos-/Bogdan Zubov.mp4', title: 'Bogdan Zubov', description: '' },
    { src: 'videos-/Camille.mp4', title: 'Camille', description: '' },
    { src: 'videos-/Hakob Balayan.mp4', title: 'Hakob Balayan', description: '' },
    { src: 'videos-/Jean.mp4', title: 'Jean', description: '' },
    { src: 'videos-/Joana Millet.mp4', title: 'Joana Millet', description: '' },
    { src: 'videos-/Kolay Shatalov.mp4', title: 'Kolay Shatalov', description: '' },
    { src: 'videos-/Leon Gaskin.mp4', title: 'Leon Gaskin', description: '' },
    { src: 'videos-/Liza Drudi.mp4', title: 'Liza Drudi', description: '' },
    { src: 'videos-/Luna Sybil.mp4', title: 'Luna Sybil', description: '' },
    { src: 'videos-/Mariana.mp4', title: 'Mariana', description: '' },
    { src: 'videos-/Marie-Aïda Karibian.mp4', title: 'Marie-Aïda Karibian', description: '' },
    { src: 'videos-/Masha Pospevola.mp4', title: 'Masha Pospevola', description: '' },
    { src: 'videos-/Martina.mp4', title: 'Martina', description: '' },
    { src: 'videos-/Michael-Atasoonts.mp4', title: 'Michael Atasoonts', description: '' },
    { src: 'videos-/Nathalie-Karibian.mp4', title: 'Nathalie Karibian', description: '' },
    { src: 'videos-/Patti-Smith.mp4', title: 'Patti Smith', description: '' },
    { src: 'videos-/Rita-Salnikova.mp4', title: 'Rita Salnikova', description: '' },
    { src: 'videos-/Samar.mp4', title: 'Samar', description: '' },
    { src: 'videos-/Sébastien Karibian.mp4', title: 'Sébastien Karibian', description: '' },
    { src: 'videos-/Silva Chobanyan.mp4', title: 'Silva Chobanyan', description: '' },
    { src: 'videos-/Stella Grigoryan.mp4', title: 'Stella Grigoryan', description: '' },
    { src: 'videos-/Stéphane Karibian.mp4', title: 'Stéphane Karibian', description: '' },
    { src: 'videos-/Tathev-Taryan.mp4', title: 'Tathev Taryan', description: '' }
];

function init() {
    // Initialisation de Three.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('video-container').appendChild(renderer.domElement);

    // Ajout de l'effet de particules
    createParticles();

    // Initialisation des sons
    initAudio();

    // Initialisation du raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Création des points vidéo
    createVideoPoints();

    // Position initiale de la caméra
    camera.position.z = 15;
    cameraTarget = new THREE.Vector3(0, 0, 0);
    
    // Gestion des événements de la souris
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onMouseWheel);

    // Gestion des événements
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onMouseClick);
}

function createParticles() {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        colors[i * 3] = Math.random() * 0.5 + 0.5; // Rouge
        colors[i * 3 + 1] = Math.random() * 0.5 + 0.5; // Vert
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // Bleu
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createVideoPoints() {
    const videoSize = 1.5;
    const cubeSize = 1.2;
    
    videos.forEach((video, index) => {
        // Position aléatoire dans l'espace avec plus de distance
        const x = (Math.random() - 0.5) * 30;
        const y = (Math.random() - 0.5) * 30;
        const z = (Math.random() - 0.5) * 30;

        // Création du groupe pour le cube
        const group = new THREE.Group();

        // Création des faces du cube avec les vidéos
        const videoGeometry = new THREE.PlaneGeometry(videoSize, videoSize);
        const videoElement = document.createElement('video');
        videoElement.src = video.src;
        videoElement.muted = true;
        videoElement.loop = true;
        videoElement.playsInline = true;
        
        const videoTexture = new THREE.VideoTexture(videoElement);
        const videoMaterial = new THREE.MeshBasicMaterial({ 
            map: videoTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });

        // Positions et rotations pour les 6 faces du cube
        const faceConfigs = [
            { pos: [0, 0, cubeSize/2], rot: [0, 0, 0] },           // face avant
            { pos: [0, 0, -cubeSize/2], rot: [0, Math.PI, 0] },    // face arrière
            { pos: [cubeSize/2, 0, 0], rot: [0, Math.PI/2, 0] },   // face droite
            { pos: [-cubeSize/2, 0, 0], rot: [0, -Math.PI/2, 0] }, // face gauche
            { pos: [0, cubeSize/2, 0], rot: [-Math.PI/2, 0, 0] },  // face haut
            { pos: [0, -cubeSize/2, 0], rot: [Math.PI/2, 0, 0] }   // face bas
        ];

        // Créer les 6 faces
        faceConfigs.forEach(config => {
            const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial.clone());
            videoMesh.position.set(...config.pos);
            videoMesh.rotation.set(...config.rot);
            videoMesh.userData = { isVideo: true, video, index };
            group.add(videoMesh);
        });

        // Position et rotation initiale du cube
        group.position.set(x, y, z);
        group.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        // Vitesse de rotation aléatoire
        group.userData = {
            video,
            index,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            movementSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            originalScale: 1,
            targetScale: 1,
            originalRotationSpeed: null,
            originalMovementSpeed: null
        };
        
        // Sauvegarder les vitesses originales
        group.userData.originalRotationSpeed = { ...group.userData.rotationSpeed };
        group.userData.originalMovementSpeed = { ...group.userData.movementSpeed };
        
        scene.add(group);
        videoPoints.push(group);
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Animation des particules
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;

    // Animation de la caméra
    if (cameraAnimation) {
        const progress = cameraAnimation.progress;
        const targetPosition = cameraAnimation.targetPosition;
        const targetLookAt = cameraAnimation.targetLookAt;

        // Interpolation de la position
        camera.position.lerp(targetPosition, 0.1);
        
        // Interpolation du point de vue
        cameraTarget.lerp(targetLookAt, 0.1);
        camera.lookAt(cameraTarget);

        // Vérifier si l'animation est terminée
        if (progress >= 1) {
            cameraAnimation = null;
        } else {
            cameraAnimation.progress += 0.02;
        }
    }

    if (!isPlaying) {
        // Animation des points
        videoPoints.forEach(point => {
            // Récupérer les vitesses cibles
            const targetRotationSpeed = point.userData.targetRotationSpeed || point.userData.originalRotationSpeed;
            const targetMovementSpeed = point.userData.targetMovementSpeed || point.userData.originalMovementSpeed;

            // Interpolation des vitesses
            point.userData.rotationSpeed.x += (targetRotationSpeed.x - point.userData.rotationSpeed.x) * 0.1;
            point.userData.rotationSpeed.y += (targetRotationSpeed.y - point.userData.rotationSpeed.y) * 0.1;
            point.userData.rotationSpeed.z += (targetRotationSpeed.z - point.userData.rotationSpeed.z) * 0.1;

            point.userData.movementSpeed.x += (targetMovementSpeed.x - point.userData.movementSpeed.x) * 0.1;
            point.userData.movementSpeed.y += (targetMovementSpeed.y - point.userData.movementSpeed.y) * 0.1;
            point.userData.movementSpeed.z += (targetMovementSpeed.z - point.userData.movementSpeed.z) * 0.1;

            // Application des vitesses
            point.rotation.x += point.userData.rotationSpeed.x;
            point.rotation.y += point.userData.rotationSpeed.y;
            point.rotation.z += point.userData.rotationSpeed.z;
            
            point.position.x += point.userData.movementSpeed.x;
            point.position.y += point.userData.movementSpeed.y;
            point.position.z += point.userData.movementSpeed.z;

            // Rebond sur les bords
            if (Math.abs(point.position.x) > 10) point.userData.movementSpeed.x *= -1;
            if (Math.abs(point.position.y) > 10) point.userData.movementSpeed.y *= -1;
            if (Math.abs(point.position.z) > 10) point.userData.movementSpeed.z *= -1;

            // Animation de l'échelle
            const scale = point.userData.targetScale;
            point.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        });
    }

    // Mise à jour du raycaster
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(videoPoints);

    // Mise en évidence du point survolé
    if (intersects.length > 0) {
        const point = intersects[0].object.parent;
        if (selectedPoint !== point) {
            if (selectedPoint) {
                // Restaurer les vitesses originales
                selectedPoint.userData.targetRotationSpeed = selectedPoint.userData.originalRotationSpeed;
                selectedPoint.userData.targetMovementSpeed = selectedPoint.userData.originalMovementSpeed;
                selectedPoint.userData.targetScale = 1;
                selectedPoint.children.forEach(child => {
                    child.material.opacity = 0.8;
                });
            }
            selectedPoint = point;
            // Ralentir la vidéo survolée
            point.userData.targetRotationSpeed = {
                x: point.userData.originalRotationSpeed.x * 0.2,
                y: point.userData.originalRotationSpeed.y * 0.2,
                z: point.userData.originalRotationSpeed.z * 0.2
            };
            point.userData.targetMovementSpeed = {
                x: point.userData.originalMovementSpeed.x * 0.2,
                y: point.userData.originalMovementSpeed.y * 0.2,
                z: point.userData.originalMovementSpeed.z * 0.2
            };
            point.userData.targetScale = 1.5;
            point.children.forEach(child => {
                child.material.opacity = 1;
            });
        }
    } else if (selectedPoint) {
        // Restaurer les vitesses originales
        selectedPoint.userData.targetRotationSpeed = selectedPoint.userData.originalRotationSpeed;
        selectedPoint.userData.targetMovementSpeed = selectedPoint.userData.originalMovementSpeed;
        selectedPoint.userData.targetScale = 1;
        selectedPoint.children.forEach(child => {
            child.material.opacity = 0.8;
        });
        selectedPoint = null;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseMove(event) {
    if (isDragging && !isPlaying) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        cameraRotation.x += deltaMove.x * 0.01;
        cameraRotation.y += deltaMove.y * 0.01;
        
        cameraRotation.y = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraRotation.y));

        const radius = camera.position.length();
        camera.position.x = radius * Math.sin(cameraRotation.x) * Math.cos(cameraRotation.y);
        camera.position.y = radius * Math.sin(cameraRotation.y);
        camera.position.z = radius * Math.cos(cameraRotation.x) * Math.cos(cameraRotation.y);
        
        camera.lookAt(scene.position);

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    // Mise à jour du raycaster pour le survol
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    const interactiveObjects = [];
    videoPoints.forEach(group => {
        group.children.forEach(child => {
            interactiveObjects.push(child);
        });
    });
    
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        const point = intersects[0].object.parent;
        if (selectedPoint !== point) {
            if (selectedPoint) {
                selectedPoint.userData.targetRotationSpeed = selectedPoint.userData.originalRotationSpeed;
                selectedPoint.userData.targetMovementSpeed = selectedPoint.userData.originalMovementSpeed;
                selectedPoint.userData.targetScale = 1;
                selectedPoint.children.forEach(child => {
                    child.material.opacity = 0.8;
                });
            }
            selectedPoint = point;
            point.userData.targetRotationSpeed = {
                x: point.userData.originalRotationSpeed.x * 0.2,
                y: point.userData.originalRotationSpeed.y * 0.2,
                z: point.userData.originalRotationSpeed.z * 0.2
            };
            point.userData.targetMovementSpeed = {
                x: point.userData.originalMovementSpeed.x * 0.2,
                y: point.userData.originalMovementSpeed.y * 0.2,
                z: point.userData.originalMovementSpeed.z * 0.2
            };
            point.userData.targetScale = 1.5;
            point.children.forEach(child => {
                child.material.opacity = 1;
            });
        }
    } else if (selectedPoint) {
        selectedPoint.userData.targetRotationSpeed = selectedPoint.userData.originalRotationSpeed;
        selectedPoint.userData.targetMovementSpeed = selectedPoint.userData.originalMovementSpeed;
        selectedPoint.userData.targetScale = 1;
        selectedPoint.children.forEach(child => {
            child.material.opacity = 0.8;
        });
        selectedPoint = null;
    }
}

function onMouseUp() {
    isDragging = false;
}

function onMouseWheel(event) {
    if (!isPlaying) {
        const delta = event.deltaY * 0.01;
        const direction = new THREE.Vector3().subVectors(camera.position, scene.position).normalize();
        camera.position.addScaledVector(direction, delta);
    }
}

function onMouseClick(event) {
    if (isDragging) return;

    raycaster.setFromCamera(mouse, camera);
    
    const clickableObjects = [];
    videoPoints.forEach(group => {
        group.children.forEach(child => {
            clickableObjects.push(child);
        });
    });
    
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const group = clickedObject.parent;
        const { video, index } = group.userData;
        
        // Arrêter l'animation et les autres vidéos
        isPlaying = true;
        stopAllVideos();
        
        // Animation de la caméra vers la vidéo
        const targetPosition = new THREE.Vector3().copy(group.position);
        targetPosition.z += 3;
        
        cameraAnimation = {
            targetPosition: targetPosition,
            targetLookAt: group.position,
            progress: 0
        };
        
        setTimeout(() => {
            showVideo(video);
        }, 1000);
    }
}

function initAudio() {
    // Créer et démarrer tous les éléments audio
    videos.forEach((video, index) => {
        const audio = new Audio();
        audio.src = video.src;
        audio.loop = true;
        audio.volume = 0.05; // Volume bas pour l'ambiance
        audio.preload = 'auto';
        audioElements.push(audio);
        
        // Démarrer la lecture
        audio.play().catch(error => {
            console.log('Audio play failed:', error);
        });
    });
}

function stopAllVideos() {
    // Arrêter tous les sons sauf celui de la vidéo sélectionnée
    audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function showVideo(video) {
    const player = document.getElementById('video-player');
    const videoElement = player.querySelector('video');
    const titleElement = player.querySelector('.video-title');
    const descriptionElement = player.querySelector('.video-description');
    
    videoElement.src = video.src;
    titleElement.textContent = video.title;
    titleElement.setAttribute('data-original-title', video.title);
    descriptionElement.textContent = video.description;
    descriptionElement.setAttribute('data-original-description', video.description);
    
    player.classList.remove('hidden');
    videoElement.play();
    
    // Ajouter des contrôles vidéo
    videoElement.controls = true;
    videoElement.style.width = '100%';
    videoElement.style.maxHeight = '80vh';
}

function closeVideo() {
    const player = document.getElementById('video-player');
    const videoElement = player.querySelector('video');
    
    videoElement.pause();
    videoElement.currentTime = 0;
    videoElement.muted = true;
    player.classList.add('hidden');
    isPlaying = false;
    
    // Animation de retour de la caméra
    cameraAnimation = {
        targetPosition: new THREE.Vector3(0, 0, 15),
        targetLookAt: new THREE.Vector3(0, 0, 0),
        progress: 0
    };
    
    // Redémarrer tous les audios d'ambiance
    audioElements.forEach(audio => {
        audio.volume = 0.05;
        audio.play().catch(error => {
            console.log('Audio play failed:', error);
        });
    });
}

// Initialisation
init();
animate();

// Gestion du bouton de fermeture
document.querySelector('.close-button').addEventListener('click', closeVideo); 