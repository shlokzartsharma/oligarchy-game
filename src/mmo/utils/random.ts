// Random utility functions
// Re-exporting from parent if exists, otherwise defining here

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const randomBool = (probability: number = 0.5): boolean => {
  return Math.random() < probability;
};
