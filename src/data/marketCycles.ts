import { MarketCycleData } from '../types/game';

export const getMarketCycle = (year: number, age: number): MarketCycleData => {
  // Market cycles based on age and year
  const cycleYear = age - 25; // For adults, or year for students
  
  // Recession periods
  if ((cycleYear >= 7 && cycleYear <= 9) || (cycleYear >= 32 && cycleYear <= 34)) {
    return {
      year,
      type: 'recession',
      returns: {
        stocks: { min: -25, max: -15 },
        bonds: { min: 2, max: 4 },
        realEstate: { min: -10, max: -5 },
        gold: { min: 8, max: 12 },
        crypto: { min: -70, max: -40 },
      },
    };
  }
  
  // Bull market periods
  if ((cycleYear >= 10 && cycleYear <= 12) || (cycleYear >= 35 && cycleYear <= 40)) {
    return {
      year,
      type: 'bull',
      returns: {
        stocks: { min: 8, max: 10 },
        bonds: { min: 3, max: 5 },
        realEstate: { min: 7, max: 9 },
        gold: { min: 5, max: 5 },
        crypto: { min: 50, max: 100 },
      },
    };
  }
  
  // Normal market
  return {
    year,
    type: 'normal',
    returns: {
      stocks: { min: 5, max: 7 },
      bonds: { min: 2, max: 3 },
      realEstate: { min: 3, max: 5 },
      gold: { min: 2, max: 3 },
      crypto: { min: -10, max: 30 },
    },
  };
};

export const getRandomReturn = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

