import { mat4, vec3 } from 'gl-matrix';
import { deg2rad, lerp } from '../utils';
import { Transform3d } from './transform';

type CameraMode = 'free' | 'orbit';

export class Camera {
  private canvas: HTMLCanvasElement | OffscreenCanvas;
  private controller: FreeCameraController | OrbitCameraController;
  private mode: CameraMode;

  /** Camera position in space */
  private transform = new Transform3d();
  /** Inverse of camera position */
  private viewMatrix = mat4.create();
  /** Remaps camera frustum to clip space */
  private projectionMatrix = mat4.create();
  /** Moves projection space to view space (in front of camera) */
  viewProjectionMatrix = mat4.create();

  constructor(gl: WebGL2RenderingContext, mode: CameraMode) {
    this.canvas = gl.canvas;
    this.controller =
      mode === 'free'
        ? new FreeCameraController(gl, this.transform)
        : new OrbitCameraController(gl, this.transform);
    this.mode = mode;
    this.setProjection(deg2rad(45), 0.1, 1000);
  }

  pauseController(): void {
    this.controller.paused = true;
  }

  startController(): void {
    this.controller.paused = false;
  }

  setTranslation(translation: vec3, instant = false): void {
    this.controller.setTranslation(translation);
    if (instant) {
      vec3.copy(this.transform.translation, translation);
    }
  }

  setRotation(rotation: vec3, instant = false): void {
    this.controller.setRotation(rotation);
    if (instant) {
      vec3.copy(this.transform.rotation, rotation);
    }
  }

  setProjection(fovy: number, near: number, far: number): void {
    mat4.perspective(
      this.projectionMatrix,
      fovy,
      this.canvas.width / this.canvas.height,
      near,
      far,
    );
  }

  update(): mat4 {
    this.transform.resetMatrix();
    if (this.mode === 'free') {
      this.transform.applyTransforms();
    } else {
      this.transform.applyTransformsRotationFirst();
    }
    mat4.invert(this.viewMatrix, this.transform.matrix);
    mat4.mul(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
    this.controller.update();
    return this.viewProjectionMatrix;
  }

  destroy(): void {
    this.controller.destroy();
  }
}

// TODO: null-cancelling movement
class FreeCameraController {
  private canvas: HTMLCanvasElement | OffscreenCanvas;
  private cameraTransform: Transform3d;
  private translationFlags = {
    forward: false,
    back: false,
    left: false,
    right: false,
    up: false,
    down: false,
  };
  private mouseCapture = false;
  private translationTarget: vec3;
  private rotationTarget: vec3;
  private boundKeyDownListener: (e: KeyboardEvent) => void;
  private boundKeyUpListener: (e: KeyboardEvent) => void;
  private boundMouseDownListener: VoidFunction;
  private boundMouseUpListener: VoidFunction;
  private boundMouseMoveListener: (e: MouseEvent) => void;

  paused = false;
  private speed = 10;
  private mouseMoveCoef = 0.2;

  constructor(gl: WebGL2RenderingContext, cameraTransform: Transform3d) {
    this.canvas = gl.canvas;
    this.cameraTransform = cameraTransform;
    this.translationTarget = vec3.clone(cameraTransform.translation);
    this.rotationTarget = vec3.clone(cameraTransform.rotation);
    this.boundKeyDownListener = this.keyDownListener.bind(this);
    document.addEventListener('keydown', this.boundKeyDownListener);
    this.boundKeyUpListener = this.keyUpListener.bind(this);
    document.addEventListener('keyup', this.boundKeyUpListener);
    this.boundMouseDownListener = this.mouseDownListener.bind(this);
    this.canvas.addEventListener('mousedown', this.boundMouseDownListener);
    this.boundMouseUpListener = this.mouseUpListener.bind(this);
    document.addEventListener('mouseup', this.boundMouseUpListener);
    this.boundMouseMoveListener = this.mouseMoveListener.bind(this);
    document.addEventListener('mousemove', this.boundMouseMoveListener);
  }

  private keyDownListener(e: KeyboardEvent): void {
    if (this.paused) {
      return;
    }
    // TODO: use map lookup
    if (e.code === 'KeyW') {
      this.translationFlags.forward = true;
    } else if (e.code === 'KeyS') {
      this.translationFlags.back = true;
    } else if (e.code === 'KeyA') {
      this.translationFlags.left = true;
    } else if (e.code === 'KeyD') {
      this.translationFlags.right = true;
    } else if (e.code === 'KeyR') {
      this.translationFlags.up = true;
    } else if (e.code === 'KeyF') {
      this.translationFlags.down = true;
    }
  }

  private keyUpListener(e: KeyboardEvent): void {
    if (this.paused) {
      return;
    }
    if (e.code === 'KeyW') {
      this.translationFlags.forward = false;
    } else if (e.code === 'KeyS') {
      this.translationFlags.back = false;
    } else if (e.code === 'KeyA') {
      this.translationFlags.left = false;
    } else if (e.code === 'KeyD') {
      this.translationFlags.right = false;
    } else if (e.code === 'KeyR') {
      this.translationFlags.up = false;
    } else if (e.code === 'KeyF') {
      this.translationFlags.down = false;
    }
  }

  private mouseDownListener(): void {
    this.mouseCapture = true;
  }

  private mouseUpListener(): void {
    this.mouseCapture = false;
  }

  private mouseMoveListener(e: MouseEvent): void {
    if (!this.mouseCapture || this.paused) {
      return;
    }
    this.rotationTarget[0] += e.movementY * this.mouseMoveCoef;
    this.rotationTarget[2] -= e.movementX * this.mouseMoveCoef;
  }

  setTranslation(translation: vec3): void {
    vec3.copy(this.translationTarget, translation);
  }

  setRotation(rotation: vec3): void {
    vec3.copy(this.rotationTarget, rotation);
  }

  update(): void {
    const { translation, rotation, direction } = this.cameraTransform;
    const { speed, translationFlags, translationTarget, rotationTarget } = this;
    if (translationFlags.forward) {
      translationTarget[0] -= direction.forward[0] * speed;
      translationTarget[1] -= direction.forward[1] * speed;
      translationTarget[2] -= direction.forward[2] * speed;
    }
    if (translationFlags.back) {
      translationTarget[0] += direction.forward[0] * speed;
      translationTarget[1] += direction.forward[1] * speed;
      translationTarget[2] += direction.forward[2] * speed;
    }
    if (translationFlags.left) {
      translationTarget[0] -= direction.right[0] * speed;
      translationTarget[1] -= direction.right[1] * speed;
      translationTarget[2] -= direction.right[2] * speed;
    }
    if (translationFlags.right) {
      translationTarget[0] += direction.right[0] * speed;
      translationTarget[1] += direction.right[1] * speed;
      translationTarget[2] += direction.right[2] * speed;
    }
    if (translationFlags.up) {
      translationTarget[0] += direction.up[0] * speed;
      translationTarget[1] += direction.up[1] * speed;
      translationTarget[2] += direction.up[2] * speed;
    }
    if (translationFlags.down) {
      translationTarget[0] -= direction.up[0] * speed;
      translationTarget[1] -= direction.up[1] * speed;
      translationTarget[2] -= direction.up[2] * speed;
    }
    vec3.lerp(translation, translation, translationTarget, 0.2);
    vec3.lerp(rotation, rotation, rotationTarget, 0.2);
  }

  destroy(): void {
    document.removeEventListener('keydown', this.boundKeyDownListener);
    document.removeEventListener('keyup', this.boundKeyUpListener);
    this.canvas.removeEventListener('mousedown', this.boundMouseDownListener);
    document.removeEventListener('mouseup', this.boundMouseUpListener);
    document.removeEventListener('mousemove', this.boundMouseMoveListener);
  }
}

class OrbitCameraController {
  private canvas: HTMLCanvasElement | OffscreenCanvas;
  private cameraTransform: Transform3d;
  private zTarget: number;
  private rotationTarget: vec3;
  private mouseCapture = false;
  private boundMouseDownListener: VoidFunction;
  private boundMouseUpListener: VoidFunction;
  private boundMouseMoveListener: (e: MouseEvent) => void;
  private boundWheelListener: (e: WheelEvent) => void;

  paused = false;
  private zoomSpeed = 10;
  private mouseMoveCoef = 0.2;

  constructor(gl: WebGL2RenderingContext, cameraTransform: Transform3d) {
    this.canvas = gl.canvas;
    this.cameraTransform = cameraTransform;
    this.zTarget = cameraTransform.translation[2];
    this.rotationTarget = vec3.clone(cameraTransform.rotation);
    this.boundMouseDownListener = this.mouseDownListener.bind(this);
    this.canvas.addEventListener('mousedown', this.boundMouseDownListener);
    this.boundMouseUpListener = this.mouseUpListener.bind(this);
    document.addEventListener('mouseup', this.boundMouseUpListener);
    this.boundMouseMoveListener = this.mouseMoveListener.bind(this);
    document.addEventListener('mousemove', this.boundMouseMoveListener);
    this.boundWheelListener = this.wheelListener.bind(this);
    // @ts-expect-error cannot detect WheelEvent
    this.canvas.addEventListener('wheel', this.boundWheelListener);
  }

  private mouseDownListener(): void {
    this.mouseCapture = true;
  }

  private mouseUpListener(): void {
    this.mouseCapture = false;
  }

  private mouseMoveListener(e: MouseEvent): void {
    if (!this.mouseCapture || this.paused) {
      return;
    }
    this.rotationTarget[0] -= e.movementY * this.mouseMoveCoef;
    this.rotationTarget[1] -= e.movementX * this.mouseMoveCoef;
  }

  private wheelListener(e: WheelEvent): void {
    this.zTarget = this.cameraTransform.translation[2] - e.deltaY * this.zoomSpeed;
  }

  setTranslation(translation: vec3): void {
    this.zTarget = translation[2];
  }

  setRotation(rotation: vec3): void {
    vec3.copy(this.rotationTarget, rotation);
  }

  update(): void {
    const { translation, rotation } = this.cameraTransform;
    translation[2] = lerp(translation[2], this.zTarget, 0.2);
    vec3.lerp(rotation, rotation, this.rotationTarget, 0.2);
  }

  destroy(): void {
    this.canvas.removeEventListener('mousedown', this.boundMouseDownListener);
    document.removeEventListener('mouseup', this.boundMouseUpListener);
    document.removeEventListener('mousemove', this.boundMouseMoveListener);
  }
}
