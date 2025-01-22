import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import witch from "./ai-witch.webp";

// 텍스쳐 이미지 로드
export function example() {
  // 텍스쳐 로드
  // loadingManager를 인수로 전달해서 사용할 수도 있다
  const textureLoader = new THREE.TextureLoader();
  const witchTexture = textureLoader.load(witch);
  console.log(witchTexture);
  // 텍스쳐 반복. offset이나 repeat를 쓸 때는 특별한 효과를 주고 싶은 게 아니면
  // wrapS, wrapT를 설정해줘야 한다.
  witchTexture.wrapS = THREE.RepeatWrapping;
  witchTexture.wrapT = THREE.RepeatWrapping;
  // witchTexture.offset.x = 0.3;
  // witchTexture.offset.y = 0.3;
  // 반복 횟수
  witchTexture.repeat.set(2, 2);
  // texture의 rotation, center, matrix 등을 설정할 수 있다.

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

  const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  // basic material: 입체감이 없는 단순한 색상을 입힐 수 있는 재질. 빛에 영향 x
  const material = new THREE.MeshBasicMaterial({
    // color: "#b197fc",
    map: witchTexture,
  });
  // 퐁, 램버트 material은 빛이 필요하다
  // PhongMaterial: 입체감이 있는 재질. 빛에 반사되는 효과를 줄 수 있다.
  const material2 = new THREE.MeshPhongMaterial({ color: "#ff0000" });
  // LambertMaterial: 하이라이트나 반사광이 없다. 반짝이는 효과가 있는 재질 표현은 불가
  // 당연히 LambertMaterial이 PhongMaterial보다 더 빠르다.
  const material3 = new THREE.MeshLambertMaterial({ color: "#00ff00" });
  // standard material: 입체감이 있는 재질. 빛에 반사되는 효과를 줄 수 있고 roughness, metalness를 조절할 수 있다.
  const material4 = new THREE.MeshStandardMaterial({
    color: "#c5f6fa",
    roughness: 0.5,
    // 금속성
    metalness: 0.5,
    flatShading: true,
    // side: THREE.DoubleSide, side 옵션을 통해서 front/back/양면 중 어떤 걸 보여줄지 정할 수 있다.
  });
  const mesh = new THREE.Mesh(boxGeometry, material);
  scene.add(mesh);
  const mesh2 = new THREE.Mesh(geometry, material2);
  mesh2.position.x = 2;
  scene.add(mesh2);
  const mesh3 = new THREE.Mesh(geometry, material3);
  mesh3.position.x = -2;
  scene.add(mesh3);
  const mesh4 = new THREE.Mesh(geometry, material4);
  mesh4.position.z = -2;
  scene.add(mesh4);

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
