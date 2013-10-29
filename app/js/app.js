define([
  "jquery",
  "THREE",
  "Stats",
  "shortcut",
  "graphics"
  ],
  function(
    jquery,
    THREE,
    Stats,
    shortcut,
    g
  ) {

  var App = {

    init: function() {
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