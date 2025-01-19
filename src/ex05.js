import * as THREE from "three";

export function example() {
  // renderer
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
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
  camera.position.z = 5;
  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: "#7048e8" });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const clock = new THREE.Clock();

  function draw() {
    // 실행 시점으로부터 경과 시간
    // const elapsedTime = clock.getElapsedTime();
    // draw가 한번 실행될 때마다의 시간차. getElapsedTime()와 같이 쓰면 시간이 꼬인다고 한다
    // 물론 JS Date 객체의 Date.now()등을 이용해 값을 계산해도 된다
    const delta = clock.getDelta();

    // 각의 단위는 라디안(360도 = 2pi)
    // mesh.rotation.y += 0.1;
    // clock 값을 이용하여 기기마다의 성능 차이를 보정
    mesh.rotation.y += 2 * delta;
    mesh.position.y += delta;
    if (mesh.position.y > 2) {
      mesh.position.y = 0;
    }
    // mesh.position.y = time;
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
