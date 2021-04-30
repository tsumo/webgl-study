const { random, floor, PI } = Math;

export const assertUnreachable = (value: never): never => {
  console.warn(value);
  throw new Error('This should be unreachable!');
};

export const objEntries = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
): [keyof T, T[K]][] => Object.entries(obj);

export const rand = (n = 1): number => random() * n;

export const randInt = (range: number): number => floor(rand() * range);

export const randSign = (): number => (rand() >= 0.5 ? 1 : -1);

export const randRange = (from: number, to: number): number => rand(to - from) + from;

export const randDeviation = (n: number): number => rand(n * 2) - n;

const deg2radPreCalc = PI / 180;
export const deg2rad = (d: number): number => d * deg2radPreCalc;

export const lerp = (start: number, end: number, t: number): number => start * (1 - t) + end * t;
