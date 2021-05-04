import { BufferInitInfoFloat, BufferInitInfoUnsignedByte } from '../lib/types';

export const grid = ((): { position: BufferInitInfoFloat; color: BufferInitInfoUnsignedByte } => {
  const positionData: number[] = [];
  const size = 1;
  const div = 10;
  const step = size / div;
  const half = size / 2;
  for (let i = 0; i <= div; i++) {
    const horizontal = -half + i * step;
    positionData.push(horizontal, 0, half);
    positionData.push(horizontal, 0, -half);
    const vertical = half - i * step;
    positionData.push(-half, 0, vertical);
    positionData.push(half, 0, vertical);
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
