define([
  "jquery",
  "THREE"
  ],
  function(
  ) {

  var BOUNDS_HSIZE = 100;
  var bounds = new THREE.Box3(
    new THREE.Vector3(-BOUNDS_HSIZE,-BOUNDS_HSIZE,-BOUNDS_HSIZE),
    new THREE.Vector3(BOUNDS_HSIZE,BOUNDS_HSIZE,BOUNDS_HSIZE));
  var OBJ_NUM = 500;
  var OBJ_SCALE_MIN = 1;
  var OBJ_SCALE_MAX = 10;
  var OBJ_VELOCITY_MAX = 2;

  var Scene = {
    scene: null,
    geos: [],
    objects: [],
    matWire: new THREE.MeshBasicMaterial( { color: 0xfffff, wireframe: true } ),
    matParticle: new THREE.ParticleBasicMaterial( { color: 0xfffff, size: 0.1, sizeAttenuation: true } ),

    init: function(scene) {
      this.scene = scene;
      this.geos.push( new THREE.IcosahedronGeometry(1, 0) );
      this.geos.push( new THREE.OctahedronGeometry(1, 0) );
      this.geos.push( new THREE.TetrahedronGeometry(1, 0) );

      // random
      var i;
      for (i=0; i<OBJ_NUM; ++i) {
        var geo = this.geos[ Math.floor(i/OBJ_NUM * this.geos.length) ];
        var mesh = new THREE.ParticleSystem(geo, this.matparticle);

        mesh.position.x = Math.random() * BOUNDS_HSIZE * 2 - BOUNDS_HSIZE;
        mesh.position.y = Math.random() * BOUNDS_HSIZE * 2 - BOUNDS_HSIZE;
        mesh.position.z = Math.random() * BOUNDS_HSIZE * 2 - BOUNDS_HSIZE;

        var scale = Math.random() * (OBJ_SCALE_MAX-OBJ_SCALE_MIN) + OBJ_SCALE_MIN;
        mesh.scale = mesh.scale.multiplyScalar(scale);

        mesh.velocity = new THREE.Vector3();
        mesh.velocity.x = Math.random() * OBJ_VELOCITY_MAX * 2 - OBJ_VELOCITY_MAX;
        mesh.velocity.y = Math.random() * OBJ_VELOCITY_MAX * 2 - OBJ_VELOCITY_MAX;
        mesh.velocity.z = Math.random() * OBJ_VELOCITY_MAX * 2 - OBJ_VELOCITY_MAX;

        scene.add(mesh);
        this.objects.push(mesh);
      }
    },

    updateObjects: function(deltaT) {
      for (var i in this.objects) {
        var obj = this.objects[i];
        obj.position = obj.position.add( obj.velocity.clone().multiplyScalar(deltaT) );
      }
    },

    wrapAround: function(center) {
      var cbounds = new THREE.Box3(
        bounds.min.add(center),
        bounds.max.add(center));


    }

  };

  return Scene;

});