export type NonEmptyArray<T> = [T, ...T[]];

export type BufferInitInfoFloat = {
  type: 'float';
  data: Float32Array;
  size: number;
};

export type BufferInitInfoUnsignedByte = {
  type: 'unsigned-byte';
  data: Uint8Array;
  size: number;
  normalized: boolean;
};

export type BufferInitInfo = BufferInitInfoFloat | BufferInitInfoUnsignedByte;
