define([
  "FlyControls",
  "gamepad"
  ],
  function(
    ignore,
    gamepad
  ) {

  var ANALOG_TH = 0.05;
  var ROLL_SPEED = Math.PI * 1/2;
  var PITCH_SPEED = Math.PI * 1/8;
  var SPEED_STEP = 200;
  var BOOST_FACTOR = 5;

  var MyControls = {
    camera: null,
    speed: 0,

    init: function() {
      this.controls = new THREE.FlyControls(this.camera);
      this.controls.autoForward = true;
      this.controls.dragToLook = false;

      gamepad.init();
    },

    update: function(delta) {
      gamepad.update();

      var boostMult = gamepad.buttons["LEFT_SHOULDER_BOTTOM"] ?
        BOOST_FACTOR : 1;

      var lookV = gamepad.axes["LEFT_ANALOGUE_VERT"];
      this.controls.pitchSpeed = PITCH_SPEED * Math.abs(lookV) * boostMult;
      this.controls.moveState.pitchUp = (lookV < -ANALOG_TH) * 1;
      this.controls.moveState.pitchDown = (lookV > ANALOG_TH) * 1;

      var lookH = gamepad.axes["LEFT_ANALOGUE_HOR"];
      this.controls.rollSpeed = ROLL_SPEED * Math.abs(lookH) * boostMult;
      this.controls.moveState.rollLeft = (lookH < -ANALOG_TH) * 1;
      this.controls.moveState.rollRight = (lookH > ANALOG_TH) * 1;

      if (gamepad.buttons["PAD_TOP"])
        this.speed += SPEED_STEP * delta;
      if (gamepad.buttons["PAD_BOTTOM"])
        this.speed -= SPEED_STEP * delta;
      this.controls.movementSpeed = this.speed * boostMult;

      this.controls.update(delta);
    }
  };

  return MyControls;
});