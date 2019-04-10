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
  var OBJ_DROT_MAX = 0.3;
  var OBJ_GEO_MODES = 2;
  var PARTICLE_SIZE = 5;
  var PARTICLE_LIGHT_ADD = 0.15;

  var Scene = {

    bounds: new THREE.Box3(
      new THREE.Vector3(-BOUNDS_HSIZE,-BOUNDS_HSIZE,-BOUNDS_HSIZE),
      new THREE.Vector3(BOUNDS_HSIZE,BOUNDS_HSIZE,BOUNDS_HSIZE)
    ),

    matWire: new THREE.MeshBasicMaterial( { color: 0x0fffff, wireframe: true } ),
    matParticle: new THREE.ParticleBasicMaterial( { color: 0x0fffff, size: PARTICLE_SIZE, sizeAttenuation: true } ),
    geoMode: 0,

    geos: [],
    objects: [],

    init: function() {
      var triGeometry = new THREE.Geometry();
      triGeometry.vertices.push( new THREE.Vector3( Math.cos(Math.PI*1/6), Math.sin(Math.PI*1/6), 0 ) );
      triGeometry.vertices.push( new THREE.Vector3( Math.cos(Math.PI*5/6), Math.sin(Math.PI*5/6), 0 ) );
      triGeometry.vertices.push( new THREE.Vector3( 0, -1, 0 ) );
      triGeometry.faces.push( new THREE.Face3(0, 1, 2) );

      this.geos.push(triGeometry);
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

        mesh.drot = new THREE.Vector3();
        mesh.drot.x = Math.random() * OBJ_DROT_MAX * 2 - OBJ_DROT_MAX;
        mesh.drot.y = Math.random() * OBJ_DROT_MAX * 2 - OBJ_DROT_MAX;
        mesh.drot.z = Math.random() * OBJ_DROT_MAX * 2 - OBJ_DROT_MAX;

        var meshMesh = mesh;
        var meshParticle = new THREE.ParticleSystem(geo);
        meshParticle.position = meshMesh.position;
        meshParticle.scale    = meshMesh.scale;
        meshParticle.velocity = meshMesh.velocity;
        meshParticle.drot     = meshMesh.drot;
        meshParticle.material.size = PARTICLE_SIZE;
        meshParticle.material.color.r += PARTICLE_LIGHT_ADD;
        meshParticle.material.color.g += PARTICLE_LIGHT_ADD;
        meshParticle.material.color.b += PARTICLE_LIGHT_ADD;

        this.objects[0].push(meshMesh);
        this.objects[1].push(meshParticle);
      }
    },

    updateObjects: function(deltaT) {
      for (var i in this.objects[0]) {
        var obj = this.objects[0][i];
        obj.position = obj.position.add( obj.velocity.clone().multiplyScalar(deltaT) );

        obj.rotation.x += obj.drot.x * deltaT;
        obj.rotation.y += obj.drot.y * deltaT;
        obj.rotation.z += obj.drot.z * deltaT;
      }
    },

    wrapAround: function(center) {
      var cbounds = this.bounds.clone();
      cbounds.min.add(center);
      cbounds.max.add(center);

      for (var i in this.objects[0]) {
        var obj = this.objects[0][i];
        if (obj.position.x > cbounds.max.x) obj.position.x = cbounds.min.x;
        else if (obj.position.x < cbounds.min.x) obj.position.x = cbounds.max.x;
        if (obj.position.y > cbounds.max.y) obj.position.y = cbounds.min.y;
        else if (obj.position.y < cbounds.min.y) obj.position.y = cbounds.max.y;
        if (obj.position.z > cbounds.max.z) obj.position.z = cbounds.min.z;
        else if (obj.position.z < cbounds.min.z) obj.position.z = cbounds.max.z;
      }
    }

  };

  return Scene;

});