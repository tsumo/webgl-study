import { Program } from '../../lib/program';
import { Canvas } from '../../lib/canvas';
import { Buffer } from '../../lib/buffer';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

/**
 * Draw single point of fixed size using buffer data.
 * Does not have a render loop, image is static after the draw call.
 * Drawn in setTimeout to give Canvas time to set gl viewport.
 */
export const init001Point = (gl: WebGL2RenderingContext): void => {
  new Canvas(gl);

  const program = new Program(gl, vertexShaderSource, fragmentShaderSource, {});

  const buffer = new Buffer(gl, 'a_position', [0, 0], 2, program);

  setTimeout(() => {
    program.use();
    buffer.prepare();
    buffer.drawPoints();
  });
};
