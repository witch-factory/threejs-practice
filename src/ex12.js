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
  camera.position.z = 10;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 2, 0);
  scene.add(directionalLight);

  // 카메라와 렌더러 요소가 인수로 들어감
  const controls = new OrbitControls(camera, renderer.domElement);
  // 여러 컨트롤 옵션들(이외에도 있음)
  // 카메라 이동을 부드럽게
  controls.enableDamping = true;
  // 줌 사용 불가
  // controls.enableZoom = false;
  // 줌 최소/최대 거리 설정
  // controls.minDistance = 5;
  // controls.maxDistance = 10;
  // 극좌표 기준으로 최대 회전 각도 설정
  // controls.maxPolarAngle = Math.PI / 2;
  // 회전 중심점 설정
  // controls.target.set(2,2,2);
  // 자동 회전
  controls.autoRotate = true;
  // 회전 속도
  // controls.autoRotateSpeed = 2;

  // 인수가 사이즈
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(5);
  scene.add(gridHelper);

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  let mesh, material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(
      ${Math.floor(Math.random() * 200) + 55}, 
      ${Math.floor(Math.random() * 200) + 55}, 
      ${Math.floor(Math.random() * 200) + 55})`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 10;
    scene.add(mesh);
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

    controls.update();
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
