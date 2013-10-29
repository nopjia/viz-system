define([
  ],
  function(
  ) {

  var GamepadManager = {

    BUTTONS: {
      FACE_1: 0, // Face (main) buttons
      FACE_2: 1,
      FACE_3: 2,
      FACE_4: 3,
      LEFT_SHOULDER: 4, // Top shoulder buttons
      RIGHT_SHOULDER: 5,
      LEFT_SHOULDER_BOTTOM: 6, // Bottom shoulder buttons
      RIGHT_SHOULDER_BOTTOM: 7,
      SELECT: 8,
      START: 9,
      LEFT_ANALOGUE_STICK: 10, // Analogue sticks (if depressible)
      RIGHT_ANALOGUE_STICK: 11,
      PAD_TOP: 12, // Directional (discrete) pad
      PAD_BOTTOM: 13,
      PAD_LEFT: 14,
      PAD_RIGHT: 15
    },

    AXES: {
      LEFT_ANALOGUE_HOR: 0,
      LEFT_ANALOGUE_VERT: 1,
      RIGHT_ANALOGUE_HOR: 2,
      RIGHT_ANALOGUE_VERT: 3
    },

    TYPICAL_BUTTON_COUNT: 16,
    TYPICAL_AXIS_COUNT: 4,

    polling: false,
    gamepad: null, // only support one gamepad

    init: function() {
      
      var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
      if (!gamepadSupportAvailable)
        console.error("Gamepad not supported");

      this.polling = true;

    },

    update: function() {
      if (this.polling) {
        _gamepad = navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0];

        if (_gamepad) {
          // finds new gamepad
          if (_gamepad != this.gamepad) {
            this.gamepad = _gamepad;
            console.log(this.gamepad.id);
            console.log(this.gamepad);
          }

          console.log(
            _gamepad.axes[this.AXES["LEFT_ANALOGUE_VERT"]] + " , " +
            _gamepad.axes[this.AXES["LEFT_ANALOGUE_HOR"]]
          );
        }
      }
    }

  };

  return GamepadManager;
});