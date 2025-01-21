import * as THREE from "three";
import dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export function example() {
  // renderer
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Scene
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.5;
  camera.position.z = 15;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 2, 0);
  scene.add(directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);

  // 인수가 사이즈
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(5);
  scene.add(gridHelper);

  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: "hotpink",
    side: THREE.DoubleSide, // 안에서도 보이게
    flatShading: true, // 평면으로 쉐이딩
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  // 점 개수*3의 원소 개수
  const positionArray = geometry.attributes.position.array;
  const randomArray = [];

  for (let i = 0; i < positionArray.length; i += 3) {
    // 정점 한 개의 xyz 좌표를 랜덤으로 조정
    positionArray[i] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 1] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 2] += (Math.random() - 0.5) * 0.2;

    randomArray.push(Math.random() - 0.5);
    randomArray.push(Math.random() - 0.5);
    randomArray.push(Math.random() - 0.5);
  }

  // JS의 객체 속성값을 GUI로 조정할 수 있게 해줌
  const gui = new dat.GUI();
  // 객체, 조정할 속성, 최소, 최대, 단계
  gui.add(camera.position, "x", -5, 5, 0.1).name("카메라 X");
  gui.add(camera.position, "y", -5, 5, 0.1).name("카메라 Y");
  gui.add(camera.position, "z", 2, 10, 0.1).name("카메라 Z");

  const clock = new THREE.Clock();
  function draw() {
    const time = clock.getElapsedTime();

    for (let i = 0; i < positionArray.length; i += 3) {
      positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.002;
      positionArray[i + 1] += Math.cos(time + randomArray[i + 1] * 100) * 0.002;
      positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.002;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);

    renderer.setAnimationLoop(draw);
  }

  // 리사이즈
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    // 카메라에 변화가 있을 경우 실행
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", onWindowResize);

  draw();
}
