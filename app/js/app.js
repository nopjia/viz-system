define([
  "shortcut",
  "graphics"
  ],
  function(
    shortcut,
    g
  ) {

  function setupShortcuts() {

    shortcut.add("shift+p", function() {
      g.postprocess.enabled = !g.postprocess.enabled;
    });

  }

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

  return App;
});