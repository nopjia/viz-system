define([
  "jquery",
  "THREE",
  "Stats",
  "TrackballControls",
  "FlyControls",
  "utils"
  ],
  function(
    ignore,
    ignore,
    ignore,
    ignore,
    ignore,
    Utils
  ) {

  var clock = new THREE.Clock();

  var RESOLUTION = 2;

  var Graphics = {
    CAM_FOV: 45,
    CAM_NEAR: 0.1,
    CAM_FAR: 200,
    FOG_NEAR: 10,
    FOG_FAR: 200,
    RESOLUTION: RESOLUTION,

    SCENE_NUM: 2,

    container: null,
    renderer: null,
    camera: null,
    scenes: [],
    currSceneIdx: 0,
    stats: null,

    init: function() {
      this.container = $("#webgl-container")[0];
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.renderer = new THREE.WebGLRenderer({
        clearAlpha: 0,
        clearColor: 0x000000,
        antialias: true,
        devicePixelRatio: 1 / this.RESOLUTION,
      });
      this.renderer.setSize( this.width, this.height );
      this.renderer.autoClear = false;
      this.container.appendChild( this.renderer.domElement );

      // camera
      this.camera = new THREE.PerspectiveCamera(
        this.CAM_FOV,
        this.width/this.height,
        this.CAM_NEAR, this.CAM_FAR
      );
      this.camera.position.set(0,0,1);
      this.camera.lookAt(new THREE.Vector3());

      // this.controls = new THREE.TrackballControls(this.camera, this.container);
      // this.controls.rotateSpeed = 1.0;
      // this.controls.zoomSpeed = 1.2;
      // this.controls.panSpeed = 1.0;
      // this.controls.dynamicDampingFactor = 0.3;
      // this.controls.staticMoving = false;
      // this.controls.noZoom = false;
      // this.controls.noPan = true;
      // this.controls.keys = []; // hack disable keyboard

      // scene
      for (var i=0; i<this.SCENE_NUM; ++i) {
        this.scenes[i] = new THREE.Scene();
        this.scenes[i].fog = new THREE.Fog( 0x000000, this.FOG_NEAR, this.FOG_FAR );
      }

      if (this.postprocess.enabled)
        this.postprocess.init();

      // insert stats
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.zIndex = 100;
      this.container.appendChild( this.stats.domElement );

      (function(self) {
        window.addEventListener( 'resize', function() {self.onWindowResize();}, false );
      })(this);
    },

    update: function(elapsedTime) {
      this.stats.update();

      this.renderer.clear();
      if (this.postprocess.enabled) {
        this.renderer.render( this.scenes[this.currSceneIdx], this.camera, this.postprocess.rtDiffuse, true );
        this.renderer.render( this.postprocess.scene, this.postprocess.camera );
      }
      else {
        this.renderer.render(this.scenes[this.currSceneIdx], this.camera);
      }

      this.postprocess.uniforms.uTime.value = elapsedTime / 10;
    },

    onWindowResize: function() {
      this.width  = window.innerWidth/this.RESOLUTION;
      this.height = window.innerHeight/this.RESOLUTION;

      this.renderer.setSize( this.width, this.height );

      // if (this.postprocess.enabled) {
      //   this.postprocess.rtDiffuse = new THREE.WebGLRenderTarget(
      //     this.width/this.postprocess.RESOLUTION, this.height/this.postprocess.RESOLUTION);
      //   this.postprocess.rtDiffuse.generateMipmaps = false;
      // }

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    },

    postprocess: {
      enabled: true,
      RESOLUTION: 2,  // on top, multiplied

      init: function() {
        width = window.innerWidth/RESOLUTION;
        height = window.innerHeight/RESOLUTION;

        // init buffer
        this.rtDiffuse = new THREE.WebGLRenderTarget(width/this.RESOLUTION, height/this.RESOLUTION);
        this.rtDiffuse.generateMipmaps = false;

        // scene and camera
        this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1.0, 1.0);
        this.scene = new THREE.Scene();

        this.uniforms = {
          uDiffuse:   {type: "t", value: this.rtDiffuse},
          uHV:        {type: "v2", value: new THREE.Vector2(1.0/width, 1.0/height)},
          uTime:      {type: "f", value: 0.0},
          uUVDistort: {type: "f", value: 0.0},
          uFlash:     {type: "f", value: 0.0},
          uBlackout:  {type: "f", value: 0.0},
          uSubdivs:   {type: "f", value: 1.0}
        };

        var shader = new THREE.ShaderMaterial({
          uniforms:       this.uniforms,
          vertexShader:   Utils.loadTextFile("shaders/postprocess-vs.glsl"),
          fragmentShader: Utils.loadTextFile("shaders/postprocess-fs.glsl")
        });

        this.quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shader);
        this.scene.add(this.quad);
      }
    }
  };

  return Graphics;
});
