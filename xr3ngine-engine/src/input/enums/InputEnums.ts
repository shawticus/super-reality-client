export enum MouseInput {
  LeftButton = 0,
  MiddleButton = 1,
  RightButton = 2,
  MousePosition = 3,
  MouseClickDownPosition = 4,
  MouseClickDownTransformRotation = 5,
  MouseMovement = 6,
  MouseScroll = 7,
  MouseClickDownMovement = 8
}

export enum TouchInputs {
  Touch = 10,
  DoubleTouch = 11,
  LongTouch = 12,
  Touch1Position = 13,
  Touch2Position = 14,
  Touch1Movement = 15,
  Touch2Movement = 16,
  SwipeLeft = 17,
  SwipeRight = 18,
  SwipeUp = 19,
  SwipeDown = 20,
  Scale = 21,
}

export enum XRAxes {
  Left = 22,
  Right = 23
}

export enum GamepadAxis {
  Left = 28,
  Right = 29
}

export enum GamepadButtons {
  A = 30,
  B = 31,
  X = 32,
  Y = 33,
  LBumper = 34,
  RBumper = 35,
  LTrigger = 36,
  RTrigger = 37,
  Back = 38,
  Start = 39,
  LStick = 40,
  RStick = 41,
  DPad1 = 42,
  DPad2 = 43,
  DPad3 = 44,
  DPad4 = 45
}

export const CameraInput = {
  Neutral: 100,
  Angry: 101,
  Disgusted: 102,
  Fearful: 103,
  Happy: 104,
  Surprised: 105,
  Sad: 106,
  Pucker: 107,
  Widen: 108,
  Open: 109
};
