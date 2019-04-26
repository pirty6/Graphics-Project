////////////////////////////////////////////////////////////////////////////////
/*global THREE, document, window  */

'use strict';

Physijs.scripts.worker = './js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var camera, scene, renderer;
var cameraControls, cameraView = 0, once = 0, change = 0;
var ball, textureBall;
var group = new THREE.Group(), offset = new THREE.Object3D();

var friction = 0.4;
var restitution = 0.6;
var gravity = -500;
var jumping = false;

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

  textureBall = THREE.ImageUtils.loadTexture( 'assets/Ball_Test.jpg' );
  const loader = new THREE.TextureLoader();

  textureBall.wrapS = THREE.RepeatWrapping;
  textureBall.repeat.set( 2, 1 );

  var ballGeometry = new THREE.SphereGeometry(50, 50, 50);
  var ballMaterial = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({
    color: 'yellow',
    wireframe: false,
    map: textureBall
  }),
  0.4,
  0.6
  );
  ball = new Physijs.SphereMesh(ballGeometry, ballMaterial, 100)
  ball.position.y = 30;
  ball.position.z = 0;
  ball.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    jumping = false;
  });
  scene.add(ball);


  var floorGeometry = new THREE.BoxGeometry(3000, 10, 3000)
  var transparentMaterial = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0
    }),
    0.4,
    0.6
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

  var bed = new Physijs.BoxMesh(new THREE.BoxGeometry(1100, 300, 800), transparentMaterial, 0)
  bed.position.x = -1400;
  bed.position.y = 250;
  bed.position.z = 1140;
  scene.add(bed);

  var redBox = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 320, 250), transparentMaterial, 0)
  redBox.position.x = 100;
  redBox.position.y = 40;
  redBox.position.z = -1000;
  scene.add(redBox)

  var boxes1 = new Physijs.BoxMesh(new THREE.BoxGeometry(250, 150, 300), transparentMaterial, 0)
  boxes1.position.x = -240;
  boxes1.position.y = 40;
  boxes1.position.z = -1200;
  scene.add(boxes1)

  var boxes2 = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 70, 250), transparentMaterial, 0)
  boxes2.position.x = -230;
  boxes2.position.y = 200;
  boxes2.position.z = -1250;
  scene.add(boxes2)

  var boxes3 = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 200, 200), transparentMaterial, 0)
  // boxes3.position.x =

  var desk = new Physijs.BoxMesh(new THREE.BoxGeometry(800, 800, 500), transparentMaterial, 0)
  desk.position.x = -750;
  desk.position.y = 75;
  desk.position.z = -1300;
  scene.add(desk)

  var shelf1 = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 600, 600), transparentMaterial, 0)
  shelf1.position.x = 580;
  shelf1.position.y = 290;
  shelf1.position.z = -450;
  scene.add(shelf1)

  var shelf2 = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 270, 350), transparentMaterial, 0)
  shelf2.position.x = -1930;
  shelf2.position.y = 140;
  shelf2.position.z = -1170;
  scene.add(shelf2)
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

function chaseMesh(camera, mesh) {
    camera.position.z = mesh.position.z;
    camera.lookAt(mesh.position);
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
  // camera.position.set(-319.10, 1128.72, 1073.32);

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

  if (keyboard.down("E")) {
    console.log(camera.position)
    once = 0;
    if (cameraView === 2){
      cameraView = 0;
    } else {
      cameraView++;
    }
  }

  if (keyboard.down("space") && !jumping) {
    var jump = new THREE.Vector3(oldVector.x, 50000, oldVector.z);
    ball.applyCentralImpulse(jump)
    keyPressed = true;
    jumping = true;
  }
  if (!keyPressed) {
    ball.setLinearVelocity(new THREE.Vector3(
        (oldVector.x > 0) ? oldVector.x - 1 : oldVector.x + 1,
        oldVector.y,
        (oldVector.z > 0) ? oldVector.z - 1 : oldVector.z + 1)
      );
  }
  keyPressed = false;
  // ball.add(camera)
  // camera.lookAt(ball.position);
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
var hewwo = 0;

function render() {
  var delta = clock.getDelta();
  const yAxis = new THREE.Vector3(0, 1, 0).normalize();
  const xAxis = new THREE.Vector3(1, 0, 0).normalize();
  const rotationStep = Math.PI / 180;
  // camera.position.applyAxisAngle(yAxis, xAxis);
  ball.__dirtyPosition = true;
  ball.__dirtyRotation = true;
  cameraControls.update(delta);
  scene.simulate();
  camera.lookAt(ball.position)
  if (cameraView == 0) {
    if (once === 0) {
      camera.position.set(-319.10, 1128.72, 1073.32);
      once++;
    }
  } else if (cameraView == 1) {
    var ballPosition = ball.position;
    var cameraPosition = camera.position;
    if (once === 0) {
      camera.position.set(ballPosition.x, ballPosition.y, ballPosition.z + 500)
      once++;
    } else {
      // camera.position.set(cameraPosition.x , ballPosition.y, cameraPosition.z)
    }
  }
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
