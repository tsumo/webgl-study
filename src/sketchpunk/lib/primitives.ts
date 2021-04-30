import { BufferInitInfoFloat, BufferInitInfoUnsignedByte } from './types';

const f2d = ((): BufferInitInfoFloat => {
  const width = 0.1;
  const height = 0.15;
  const thickness = 0.03;
  const x = 0;
  const y = 0;
  const data = new Float32Array(
    [
      // left column
      [x, y],
      [x + thickness, y],
      [x, y + height],
      [x, y + height],
      [x + thickness, y],
      [x + thickness, y + height],
      // top rung
      [x + thickness, y],
      [x + width, y],
      [x + thickness, y + thickness],
      [x + thickness, y + thickness],
      [x + width, y],
      [x + width, y + thickness],
      // middle rung
      [x + thickness, y + thickness * 2],
      [x + (width * 2) / 3, y + thickness * 2],
      [x + thickness, y + thickness * 3],
      [x + thickness, y + thickness * 3],
      [x + (width * 2) / 3, y + thickness * 2],
      [x + (width * 2) / 3, y + thickness * 3],
    ]
      .map(([x, y]) => [x, -y])
      .flat(),
  );
  return { type: 'float', data, size: 2 };
})();

const f3d = ((): { position: BufferInitInfoFloat; color: BufferInitInfoUnsignedByte } => {
  const positionData = new Float32Array(
    [
      // left column front
      [0, 0, 0, 0, 150, 0, 30, 0, 0],
      [0, 150, 0, 30, 150, 0, 30, 0, 0],
      // top rung front
      [30, 0, 0, 30, 30, 0, 100, 0, 0],
      [30, 30, 0, 100, 30, 0, 100, 0, 0],
      // middle rung front
      [30, 60, 0, 30, 90, 0, 67, 60, 0],
      [30, 90, 0, 67, 90, 0, 67, 60, 0],
      // left column back
      [0, 0, 30, 30, 0, 30, 0, 150, 30],
      [0, 150, 30, 30, 0, 30, 30, 150, 30],
      // top rung back
      [30, 0, 30, 100, 0, 30, 30, 30, 30],
      [30, 30, 30, 100, 0, 30, 100, 30, 30],
      // middle rung back
      [30, 60, 30, 67, 60, 30, 30, 90, 30],
      [30, 90, 30, 67, 60, 30, 67, 90, 30],
      // top
      [0, 0, 0, 100, 0, 0, 100, 0, 30],
      [0, 0, 0, 100, 0, 30, 0, 0, 30],
      // top rung right
      [100, 0, 0, 100, 30, 0, 100, 30, 30],
      [100, 0, 0, 100, 30, 30, 100, 0, 30],
      // under top rung
      [30, 30, 0, 30, 30, 30, 100, 30, 30],
      [30, 30, 0, 100, 30, 30, 100, 30, 0],
      // between top rung and middle
      [30, 30, 0, 30, 60, 30, 30, 30, 30],
      [30, 30, 0, 30, 60, 0, 30, 60, 30],
      // top of middle rung
      [30, 60, 0, 67, 60, 30, 30, 60, 30],
      [30, 60, 0, 67, 60, 0, 67, 60, 30],
      // right of middle rung
      [67, 60, 0, 67, 90, 30, 67, 60, 30],
      [67, 60, 0, 67, 90, 0, 67, 90, 30],
      // bottom of middle rung.
      [30, 90, 0, 30, 90, 30, 67, 90, 30],
      [30, 90, 0, 67, 90, 30, 67, 90, 0],
      // right of bottom
      [30, 90, 0, 30, 150, 30, 30, 90, 30],
      [30, 90, 0, 30, 150, 0, 30, 150, 30],
      // bottom
      [0, 150, 0, 0, 150, 30, 30, 150, 30],
      [0, 150, 0, 30, 150, 30, 30, 150, 0],
      // left side
      [0, 0, 0, 0, 0, 30, 0, 150, 30],
      [0, 0, 0, 0, 150, 30, 0, 150, 0],
    ].flat(),
  );
  const position: BufferInitInfoFloat = { type: 'float', data: positionData, size: 3 };
  const colorData = new Uint8Array(
    [
      // left column front
      [200, 70, 120, 200, 70, 120, 200, 70, 120],
      [200, 70, 120, 200, 70, 120, 200, 70, 120],
      // top rung front
      [200, 70, 120, 200, 70, 120, 200, 70, 120],
      [200, 70, 120, 200, 70, 120, 200, 70, 120],
      // middle rung front
      [200, 70, 120, 200, 70, 120, 200, 70, 120],
      [200, 70, 120, 200, 70, 120, 200, 70, 120],
      // left column back
      [80, 70, 200, 80, 70, 200, 80, 70, 200],
      [80, 70, 200, 80, 70, 200, 80, 70, 200],
      // top rung back
      [80, 70, 200, 80, 70, 200, 80, 70, 200],
      [80, 70, 200, 80, 70, 200, 80, 70, 200],
      // middle rung back
      [80, 70, 200, 80, 70, 200, 80, 70, 200],
      [80, 70, 200, 80, 70, 200, 80, 70, 200],
      // top
      [70, 200, 210, 70, 200, 210, 70, 200, 210],
      [70, 200, 210, 70, 200, 210, 70, 200, 210],
      // top rung right
      [200, 200, 70, 200, 200, 70, 200, 200, 70],
      [200, 200, 70, 200, 200, 70, 200, 200, 70],
      // under top rung
      [210, 100, 70, 210, 100, 70, 210, 100, 70],
      [210, 100, 70, 210, 100, 70, 210, 100, 70],
      // between top rung and middle
      [210, 160, 70, 210, 160, 70, 210, 160, 70],
      [210, 160, 70, 210, 160, 70, 210, 160, 70],
      // top of middle rung
      [70, 180, 210, 70, 180, 210, 70, 180, 210],
      [70, 180, 210, 70, 180, 210, 70, 180, 210],
      // right of middle rung
      [100, 70, 210, 100, 70, 210, 100, 70, 210],
      [100, 70, 210, 100, 70, 210, 100, 70, 210],
      // bottom of middle rung.
      [76, 210, 100, 76, 210, 100, 76, 210, 100],
      [76, 210, 100, 76, 210, 100, 76, 210, 100],
      // right of bottom
      [140, 210, 80, 140, 210, 80, 140, 210, 80],
      [140, 210, 80, 140, 210, 80, 140, 210, 80],
      // bottom
      [90, 130, 110, 90, 130, 110, 90, 130, 110],
      [90, 130, 110, 90, 130, 110, 90, 130, 110],
      // left side
      [160, 160, 220, 160, 160, 220, 160, 160, 220],
      [160, 160, 220, 160, 160, 220, 160, 160, 220],
    ].flat(),
  );
  const color: BufferInitInfoUnsignedByte = {
    type: 'unsigned-byte',
    data: colorData,
    size: 3,
    normalized: true,
  };
  return { position, color };
})();

const grid = ((): { position: BufferInitInfoFloat; color: BufferInitInfoUnsignedByte } => {
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
  const position: BufferInitInfoFloat = {
    type: 'float',
    data: new Float32Array(positionData),
    size: 3,
  };
  const colorData = new Uint8Array(
    [
      ...Array(60).fill(255),
      [255, 0, 0, 255, 0, 0],
      [0, 255, 0, 0, 255, 0],
      ...Array(60).fill(255),
    ].flat(),
  );
  const color: BufferInitInfoUnsignedByte = {
    type: 'unsigned-byte',
    data: colorData,
    size: 3,
    normalized: true,
  };
  return { position, color };
})();

export const primitives = { f2d, f3d, grid };
