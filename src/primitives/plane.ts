import { vec3 } from 'gl-matrix';
import { Transform3d } from '../lib/transform';
import { BufferInitInfoFloat } from '../lib/types';
import { randDeviation } from '../utils';

export const generatePlaneData = (): {
  position: BufferInitInfoFloat;
  uv: BufferInitInfoFloat;
  index: number[];
} => {
  const positionData = new Float32Array(
    [
      [-1, 1, 0],
      [-1, -1, 0],
      [1, -1, 0],
      [1, 1, 0],
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

export type MultiPlaneOptions = {
  n: number;
  translationDeviation: vec3;
  rotationInitial: vec3;
  rotationDeviation: vec3;
  scaleInitial: vec3;
  scaleDeviation: vec3;
};

export const generateMultiPlaneData = (
  options: MultiPlaneOptions,
): { position: BufferInitInfoFloat; uv: BufferInitInfoFloat; index: number[] } => {
  const {
    n,
    translationDeviation,
    rotationInitial,
    rotationDeviation,
    scaleInitial,
    scaleDeviation,
  } = options;
  const positionData: number[] = [];
  const uvData: number[] = [];
  const index: number[] = [];
  for (let i = 0; i < n; i++) {
    const translation: vec3 = [
      randDeviation(translationDeviation[0]),
      randDeviation(translationDeviation[1]),
      randDeviation(translationDeviation[2]),
    ];
    const rotation: vec3 = [
      rotationInitial[0] + randDeviation(rotationDeviation[0]),
      rotationInitial[1] + randDeviation(rotationDeviation[1]),
      rotationInitial[2] + randDeviation(rotationDeviation[2]),
    ];
    const scale: vec3 = [
      scaleInitial[0] + randDeviation(scaleDeviation[0]),
      scaleInitial[1] + randDeviation(scaleDeviation[1]),
      scaleInitial[2] + randDeviation(scaleDeviation[2]),
    ];
    const transform = new Transform3d();
    transform.translation = translation;
    transform.rotation = rotation;
    transform.scale = scale;
    transform.applyTransforms();
    const position: vec3[] = [
      [-1, 1, 0],
      [-1, -1, 0],
      [1, -1, 0],
      [1, 1, 0],
    ];
    position.forEach((pos) => {
      vec3.transformMat4(pos, pos, transform.matrix);
      positionData.push(pos[0], pos[1], pos[2]);
    });
    const p = i * 4;
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
