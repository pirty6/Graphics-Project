////////////////////////////////////////////////////////////////////////////////
/*global THREE, document, window  */
var camera, scene, renderer;
var cameraControls;

var clock = new THREE.Clock();

function fillScene() {
  scene = new THREE.Scene();

  // LIGHTS

  scene.add(new THREE.AmbientLight(0x222222));

  var light = new THREE.DirectionalLight(0xffffff, 0.7);
  light.position.set(200, 500, 500);

  scene.add(light);

  light = new THREE.DirectionalLight(0xffffff, 0.9);
  light.position.set(-200, -100, -400);

  scene.add(light);

  //grid xz
  var gridXZ = new THREE.GridHelper(2000, 100, new THREE.Color(0xCCCCCC), new THREE.Color(0x888888));
  scene.add(gridXZ);

  //axes
  var axes = new THREE.AxisHelper(150);
  axes.position.y = 1;
  scene.add(axes);

  drawElephant();
}

function drawElephant() {

  var manager = new THREE.LoadingManager();
  manager.onProgress = function(item, loaded, total) {
    console.log(item, loaded, total);
  };

  var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };
  var onError = function(xhr) {};

// Load The Room
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('assets/');
  mtlLoader.load('Room.mtl', function(materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('assets/');
    objLoader.load('Room.obj', function(object) {
      object.position.y = 500;
      object.scale.z = 30;
      object.scale.x = 30;
      object.scale.y = 30;
      scene.add(object);
    }, onProgress, onError);
  });


}

function init() {
  var canvasWidth = 600;
  var canvasHeight = 400;
  var canvasRatio = canvasWidth / canvasHeight;

  // RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0xAAAAAA, 1.0);

  // CAMERA
  camera = new THREE.PerspectiveCamera(10, canvasRatio, 7000, 18000);
  camera.position.set(-7000, 4500, 7000);

  // CONTROLS
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 500, 0);
}

function addToDOM() {
  var canvas = document.getElementById('canvas');
  canvas.appendChild(renderer.domElement);
  console.log(canvas);
}

function animate() {
  window.requestAnimationFrame(animate);
  render();
}

function render() {
  var delta = clock.getDelta();
  const yAxis = new THREE.Vector3(0, 1, 0).normalize();
  const xAxis = new THREE.Vector3(1, 0, 0).normalize();
  const rotationStep = Math.PI / 180;
  // camera.position.applyAxisAngle(yAxis, xAxis);

  cameraControls.update();
  renderer.render(scene, camera);
}

try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch (error) {
  console.log("Your program encountered an unrecoverable error, can not draw on canvas. Error was:");
  console.log(error);
}
