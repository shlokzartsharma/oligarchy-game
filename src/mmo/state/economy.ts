import { MarketCycle, Player, Territory } from '../types';
import { getIndustryById } from '../data/industries';

// Economy engine for calculating revenue and market cycles

export const MARKET_CYCLE_DURATION = 60000; // 60 seconds in milliseconds

export const getMarketCycle = (currentTime: number, cycleStartTime: number): MarketCycle => {
  const elapsed = currentTime - cycleStartTime;
  const cycleIndex = Math.floor(elapsed / MARKET_CYCLE_DURATION) % 3;
  
  const cycles: MarketCycle[] = ['BULL', 'STABLE', 'BEAR'];
  return cycles[cycleIndex];
};

export const getMarketMultiplier = (cycle: MarketCycle): number => {
  switch (cycle) {
    case 'BULL':
      return 1.2; // +20%
    case 'STABLE':
      return 1.0; // +0%
    case 'BEAR':
      return 0.85; // -15%
    default:
      return 1.0;
  }
};

export const calculateBaseRevenue = (
  player: Player,
  territories: Territory[],
  marketCycle: MarketCycle
): number => {
  const industry = getIndustryById(player.industry);
  if (!industry) return 0;

  // Base yield from industry
  let revenue = industry.baseYield;

  // Add territory yields
  const ownedTerritories = territories.filter(t => player.territoriesOwned.includes(t.id));
  const territoryYield = ownedTerritories.reduce((sum, t) => {
    return sum + (t.baseYield * industry.territoryMultiplier);
  }, 0);

  revenue += territoryYield;

  // Apply market cycle multiplier
  const marketMultiplier = getMarketMultiplier(marketCycle);
  revenue *= marketMultiplier;

  return Math.round(revenue);
};

export const getNextCycleTime = (currentTime: number, cycleStartTime: number): number => {
  const elapsed = currentTime - cycleStartTime;
  const cyclesElapsed = Math.floor(elapsed / MARKET_CYCLE_DURATION);
  return cycleStartTime + (cyclesElapsed + 1) * MARKET_CYCLE_DURATION;
};

