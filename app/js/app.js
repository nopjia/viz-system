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
  };

  var App = {

    init: function() {
      setupShortcuts();
      g.init();

      gamepad.init();
      controls.init(g.camera, gamepad);
      sceneManager.init();

      // add scene
      for (var j in g.scenes)
        for (var i in sceneManager.objects[j])
          g.scenes[j].add(sceneManager.objects[j][i]);
      
      g.currSceneIdx = 1;

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
    g.update(clock.elapsedTime);

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
      g.currSceneIdx = g.currSceneIdx == 0 ? 1 : 0;

    // flash    
    // NOTE: decay not framerate independent
    g.postprocess.uniforms.uFlash.value =
      g.postprocess.uniforms.uFlash.value * FLASH_DECAY_RATE;
    if (gamepad.buttons["RIGHT_SHOULDER"]) {
      g.postprocess.uniforms.uFlash.value = 1;
    }

    g.postprocess.uniforms.uUVDistort.value =
      gamepad.buttons["FACE_2"];

    // spaz
    if (gamepad.buttons["FACE_1"]) {
      for (var i in sceneManager.objects[0]) {
        var obj = sceneManager.objects[0][i];
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