define([
  "shortcut",
  "graphics",
  "gamepad",
  "mycontrols",
  "scene"
  ],
  function(
    shortcut,
    g,
    gamepad,
    controls,
    sceneManager
  ) {

  var clock = new THREE.Clock();

  var setupShortcuts = function() {
    shortcut.add("shift+p", function() {
      g.postprocess.enabled = !g.postprocess.enabled;
    });
  }

  var App = {

    init: function() {
      setupShortcuts();
      g.init();

      gamepad.init();
      controls.init(g.camera, gamepad);
      sceneManager.init(g.scene);
      
      update();
    }

  };

  var update = function() {
    var deltaT = clock.getDelta();

    gamepad.update();
    gamepadKeysUpdate(deltaT);
    controls.update(deltaT);
    sceneManager.updateObjects(deltaT);
    sceneManager.wrapAround(g.camera.position);
    g.update();

    requestAnimationFrame(update);
  };

  var SPAZ_MAG = 5;
  var FLASH_DECAY_RATE = 0.8;
  var UV_LOOP_LOOP_RATE = 2;
  var UV_LOOP_RESTORE_RATE = 15;
  var uvLoopSpeed = 0;
  var uvLoop = 0;

  var gamepadKeysUpdate = function(deltaT) {
    
    // toggle material
    if (gamepad.buttons["FACE_4"])
      sceneManager.toggleObjectMaterial();

    // flash    
    // NOTE: decay not framerate independent
    g.postprocess.uniforms.uFlash.value =
      g.postprocess.uniforms.uFlash.value * FLASH_DECAY_RATE;
    if (gamepad.buttons["RIGHT_SHOULDER"]) {
      g.postprocess.uniforms.uFlash.value = 1;
    }

    // spaz
    if (gamepad.buttons["FACE_1"]) {
      for (var i in sceneManager.objects[sceneManager.geoMode]) {
        var obj = sceneManager.objects[sceneManager.geoMode][i];
        obj.position.x += Math.random() * SPAZ_MAG * 2 - SPAZ_MAG;
        obj.position.y += Math.random() * SPAZ_MAG * 2 - SPAZ_MAG;
        obj.position.z += Math.random() * SPAZ_MAG * 2 - SPAZ_MAG;
      }
    }

    // UV LOOP
    if (gamepad.buttons["FACE_3"]) {
      uvLoopSpeed += UV_LOOP_LOOP_RATE * deltaT;
      uvLoop += uvLoopSpeed * deltaT;
    }
    else {
      uvLoopSpeed = 0;
      var targetLoop = Math.round(uvLoop);
      var dist = targetLoop - uvLoop;
      uvLoop += dist * UV_LOOP_RESTORE_RATE * deltaT;
    }
    g.postprocess.uniforms.uUVLoop.value = uvLoop;



  };

  return App;
});