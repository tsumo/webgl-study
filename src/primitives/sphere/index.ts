import { vec3 } from 'gl-matrix';
import { BufferInitInfoFloat, BufferInitInfoUnsignedByte } from '../../lib/types';
import { mapRange, spher2cart } from '../../utils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const generateSphereData = (slices: number, stacks: number) => {
  const positionData: vec3[] = [];
  const facesData: vec3[] = [];
  const colorData: vec3[] = [];

  const top = spher2cart([1, 0, 0]);
  positionData.push([top[0], top[1], top[2]]);
  colorData.push([1, 1, 1]);

  for (let stack = 1; stack < stacks - 1; stack++) {
    for (let slice = 0; slice < slices; slice++) {
      const phi = mapRange(0, stacks - 1, 0, Math.PI, stack);
      const theta = mapRange(0, slices, 0, Math.PI * 2, slice);
      const cart = spher2cart([1, phi, theta]);
      positionData.push(cart);
      const c = mapRange(0, stacks - 1, 0, 255, stack);
      colorData.push([c, c, c]);
    }
  }

  const bottom = spher2cart([1, Math.PI, 0]);
  positionData.push(bottom);
  colorData.push([255, 255, 255]);

  for (let slice = 1; slice < slices + 1; slice++) {
    facesData.push(top, positionData[slice], positionData[slice + 1]);
  }
  facesData[facesData.length - 1] = positionData[1];

  for (let stack = 0; stack < stacks - 3; stack++) {
    for (let slice = 0; slice < slices; slice++) {
      const lastSlice = slice === slices - 1;
      const tl = stack * slices + slice + 1;
      const tr = tl + 1 - (lastSlice ? slices : 0);
      const bl = tl + slices;
      const br = tr + slices;
      facesData.push(positionData[tl], positionData[bl], positionData[tr]);
      facesData.push(positionData[bl], positionData[br], positionData[tr]);
    }
  }

  for (let slice = 2; slice < slices + 2; slice++) {
    const s = positionData.length - slice;
    facesData.push(bottom, positionData[s], positionData[s - 1]);
  }
  facesData[facesData.length - 1] = positionData[positionData.length - 2];

  const position: BufferInitInfoFloat = {
    type: 'float',
    data: positionData.flat() as number[],
    size: 3,
  };
  const faces: BufferInitInfoFloat = {
    type: 'float',
    data: facesData.flat() as number[],
    size: 3,
  };
  const color: BufferInitInfoUnsignedByte = {
    type: 'unsigned-byte',
    data: colorData.flat() as number[],
    size: 3,
  };

  return { position, faces, color };
};
