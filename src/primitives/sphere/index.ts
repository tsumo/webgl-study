import { vec3 } from 'gl-matrix';
import { BufferInitInfoFloat } from '../../lib/types';
import { mapRange, spher2cart } from '../../utils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const generateSphereData = (slices: number, stacks: number) => {
  const top: vec3 = [0, 0, 1];
  const bottom: vec3 = [0, 0, -1];
  const vertexStacks: vec3[][] = [];
  for (let stack = 1; stack < stacks - 1; stack++) {
    const vertexStack: vec3[] = [];
    for (let slice = 0; slice < slices; slice++) {
      const phi = mapRange(0, stacks - 1, 0, Math.PI, stack);
      const theta = mapRange(0, slices, 0, Math.PI * 2, slice);
      const cart = spher2cart([1, phi, theta]);
      vertexStack.push(cart);
    }
    vertexStacks.push(vertexStack);
  }
  const positionData: number[] = [];
  // top cap
  for (let slice = 0; slice < slices; slice++) {
    const v1 = vertexStacks[0][slice];
    const v2 = vertexStacks[0][(slice + 1) % slices];
    positionData.push(...top, v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
  }
  // sides
  for (let i = 0; i < vertexStacks.length - 1; i++) {
    for (let slice = 0; slice < slices; slice++) {
      const tl = vertexStacks[i][slice];
      const tr = vertexStacks[i][(slice + 1) % slices];
      const bl = vertexStacks[i + 1][slice];
      const br = vertexStacks[i + 1][(slice + 1) % slices];
      positionData.push(tl[0], tl[1], tl[2], bl[0], bl[1], bl[2], tr[0], tr[1], tr[2]);
      positionData.push(bl[0], bl[1], bl[2], br[0], br[1], br[2], tr[0], tr[1], tr[2]);
    }
  }
  // bottom cap
  for (let slice = 0; slice < slices; slice++) {
    const v1 = vertexStacks[stacks - 3][slice];
    const v2 = vertexStacks[stacks - 3][(slice + 1) % slices];
    positionData.push(...bottom, v2[0], v2[1], v2[2], v1[0], v1[1], v1[2]);
  }
  const position: BufferInitInfoFloat = { type: 'float', data: positionData, size: 3 };
  return { position };
};
