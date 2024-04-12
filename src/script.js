import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import shadingVertexShader from './shaders/shading/vertex.glsl';
import shadingFragmentShader from './shaders/shading/fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Loaders
const gltfLoader = new GLTFLoader();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 7;
camera.position.y = 7;
camera.position.z = 7;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 3
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Material
 */
const materialParameters = {
  materialColor: '#ffffff',
  ambientLightColor: '#CBCBCB',
  directionalLightColor: '#1A80ff',
  pointLight1Color: '#ff1A1A',
  pointLight2Color: '#00FF80',
};

const material = new THREE.ShaderMaterial({
  vertexShader: shadingVertexShader,
  fragmentShader: shadingFragmentShader,
  uniforms: {
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.materialColor)),
    uAmbientLightColor: new THREE.Uniform(new THREE.Color(materialParameters.ambientLightColor)),
    uDirectionalLightColor: new THREE.Uniform(new THREE.Color(materialParameters.directionalLightColor)),
    uPointLight1Color: new THREE.Uniform(new THREE.Color(materialParameters.pointLight1Color)),
    uPointLight2Color: new THREE.Uniform(new THREE.Color(materialParameters.pointLight2Color)),
  },
});

gui.addColor(materialParameters, 'materialColor').onChange(() => {
  material.uniforms.uColor.value.set(materialParameters.materialColor);
});

const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.addColor(materialParameters, 'ambientLightColor').onChange(() => {
  material.uniforms.uAmbientLightColor.value.set(materialParameters.ambientLightColor);
});

const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.addColor(materialParameters, 'directionalLightColor').onChange(() => {
  material.uniforms.uDirectionalLightColor.value.set(materialParameters.directionalLightColor);
  directionalLightHelper.material.color.set(materialParameters.directionalLightColor);
});

const pointLight1Folder = gui.addFolder('Point Light 1');
pointLight1Folder.addColor(materialParameters, 'pointLight1Color').onChange(() => {
  material.uniforms.uPointLight1Color.value.set(materialParameters.pointLight1Color);
  pointLight1Helper.material.color.set(materialParameters.pointLight1Color);
});

const pointLight2Folder = gui.addFolder('Point Light 2');
pointLight2Folder.addColor(materialParameters, 'pointLight2Color').onChange(() => {
  material.uniforms.uPointLight2Color.value.set(materialParameters.pointLight2Color);
});

/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32), material);
torusKnot.position.x = 3;
scene.add(torusKnot);

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
sphere.position.x = -3;
scene.add(sphere);

// Suzanne
let suzanne = null;
gltfLoader.load('./suzanne.glb', gltf => {
  suzanne = gltf.scene;
  suzanne.traverse(child => {
    if (child.isMesh) child.material = material;
  });
  scene.add(suzanne);
});

/**
 * Light helpers
 */
const directionalLightHelper = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial());
directionalLightHelper.material.color.set(materialParameters.directionalLightColor);
directionalLightHelper.material.side = THREE.DoubleSide;
directionalLightHelper.position.set(0, 0, 3);

scene.add(directionalLightHelper);

const pointLight1Helper = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 2), new THREE.MeshBasicMaterial());
pointLight1Helper.material.color.set(materialParameters.pointLight1Color);
pointLight1Helper.position.set(0, 2.5, 0);

scene.add(pointLight1Helper);

const pointLight2Helper = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 2), new THREE.MeshBasicMaterial());
pointLight2Helper.material.color.set(materialParameters.pointLight2Color);
pointLight2Helper.position.set(2, 2, 2);

scene.add(pointLight2Helper);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate objects
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.1;
    suzanne.rotation.y = elapsedTime * 0.2;
  }

  sphere.rotation.x = -elapsedTime * 0.1;
  sphere.rotation.y = elapsedTime * 0.2;

  torusKnot.rotation.x = -elapsedTime * 0.1;
  torusKnot.rotation.y = elapsedTime * 0.2;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
