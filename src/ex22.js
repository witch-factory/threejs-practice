import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import dat from "dat.gui";

// 조명 강의 실습
export function example() {
  // renderer
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // 그림자 사용 설정
  renderer.shadowMap.enabled = true;
  // 그림자 렌더링 스타일 설정 가능
  // 기본은 THREE.PCFShadowMap
  // BasicShadowMap은 shadow.radius가 안 먹음
  renderer.shadowMap.type = THREE.BasicShadowMap;

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

  // Light
  // 다른 형태의 light는 공식 문서 참고 가능
  // pointLight 등이 있고 pointLightHelper처럼 대응하는 헬퍼도 있음
  // SpotLight: 무대 조명처럼 점에서 특정 범위로 쏘는 빛
  // HemisphereLight: 하늘과 땅에서 빛을 쏘는 느낌
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 3, 0);
  scene.add(directionalLight);

  const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
  scene.add(lightHelper);

  // 그림자 설정
  directionalLight.castShadow = true; // 이 빛은 그림자를 만들 수 있는 빛이다
  directionalLight.shadow.mapSize.width = 1024; // 그림자의 해상도(퀄리티)
  directionalLight.shadow.mapSize.height = 1024;
  // 그림자를 지게 할 범위. 불필요한 범위까지 그림지가 지게 하는 걸 막아줌
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 6;
  // directionalLight.shadow.radius = 4; // 그림자의 부드러움 정도

  // controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

  // material
  const material1 = new THREE.MeshStandardMaterial({
    color: "white",
  });
  const material2 = new THREE.MeshStandardMaterial({
    color: "#c0eb75",
  });
  const material3 = new THREE.MeshStandardMaterial({
    color: "blue",
  });

  // mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  plane.rotation.x = -Math.PI / 2;
  const box = new THREE.Mesh(boxGeometry, material2);
  box.position.set(2, 1, 0);
  const sphere = new THREE.Mesh(sphereGeometry, material3);
  sphere.position.set(-2, 1, 0);

  // 그림자 설정
  plane.receiveShadow = true; // 이 물체는 그림자를 받을 수 있는 물체이다
  box.castShadow = true;
  box.receiveShadow = true;
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  scene.add(box, plane, sphere);

  // 축, 그리드 헬퍼
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(5);
  scene.add(gridHelper);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(directionalLight.position, "x", -5, 5, 0.01);
  gui.add(directionalLight.position, "y", -5, 5, 0.01);
  gui.add(directionalLight.position, "z", -5, 5, 0.01);

  const clock = new THREE.Clock();
  function draw() {
    const time = clock.getElapsedTime();
    // directionalLight.position.x = Math.cos(time);
    // directionalLight.position.z = Math.sin(time);

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
