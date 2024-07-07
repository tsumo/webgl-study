import { mat4 } from 'gl-matrix';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { Transform3d } from '../../lib/transform';
import { BufferInitInfoFloat, BufferInitInfoUnsignedByte } from '../../lib/types';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

const generateGridData = (): {
  position: BufferInitInfoFloat;
  color: BufferInitInfoUnsignedByte;
} => {
  const positionData: number[] = [];
  const size = 1;
  const div = 10;
  const step = size / div;
  const half = size / 2;
  for (let i = 0; i <= div; i++) {
    const horizontal = -half + i * step;
    positionData.push(horizontal, half, 0);
    positionData.push(horizontal, -half, 0);
    const vertical = half - i * step;
    positionData.push(-half, vertical, 0);
    positionData.push(half, vertical, 0);
  }
  const position: BufferInitInfoFloat = { type: 'float', data: positionData, size: 3 };
  const colorData = [
    ...Array(60).fill(255),
    [0, 255, 0, 0, 255, 0],
    [255, 0, 0, 255, 0, 0],
    ...Array(60).fill(255),
  ].flat();
  const color: BufferInitInfoUnsignedByte = { type: 'unsigned-byte', data: colorData, size: 3 };
  return { position, color };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createGrid = (gl: WebGL2RenderingContext) => {
  const program = new Program(
    gl,
    vertexShader,
    fragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position', 'a_color'],
  );
  const data = generateGridData();
  const vao = new Vao(gl, [data.position, data.color]);
  const transform = new Transform3d();
  return { program, vao, transform };
};
