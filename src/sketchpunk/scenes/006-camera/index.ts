import { mat4 } from 'gl-matrix';
import { Canvas } from '../../lib/canvas';
import { Gui } from '../../lib/gui';
import { primitives } from '../../lib/primitives';
import { Program } from '../../lib/program';
import { RenderLoop } from '../../lib/render-loop';
import { Vao } from '../../lib/vao';
import { Camera } from '../../lib/camera';
import { deg2rad } from '../../../utils';
import { Transform3d } from '../../lib/transform';
import gridVertexShader from './grid-vertex.glsl';
import gridFragmentShader from './grid-fragment.glsl';
import fVertexShader from './f-vertex.glsl';
import fFragmentShader from './f-fragment.glsl';

export const init006Camera = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const gridProgram = new Program(
    gl,
    gridVertexShader,
    gridFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position', 'a_color'],
  );
  const gridVao = new Vao(gl, [primitives.grid.position, primitives.grid.color]);
  const gridTransform = new Transform3d();
  gridTransform.rotation = [90, 0, 0];
  gridTransform.scale = [200, 200, 200];

  const fProgram = new Program(
    gl,
    fVertexShader,
    fFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position', 'a_color'],
  );
  const fVao = new Vao(gl, [primitives.f3d.position, primitives.f3d.color]);
  const fTransform = new Transform3d();

  const freeCamera = new Camera(gl, 'free');
  const orbitCamera = new Camera(gl, 'orbit');
  let currentCamera = orbitCamera;
  freeCamera.pauseController();

  const changeCamera = (): void => {
    currentCamera.pauseController();
    if (currentCamera === freeCamera) {
      currentCamera = orbitCamera;
    } else {
      currentCamera = freeCamera;
    }
    currentCamera.startController();
  };

  const resetCameras = (instant = false): void => {
    freeCamera.setTranslation([0, 80, -400], instant);
    freeCamera.setRotation([-10, 180, 0], instant);
    orbitCamera.setRotation([-15, 0, 0], instant);
    orbitCamera.setTranslation([0, 0, 400], instant);
  };

  resetCameras(true);

  const gui = new Gui({
    rotation: { type: 'vec3', default: [0, 0, 45], min: 0, max: 360, step: 0.01 },
    fovy: { type: 'float', default: 45, min: 0, max: 180, step: 0.01 },
    near: { type: 'float', default: 0.1, min: 0.1, max: 1000, step: 0.01 },
    far: { type: 'float', default: 5000, min: 0, max: 5000, step: 0.01 },
    buttons: { type: 'functions', functions: { changeCamera, resetCameras } },
  });

  // TODO: move to canvas options?
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  new RenderLoop(() => {
    canvas.clear();

    currentCamera.setProjection(deg2rad(gui.values.fovy), gui.values.near, gui.values.far);
    currentCamera.update();

    gridProgram.use();
    gridTransform.matrix = mat4.clone(currentCamera.viewProjectionMatrix);
    gridTransform.applyTransforms();
    gridProgram.setUniform('matrix', gridTransform.matrix);
    gridVao.drawLines();

    fProgram.use();
    fTransform.matrix = mat4.clone(currentCamera.viewProjectionMatrix);
    fTransform.rotation = gui.values.rotation;
    fTransform.applyTransforms();
    fProgram.setUniform('matrix', fTransform.matrix);
    fVao.drawTriangles();
  });
};
