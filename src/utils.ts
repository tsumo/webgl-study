const { random, floor } = Math;

export const rand = (n = 1): number => random() * n;

export const randInt = (range: number): number => floor(rand() * range);
