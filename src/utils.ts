const { random, floor } = Math;

export const rand = (n = 1): number => random() * n;

export const randInt = (range: number): number => floor(rand() * range);

export const randSign = (): number => (rand() >= 0.5 ? 1 : -1);

export const randRange = (from: number, to: number): number => rand(to - from) + from;

export const randDeviate = (n: number): number => rand(n * 2) - n;
