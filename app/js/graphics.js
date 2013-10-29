define([
  "jquery",
  "THREE",
  "Stats",
  "shortcut"
  ],
  function(
    jquery,
    THREE,
    Stats,
    shortcut
  ) {

  var Graphics = {
    camFOV: 45,
    camNear: 1.0,
    camFar: 1000.0,

    resolution: 1.0,

    init: function() {
      console.log("init graphics...");

      this.container = document.getElementById("webgl-container");
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
      this.camera.position.set(10,10,20);
      this.camera.lookAt(new THREE.Vector3());

      // scene
      this.scene = new THREE.Scene();
      this.scene.add(this.camerao);

      geometry = new THREE.CubeGeometry( 1, 1, 1 );
      material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
      mesh = new THREE.Mesh( geometry, material );
      this.scene.add( mesh );

      // insert stats
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.style.zIndex = 100;
      this.container.appendChild( this.stats.domElement );

      self = this;
      window.addEventListener( 'resize', self.onWindowResize, false );
    },

    update: function() {
      this.stats.update();
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    },

    onWindowResize: function() {
      this.width  = window.innerWidth/this.resolution;
      this.height = window.innerHeight/this.resolution;

      this.renderer.setSize( this.width, this.height );

      this.camerao.aspect = this.width / this.height;
      this.camerao.updateProjectionMatrix();
    }
  };

  return Graphics;
});