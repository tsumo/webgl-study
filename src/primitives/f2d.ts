import { BufferInitInfoFloat } from '../lib/types';

export const f2d = ((): BufferInitInfoFloat => {
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
