import { vec3 } from 'gl-matrix';
import { BufferInitInfoFloat, BufferInitInfoUnsignedByte } from '../../lib/types';
import { times } from '../../utils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const generateCubeData = (size: vec3 = [1, 1, 1], offset: vec3 = [0, 0, 0]) => {
  const width = size[0] * 0.5;
  const depth = size[1] * 0.5;
  const height = size[2] * 0.5;
  const xn = offset[0] - width;
  const xp = offset[0] + width;
  const yn = offset[1] - depth;
  const yp = offset[1] + depth;
  const zn = offset[2] - height;
  const zp = offset[2] + height;
  const positionData: number[] = [
    // right (x positive)
    [xp, yp, zp],
    [xp, yn, zp],
    [xp, yn, zn],
    [xp, yp, zn],
    // left (x negative)
    [xn, yp, zn],
    [xn, yn, zn],
    [xn, yn, zp],
    [xn, yp, zp],
    // top (z positive)
    [xn, yp, zp],
    [xn, yn, zp],
    [xp, yn, zp],
    [xp, yp, zp],
    // bottom (z negative)
    [xp, yp, zn],
    [xp, yn, zn],
    [xn, yn, zn],
    [xn, yp, zn],
    // back (y positive)
    [xn, yp, zn],
    [xn, yp, zp],
    [xp, yp, zp],
    [xp, yp, zn],
    // front (y negative)
    [xn, yn, zp],
    [xn, yn, zn],
    [xp, yn, zn],
    [xp, yn, zp],
  ].flat();
  const colorData: number[] = positionData.map((v) => (v + 0.5) * 255);
  const uvData: number[] = [];
  times(6, () => uvData.push(0, 0, 0, 1, 1, 1, 1, 0));
  const normalData: number[] = [
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0], // right
    [-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0], // left
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], // top
    [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1], // bottom
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], // back
    [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0], // front
  ].flat();
  const index: number[] = [];
  times(6, (i) => {
    const ii = i * 4;
    index.push(ii + 3, ii + 2, ii, ii + 1, ii, ii + 2);
  });
  const position: BufferInitInfoFloat = { type: 'float', data: positionData, size: 3 };
  const color: BufferInitInfoUnsignedByte = { type: 'unsigned-byte', data: colorData, size: 3 };
  const uv: BufferInitInfoFloat = { type: 'float', data: uvData, size: 2 };
  const normal: BufferInitInfoFloat = { type: 'float', data: normalData, size: 3 };
  return { position, color, uv, normal, index };
};
