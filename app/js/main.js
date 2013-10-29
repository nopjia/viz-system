require.config({
  shim: {
    THREE: {
      exports: "THREE"
    },
    Stats: {
      exports: "Stats"
    }
  },
  paths: {
    'jquery': 'vendor/jquery',
    'THREE': 'vendor/three',
    'Stats': 'vendor/Stats',
    'shortcut': 'vendor/shortcut'
  },
  urlArgs: "bust=" + (new Date()).getTime()
});

require(["app"], function(App) {
  App.init();
});