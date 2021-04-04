import { Program } from '../../lib/program';
import { Canvas } from '../../lib/canvas';
import { Buffer } from '../../lib/buffer';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

export const init001Point = (gl: WebGL2RenderingContext, fpsElement: HTMLDivElement): void => {
  new Canvas(gl);

  const program = new Program(gl, vertexShaderSource, fragmentShaderSource, {}, true);

  const buffer = new Buffer(gl, 'a_position', [0, 0], 2, program);

  setTimeout(() => {
    program.use();
    buffer.prepare();
    buffer.drawPoints();
  });
};
