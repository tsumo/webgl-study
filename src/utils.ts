import { vec2, vec3 } from 'gl-matrix';

const { random, floor, PI, sin, cos, sqrt, atan2, acos } = Math;

export const assertUnreachable = (value: never): never => {
  console.warn(value);
  throw new Error('This should be unreachable!');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const objEntries = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
): [keyof T, T[K]][] => Object.entries(obj);

export const rand = (n = 1): number => random() * n;

export const randInt = (range: number): number => floor(random() * range);

export const randSign = (): number => (random() >= 0.5 ? 1 : -1);

export const randRange = (from: number, to: number): number => rand(to - from) + from;

export const randDeviation = (n = 1): number => rand(n * 2) - n;

const deg2radPreCalc = PI / 180;
export const deg2rad = (d: number): number => d * deg2radPreCalc;

const rad2degPreCalc = 180 / PI;
export const rad2deg = (r: number): number => r * rad2degPreCalc;

export const lerp = (start: number, end: number, t: number): number => start * (1 - t) + end * t;

export const cart2polar = (c: vec2): vec2 => [sqrt(c[0] * c[0] + c[1] * c[1]), atan2(c[1], c[0])];
export const polar2cart = (p: vec2): vec2 => [p[0] * cos(p[1]), p[0] * sin(p[1])];

export const cart2spher = (c: vec3): vec3 => {
  const rho = sqrt(c[0] * c[0] + c[1] * c[1] + c[2] * c[2]);
  return [rho, acos(c[2] / rho), atan2(c[1], c[0])];
};
export const spher2cart = (s: vec3): vec3 => [
  s[0] * sin(s[1]) * cos(s[2]),
  s[0] * sin(s[1]) * sin(s[2]),
  s[0] * cos(s[1]),
];
