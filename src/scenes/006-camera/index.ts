import { mat4 } from 'gl-matrix';
import { Canvas } from '../../lib/canvas';
import { Gui } from '../../lib/gui';
import { RenderLoop } from '../../lib/render-loop';
import { Camera } from '../../lib/camera';
import { createGrid } from '../../primitives/grid/grid';
import { createF3d } from '../../primitives/f3d/f3d';

/**
 * Configurable and controllable perspective camera.
 * 3d transforms.
 */
export const init006Camera = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const grid = createGrid(gl);
  grid.transform.scale = [200, 200, 200];

  const f3d = createF3d(gl);

  const fpsCamera = new Camera(gl, 'fps', 10);
  const orbitCamera = new Camera(gl, 'orbit', 10);
  let currentCamera = orbitCamera;
  fpsCamera.pauseInputController();

  const resetCameras = (instant = false): void => {
    fpsCamera.setTranslation([0, -300, 200], instant);
    fpsCamera.setRotation([60, 0, 0], instant);
    orbitCamera.setRotation([64, 0, 0], instant);
    orbitCamera.setTranslation([0, 0, 400], instant);
  };

  resetCameras(true);

  const onCameraChange = (cameraType: string): void => {
    currentCamera.pauseInputController();
    if (cameraType === 'orbit') {
      currentCamera = orbitCamera;
    } else {
      currentCamera = fpsCamera;
    }
    currentCamera.startInputController();
  };

  const gui = new Gui({
    rotation: { type: 'vec3', default: [90, 0, 45], min: 0, max: 360, step: 0.1 },
    translation: { type: 'vec3', default: [0, 0, 0], min: -100, max: 100, step: 5 },
    scale: { type: 'vec3', default: [1, 1, 1], min: -3, max: 3, step: 0.1 },
    fovy: { type: 'float', default: 45, min: 0, max: 180, step: 0.01 },
    near: { type: 'float', default: 0.1, min: 0.1, max: 1000, step: 0.01 },
    far: { type: 'float', default: 5000, min: 0, max: 5000, step: 0.01 },
    camera: { type: 'select', options: ['orbit', 'fps'], onChange: onCameraChange },
    buttons: { type: 'functions', functions: { resetCameras } },
  });

  // TODO: move to canvas options?
  gl.enable(gl.DEPTH_TEST);

  new RenderLoop(() => {
    canvas.clear();

    currentCamera.fovy = gui.values.fovy;
    currentCamera.near = gui.values.near;
    currentCamera.far = gui.values.far;
    currentCamera.update();

    grid.program.use();
    grid.transform.matrix = mat4.clone(currentCamera.viewProjectionMatrix);
    grid.transform.applyTransforms();
    grid.program.setUniform('matrix', grid.transform.matrix);
    grid.vao.drawLines();

    f3d.program.use();
    f3d.transform.matrix = mat4.clone(currentCamera.viewProjectionMatrix);
    f3d.transform.translation = gui.values.translation;
    f3d.transform.rotation = gui.values.rotation;
    f3d.transform.scale = gui.values.scale;
    f3d.transform.applyTransforms();
    f3d.program.setUniform('matrix', f3d.transform.matrix);
    f3d.vao.drawTriangles();
  });
};
