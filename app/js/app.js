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

  // CONTROL VARS

  var TOGGLE_WAIT_FRAMES = 7;
  var toggleWait = 0;

  var SPAZ_MAG = 5;

  var FLASH_DECAY_RATE = 0.8;

  var UV_LOOP_LOOP_RATE = 2;
  var UV_LOOP_RESTORE_RATE = 15;
  var uvLoopSpeed = 0;
  var uvLoop = 0;

  var BLACK_WAIT_FRAMES = 3;
  var blackWait = 0;

  var subdivsButtonLast = 0;

  var COLORS_WAIT_FRAMES = 8;
  var colorsWait = 0;
  var currColorsIdx = 0;
  var cycleColors = [
    new THREE.Color(0xff4040), // red
    new THREE.Color(0xffff0f), // yellow
    new THREE.Color(0x40ff40), // green
    new THREE.Color(0x0fffff), // cyan
    new THREE.Color(0x4040ff), // blue
    new THREE.Color(0xff0fff), // magenta
  ];

  var gamepadKeysUpdate = function(deltaT) {

    // RESET! refresh page
    if (gamepad.buttons["SELECT"] && gamepad.buttons["START"])
      location.reload();
    
    // toggle material
    ++toggleWait;
    if (gamepad.buttons["FACE_4"] && toggleWait > TOGGLE_WAIT_FRAMES) {
      g.currSceneIdx = g.currSceneIdx === 0 ? 1 : 0;
      toggleWait = 0;
    }

    // color cycle
    ++colorsWait;
    if (gamepad.buttons["FACE_3"] && colorsWait > COLORS_WAIT_FRAMES) {
      currColorsIdx += 1;
      if (currColorsIdx >= cycleColors.length)
        currColorsIdx = 0;
      sceneManager.matWire.color = cycleColors[currColorsIdx];

      colorsWait = 0;
    }

    // blackout flicker
    ++blackWait;
    g.postprocess.uniforms.uBlackout.value = 0;
    if (gamepad.buttons["RIGHT_SHOULDER_BOTTOM"] && blackWait > BLACK_WAIT_FRAMES) {
      g.postprocess.uniforms.uBlackout.value =
        g.postprocess.uniforms.uBlackout.value === 0 ? 1 : 0;
      blackWait = 0;
    }

    // subdivs
    if (gamepad.buttons["PAD_TOP"] && subdivsButtonLast === 0)
      g.postprocess.uniforms.uSubdivs.value += 1;
    else if (gamepad.buttons["PAD_BOTTOM"] && subdivsButtonLast === 0)
      g.postprocess.uniforms.uSubdivs.value -=
        g.postprocess.uniforms.uSubdivs.value > 1 ? 1 : 0;
    subdivsButtonLast = gamepad.buttons["PAD_TOP"] || gamepad.buttons["PAD_BOTTOM"];

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

  };

  return App;
});