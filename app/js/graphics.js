define([
  "jquery",
  "THREE",
  "Stats",
  "TrackballControls",
  "utils"
  ],
  function(
    ignore,
    ignore,
    ignore,
    ignore,
    Utils
  ) {

  var timer = 0.0;
  var resolution = 2.0;

  var Graphics = {
    camFOV: 45,
    camNear: 0.1,
    camFar: 1000.0,
    resolution: resolution,

    init: function() {
      this.container = $("#webgl-container")[0];
      this.width = window.innerWidth/this.resolution;
      this.height = window.innerHeight/this.resolution;

      this.renderer = new THREE.WebGLRenderer({
        clearAlpha: 0,
        clearColor: 0x000000,
        antialias: true
      });
      this.renderer.setSize( this.width, this.height );
      this.renderer.autoClear = false;
      this.container.appendChild( this.renderer.domElement );
 
      // camera
      this.camera = new THREE.PerspectiveCamera(
        this.camFOV,
        this.width/this.height,
        this.camNear, this.camFar
      );
      this.camera.position.set(5,5,10);
      this.camera.lookAt(new THREE.Vector3());

      this.controls = new THREE.TrackballControls(this.camera, this.container);
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.panSpeed = 1.0;
      this.controls.dynamicDampingFactor = 0.3;
      this.controls.staticMoving = false;
      this.controls.noZoom = false;
      this.controls.noPan = true;
      this.controls.keys = []; // hack disable keyboard

      // scene
      this.scene = new THREE.Scene();

      geometry = new THREE.CubeGeometry( 1, 1, 1 );
      material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
      mesh = new THREE.Mesh( geometry, material );
      this.scene.add( mesh );

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

    update: function() {
      this.stats.update();

      this.renderer.clear();

      if (this.postprocess.enabled) {
        this.renderer.render( this.scene, this.camera, this.postprocess.rtDiffuse, true );
        this.renderer.render( this.postprocess.scene, this.postprocess.camera );
      }
      else {
        this.renderer.render(this.scene, this.camera);
      }

      this.postprocess.uniforms.uTime.value += 0.001;

      this.controls.update();
    },

    onWindowResize: function() {
      this.width  = window.innerWidth/this.resolution;
      this.height = window.innerHeight/this.resolution;

      this.renderer.setSize( this.width, this.height );

      if (this.postprocess.enabled)
        this.postprocess.rtDiffuse = new THREE.WebGLRenderTarget(this.width, this.height);

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    },

    postprocess: {
      enabled: true,

      init: function() {
        width = window.innerWidth/resolution;
        height = window.innerHeight/resolution;

        // init buffer
        this.rtDiffuse = new THREE.WebGLRenderTarget(width, height);
        
        // scene and camera
        this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1.0, 1.0);
        this.scene = new THREE.Scene();
        
        this.uniforms = {
          uDiffuse:   {type: "t", value: this.rtDiffuse},
          uHV:        {type: "v2", value: new THREE.Vector2(1.0/width, 1.0/height)},
          uTime:      {type: "f", value: 0.0}
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