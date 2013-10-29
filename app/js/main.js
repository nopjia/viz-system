require.config({
  shim: {
    THREE: {
      exports: "THREE"
    },
    TrackballControls: {
      deps: ["THREE"],
      exports: "THREE"
    },
    Stats: {
      exports: "Stats"
    }
  },
  paths: {
    jquery: 'vendor/jquery',
    THREE: 'vendor/three',
    Stats: 'vendor/Stats',
    shortcut: 'vendor/shortcut',
    TrackballControls: 'vendor/TrackballControls'
  }
});

require(["app"], function(App) {
  App.init();
});