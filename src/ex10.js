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
  const material = new THREE.MeshStandardMaterial({ color: "#f783ac" });

  const group1 = new THREE.Group();
  const sun = new THREE.Mesh(geometry, material);

  const group2 = new THREE.Group();
  const earth = sun.clone();
  // earth.material.color.set("#2e86de");
  earth.scale.set(0.3, 0.3, 0.3);
  group2.position.set(2, 0, 0);

  // Object3D로 만들 수도 있다
  const group3 = new THREE.Group();
  const moon = earth.clone();
  moon.scale.set(0.1, 0.1, 0.1);
  moon.position.set(0.5, 0, 0);

  group3.add(moon);
  group2.add(earth, group3);
  group1.add(sun, group2);
  scene.add(group1);

  // JS의 객체 속성값을 GUI로 조정할 수 있게 해줌
  const gui = new dat.GUI();
  // 객체, 조정할 속성, 최소, 최대, 단계
  gui.add(camera.position, "x", -5, 5, 0.1).name("카메라 X");
  gui.add(camera.position, "y", -5, 5, 0.1).name("카메라 Y");
  gui.add(camera.position, "z", 2, 10, 0.1).name("카메라 Z");

  const clock = new THREE.Clock();
  function draw() {
    const delta = clock.getDelta();

    group1.rotation.y += 0.5 * delta;
    group2.rotation.y += 0.5 * delta;
    group3.rotation.y += 0.5 * delta;
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
