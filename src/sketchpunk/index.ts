import { Program } from './program';
import { Canvas } from './canvas';
import { Buffer } from './buffer';
import { Gui } from './gui';
import { rand } from '../utils';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

const init = (): void => {
  const canvasElement = document.createElement('canvas');
  document.body.appendChild(canvasElement);

  const gl = canvasElement.getContext('webgl2');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  const canvas = new Canvas(gl);

  const program = new Program(
    gl,
    vertexShaderSource,
    fragmentShaderSource,
    {
      uPointSize: { type: 'float', value: 50 },
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
      uPointSize: { default: 50, min: 0, max: 300, step: 0.01 },
      red: { default: rand(), min: 0, max: 1, step: 0.01 },
      green: { default: rand(), min: 0, max: 1, step: 0.01 },
      blue: { default: rand(), min: 0, max: 1, step: 0.01 },
    },
    (values) => {
      program.setUniform('uPointSize', values.uPointSize);
      program.setUniform('uPointColor', [values.red, values.green, values.blue, 1]);
    },
  );

  const tick = (): void => {
    canvas.clear();
    program.use();
    program.setUniform('uPointSize', gui.guiValues.uPointSize);
    program.setUniform('uPointColor', [
      gui.guiValues.red,
      gui.guiValues.green,
      gui.guiValues.blue,
      1,
    ]);
    buffer.prepare();
    buffer.draw();
    window.requestAnimationFrame(tick);
  };
  tick();
};

window.addEventListener('load', init);
