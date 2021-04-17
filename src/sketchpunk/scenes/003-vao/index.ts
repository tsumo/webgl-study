import { Canvas } from '../../lib/canvas';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { RenderLoop } from '../../lib/render-loop';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

/**
 * Uses Vertex Array Object to draw triangles with shared central point.
 */
export const init003Vao = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const program = new Program(gl, vertexShaderSource, fragmentShaderSource, {
    angle: { type: 'f', value: 0 },
  });

  const points = new Float32Array(
    [
      [-0.1, 0.1],
      [0.1, -0.1],
      [-0.1, -0.1],
      [0.1, 0.1],
    ].flat(),
  );

  const vaoWithoutIndex = new Vao(gl, [{ type: 'float', data: points, size: 2 }]);

  const cross = new Float32Array(
    [
      [0, 0],
      [-0.05, 0.1],
      [-0.1, 0.05],
      [0.05, 0.1],
      [0.1, 0.05],
      [-0.1, -0.05],
      [-0.05, -0.1],
      [0.1, -0.05],
      [0.05, -0.1],
    ].flat(),
  );

  const vaoWithIndex = new Vao(
    gl,
    [{ type: 'float', data: cross, size: 2 }],
    [0, 1, 2, 0, 3, 4, 0, 5, 6, 0, 7, 8],
  );

  let angle = 0;

  new RenderLoop((delta) => {
    angle = (angle + delta * 0.5) % (Math.PI * 2);

    canvas.clear();
    program.use();
    program.setUniform('angle', angle);
    vaoWithIndex.drawTriangles();
    vaoWithoutIndex.drawPoints();
  });
};
