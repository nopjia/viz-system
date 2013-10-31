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
    gamepadKeysUpdate();
    controls.update(deltaT);
    sceneManager.updateObjects(deltaT);
    sceneManager.wrapAround(g.camera.position);
    g.update();

    requestAnimationFrame(update);
  };

  var gamepadKeysUpdate = function() {
    if (gamepad.buttons["FACE_4"])
      sceneManager.toggleObjectMaterial();
  };

  return App;
});