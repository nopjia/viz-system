define([
  "shortcut",
  "graphics",
  "gamepad"
  ],
  function(
    shortcut,
    g
  ) {

  var App = {

    init: function() {
      setupShortcuts();
      g.init();
      
      var update = function() {
        g.update();
        requestAnimationFrame(update);
      };
      update();
    }

  };

  function setupShortcuts() {
    shortcut.add("shift+p", function() {
      g.postprocess.enabled = !g.postprocess.enabled;
    });

    shortcut.add("m", function() {
      g.sceneManager.toggleObjectMaterial();
    });
  }

  return App;
});