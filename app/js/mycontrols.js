define([
  "FlyControls"
  ],
  function(
  ) {

  var ANALOG1_TH = 0.05;
  var ANALOG2_TH = 0.50;
  var ROLL_SPEED = Math.PI * 1/4;
  var PITCH_SPEED = Math.PI * 1/8;
  var MOVE_SPEED = 100;
  var BOOST_FACTOR = 5;
  var SLOW_AIM_FACTOR = 0.2;

  var MyControls = {
    speed: new THREE.Vector3(),

    gamepad: null,
    camera: null,

    init: function(camera, gamepad) {
      this.camera = camera;
      this.gamepad = gamepad;

      this.controls = new THREE.FlyControls(this.camera);
      this.controls.autoForward = true;
      this.controls.dragToLook = false;
    },

    update: function(delta) {
      this.gamepad.update();

      var boostMult = 1;
      var slowAimMult = 1;

      if (this.gamepad.buttons["LEFT_SHOULDER_BOTTOM"])
        boostMult *= BOOST_FACTOR;

      if (this.gamepad.buttons["LEFT_SHOULDER"])
        slowAimMult *= SLOW_AIM_FACTOR;

      var lookV = this.gamepad.axes["LEFT_ANALOGUE_VERT"];
      this.controls.pitchSpeed = PITCH_SPEED * Math.abs(lookV) * boostMult * slowAimMult;
      this.controls.moveState.pitchUp = (lookV < -ANALOG1_TH) * 1;
      this.controls.moveState.pitchDown = (lookV > ANALOG1_TH) * 1;

      var lookH = this.gamepad.axes["LEFT_ANALOGUE_HOR"];
      this.controls.rollSpeed = ROLL_SPEED * Math.abs(lookH) * boostMult * slowAimMult;
      this.controls.moveState.rollLeft = (lookH < -ANALOG1_TH) * 1;
      this.controls.moveState.rollRight = (lookH > ANALOG1_TH) * 1;

      var moveV = this.gamepad.axes["RIGHT_ANALOGUE_VERT"];
      if (Math.abs(moveV) > ANALOG2_TH)
        this.speed.z += MOVE_SPEED * delta * moveV * boostMult;

      var moveH = this.gamepad.axes["RIGHT_ANALOGUE_HOR"];
      if (Math.abs(moveH) > ANALOG2_TH)
        this.speed.x += MOVE_SPEED * delta * moveH * boostMult;

      if (this.gamepad.buttons["RIGHT_ANALOGUE_STICK"]) {
        this.speed.x = 0;
        this.speed.z = 0;
      }

      this.controls.moveVector = this.speed.clone().multiplyScalar(boostMult);

      this.controls.update(delta);
    }
  };

  return MyControls;
});