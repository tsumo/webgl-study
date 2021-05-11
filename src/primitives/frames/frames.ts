import { mat4 } from 'gl-matrix';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { BufferInitInfoFloat } from '../../lib/types';
import { Transform3d } from '../../lib/transform';
import { rand, randDeviation } from '../../utils';
import vertexShader from './vertex.glsl';
import quadFragmentShader from './quad-fragment.glsl';
import ringFragmentShader from './ring-fragment.glsl';

const generateFrameData = (): {
  position: BufferInitInfoFloat;
  uv: BufferInitInfoFloat;
  index: number[];
} => {
  const positionData = new Float32Array(
    [
      [-1, 1, 0],
      [1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0],
    ].flat(),
  );
  const position: BufferInitInfoFloat = { type: 'float', data: positionData, size: 3 };
  const uvData = new Float32Array(
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ].flat(),
  );
  const uv: BufferInitInfoFloat = { type: 'float', data: uvData, size: 2 };
  const index = [0, 1, 2, 2, 3, 0];
  return { position, uv, index };
};

export const createQuadFrame = (gl: WebGL2RenderingContext) => {
  const program = new Program(
    gl,
    vertexShader,
    quadFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() }, width: { type: 'f', value: 0.1 } },
    ['a_position', 'a_uv'],
  );
  const data = generateFrameData();
  const vao = new Vao(gl, [data.position, data.uv], data.index);
  const transform = new Transform3d();
  return { program, vao, transform };
};

export const createRingFrame = (gl: WebGL2RenderingContext) => {
  const program = new Program(
    gl,
    vertexShader,
    ringFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() }, width: { type: 'f', value: 0.1 } },
    ['a_position', 'a_uv'],
  );
  const data = generateFrameData();
  const vao = new Vao(gl, [data.position, data.uv], data.index);
  const transform = new Transform3d();
  return { program, vao, transform };
};

const generateMultiFrameData = (
  n: number,
  posDeviation: number,
  sizeDeviation: number,
): {
  position: BufferInitInfoFloat;
  uv: BufferInitInfoFloat;
  index: number[];
} => {
  const positionData: number[] = [];
  const uvData: number[] = [];
  const index: number[] = [];
  for (let i = 0; i < n; i++) {
    const size = 1 + randDeviation(sizeDeviation);
    const half = size * 0.5;
    const angle = rand(Math.PI * 2);
    const dx = half * Math.cos(angle);
    const dy = half * Math.sin(angle);
    const x = randDeviation(posDeviation);
    const y = randDeviation(posDeviation);
    const z = randDeviation(posDeviation);
    const p = i * 4;
    positionData.push(x - dx, y + half, z - dy);
    positionData.push(x - dx, y - half, z - dy);
    positionData.push(x + dx, y - half, z + dy);
    positionData.push(x + dx, y + half, z + dy);
    uvData.push(0, 0, 0, 1, 1, 1, 1, 0);
    index.push(p, p + 1, p + 2, p + 2, p + 3, p);
  }
  const position: BufferInitInfoFloat = {
    type: 'float',
    data: new Float32Array(positionData),
    size: 3,
  };
  const uv: BufferInitInfoFloat = {
    type: 'float',
    data: new Float32Array(uvData),
    size: 2,
  };
  return { position, uv, index };
};

export const createMultiRingFrame = (
  gl: WebGL2RenderingContext,
  n: number,
  posDeviation: number,
  sizeDeviation: number,
) => {
  const program = new Program(
    gl,
    vertexShader,
    ringFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() }, width: { type: 'f', value: 0.1 } },
    ['a_position', 'a_uv'],
  );
  const data = generateMultiFrameData(n, posDeviation, sizeDeviation);
  const vao = new Vao(gl, [data.position, data.uv], data.index);
  const transform = new Transform3d();
  return { program, vao, transform };
};
