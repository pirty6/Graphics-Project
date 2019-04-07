////////////////////////////////////////////////////////////////////////////////
/*global THREE, document, window  */

'use strict';

Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var camera, scene, renderer;
var cameraControls;
var ball, box;

var friction = 0.4;
var restitution = 0.6;
var gravity = -50;

var clock = new THREE.Clock();
var keyboard = new KeyboardState();
var rotSpeed = 0.01;

function fillScene() {
  scene = new Physijs.Scene;
  // scene.setGravity(new THREE.Vector3(0, gravity, 0));
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
  // var ballMaterial = Physijs.createMaterial(
  //   new THREE.MeshPhongMaterial({
  //     color: 0xffffff,
  //     transparent: false,
  //     opacity: 0.1
  //   }),
  //   3.5,
  //   0
  // );
  ball = new Physijs.BoxMesh(ballGeometry, ballMaterial, 0)
  ball.setAngularFactor(THREE.Vector3(0,0,0));
  // ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.x = 0;
  ball.position.y = 30;
  ball.position.z = 0;
  scene.add(ball);


  var boxGeometry = new THREE.BoxGeometry(100, 100, 100)
  var transparentMaterial = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: false,
      opacity: 0.1
    }),
    friction,
    0
  );
  box = new Physijs.BoxMesh(boxGeometry, transparentMaterial, 0);

  box.position.x = 200;
  box.position.y = 30;
  box.position.z = 0;
  scene.add(box);

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
      object.scale.z = 50;
      object.scale.x = 50;
      object.scale.y = 50;
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
    LEFT: 4, //left arrow
	  UP: 3, // up arrow
	  RIGHT: 2, // right arrow
	  BOTTOM: 1 // down arrow
  }
  cameraControls.target.set(0, 500, 0);

}


function keyInput() {
  var x = camera.position.x,
    y = camera.position.y,
    z = camera.position.z;

  if (keyboard.pressed("A")) {
    camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
    camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
  }
  if (keyboard.pressed("D")) {
    camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
  }
  if (keyboard.pressed("down")) {
    ball.translateZ(5);
  }

  // if (keyboard.pressed("up")) {
  //   // ball.position.z = ball.position.z - 5;
  //   ball.setLinearVelocity({z: -10, y:0,x:0});
  // }

  if (keyboard.pressed("left")) {
    ball.translateX(-5);
  }

  if (keyboard.pressed("right")) {
    ball.translateX(5);
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
