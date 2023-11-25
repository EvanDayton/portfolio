import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let composer;
let outlinePass;
let selectedObjects = [];
let textMesh;

window.addEventListener('wheel', handleScroll);

// Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc); // Replace 0xabcdef with your desired color

let orbMouse = new THREE.Vector2();
let orbRaycaster = new THREE.Raycaster();

function animate() {
    requestAnimationFrame(animate);

    // Update the animation mixer for the main model
    const deltaTime = 0.01; // You can adjust this value for the animation speed
    mixer.update(deltaTime);

    renderer.render(scene, camera);
}

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3.5, 30); // Initial camera position
camera.lookAt(0, 3.5, 30);

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the GLTF model for the floating object
let floatingObject;
let parentObject = new THREE.Object3D(); // Create an empty parent object

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.8;
directionalLight.shadow.camera.far = 100;

const loader = new GLTFLoader();

loader.load('./glb/pine.glb', (gltf) => {
    floatingObject = gltf.scene;
    // Position the floating object in the middle of the two-letter kanji
    floatingObject.position.set(0, -1.5, 0); // Adjust the position as needed

    // Scale the floating object down (adjust the scale value as needed)
    floatingObject.scale.set(1.2, 1.2, 1.2); 

    // Add the floating object to the parent object
    parentObject.add(floatingObject);

    // Position the parent object near the initial camera position
    parentObject.position.set(6, 2, 20); // Adjust the position as needed
    scene.add(parentObject);

    // Set up rotation variables for the parent object (horizontal rotation only)
    const rotationSpeed = 0.01; // You can adjust this value for rotation speed

    // Animation loop for the parent object
    function animateFloatingObject() {
        requestAnimationFrame(animateFloatingObject);

        // Update the rotation of the parent object (horizontal rotation only)
        parentObject.rotation.y += rotationSpeed;

        renderer.render(scene, camera);
    }

    animateFloatingObject();
});

function initOutline() {
    composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outlinePass);

    // Set the outline color and parameters
    outlinePass.visibleEdgeColor.set('#ff0000'); // Color of the outline

    // Adjust these values for a stronger outline
    outlinePass.edgeStrength = 2100; // Increase the strength of the outline effect
    outlinePass.edgeGlow = 50; // Increase the glow intensity of the outline
    outlinePass.edgeThickness = 5; // Thickness of the outline
    outlinePass.pulsePeriod = 0; // No pulsing effect
    outlinePass.usePatternTexture = false;

    // Add the orb object to the list of selected objects
    selectedObjects.push(floatingObject);
    outlinePass.selectedObjects = selectedObjects;
}

window.addEventListener('mousemove', onMouseMove);

let isHovered = false;
let orbClicked = false;
let allowScrolling = true; // A flag to control scrolling

// Function to handle scrolling
function handleScroll(e) {
    if (!allowScrolling) {
        e.preventDefault(); // Prevent default scroll behavior
    }
}

// Handle window resizing
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});

// This part ensures that the animation loop continues to run
animate();
