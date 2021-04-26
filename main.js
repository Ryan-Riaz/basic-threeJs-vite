import {
    BufferGeometry,
    Clock,
    Float32BufferAttribute,
    Group,
    Line,
    LineBasicMaterial,
    MathUtils,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    TextureLoader,
    VertexColors,
    WebGLRenderer,
} from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";

// texture load from file
const textureLoader = new TextureLoader();
const circleWhite = textureLoader.load("/disc.png");
const alphaMap = textureLoader.load("/alpha.png");

// create a scene
const scene = new Scene();
// scene.add(new AxesHelper());

let count = 100;
let distance = 3;
let points = new Float32Array(count * 3);
let colors = new Float32Array(count * 3);

for (let i = 0; i < points.length; i++) {
    points[i] = MathUtils.randFloatSpread(distance * 2);
    colors[i] = Math.random() * 0.5 + 0.5;
}

// cube (Mesh aka Objects)
// const geometry = new BoxGeometry(1, 1, 1);
// const cubeGeometry = new BoxBufferGeometry(1, 1, 1);
const particles = new BufferGeometry();
particles.setAttribute("position", new Float32BufferAttribute(points, 3));
particles.setAttribute("color", new Float32BufferAttribute(colors, 3));

// const material = new MeshBasicMaterial({ color: 0x4f2fdd });
const pointMaterial = new PointsMaterial({
    // color: 0x4f2fdd,
    vertexColors: VertexColors,
    size: 0.2,
    // map: alphaMap,
    alphaMap: circleWhite,
    alphaTest: 0.3,
    transparent: true,
});

const pointsObj = new Points(particles, pointMaterial);
// scene.add(pointsObj);

const group = new Group();
group.add(pointsObj);
scene.add(group);

// const cube = new Mesh(geometry, material);
// scene.add(cube);

//create a blue LineBasicMaterial
const lineMaterial = new LineBasicMaterial({
    color: 0x000000,
    opacity: 0.05,
    // depthTest: false,
    depthWrite: false,
});

const lineObj = new Line(particles, lineMaterial);
group.add(lineObj);

// interesting mesh of particles
// group.add(new Mesh(new SphereBufferGeometry(1, 32), new MeshNormalMaterial()));

// Camera
const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);
camera.position.z = 3;
scene.add(camera);

// renderer
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.clearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
// renderer.render(scene, camera);

// const controls = new OrbitControls(camera, renderer.domElement);

// mouse move effect
let mouseX = 0;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
});

// animation
const clock = new Clock();
const animate = function () {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // group.rotateY(0.001 * Math.PI);

    const time = clock.getElapsedTime();
    group.rotation.x = time * 0.1;

    const ratio = (mouseX / window.innerWidth - 0.5) * 2;
    group.rotation.y = ratio * Math.PI;

    // controls.update();

    renderer.render(scene, camera);
};

animate();

// window resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
