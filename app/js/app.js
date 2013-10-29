define([
  "shortcut",
  "graphics",
  "gamepad",
  ],
  function(
    shortcut,
    g,
    gamepad
  ) {

  var App = {

    init: function() {
      setupShortcuts();
      g.init();
      gamepad.init();
      
      var update = function() {
        g.update();
        gamepad.update();
        requestAnimationFrame(update);
      };
      update();
    }

  };

  function setupShortcuts() {
    shortcut.add("shift+p", function() {
      g.postprocess.enabled = !g.postprocess.enabled;
    });
  }

  return App;
});