////////////////////////////////////////////////////////////////////////////////
/*global THREE, document, window  */

'use strict';

Physijs.scripts.worker = './js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var counter = 0;

var camera, scene, renderer;
var cameraControls, cameraView = 0, once = 0, goal;
var ball, textureBall, mixer, mix;
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

    if (other_object.name == "woody") {
      alert("Hello! I am woody, you have collected " + counter + "/3 coins.");
    }

    if (other_object.name == "lotzo") {
      var rand = Math.floor(Math.random() * 3);

      if (rand == 0) {
        alert("Hint: I am so sleepy... zzz zzz zzz");
      } else if (rand == 1) {
        alert("Hint: You are trash at this game... Booo");
      } else {
        alert("Hint: Where would Wheezy be??");
      }
    }

    if(other_object.name.includes("coin")) {
      if(other_object.name == "coin-bed-col"){
        console.log("Remove coin-bed-obj");
        scene.remove(scene.getObjectByName("coin-bed-obj"));
      } else if (other_object.name == "coin-bin-col") {
        console.log("Remove coin-bin-obj");
        scene.remove(scene.getObjectByName("coin-bin-obj"));
      } else {
        console.log("Remove coin-shelf-obj");
        scene.remove(scene.getObjectByName("coin-shelf-obj"));
      }

      scene.remove(scene.getObjectByName(other_object.name));

      counter++;

      if (counter == 3) {
        alert("You have found all the coins!!");
      }
    }

  });

  goal = new THREE.Object3D;
  goal.add(ball);
  goal.add(camera);

  goal.position.set(0, 2, -2);
  scene.add(ball)
  scene.add(goal);

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
  floor.position.y = -5;
  floor.position.z = 0;
  scene.add(floor);

  var wallGeometry = new THREE.BoxGeometry(10, 2000, 3000)
  var wall1 = new Physijs.BoxMesh(wallGeometry, transparentMaterial, 0);
  wall1.position.x = 780;
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

  var bed = new Physijs.BoxMesh(new THREE.BoxGeometry(1100, 740, 800), transparentMaterial, 0)
  bed.position.x = -1400;
  bed.position.y = 40;
  bed.position.z = 1140;
  scene.add(bed);

  var bed2 = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 800, 800), transparentMaterial, 0)
  bed2.position.x = -800;
  bed2.position.y = 200;
  bed2.position.z = 1140;
  scene.add(bed2);

  var redBox = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 320, 250), transparentMaterial, 0)
  redBox.position.x = 100;
  redBox.position.y = 40;
  redBox.position.z = -980;
  scene.add(redBox)

  var boxes1 = new Physijs.BoxMesh(new THREE.BoxGeometry(250, 150, 200), transparentMaterial, 0)
  boxes1.position.x = -240;
  boxes1.position.y = 150;
  boxes1.position.z = -1250;
  scene.add(boxes1)

  var boxes2 = new Physijs.BoxMesh(new THREE.BoxGeometry(190, 140, 500), transparentMaterial, 0)
  boxes2.position.x = -260;
  boxes2.position.y = 40;
  boxes2.position.z = -1300;
  scene.add(boxes2)

  var boxes3 = new Physijs.BoxMesh(new THREE.BoxGeometry(210, 380, 180), transparentMaterial, 0)
  boxes3.position.x = 20;
  boxes3.position.y = 40;
  boxes3.position.z = -1300;
  scene.add(boxes3)

  var desk = new Physijs.BoxMesh(new THREE.BoxGeometry(800, 785, 510), transparentMaterial, 0)
  desk.position.x = -750;
  desk.position.y = 75;
  desk.position.z = -1300;
  scene.add(desk)

  var shelf1 = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 600, 600), transparentMaterial, 0)
  shelf1.position.x = 580;
  shelf1.position.y = 290;
  shelf1.position.z = -450;
  scene.add(shelf1)

  var shelf2 = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 270, 320), transparentMaterial, 0)
  shelf2.position.x = -1930;
  shelf2.position.y = 140;
  shelf2.position.z = -1170;
  scene.add(shelf2)

  var shelf3 = new Physijs.BoxMesh(new THREE.BoxGeometry(330, 1250, 1200), transparentMaterial, 0)
  shelf3.position.x = 700;
  shelf3.position.y = 140;
  shelf3.position.z = 1350;
  scene.add(shelf3)

  var shelf3a = new Physijs.BoxMesh(new THREE.BoxGeometry(600, 125, 1200), transparentMaterial, 0)
  shelf3a.position.x = 700;
  shelf3a.position.y = 200;
  shelf3a.position.z = 1350;
  scene.add(shelf3a)

  var trashcan1 = new Physijs.BoxMesh(new THREE.BoxGeometry(10, 350, 160), transparentMaterial, 0)
  trashcan1.position.x = -1320;
  trashcan1.position.y = 40;
  trashcan1.position.z = -1300;
  scene.add(trashcan1)

  var trashcan2 = new Physijs.BoxMesh(new THREE.BoxGeometry(100,350 ,10), transparentMaterial, 0)
  trashcan2.position.x = -1200;
  trashcan2.position.y = 40;
  trashcan2.position.z = -1240;
  scene.add(trashcan2)

  var chair = new Physijs.BoxMesh(new THREE.BoxGeometry(270,370 ,300), transparentMaterial, 0)
  chair.position.x = -650;
  chair.position.y = 40;
  chair.position.z = -1000;
  scene.add(chair)

  var chairUp1 = new Physijs.BoxMesh(new THREE.BoxGeometry(40,200 ,10), transparentMaterial, 0)
  chairUp1.position.x = -645;
  chairUp1.position.y = 370;
  chairUp1.position.z = -840;
  scene.add(chairUp1)

  var chairUp2 = new Physijs.BoxMesh(new THREE.BoxGeometry(270,50 ,20), transparentMaterial, 0)
  chairUp2.position.x = -650;
  chairUp2.position.y = 440;
  chairUp2.position.z = -840;
  scene.add(chairUp2)

  var carriage = new Physijs.BoxMesh(new THREE.BoxGeometry(550,600,660), transparentMaterial, 0)
  carriage.position.x = -1950;
  carriage.position.y = 40;
  carriage.position.z = 110;
  scene.add(carriage)

  var window1 = new Physijs.BoxMesh(new THREE.BoxGeometry(270,40,810), transparentMaterial, 0)
  window1.position.x = -1950;
  window1.position.y = 450;
  window1.position.z = 15;
  scene.add(window1)

  var table = new Physijs.BoxMesh(new THREE.BoxGeometry(200,40,300), transparentMaterial, 0)
  table.position.x = -1950;
  table.position.y = 410;
  table.position.z = 550;
  scene.add(table)

  // Used for debugging the collision object.
  var ground_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ color: 0x888888 }),
		.8, // high friction
		.4 // low restitution
	);

  var shelfCoin = new Physijs.BoxMesh(new THREE.BoxGeometry(350,30,400), transparentMaterial, 0)
  shelfCoin.position.x = 615;
  shelfCoin.position.y = 685;
  shelfCoin.position.z = -1240;
  scene.add(shelfCoin)

  var coinShelf = new Physijs.BoxMesh(new THREE.BoxGeometry(10,40,40), transparentMaterial, 0)
  coinShelf.name = "coin-shelf-col";
  coinShelf.position.x = 615;
  coinShelf.position.y = 725;
  coinShelf.position.z = -1240;
  coinShelf.rotation.y = Math.PI / 2;
  scene.add(coinShelf)

  var coinBed = new Physijs.BoxMesh(new THREE.BoxGeometry(10, 40, 40), transparentMaterial, 0)
  coinBed.name = "coin-bed-col";
  coinBed.position.x = -1465;
  coinBed.position.y = 505;
  coinBed.position.z = 1050;
  coinBed.rotation.y = Math.PI / 2;
  scene.add(coinBed)

  var coinBin = new Physijs.BoxMesh(new THREE.BoxGeometry(10, 40, 40), transparentMaterial, 0)
  coinBin.name = "coin-bin-col";
  coinBin.position.x = -1235;
  coinBin.position.y = 125;
  coinBin.position.z = -1370;
  coinBin.rotation.y = Math.PI / 2;
  scene.add(coinBin)

  var woody = new Physijs.BoxMesh(new THREE.BoxGeometry(10,150,10), transparentMaterial, 0)
  woody.name = "woody";
  woody.position.x = 0;
  woody.position.y = 75;
  woody.position.z = -500;
  scene.add(woody)

  var lotzo = new Physijs.BoxMesh(new THREE.BoxGeometry(90,225,50), transparentMaterial, 0)
  lotzo.name = "lotzo";
  lotzo.position.x = -900;
  lotzo.position.y = 525;
  lotzo.position.z = -1300;
  scene.add(lotzo)

  var laptop = new Physijs.BoxMesh(new THREE.BoxGeometry(200,180,10), transparentMaterial, 0)
  laptop.position.x = -500;
  laptop.position.y = 525;
  laptop.position.z = -1390;
  scene.add(laptop)

  drawElephant();
  coins();
}

function coins() {

  var loadCoin = new THREE.OBJLoader();

  loadCoin.setPath('assets/');
  loadCoin.load('coin.obj', function(object) {

    object.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.material.color.setHex(0xFFFF00);
      }
    });

    object.name = "coin-bed-obj";
    object.rotation.y = Math.PI / 2;
    object.scale.z = 100;
    object.scale.x = 100;
    object.scale.y = 100;
    object.position.x = -1500;
    object.position.y = 370;
    object.position.z = 1140;
    scene.add(object);
  });

  loadCoin.setPath('assets/');
  loadCoin.load('coin.obj', function(object) {

    object.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.material.color.setHex(0xFFFF00);
      }
    });

    object.name = "coin-bin-obj";
    object.rotation.y = Math.PI / 2;
    object.scale.z = 100;
    object.scale.x = 100;
    object.scale.y = 100;
    object.position.x = -1270;
    object.position.y = -10;
    object.position.z = -1280;
    scene.add(object);
  });

  loadCoin.setPath('assets/');
  loadCoin.load('coin.obj', function(object) {

    object.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.material.color.setHex(0xFFFF00);
      }
    });

    object.name = "coin-shelf-obj";
    object.rotation.y = Math.PI / 2;
    object.scale.z = 100;
    object.scale.x = 100;
    object.scale.y = 100;
    object.position.x = 575;
    object.position.y = 600;
    object.position.z = -1150;
    scene.add(object);
  });
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

  // Load Woody
  var loader = new THREE.FBXLoader();
  loader.load( 'assets/Looking_Around.fbx', function ( object ) {
    console.log(object)
    mixer = new THREE.AnimationMixer( object );
    var action = mixer.clipAction( object.animations[ 0 ] );
    action.play();
    object.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    } );
    object.scale.z = 80;
    object.scale.x = 80;
    object.scale.y = 80;
    object.position.y = 10;
    object.position.z =-500;
    scene.add( object );
  } );

  // Load Lotso
  loader = new THREE.FBXLoader();
  loader.load( 'assets/Breathing_Idle.fbx', function ( object ) {
    console.log(object)
    mix = new THREE.AnimationMixer( object );
    var action = mix.clipAction( object.animations[ 0 ] );
    action.play();
    object.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    } );
    object.scale.z = 80;
    object.scale.x = 80;
    object.scale.y = 80;
    object.position.y = 475;
    object.position.x = -900;
    object.position.z = -1300;
    scene.add( object );
  } );

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
  var canvasWidth = 800;
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

  // CONTROLS
  cameraControls = new THREE.OrbitControls(camera);
  cameraControls.keys = {
    LEFT: 4,
	  UP: 3,
	  RIGHT: 2,
	  BOTTOM: 1
  }
  cameraControls.target.set(0, 500, 0);
  cameraControls.enabled = false;
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
}


function addToDOM() {
  var canvas = document.getElementById('canvas');
  canvas.appendChild(renderer.domElement);
  console.log(canvas);
}

function animate() {
  keyboard.update();
  window.requestAnimationFrame(animate);
  var delta = clock.getDelta();
	if ( mixer ) mixer.update( delta );
  if ( mix ) mix.update( delta );
  keyInput();
  render();
}

function getCenterPoint(mesh) {
    var geometry = mesh.geometry;
    geometry.computeBoundingBox();
    var center = geometry.boundingBox.getCenter();
    mesh.localToWorld( center );
    return center;
}

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
  goal.position.set(ball.position.x, ball.position.y, ball.position.z)
  if (cameraView === 0) {
    if (once === 0) {
      camera.position.set(-319.10, 1128.72, 1073.32);
      once++;
    }
  } else if (cameraView === 1) {
    if (once === 0) {
      var center = getCenterPoint(ball)
      camera.position.set(center.x, center.y, center.z)
      ball.visible = false;
      once++;
    }
  } else if (cameraView === 2) {
    if (once === 0) {
      ball.visible = true;
      camera.position.set(goal.position.x, goal.position.y, goal.position.z + 500)
      once++;
    }
  }
  camera.lookAt(ball.position)
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
