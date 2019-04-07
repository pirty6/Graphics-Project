////////////////////////////////////////////////////////////////////////////////
/*global THREE, document, window  */

'use strict';

Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var camera, scene, renderer;
var cameraControls;
var ball;

var friction = 0.4;
var restitution = 0.6;
var gravity = -50;

var clock = new THREE.Clock();
var keyboard = new KeyboardState();
var rotSpeed = 0.01;

function fillScene() {
  scene = new Physijs.Scene;
  scene.setGravity(new THREE.Vector3(0, gravity, 0));
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

  var ballGeometry = new THREE.SphereGeometry(50, 50, 50);
  var ballMaterial = new THREE.MeshLambertMaterial({
    color: 'yellow',
    wireframe: false
  });
  ball = new Physijs.BoxMesh(ballGeometry, ballMaterial, 100)
  ball.position.y = 30;
  ball.position.z = 0;
  scene.add(ball);


  var floorGeometry = new THREE.BoxGeometry(3000, 10, 3000)
  var transparentMaterial = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      color: 0x000000,
      transparent: false,
      opacity: 0.1
    }),
    0,
    0
  );
  var floor = new Physijs.BoxMesh(floorGeometry, transparentMaterial, 0);

  floor.position.x = -500;
  floor.position.y = -10;
  floor.position.z = 0;
  scene.add(floor);

  var wallGeometry = new THREE.BoxGeometry(10, 2000, 3000)
  var wall1 = new Physijs.BoxMesh(wallGeometry, transparentMaterial, 0);
  wall1.position.x = 810;
  wall1.position.y = 1000;
  wall1.position.z = 10;
  scene.add(wall1);

  var wall2 = new Physijs.BoxMesh(wallGeometry, transparentMaterial, 0);
  wall2.position.x = -1950;
  wall2.position.y = 1000;
  wall2.position.z = 0;
  scene.add(wall2);

  var wall3 = new Physijs.BoxMesh(wallGeometry, transparentMaterial, 0);
  wall3.position.x = -600;
  wall3.position.y = 1000;
  wall3.position.z = 1350;
  wall3.rotation.y = Math.PI / 2;
  scene.add(wall3);

  var wall4 = new Physijs.BoxMesh(wallGeometry, transparentMaterial, 0);
  wall4.position.x = -600;
  wall4.position.y = 1000;
  wall4.position.z = -1470;
  wall4.rotation.y = Math.PI / 2;
  scene.add(wall4);


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
      object.position.y = 0;
      object.scale.z = 80;
      object.scale.x = 80;
      object.scale.y = 80;
      scene.add(object);
    }, onProgress, onError);
  });


}

function init() {
  // var canvasWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  // var canvasHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var canvasWidth = 600;
  var canvasHeight = 600;
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
  camera = new THREE.PerspectiveCamera(45, canvasRatio, 0.1, 10000);
  camera.position.set(0, -10, 0);

  // CONTROLS
  cameraControls = new THREE.OrbitControls(camera);
  cameraControls.keys = {
    LEFT: 4,
	  UP: 3,
	  RIGHT: 2,
	  BOTTOM: 1
  }
  cameraControls.target.set(0, 500, 0);

}

var hewwo = -1;
var keyPressed = false;

function keyInput() {
  var x = camera.position.x,
    y = camera.position.y,
    z = camera.position.z;

  var oldVector = ball.getLinearVelocity();

  if (keyboard.pressed("A")) {
    camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
    camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
  }
  if (keyboard.pressed("D")) {
    camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
  }
  if (keyboard.pressed("down")) {
    var ballVector = new THREE.Vector3(oldVector.x, oldVector.y, oldVector.z + 5);
    ball.setLinearVelocity(ballVector);
    keyPressed = true;
  }

  if (keyboard.pressed("up")) {
    var ballVector = new THREE.Vector3(oldVector.x, oldVector.y, oldVector.z - 5);
    ball.setLinearVelocity(ballVector);
    keyPressed = true;
  }

  if (keyboard.pressed("left")) {
    var ballVector = new THREE.Vector3(oldVector.x - 5, oldVector.y, oldVector.z);
    ball.setLinearVelocity(ballVector);
    keyPressed = true;
  }

  if (keyboard.pressed("right")) {
    var ballVector = new THREE.Vector3(oldVector.x + 5, oldVector.y, oldVector.z);
    ball.setLinearVelocity(ballVector);
    keyPressed = true;
  }
  if (!keyPressed) {
    ball.setLinearVelocity(new THREE.Vector3(
        (oldVector.x > 0) ? oldVector.x - 1 : oldVector.x + 1,
        oldVector.y,
        (oldVector.z > 0) ? oldVector.z - 1 : oldVector.z + 1)
      );
  }

  keyPressed = false;

  if (hewwo < 0) {
    hewwo++;
    console.log(keyboard.pressed)
  }


  camera.lookAt(scene.position);
}


function addToDOM() {
  var canvas = document.getElementById('canvas');
  canvas.appendChild(renderer.domElement);
  console.log(canvas);
}

function animate() {
  keyboard.update();
  window.requestAnimationFrame(animate);
  keyInput();
  render();
}

function render() {
  var delta = clock.getDelta();
  const yAxis = new THREE.Vector3(0, 1, 0).normalize();
  const xAxis = new THREE.Vector3(1, 0, 0).normalize();
  const rotationStep = Math.PI / 180;
  // camera.position.applyAxisAngle(yAxis, xAxis);
  ball.__dirtyPosition = true;
  cameraControls.update(delta);
  scene.simulate();
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
