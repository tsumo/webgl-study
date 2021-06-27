import { mat4 } from 'gl-matrix';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { Transform3d } from '../../lib/transform';
import { BufferInitInfoFloat, BufferInitInfoUnsignedByte } from '../../lib/types';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

const generateAxesData = (): {
  position: BufferInitInfoFloat;
  color: BufferInitInfoUnsignedByte;
} => {
  const positionData = [
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1],
  ].flat();
  const position: BufferInitInfoFloat = { type: 'float', data: positionData, size: 3 };
  const colorData = [
    [255, 0, 0, 255, 0, 0],
    [0, 255, 0, 0, 255, 0],
    [0, 0, 255, 0, 0, 255],
  ].flat();
  const color: BufferInitInfoUnsignedByte = {
    type: 'unsigned-byte',
    data: colorData,
    size: 3,
  };
  return { position, color };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createAxes = (gl: WebGL2RenderingContext) => {
  const program = new Program(
    gl,
    vertexShader,
    fragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position', 'a_color'],
  );
  const data = generateAxesData();
  const vao = new Vao(gl, [data.position, data.color]);
  const transform = new Transform3d();
  return { program, vao, transform };
};
