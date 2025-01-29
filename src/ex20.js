import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// CubeTextureLoader: 큐브맵을 로드
// 텍스쳐 파일은 poly haven에서 다운로드 가능
export function example() {
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const cubeTexture = cubeTextureLoader
    .setPath("/cubemap/")
    // + - x, + - y, + - z 순서대로 넣어줘야 함
    .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

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
  // scene의 배경을 envTex로 설정
  scene.background = cubeTexture;

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.5;
  camera.position.z = 5;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 2, 0);
  scene.add(directionalLight);

  // 축, 그리드 헬퍼
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(5);
  scene.add(gridHelper);

  const boxGeometry = new THREE.BoxGeometry(2, 2, 2);

  // envMap: 주변 환경을 비추는 효과
  const material = new THREE.MeshBasicMaterial({
    envMap: cubeTexture,
    // 여기 envMap을 설정하면 큐브가 envMap에 있는 것처럼 보임
  });
  const mesh = new THREE.Mesh(boxGeometry, material);
  scene.add(mesh);

  const controls = new OrbitControls(camera, renderer.domElement);

  const clock = new THREE.Clock();
  function draw() {
    const time = clock.getDelta();

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
