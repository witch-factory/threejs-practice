import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
  camera.position.z = 5;
  scene.add(camera);

  // 축, 그리드 헬퍼
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(5);
  scene.add(gridHelper);

  const texCanvas = document.createElement("canvas");
  // 캔버스에 그림을 그리려면 이 컨텍스트 객체라는 걸 사용해야 한다
  const ctx = texCanvas.getContext("2d");
  texCanvas.width = 256;
  texCanvas.height = 256;
  const canvasTexture = new THREE.CanvasTexture(texCanvas);

  const boxGeometry = new THREE.BoxGeometry(2, 2, 2);

  // envMap: 주변 환경을 비추는 효과
  const material = new THREE.MeshBasicMaterial({
    map: canvasTexture,
  });
  const mesh = new THREE.Mesh(boxGeometry, material);
  scene.add(mesh);

  const controls = new OrbitControls(camera, renderer.domElement);

  const clock = new THREE.Clock();
  function draw() {
    const time = clock.getElapsedTime();

    material.map.needsUpdate = true;

    // 캔버스에 그림 그리기
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "gold";
    ctx.fillRect(time * 50, 10, 100, 100);
    ctx.fillStyle = "blue";
    ctx.font = "20px Arial";
    ctx.fillText("나는 마녀", 10, 150);

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
