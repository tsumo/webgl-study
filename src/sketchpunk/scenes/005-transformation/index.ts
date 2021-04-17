import { mat3 } from 'gl-matrix';
import { Canvas } from '../../lib/canvas';
import { Program } from '../../lib/program';
import { Gui } from '../../lib/gui';
import { Vao } from '../../lib/vao';
import { Transform2d } from '../../lib/transform';
import { RenderLoop } from '../../lib/render-loop';
import { primitives } from '../../lib/primitives';
import { deg2Rad } from '../../../utils';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

/**
 * Draws same data multiple times using matrices to set transform.
 * Each iteration reuses the same matrix, reapplying transforms on top.
 */
export const init005Transformation = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const program = new Program(gl, vertexShaderSource, fragmentShaderSource, {
    matrix: { type: 'matrix3fv', value: mat3.create() },
  });

  const gui = new Gui({
    translation: { type: 'vec2', default: [0.12, 0], min: -0.2, max: 0.2, step: 0.001 },
    rotation: { type: 'float', default: 15, min: 0, max: 360, step: 0.01 },
    scale: { type: 'vec2', default: [0.8, 0.8], min: 0, max: 1.4, step: 0.01 },
  });

  const vao = new Vao(gl, [primitives.f2d]);

  const transform = new Transform2d();

  new RenderLoop(() => {
    canvas.clear();
    program.use();
    program.setStandardUniforms();

    transform.setTranslation(gui.values.translation);
    transform.setRotation(deg2Rad(gui.values.rotation));
    transform.setScale(gui.values.scale);

    transform.reset();

    for (let i = 0; i < 5; ++i) {
      program.setUniform('matrix', transform.update());
      vao.drawTriangles();
    }
  });
};
