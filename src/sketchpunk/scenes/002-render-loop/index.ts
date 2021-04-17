import { Program } from '../../lib/program';
import { Canvas } from '../../lib/canvas';
import { Buffer } from '../../lib/buffer';
import { Gui } from '../../lib/gui';
import { RenderLoop } from '../../lib/render-loop';
import { rand } from '../../../utils';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

/**
 * Draws three points stored in a buffer.
 * Vertex shader animates positions using simple trig functions.
 */
export const init002RenderLoop = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const program = new Program(gl, vertexShaderSource, fragmentShaderSource, {
    pointSize: { type: 'f', value: 50 },
    angle: { type: 'f', value: 0 },
    pointColor: { type: '4f', value: [1, 1, 1, 1] },
  });

  const buffer = new Buffer(
    gl,
    'a_position',
    [0, 0, 0, 0.1, 0.1, 0.1, -0.1, -0.1, -0.1],
    3,
    program,
  );

  const gui = new Gui({
    basePointSize: { type: 'float', default: 50, min: 0, max: 300, step: 0.01 },
    red: { type: 'float', default: rand(), min: 0, max: 1, step: 0.01 },
    green: { type: 'float', default: rand(), min: 0, max: 1, step: 0.01 },
    blue: { type: 'float', default: rand(), min: 0, max: 1, step: 0.01 },
  });

  let animatedPointSize = 0;
  let angle = 0;

  new RenderLoop((delta) => {
    animatedPointSize += delta * 3;
    const finalPointSize = Math.sin(animatedPointSize) * 10 + gui.values.basePointSize;

    angle = (angle + delta * 0.5) % (Math.PI * 2);

    canvas.clear();
    program.use();
    program.setUniform('pointSize', finalPointSize);
    program.setUniform('angle', angle);
    program.setUniform('pointColor', [gui.values.red, gui.values.green, gui.values.blue, 1]);
    buffer.prepare();
    buffer.drawPoints();
  });
};
