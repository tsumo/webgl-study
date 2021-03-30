export type V3 = [number, number, number];

export const v3 = {
  length: (v: V3): number => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]),

  cross: (a: V3, b: V3): V3 => {
    //prettier-ignore
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  },

  subtract: (a: V3, b: V3): V3 => {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  },

  normalize: (v: V3): V3 => {
    const length = v3.length(v);
    if (length > 0.000001) {
      return [v[0] / length, v[1] / length, v[2] / length];
    } else {
      return [0, 0, 0];
    }
  },
};
