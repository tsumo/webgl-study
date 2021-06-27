export type NonEmptyArray<T> = [T, ...T[]];

export type BufferInitInfoFloat = {
  type: 'float';
  data: number[];
  size: number;
};

/** Data should be in range 0-255 */
export type BufferInitInfoUnsignedByte = {
  type: 'unsigned-byte';
  data: number[];
  size: number;
};

export type BufferInitInfo = BufferInitInfoFloat | BufferInitInfoUnsignedByte;
