import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// ----- 주제: 라인 그려보기

export function example() {
  // Renderer
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls

  // Mesh
  const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  // 버퍼 지오메트리는 점들을 이어주면서 직접 그리는 방식
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 100),
    new THREE.Vector3(0, 0, -100),
  ]);
  const guideLine = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(guideLine);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box";

  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({ color: "skyblue" });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus";

  scene.add(boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh];

  const raycaster = new THREE.Raycaster();

  const controls = new OrbitControls(camera, renderer.domElement);

  // 축, 그리드 헬퍼
  // const axesHelper = new THREE.AxesHelper(3);
  // scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(5);
  scene.add(gridHelper);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    boxMesh.position.y = Math.sin(time) * 2;
    torusMesh.position.y = Math.cos(time) * 2;

    boxMesh.material.color.set("plum");
    torusMesh.material.color.set("skyblue");

    const origin = new THREE.Vector3(0, 0, 100);
    // 정규화된 방향. 물론 normalize()를 호출해도 된다.
    const direction = new THREE.Vector3(0, 0, -1);
    raycaster.set(origin, direction);

    const intersects = raycaster.intersectObjects(meshes);
    intersects.forEach((item) => {
      item.object.material.color.set("red");
    });

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);

  draw();
}
