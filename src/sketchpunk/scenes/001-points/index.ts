import { Program } from '../../lib/program';
import { Canvas } from '../../lib/canvas';
import { Buffer } from '../../lib/buffer';
import { Gui } from '../../lib/gui';
import { RenderLoop } from '../../lib/render-loop';
import { rand } from '../../../utils';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

export const init001Points = (gl: WebGL2RenderingContext, fpsElement: HTMLDivElement): void => {
  const canvas = new Canvas(gl);

  const program = new Program(
    gl,
    vertexShaderSource,
    fragmentShaderSource,
    {
      uPointSize: { type: 'float', value: 50 },
      uAngle: { type: 'float', value: 0 },
      uPointColor: { type: 'vec4', value: [1, 1, 1, 1] },
    },
    true,
  );

  const buffer = new Buffer(
    gl,
    'a_position',
    [0, 0, 0, 0.1, 0.1, 0.1, -0.1, -0.1, -0.1],
    3,
    program,
  );

  const gui = new Gui(
    {
      basePointSize: { default: 50, min: 0, max: 300, step: 0.01 },
      red: { default: rand(), min: 0, max: 1, step: 0.01 },
      green: { default: rand(), min: 0, max: 1, step: 0.01 },
      blue: { default: rand(), min: 0, max: 1, step: 0.01 },
    },
    (values) => {
      program.setUniform('uPointSize', values.basePointSize);
      program.setUniform('uPointColor', [values.red, values.green, values.blue, 1]);
    },
  );

  let animatedPointSize = 0;
  let angle = 0;

  new RenderLoop((delta, fps) => {
    animatedPointSize += delta * 3;
    const finalPointSize = Math.sin(animatedPointSize) * 10 + gui.guiValues.basePointSize;

    angle = (angle + delta * 0.5) % (Math.PI * 2);

    fpsElement.innerText = String(fps);

    canvas.clear();
    program.use();
    program.setUniform('uPointSize', finalPointSize);
    program.setUniform('uAngle', angle);
    program.setUniform('uPointColor', [
      gui.guiValues.red,
      gui.guiValues.green,
      gui.guiValues.blue,
      1,
    ]);
    buffer.prepare();
    buffer.draw();
  });
};
