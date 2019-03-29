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

  /*
  The code below sets up image textures for the elephant and then imports
  the geometry from .obj files
  */
  // var elephantTex = new THREE.Texture();
  // var planeTex = new THREE.Texture();
  //

  var floorTexture = new THREE.Texture();

  var loader = new THREE.ImageLoader(manager);
  loader.load('/assets/ar_11.jpg', function(image) {
    floorTexture.image = image;
    floorTexture.needsUpdate = true;
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.offset.set(0, 0);
    floorTexture.repeat.set(2, 2);

  });

  loader = new THREE.OBJLoader(manager);
  loader.load('/assets/Floor.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = floorTexture;
        child.scale.x = 30;
        child.scale.y = 30;
        child.scale.z = 30;
      }
    });
    object.position.y = 500;
    scene.add(object);
  }, onProgress, onError);

  var wallTexture = new THREE.Texture();

  loader = new THREE.ImageLoader(manager);
  loader.load('/assets/ar_45.jpg', function(image) {
    wallTexture.image = image;
    wallTexture.needsUpdate = true;
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.offset.set(0, 0);
    wallTexture.repeat.set(1, 1);

  });

  loader = new THREE.OBJLoader(manager);
  loader.load('/assets/Walls.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = wallTexture;
        child.scale.x = 30;
        child.scale.y = 30;
        child.scale.z = 30;
      }
    });
    object.position.y = 550;
    scene.add(object);
  }, onProgress, onError);

  var roofTexture = new THREE.Texture();
  loader = new THREE.ImageLoader(manager);
  loader.load('/assets/ar_48.png', function(image) {
    roofTexture.image = image;
    roofTexture.needsUpdate = true;

  });

  loader = new THREE.OBJLoader(manager);
  loader.load('/assets/Roof.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = roofTexture;
        child.scale.x = 30;
        child.scale.y = 30;
        child.scale.z = 30;
      }
    });
    object.position.y = 550;
    scene.add(object);
  }, onProgress, onError);

  loader = new THREE.OBJLoader(manager);
  loader.load('/assets/MainDoor.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = roofTexture;
      }
    });
    object.scale.x = 30;
    object.scale.y = 32;
    object.scale.z = 30;
    object.position.y = 500;
    scene.add(object);
  }, onProgress, onError);

  loader = new THREE.OBJLoader(manager);
  loader.load('/assets/Door.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = roofTexture;
      }
    });
    object.scale.x = 30;
    object.scale.y = 32;
    object.scale.z = 30;
    object.position.y = 500;
    scene.add(object);
  }, onProgress, onError);

  loader = new THREE.OBJLoader(manager);
  loader.load('/assets/Window.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        // child.material.map = roofTexture;
      }
    });
    object.scale.x = 30;
    object.scale.y = 30;
    object.scale.z = 30;
    object.position.y = 500;
    scene.add(object);
  }, onProgress, onError);

  loader = new THREE.OBJLoader(manager);
  loader.load('/assets/WindowFrame.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = roofTexture;
      }
    });
    object.scale.x = 30;
    object.scale.y = 30;
    object.scale.z = 30;
    object.position.y = 500;
    scene.add(object);
  }, onProgress, onError);

  loader = new THREE.OBJLoader(manager);
  loader.load('/assets/ClosetDoor.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = roofTexture;
      }
    });
    object.scale.x = 30;
    object.scale.y = 30;
    object.scale.z = 30;
    object.position.y = 500;
    scene.add(object);
  }, onProgress, onError);

  loader = new THREE.OBJLoader(manager);
  loader.load('/assets/WindowFrame2.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = roofTexture;
      }
    });
    object.scale.x = 30;
    object.scale.y = 30;
    object.scale.z = 30;
    object.position.y = 500;
    scene.add(object);
  }, onProgress, onError);

	loader = new THREE.OBJLoader(manager);
	loader.load('/assets/ClosetDoor.obj', function(object) {
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.material.map = roofTexture;
			}
		});
		object.scale.x = 30;
		object.scale.y = 30;
		object.scale.z = 30;
		object.position.y = 500;
		scene.add(object);
	}, onProgress, onError);

	loader = new THREE.OBJLoader(manager);
	loader.load('/assets/ClosetDoorFrame.obj', function(object) {
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.material.map = roofTexture;
			}
		});
		object.scale.x = 30;
		object.scale.y = 30;
		object.scale.z = 30;
		object.position.y = 500;
		scene.add(object);
	}, onProgress, onError);

	loader = new THREE.OBJLoader(manager);
	loader.load('/assets/Blinds.obj', function(object) {
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.material.map = roofTexture;
			}
		});
		object.scale.x = 30;
		object.scale.y = 30;
		object.scale.z = 30;
		object.position.y = 500;
		scene.add(object);
	}, onProgress, onError);

	var carpetTexture = new THREE.Texture();

  loader = new THREE.ImageLoader(manager);
  loader.load('/assets/ar_22.jpg', function(image) {
    carpetTexture.image = image;
    carpetTexture.needsUpdate = true;
    carpetTexture.wrapS = carpetTexture.wrapT = THREE.RepeatWrapping;
    carpetTexture.offset.set(0, 0);
    carpetTexture.repeat.set(1, 1);

  });

	loader = new THREE.OBJLoader(manager);
	loader.load('/assets/Carpet.obj', function(object) {
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				console.log('Entro');
				child.material.map = carpetTexture;
			}
		});
		object.scale.x = 30;
		object.scale.y = 30;
		object.scale.z = 30;
		object.position.y = 520;
		scene.add(object);
	}, onProgress, onError);


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
