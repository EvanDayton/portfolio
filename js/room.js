import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './hyperspace.js'; // Import hyperspace.js

let composer; // Declare composer globally
let outlinePass; // Declare outlinePass globally
let selectedObjects = []; // Declare selectedObjects globally
window.addEventListener('wheel', handleScroll);

// Set up the scene
const scene = new THREE.Scene();

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
camera.position.set(0, 5, 25); // Initial camera position
camera.lookAt(0, 3, 18);

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Load the GLTF model for the main scene
const loader = new GLTFLoader();

let model;
let mixer; // Declare the mixer variable here

loader.load('./objects/scene.gltf', (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // Set up the animation mixer for the main model
    mixer = new THREE.AnimationMixer(model); // Initialize the mixer
    const clips = gltf.animations;

    clips.forEach((clip) => {
        mixer.clipAction(clip).play();
    });

    // Define the scroll effect
    const minCameraDistance = 13; // Minimum distance to the camera
    const maxCameraDistance = 25; // Maximum distance to the camera
    const scrollSpeed = 0.01; // You can adjust this value to control the zoom speed
    let currentCameraPositionZ = camera.position.z;

    // Prevent default scroll behavior
    window.addEventListener('scroll', (e) => {
        e.preventDefault();
    });

    // Handle custom scroll effect
    let scrollAmount = 0;
    const maxScrollAmount = 100; // Adjust this value for the maximum scroll effect
    window.addEventListener('wheel', (e) => {
        scrollAmount += e.deltaY;
        scrollAmount = Math.max(0, Math.min(scrollAmount, maxScrollAmount));

        const targetCameraPositionZ = minCameraDistance + (maxCameraDistance - minCameraDistance) * (scrollAmount / maxScrollAmount);
        currentCameraPositionZ += (targetCameraPositionZ - currentCameraPositionZ) * 0.1; // Smoothing factor
        camera.position.z = currentCameraPositionZ;
    });

    // Animation loop
    function sceneanimate() {
        requestAnimationFrame(animate);

        // Update the animation mixer for the main model
        const deltaTime = 0.01; // You can adjust this value for the animation speed
        mixer.update(deltaTime);

        renderer.render(scene, camera);
    }

    sceneanimate();
});

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

loader.load('./objects/evangelion.glb', (gltf) => {
    floatingObject = gltf.scene;
    // Position the floating object in the middle of the two-letter kanji
    floatingObject.position.set(0, -0.8, 0); // Adjust the position as needed

    // Scale the floating object down (adjust the scale value as needed)
    floatingObject.scale.set(0.015, 0.015, 0.015); 

    // Add the floating object to the parent object
    parentObject.add(floatingObject);

    // Position the parent object near the initial camera position
    parentObject.position.set(0, 4.5, 20.7); // Adjust the position as needed
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


// Load the GLTF model for the "orb" object
let orbObject;
let orbMixer; // Declare the orbMixer variable here
let outlineSphere; // Declare the outline sphere

loader.load('./objects/orblightning.glb', (gltf) => {
    orbObject = gltf.scene;
    const orbLight = new THREE.PointLight(0x9925be, 2000, 0);
    orbLight.position.set(0, 3.8, 11);
    scene.add(orbLight);

    // Add the orbObject to the scene
    scene.add(orbObject);

    // Position the "orb" object as needed
    orbObject.position.set(0.05, 3.5, 9); // Adjust the position as needed

    // Scale the "orb" object (adjust the scale value as needed)
    orbObject.scale.set(0.025, 0.025, 0.025);

    // Create an invisible outer sphere for outlining
    const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, side: THREE.BackSide });
    const sphereGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    outlineSphere = new THREE.Mesh(sphereGeometry, outlineMaterial);
    outlineSphere.position.copy(orbObject.position); // Set the position to match the orb
    scene.add(outlineSphere);

    // Set up an animation mixer for the "orb" model
    orbMixer = new THREE.AnimationMixer(orbObject);

    const orbClips = gltf.animations;
    initOutline();

    if (orbClips.length > 0) {
        orbClips.forEach((clip) => {
            orbMixer.clipAction(clip).play();
        });

        // Animation loop for the "orb" model
        function animateOrb() {
            requestAnimationFrame(animateOrb);

            // Update the animation mixer for the "orb" model
            const deltaTime = 0.01; // You can adjust this value for the animation speed
            orbMixer.update(deltaTime);

            // Use the orbRaycaster here for raycasting
            orbRaycaster.setFromCamera(orbMouse, camera);
            const intersects = orbRaycaster.intersectObject(outlineSphere);

            if (intersects.length > 0) {
                // Mouse is hovering over the orb
                outlineSphere.material.opacity = 0.5; // Adjust opacity as needed
            } else {
                // Mouse is not hovering over the orb
                outlineSphere.material.opacity = 0.0;
            }

            renderer.render(scene, camera);
        }

        animateOrb(); // Start the animation loop for the "orb" model
    } else {
        console.error('No animations found in "orb.glb"');
    }
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
    selectedObjects.push(orbObject);
    outlinePass.selectedObjects = selectedObjects;
}

window.addEventListener('mousemove', onMouseMove);

let isHovered = false;
let orbClicked = false;
let allowScrolling = true; // A flag to control scrolling

function handleOrbClick(event) {
    orbMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    orbMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    orbRaycaster.setFromCamera(orbMouse, camera);

    const intersects = orbRaycaster.intersectObject(outlineSphere);

    if (intersects.length > 0) {
        // Mouse is hovering over the orb
        // Teleport the camera to a specific position
        camera.position.set(0, 30, 8); // Teleport the camera
        camera.lookAt(0, 30, 5); // Adjust the camera's lookAt as needed

        // Show the hyperspace canvas
        canvas.style.display = 'block';

        // Set the flag to indicate the orb is pressed
        orbPressed = true;

        // Start the hyperspace animation
        animateHyperspace();
    }
}

// Add a click event listener to the document to handle orb clicks
document.addEventListener('click', handleOrbClick);

// Function to handle scrolling
function handleScroll(e) {
    if (!allowScrolling) {
        e.preventDefault(); // Prevent default scroll behavior
    }
}

window.addEventListener('wheel', handleScroll);

// Add a check to enable or disable scrolling
if (allowScrolling) {
    window.addEventListener('wheel', (e) => {
        scrollAmount += e.deltaY;
        scrollAmount = Math.max(0, Math.min(scrollAmount, maxScrollAmount));

        const targetCameraPositionZ = minCameraDistance + (maxCameraDistance - minCameraDistance) * (scrollAmount / maxScrollAmount);
        currentCameraPositionZ += (targetCameraPositionZ - currentCameraPositionZ) * 0.1; // Smoothing factor
        camera.position.z = currentCameraPositionZ;
    });
}

// Remove the wheel event listener for scrolling when the orb is clicked
document.addEventListener('click', () => {
    window.removeEventListener('wheel', handleScroll);
});

// Add a click event listener to the document to handle orb clicks
document.addEventListener('click', handleOrbClick);

function onMouseMove(event) {
    orbMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    orbMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    orbRaycaster.setFromCamera(orbMouse, camera);

    const intersects = orbRaycaster.intersectObject(orbObject);

    if (intersects.length > 0) {
        // Mouse is hovering over the orb
        if (!isHovered) {
            outlinePass.selectedObjects = selectedObjects;
            isHovered = true;
        }
    } else {
        // Mouse is not hovering over the orb
        if (isHovered) {
            outlinePass.selectedObjects = [];
            isHovered = false;
        }
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