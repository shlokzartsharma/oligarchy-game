// Dynamic market pricing engine
// Prices fluctuate based on supply, demand, events, and manipulations

import { ResourceType, RESOURCES } from './resources';
import { randomFloat } from '../utils/random';

export interface MarketPrice {
  resourceType: ResourceType;
  currentPrice: number;
  basePrice: number;
  supply: number; // Total supply in market
  demand: number; // Total demand in market
  volatility: number; // Price volatility (0-1)
  lastUpdate: number;
}

export interface MarketState {
  prices: Record<ResourceType, MarketPrice>;
  globalInflation: number; // Multiplier for all prices
  marketManipulations: Record<string, {
    resourceType: ResourceType;
    direction: 'up' | 'down';
    strength: number; // 0-1
    expiresAt: number;
  }>;
}

// Initialize market state
export const createInitialMarketState = (): MarketState => {
  const prices: Record<ResourceType, MarketPrice> = {} as any;
  
  getAllResourceTypes().forEach(type => {
    const resource = RESOURCES[type];
    prices[type] = {
      resourceType: type,
      currentPrice: resource.basePrice,
      basePrice: resource.basePrice,
      supply: 1000, // Initial supply
      demand: 1000, // Initial demand
      volatility: 0.1,
      lastUpdate: Date.now(),
    };
  });

  return {
    prices,
    globalInflation: 1.0,
    marketManipulations: {},
  };
};

// Get all resource types
const getAllResourceTypes = (): ResourceType[] => {
  return Object.keys(RESOURCES) as ResourceType[];
};

// Update market prices based on supply/demand
export const updateMarketPrices = (market: MarketState): MarketState => {
  const now = Date.now();
  const updatedPrices = { ...market.prices };

  getAllResourceTypes().forEach(type => {
    const price = updatedPrices[type];
    const supplyDemandRatio = price.demand / (price.supply + 1); // +1 to avoid division by zero
    
    // Base price adjustment from supply/demand
    let newPrice = price.basePrice * supplyDemandRatio;
    
    // Apply volatility (random fluctuations)
    const volatilityFactor = 1 + (randomFloat(-price.volatility, price.volatility));
    newPrice *= volatilityFactor;
    
    // Apply global inflation
    newPrice *= market.globalInflation;
    
    // Apply active manipulations
    Object.values(market.marketManipulations).forEach(manip => {
      if (manip.resourceType === type && manip.expiresAt > now) {
        const direction = manip.direction === 'up' ? 1 : -1;
        newPrice *= (1 + (direction * manip.strength * 0.2)); // Max 20% manipulation
      }
    });
    
    // Clamp price to reasonable bounds (10% - 500% of base)
    newPrice = Math.max(price.basePrice * 0.1, Math.min(price.basePrice * 5, newPrice));
    
    updatedPrices[type] = {
      ...price,
      currentPrice: Math.round(newPrice),
      lastUpdate: now,
    };
  });

  return {
    ...market,
    prices: updatedPrices,
  };
};

// Get current price for a resource
export const getPrice = (market: MarketState, resourceType: ResourceType): number => {
  return market.prices[resourceType]?.currentPrice || RESOURCES[resourceType].basePrice;
};

// Update supply/demand for a resource
export const updateSupplyDemand = (
  market: MarketState,
  resourceType: ResourceType,
  supplyDelta: number,
  demandDelta: number
): MarketState => {
  const price = market.prices[resourceType];
  if (!price) return market;

  const updatedPrices = {
    ...market.prices,
    [resourceType]: {
      ...price,
      supply: Math.max(0, price.supply + supplyDelta),
      demand: Math.max(0, price.demand + demandDelta),
    },
  };

  return {
    ...market,
    prices: updatedPrices,
  };
};

// Manipulate market price (player/AI action)
export const manipulateMarket = (
  market: MarketState,
  resourceType: ResourceType,
  direction: 'up' | 'down',
  strength: number,
  duration: number // milliseconds
): MarketState => {
  const manipulationId = `${resourceType}-${Date.now()}`;
  
  return {
    ...market,
    marketManipulations: {
      ...market.marketManipulations,
      [manipulationId]: {
        resourceType,
        direction,
        strength: Math.min(1, Math.max(0, strength)),
        expiresAt: Date.now() + duration,
      },
    },
  };
};

// Clean expired manipulations
export const cleanExpiredManipulations = (market: MarketState): MarketState => {
  const now = Date.now();
  const activeManipulations: MarketState['marketManipulations'] = {};
  
  Object.entries(market.marketManipulations).forEach(([id, manip]) => {
    if (manip.expiresAt > now) {
      activeManipulations[id] = manip;
    }
  });

  return {
    ...market,
    marketManipulations: activeManipulations,
  };
};

// Apply global inflation (from world events)
export const applyInflation = (market: MarketState, inflationRate: number): MarketState => {
  return {
    ...market,
    globalInflation: market.globalInflation * (1 + inflationRate),
  };
};

