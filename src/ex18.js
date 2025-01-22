import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 텍스쳐 이미지 여러 개 로드
export function example() {
  // 텍스쳐 로드
  // loadingManager를 인수로 전달해서 사용할 수도 있다
  const textureLoader = new THREE.TextureLoader();
  const topTexture = textureLoader.load("/mcstyle/top.png");
  const bottomTexture = textureLoader.load("/mcstyle/bottom.png");
  const leftTexture = textureLoader.load("/mcstyle/left.png");
  const rightTexture = textureLoader.load("/mcstyle/right.png");
  const frontTexture = textureLoader.load("/mcstyle/front.png");
  const backTexture = textureLoader.load("/mcstyle/back.png");

  // 6개 텍스쳐 로드 -> materials 배열을 만들어서 사용
  const materials = [
    new THREE.MeshBasicMaterial({ map: rightTexture }),
    new THREE.MeshBasicMaterial({ map: leftTexture }),
    new THREE.MeshBasicMaterial({ map: topTexture }),
    new THREE.MeshBasicMaterial({ map: bottomTexture }),
    new THREE.MeshBasicMaterial({ map: frontTexture }),
    new THREE.MeshBasicMaterial({ map: backTexture }),
  ];
  // 픽셀을 살려서 보여주기
  topTexture.magFilter = THREE.NearestFilter;
  bottomTexture.magFilter = THREE.NearestFilter;
  leftTexture.magFilter = THREE.NearestFilter;
  rightTexture.magFilter = THREE.NearestFilter;
  frontTexture.magFilter = THREE.NearestFilter;
  backTexture.magFilter = THREE.NearestFilter;

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
  camera.position.z = 4;
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

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  // basic material: 입체감이 없는 단순한 색상을 입힐 수 있는 재질. 빛에 영향 x
  const material = new THREE.MeshStandardMaterial({
    // color: "#b197fc",
    map: topTexture,
  });
  const mesh = new THREE.Mesh(boxGeometry, materials);
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
