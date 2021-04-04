import { Canvas } from '../../lib/canvas';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { RenderLoop } from '../../lib/render-loop';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

// Two floats for position, one float to choose color
const generateGrid = (): number[] => {
  const grid: number[] = [];
  const size = 1.8;
  const div = 10;
  const step = size / div;
  const half = size / 2;
  for (let i = 0; i <= div; i++) {
    const horizontal = -half + i * step;
    grid.push(horizontal, half, 0);
    grid.push(horizontal, -half, 1);
    const vertical = half - i * step;
    grid.push(-half, vertical, 0);
    grid.push(half, vertical, 1);
  }

  return grid;
};

export const init004Lines = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const colors = [
    [0.8, 0.8, 0.8],
    [1, 0, 0],
  ].flat();

  const program = new Program(gl, vertexShaderSource, fragmentShaderSource, {
    uColor: { type: '3fv', value: colors },
  });

  const vao = new Vao(gl, [{ data: generateGrid(), size: 3 }]);

  new RenderLoop(() => {
    canvas.clear();
    program.use();
    program.setUniform('uColor', colors);
    vao.drawLines();
  });
};
