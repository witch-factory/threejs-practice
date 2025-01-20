import * as THREE from "three";
import dat from "dat.gui";

export function example() {
  // renderer
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  // scene의 배경은 렌더러 위에 덧칠됨
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 2, 0);
  scene.add(directionalLight);

  // 인수가 사이즈
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(5);
  scene.add(gridHelper);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: "#7048e8" });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // JS의 객체 속성값을 GUI로 조정할 수 있게 해줌
  const gui = new dat.GUI();
  // 객체, 조정할 속성, 최소, 최대, 단계
  gui.add(camera.position, "x", -5, 5, 0.1).name("카메라 X");
  gui.add(camera.position, "y", -5, 5, 0.1).name("카메라 Y");
  gui.add(camera.position, "z", 2, 10, 0.1).name("카메라 Z");

  const clock = new THREE.Clock();
  function draw() {
    const delta = clock.getDelta();
    mesh.rotation.y += 0.5 * delta;
    mesh.position.set(1, 0, 0);
    mesh.scale.x = 2;

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
