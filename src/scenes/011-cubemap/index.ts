import { mat4 } from 'gl-matrix';
import { Camera } from '../../lib/camera';
import { Canvas } from '../../lib/canvas';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { RenderLoop } from '../../lib/render-loop';
import { createGrid } from '../../primitives/grid/grid';
import { createTextureCubemap } from '../../lib/texture';
import imgRight from '../../assets/interstellar-cubemap/right.jpg';
import imgLeft from '../../assets/interstellar-cubemap/left.jpg';
import imgTop from '../../assets/interstellar-cubemap/top.jpg';
import imgBottom from '../../assets/interstellar-cubemap/bottom.jpg';
import imgBack from '../../assets/interstellar-cubemap/back.jpg';
import imgFront from '../../assets/interstellar-cubemap/front.jpg';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import { deg2rad } from '../../utils';

/**
 * Screen-space single plane cubemap.
 */
export const init011Cubemap = async (gl: WebGL2RenderingContext): Promise<void> => {
  const canvas = new Canvas(gl);

  const camera = new Camera(gl, 'orbit');
  camera.setTranslation([0, 0, 3], true);
  camera.setRotation([80, 0, 12], true);

  const grid = createGrid(gl);

  const planeData = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  const planeVao = new Vao(gl, [{ type: 'float', data: planeData, size: 2 }]);
  const planeProgram = new Program(
    gl,
    vertexShader,
    fragmentShader,
    { matrixInv: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position'],
  );

  const textureCubemap = await createTextureCubemap(
    gl,
    [imgRight, imgLeft, imgTop, imgBottom, imgBack, imgFront],
    0,
  );
  textureCubemap.activate();

  gl.enable(gl.DEPTH_TEST);

  const viewMatrixTransitionless = mat4.create();
  const viewProjection = mat4.create();
  const viewProjectionInv = mat4.create();

  new RenderLoop(() => {
    canvas.clear();

    camera.update();

    mat4.copy(viewMatrixTransitionless, camera.viewMatrix);
    viewMatrixTransitionless[12] = 0;
    viewMatrixTransitionless[13] = 0;
    viewMatrixTransitionless[14] = 0;
    mat4.rotateX(viewMatrixTransitionless, viewMatrixTransitionless, deg2rad(90));
    mat4.mul(viewProjection, camera.projectionMatrix, viewMatrixTransitionless);
    mat4.invert(viewProjectionInv, viewProjection);

    planeProgram.use();
    planeProgram.setUniform('matrixInv', viewProjectionInv);
    planeVao.drawTriangles();

    grid.program.use();
    grid.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
    grid.transform.applyTransforms();
    grid.program.setUniform('matrix', grid.transform.matrix);
    grid.vao.drawLines();
  });
};
