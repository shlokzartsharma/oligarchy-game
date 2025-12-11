// Asset system: The primary player action in Offworld-style economic game
// Assets are the core gameplay loop - build, upgrade, produce, profit

import { ResourceType } from './resources';

export type AssetType = 
  | 'factory'
  | 'farm'
  | 'mine'
  | 'refinery'
  | 'media_network'
  | 'data_center';

export interface Asset {
  id: string;
  type: AssetType;
  level: number; // 1-5
  buildCost: number;
  upkeepCost: number;
  productionPerTick: Record<ResourceType, number>; // Resources produced per tick
  industry: string; // Which industry this asset belongs to
  efficiencyMultiplier: number; // Modified by events (default 1.0)
  builtAt: number;
}

// Asset definitions - base stats
export const ASSET_DEFINITIONS: Record<AssetType, {
  name: string;
  baseBuildCost: number;
  baseUpkeep: number;
  baseProduction: Record<ResourceType, number>;
  industry: string;
}> = {
  factory: {
    name: 'Manufacturing Factory',
    baseBuildCost: 50000,
    baseUpkeep: 2000,
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 20,
      grain: 0,
      media_impressions: 0,
      data: 0,
      labor: -10, // Consumes
      energy: -15, // Consumes
    },
    industry: 'tech',
  },
  farm: {
    name: 'Agricultural Farm',
    baseBuildCost: 30000,
    baseUpkeep: 1500,
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 0,
      grain: 30,
      media_impressions: 0,
      data: 0,
      labor: -8,
      energy: -5,
    },
    industry: 'agriculture',
  },
  mine: {
    name: 'Mining Operation',
    baseBuildCost: 40000,
    baseUpkeep: 1800,
    baseProduction: {
      steel: 25,
      fuel: 0,
      chips: 0,
      grain: 0,
      media_impressions: 0,
      data: 0,
      labor: -12,
      energy: -10,
    },
    industry: 'energy',
  },
  refinery: {
    name: 'Fuel Refinery',
    baseBuildCost: 60000,
    baseUpkeep: 2500,
    baseProduction: {
      steel: 0,
      fuel: 30,
      chips: 0,
      grain: 0,
      media_impressions: 0,
      data: 0,
      labor: -15,
      energy: -20,
    },
    industry: 'energy',
  },
  media_network: {
    name: 'Media Network',
    baseBuildCost: 80000,
    baseUpkeep: 3000,
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 0,
      grain: 0,
      media_impressions: 100,
      data: 0,
      labor: -20,
      energy: -15,
    },
    industry: 'media',
  },
  data_center: {
    name: 'Data Center',
    baseBuildCost: 100000,
    baseUpkeep: 4000,
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 0,
      grain: 0,
      media_impressions: 0,
      data: 50,
      labor: -5,
      energy: -30,
    },
    industry: 'tech',
  },
};

// Calculate build cost for an asset type at a given level
export const getBuildCost = (assetType: AssetType, level: number = 1): number => {
  const def = ASSET_DEFINITIONS[assetType];
  // Cost scales: level 1 = base, level 2 = 1.5x, level 3 = 2.25x, etc.
  return Math.round(def.baseBuildCost * Math.pow(1.5, level - 1));
};

// Calculate upkeep for an asset at a given level
export const getUpkeepCost = (assetType: AssetType, level: number): number => {
  const def = ASSET_DEFINITIONS[assetType];
  // Upkeep scales linearly with level
  return Math.round(def.baseUpkeep * level);
};

// Calculate production for an asset at a given level with efficiency multiplier
export const getProductionPerTick = (
  assetType: AssetType,
  level: number,
  efficiencyMultiplier: number = 1.0
): Record<ResourceType, number> => {
  const def = ASSET_DEFINITIONS[assetType];
  const production: Record<ResourceType, number> = {} as any;
  
  // Production scales: level 1 = base, level 2 = 1.3x, level 3 = 1.6x, etc.
  const levelMultiplier = 1.0 + (level - 1) * 0.3;
  const totalMultiplier = levelMultiplier * efficiencyMultiplier;
  
  Object.entries(def.baseProduction).forEach(([type, amount]) => {
    production[type as ResourceType] = Math.round(amount * totalMultiplier);
  });
  
  return production;
};

// Create a new asset
export const createAsset = (
  assetType: AssetType,
  companyId: string,
  level: number = 1,
  efficiencyMultiplier: number = 1.0
): Asset => {
  const def = ASSET_DEFINITIONS[assetType];
  
  return {
    id: `asset-${companyId}-${assetType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: assetType,
    level,
    buildCost: getBuildCost(assetType, level),
    upkeepCost: getUpkeepCost(assetType, level),
    productionPerTick: getProductionPerTick(assetType, level, efficiencyMultiplier),
    industry: def.industry,
    efficiencyMultiplier,
    builtAt: Date.now(),
  };
};

// Calculate profit per tick for an asset (revenue - upkeep)
export const calculateAssetProfit = (
  asset: Asset | null | undefined,
  marketPrices: Record<ResourceType, number>
): number => {
  if (!asset) return 0;
  
  // Handle both old and new asset formats
  const production = asset.productionPerTick || (asset as any).productionRate || {};
  if (!production || typeof production !== 'object') {
    return -(asset.upkeepCost || 0);
  }
  
  let revenue = 0;
  
  try {
    Object.entries(production).forEach(([type, amount]) => {
      if (amount && typeof amount === 'number' && amount > 0) {
        const price = marketPrices[type as ResourceType] || 0;
        revenue += amount * price;
      }
    });
  } catch (e) {
    console.warn('[calculateAssetProfit] Error calculating profit:', e, asset);
    return -(asset.upkeepCost || 0);
  }
  
  return revenue - (asset.upkeepCost || 0);
};

// Get upgrade cost (cost to go from current level to next level)
export const getUpgradeCost = (asset: Asset): number => {
  const nextLevelCost = getBuildCost(asset.type, asset.level + 1);
  const currentLevelCost = getBuildCost(asset.type, asset.level);
  return nextLevelCost - currentLevelCost;
};

