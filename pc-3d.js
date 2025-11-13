// --- Configuración de la Escena ---
const container = document.getElementById('pc-3d-container');
if (!container) {
    console.error("El contenedor 'pc-3d-container' no fue encontrado.");
    throw new Error("Contenedor no encontrado.");
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

// CAMBIO: Activar alpha y transparencia
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true  // Esto permite transparencia
});

renderer.setSize(container.clientWidth, container.clientHeight);
// CAMBIO: Hacer el fondo transparente
renderer.setClearColor(0x000000, 0); // Color negro con alpha 0 (transparente)
container.appendChild(renderer.domElement);

// Ya NO establecemos scene.background
// scene.background = new THREE.Color(0xeeeeee); // ELIMINAR ESTA LÍNEA

// --- Variables para el Modelo y la Animación ---
let loadedModel;
let controls;

// --- Funciones Principales ---

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5); 
    scene.add(directionalLight);
}

function setupControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // CAMBIOS: Configuración para solo permitir rotación
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;
    
    // NUEVO: Deshabilitar zoom
    controls.enableZoom = false;
    
    // NUEVO: Deshabilitar paneo (mover la cámara)
    controls.enablePan = false;
    
    // OPCIONAL: Limitar la rotación vertical
    controls.minPolarAngle = Math.PI / 4; // 45 grados desde arriba
    controls.maxPolarAngle = Math.PI / 1.5; // 120 grados desde arriba
}

function loadModel() {
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        'assets/3d-models/desktop-coding.glb', 
        function (gltf) {
            loadedModel = gltf.scene;
            scene.add(loadedModel);
            console.log("Modelo .glb cargado exitosamente.");
        },
        undefined,
        function (error) {
            console.error('Error al cargar el modelo .glb:', error);
        }
    );
}

function animate() {
    requestAnimationFrame(animate);

    // Rotación automática suave
    if (loadedModel) {
        loadedModel.rotation.y += 0.003; 
    }
    
    if (controls) {
        controls.update(); 
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// --- Inicialización ---
setupLighting();
camera.position.set(0, 2, 5); 
setupControls();
loadModel();
animate();

window.addEventListener('resize', onWindowResize);