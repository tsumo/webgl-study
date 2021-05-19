import { mat4 } from 'gl-matrix';
import { Camera } from '../../lib/camera';
import { Canvas } from '../../lib/canvas';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { Transform3d } from '../../lib/transform';
import { Texture } from '../../lib/texture';
import { Gui } from '../../lib/gui';
import { RenderLoop } from '../../lib/render-loop';
import { createGrid } from '../../primitives/grid/grid';
import { generateCubeData } from '../../primitives/cube';
import { generateCheckerboardTexture } from '../../primitives/textures/checkerboard-texture';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export const init010Cube = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const camera = new Camera(gl, 'orbit');
  camera.setTranslation([0, 0, 15], true);
  camera.setRotation([50, 0, 12], true);

  const grid = createGrid(gl);
  grid.transform.scale = [10, 10, 10];

  const cubeProgram = new Program(
    gl,
    vertexShader,
    fragmentShader,
    {
      matrix: { type: 'matrix4fv', value: mat4.create() },
      mix: { type: 'f', value: 0.3 },
    },
    ['a_position', 'a_color', 'a_uv', 'a_normal'],
  );
  const cubeData = generateCubeData();
  const cubeVao = new Vao(
    gl,
    [cubeData.position, cubeData.color, cubeData.uv, cubeData.normal],
    cubeData.index,
  );
  const cubeTransform = new Transform3d();
  cubeTransform.scale = [5, 5, 5];

  const texture = new Texture(gl, generateCheckerboardTexture(256), 0);
  texture.activate();

  gl.enable(gl.DEPTH_TEST);

  const gui = new Gui({ mix: { type: 'float', min: 0, max: 1, step: 0.01, default: 0.3 } });

  new RenderLoop((_delta, time) => {
    canvas.clear();

    camera.update();

    grid.program.use();
    grid.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
    grid.transform.applyTransforms();
    grid.program.setUniform('matrix', grid.transform.matrix);
    grid.vao.drawLines();

    cubeProgram.use();
    cubeTransform.matrix = mat4.clone(camera.viewProjectionMatrix);
    cubeTransform.applyTransforms();
    cubeProgram.setUniform('matrix', cubeTransform.matrix);
    cubeProgram.setUniform('mix', gui.values.mix);
    cubeProgram.setStandardUniforms(time);
    cubeVao.drawTriangles();
  });
};
