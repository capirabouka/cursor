// Configuration de la scène Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('scene'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lumière
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Position de la caméra (vue à la première personne)
camera.position.set(0, 1.6, 0); // Hauteur des yeux
camera.rotation.set(0, 0, 0);

// Chargement des textures
const textureLoader = new THREE.TextureLoader();

// Création de l'intérieur de l'avion
const planeInterior = new THREE.Group();

// Sol
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    roughness: 0.8
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
planeInterior.add(floor);

// Sièges
const seatGeometry = new THREE.BoxGeometry(1, 0.5, 1);
const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });

for (let i = -2; i <= 2; i += 2) {
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.set(i, 0.25, -2);
    planeInterior.add(seat);
}

// Table devant
const tableGeometry = new THREE.BoxGeometry(8, 0.1, 1);
const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, 0.6, -1.5);
planeInterior.add(table);

// Passeports
const passports = [
    {
        title: "Passeport Diplomatique",
        text: "Un document officiel délivré aux diplomates pour leurs voyages internationaux.",
        position: new THREE.Vector3(-1, 0.7, -1.2)
    },
    {
        title: "Passeport Ordinaire",
        text: "Le document de voyage standard pour les citoyens.",
        position: new THREE.Vector3(0, 0.7, -1.2)
    },
    {
        title: "Passeport de Service",
        text: "Délivré aux fonctionnaires en mission officielle.",
        position: new THREE.Vector3(1, 0.7, -1.2)
    }
];

const passportGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.01);
const passportMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

passports.forEach((passport, index) => {
    const passportMesh = new THREE.Mesh(passportGeometry, passportMaterial);
    passportMesh.position.copy(passport.position);
    passportMesh.userData = { index: index };
    planeInterior.add(passportMesh);
});

scene.add(planeInterior);

// Raycaster pour la détection des clics
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Gestion des clics
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planeInterior.children);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.index !== undefined) {
            const passport = passports[clickedObject.userData.index];
            showPassportModal(passport);
        }
    }
}

// Gestion de la modal
const modal = document.getElementById('passportModal');
const closeButton = document.querySelector('.close-modal');

function showPassportModal(passport) {
    document.getElementById('passportTitle').textContent = passport.title;
    document.getElementById('passportText').textContent = passport.text;
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', onMouseClick);

// Animation
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate(); 