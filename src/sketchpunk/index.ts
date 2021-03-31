import { Program } from './program';
import { Canvas } from './canvas';
import { Buffer } from './buffer';
import { Gui } from './gui';
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
    { uPointSize: { type: 'float', value: 50 } },
    true,
  );

  const buffer = new Buffer(
    gl,
    'a_position',
    [0, 0, 0, 0.1, 0.1, 0.1, -0.1, -0.1, -0.1],
    3,
    program,
  );

  const gui = new Gui({ uPointSize: { default: 50, min: 0, max: 300, step: 0.01 } }, (values) => {
    program.setUniform('uPointSize', values.uPointSize);
  });

  const tick = (): void => {
    canvas.clear();
    program.use();
    program.setUniform('uPointSize', gui.guiValues.uPointSize);
    buffer.prepare();
    buffer.draw();
    window.requestAnimationFrame(tick);
  };
  tick();
};

window.addEventListener('load', init);
