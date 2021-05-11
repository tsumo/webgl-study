import { mat4, vec3 } from 'gl-matrix';
import { deg2rad, lerp } from '../utils';
import { InputController } from './input-controller';
import { Transform3d } from './transform';

type CameraMode = 'free' | 'orbit';

export class Camera {
  private canvas: HTMLCanvasElement | OffscreenCanvas;
  private controller: FreeCameraController | OrbitCameraController;
  private mode: CameraMode;

  private projectionParams = { fovy: deg2rad(45), near: 0.1, far: 4000 };

  /** Camera position in space */
  private transform = new Transform3d();
  /** Inverse of camera position */
  private viewMatrix = mat4.create();
  /** Remaps camera frustum to clip space */
  private projectionMatrix = mat4.create();
  /** Moves projection space to view space (in front of camera) */
  viewProjectionMatrix = mat4.create();

  constructor(gl: WebGL2RenderingContext, mode: CameraMode, moveCoef = 1) {
    this.canvas = gl.canvas;
    this.controller =
      mode === 'free'
        ? new FreeCameraController(gl, this.transform, moveCoef)
        : new OrbitCameraController(gl, this.transform, moveCoef);
    this.mode = mode;
  }

  set fovy(deg: number) {
    this.projectionParams.fovy = deg2rad(deg);
  }

  set near(distance: number) {
    this.projectionParams.near = distance;
  }

  set far(distance: number) {
    this.projectionParams.far = distance;
  }

  pauseInputController(): void {
    this.controller.inputController.paused = true;
  }

  startInputController(): void {
    this.controller.inputController.paused = false;
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

  update(): mat4 {
    mat4.perspective(
      this.projectionMatrix,
      this.projectionParams.fovy,
      this.canvas.width / this.canvas.height,
      this.projectionParams.near,
      this.projectionParams.far,
    );
    this.transform.resetMatrix();
    if (this.mode === 'free') {
      this.transform.applyTransforms();
    } else {
      this.transform.applyTransformsOrbit();
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
  private cameraTransform: Transform3d;
  private translationFlags = {
    forward: false,
    back: false,
    left: false,
    right: false,
    up: false,
    down: false,
  };
  private translationTarget: vec3;
  private rotationTarget: vec3;
  inputController: InputController;

  private moveCoef: number;
  private mouseMoveCoef = 0.2;

  constructor(gl: WebGL2RenderingContext, cameraTransform: Transform3d, moveCoef: number) {
    this.cameraTransform = cameraTransform;
    this.moveCoef = moveCoef;
    this.translationTarget = vec3.clone(cameraTransform.translation);
    this.rotationTarget = vec3.clone(cameraTransform.rotation);
    this.inputController = new InputController(gl, {
      keyDown: this.keyDownListener.bind(this),
      keyUp: this.keyUpListener.bind(this),
      mouseMove: this.mouseMoveListener.bind(this),
    });
  }

  private keyDownListener(e: KeyboardEvent): void {
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

  private mouseMoveListener(e: MouseEvent): void {
    // TODO: maintain up vector
    this.rotationTarget[0] += e.movementY * this.mouseMoveCoef;
    this.rotationTarget[1] += e.movementX * this.mouseMoveCoef;
  }

  setTranslation(translation: vec3): void {
    vec3.copy(this.translationTarget, translation);
  }

  setRotation(rotation: vec3): void {
    vec3.copy(this.rotationTarget, rotation);
  }

  update(): void {
    const { translation, rotation, direction } = this.cameraTransform;
    const { moveCoef, translationFlags, translationTarget, rotationTarget } = this;
    if (translationFlags.forward) {
      translationTarget[0] -= direction.forward[0] * moveCoef;
      translationTarget[1] -= direction.forward[1] * moveCoef;
      translationTarget[2] -= direction.forward[2] * moveCoef;
    }
    if (translationFlags.back) {
      translationTarget[0] += direction.forward[0] * moveCoef;
      translationTarget[1] += direction.forward[1] * moveCoef;
      translationTarget[2] += direction.forward[2] * moveCoef;
    }
    if (translationFlags.left) {
      translationTarget[0] -= direction.right[0] * moveCoef;
      translationTarget[1] -= direction.right[1] * moveCoef;
      translationTarget[2] -= direction.right[2] * moveCoef;
    }
    if (translationFlags.right) {
      translationTarget[0] += direction.right[0] * moveCoef;
      translationTarget[1] += direction.right[1] * moveCoef;
      translationTarget[2] += direction.right[2] * moveCoef;
    }
    if (translationFlags.up) {
      translationTarget[0] += direction.up[0] * moveCoef;
      translationTarget[1] += direction.up[1] * moveCoef;
      translationTarget[2] += direction.up[2] * moveCoef;
    }
    if (translationFlags.down) {
      translationTarget[0] -= direction.up[0] * moveCoef;
      translationTarget[1] -= direction.up[1] * moveCoef;
      translationTarget[2] -= direction.up[2] * moveCoef;
    }
    vec3.lerp(translation, translation, translationTarget, 0.2);
    vec3.lerp(rotation, rotation, rotationTarget, 0.2);
  }

  destroy(): void {
    this.inputController.destroy();
  }
}

class OrbitCameraController {
  private cameraTransform: Transform3d;
  private zTarget: number;
  private rotationTarget: vec3;

  inputController: InputController;

  private moveCoef;
  private mouseMoveCoef = 0.2;

  constructor(gl: WebGL2RenderingContext, cameraTransform: Transform3d, moveCoef: number) {
    this.cameraTransform = cameraTransform;
    this.moveCoef = moveCoef;
    this.zTarget = cameraTransform.translation[2];
    this.rotationTarget = vec3.clone(cameraTransform.rotation);
    this.inputController = new InputController(gl, {
      mouseMove: this.mouseMoveListener.bind(this),
      wheel: this.wheelListener.bind(this),
    });
  }

  private mouseMoveListener(e: MouseEvent): void {
    // TODO: maintain up vector
    this.rotationTarget[0] -= e.movementY * this.mouseMoveCoef;
    this.rotationTarget[2] -= e.movementX * this.mouseMoveCoef;
  }

  private wheelListener(e: WheelEvent): void {
    this.zTarget = this.cameraTransform.translation[2] - e.deltaY * this.moveCoef;
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
    this.inputController.destroy();
  }
}
