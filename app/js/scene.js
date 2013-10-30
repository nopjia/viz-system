define([
  "jquery",
  "THREE"
  ],
  function(
  ) {

  var BOUNDS_HSIZE = 200;
  var OBJ_NUM = 1000;
  var OBJ_SCALE_MIN = 1;
  var OBJ_SCALE_MAX = 20;
  var OBJ_VELOCITY_MAX = 2;
  var OBJ_GEO_MODES = 2;
  var PARTICLE_SIZE = 5;

  var Scene = {

    bounds: new THREE.Box3(
      new THREE.Vector3(-BOUNDS_HSIZE,-BOUNDS_HSIZE,-BOUNDS_HSIZE),
      new THREE.Vector3(BOUNDS_HSIZE,BOUNDS_HSIZE,BOUNDS_HSIZE)
    ),

    matWire: new THREE.MeshBasicMaterial( { color: 0xfffff, wireframe: true } ),
    matParticle: new THREE.ParticleBasicMaterial( { color: 0xfffff, size: PARTICLE_SIZE, sizeAttenuation: true } ),
    geoMode: 0,

    scene: null,
    geos: [],
    objects: [],

    init: function(scene) {
      this.scene = scene;
      this.geos.push( new THREE.IcosahedronGeometry(1, 0) );
      this.geos.push( new THREE.OctahedronGeometry(1, 0) );
      this.geos.push( new THREE.TetrahedronGeometry(1, 0) );

      var i;

      // init obj arrays
      for (i=0; i<OBJ_GEO_MODES; ++i) {
        this.objects.push([]);
      }

      // random init objs
      for (i=0; i<OBJ_NUM; ++i) {
        var geo = this.geos[ Math.floor(i/OBJ_NUM * this.geos.length) ];

        var mesh = new THREE.Mesh(geo, this.matWire);

        mesh.position.x = Math.random() * BOUNDS_HSIZE * 2 - BOUNDS_HSIZE;
        mesh.position.y = Math.random() * BOUNDS_HSIZE * 2 - BOUNDS_HSIZE;
        mesh.position.z = Math.random() * BOUNDS_HSIZE * 2 - BOUNDS_HSIZE;

        var scale = Math.random() * (OBJ_SCALE_MAX-OBJ_SCALE_MIN) + OBJ_SCALE_MIN;
        mesh.scale = mesh.scale.multiplyScalar(scale);

        mesh.velocity = new THREE.Vector3();
        mesh.velocity.x = Math.random() * OBJ_VELOCITY_MAX * 2 - OBJ_VELOCITY_MAX;
        mesh.velocity.y = Math.random() * OBJ_VELOCITY_MAX * 2 - OBJ_VELOCITY_MAX;
        mesh.velocity.z = Math.random() * OBJ_VELOCITY_MAX * 2 - OBJ_VELOCITY_MAX;

        var meshMesh = mesh;
        var meshParticle = new THREE.ParticleSystem(geo);
        meshParticle.position = meshMesh.position;
        meshParticle.scale    = meshMesh.scale;
        meshParticle.velocity = meshMesh.velocity;
        meshParticle.material.size = PARTICLE_SIZE;

        this.objects[0].push(meshMesh);
        this.objects[1].push(meshParticle);

        scene.add(meshMesh);
      }

      // start out with particle
      this.toggleObjectMaterial();
    },

    updateObjects: function(deltaT) {
      for (var i in this.objects[this.geoMode]) {
        var obj = this.objects[this.geoMode][i];
        obj.position = obj.position.add( obj.velocity.clone().multiplyScalar(deltaT) );
      }
    },

    wrapAround: function(center) {
      var cbounds = this.bounds.clone();
      cbounds.min.add(center);
      cbounds.max.add(center);

      for (var i in this.objects[this.geoMode]) {
        var obj = this.objects[this.geoMode][i];

        if (obj.position.x > cbounds.max.x) obj.position.x = cbounds.min.x;
        else if (obj.position.x < cbounds.min.x) obj.position.x = cbounds.max.x;
        if (obj.position.y > cbounds.max.y) obj.position.y = cbounds.min.y;
        else if (obj.position.y < cbounds.min.y) obj.position.y = cbounds.max.y;
        if (obj.position.z > cbounds.max.z) obj.position.z = cbounds.min.z;
        else if (obj.position.z < cbounds.min.z) obj.position.z = cbounds.max.z;
      }

    },

    toggleObjectMaterial: function() {
      var currMode = this.geoMode;
      this.geoMode = this.geoMode === 0 ? 1 : 0;

      for (var i in this.objects[this.geoMode]) {
        this.scene.remove( this.objects[currMode][i] );
        this.scene.add( this.objects[this.geoMode][i] );
      }
    }

  };

  return Scene;

});