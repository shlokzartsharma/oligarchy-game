// Production engine: Assets generate resources, departments improve efficiency
// This system handles the conversion of assets into raw resources and goods

import { ResourceType, ResourceInventory } from './resources';
import { MarketState, getPrice } from './markets';

export type AssetType = 
  | 'factory'
  | 'mine'
  | 'farm'
  | 'refinery'
  | 'data_center'
  | 'media_network'
  | 'patent'
  | 'logistics_hub'
  | 'research_lab';

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  level: number; // 1-10, affects production rate
  location?: string; // Territory ID
  productionRate: Record<ResourceType, number>; // Resources produced per tick
  maintenanceCost: number; // Cost per tick
  builtAt: number; // Timestamp
}

export interface ProductionModifiers {
  rndLevel: number; // 0-10, increases yield
  logisticsEfficiency: number; // 0-1, reduces loss
  departmentBonuses: {
    legal: number; // Reduces legal costs
    pr: number; // Increases brand value
    rnd: number; // Production multiplier
    logistics: number; // Efficiency multiplier
    finance: number; // Reduces interest costs
  };
}

// Asset definitions
export const ASSET_DEFINITIONS: Record<AssetType, {
  name: string;
  baseProduction: Record<ResourceType, number>;
  baseMaintenance: number;
  baseCost: number;
}> = {
  factory: {
    name: 'Manufacturing Factory',
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 10,
      grain: 0,
      media_impressions: 0,
      data: 0,
      labor: -50, // Consumes labor
      energy: -20,
    },
    baseMaintenance: 5000,
    baseCost: 50000,
  },
  mine: {
    name: 'Mining Operation',
    baseProduction: {
      steel: 20,
      fuel: 0,
      chips: 0,
      grain: 0,
      media_impressions: 0,
      data: 0,
      labor: -30,
      energy: -15,
    },
    baseMaintenance: 4000,
    baseCost: 40000,
  },
  farm: {
    name: 'Agricultural Farm',
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 0,
      grain: 30,
      media_impressions: 0,
      data: 0,
      labor: -20,
      energy: -10,
    },
    baseMaintenance: 3000,
    baseCost: 30000,
  },
  refinery: {
    name: 'Fuel Refinery',
    baseProduction: {
      steel: 0,
      fuel: 25,
      chips: 0,
      grain: 0,
      media_impressions: 0,
      data: 0,
      labor: -25,
      energy: -30,
    },
    baseMaintenance: 4500,
    baseCost: 45000,
  },
  data_center: {
    name: 'Data Center',
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 0,
      grain: 0,
      media_impressions: 0,
      data: 50,
      labor: -10,
      energy: -50,
    },
    baseMaintenance: 6000,
    baseCost: 80000,
  },
  media_network: {
    name: 'Media Network',
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 0,
      grain: 0,
      media_impressions: 100,
      data: 0,
      labor: -40,
      energy: -25,
    },
    baseMaintenance: 5500,
    baseCost: 70000,
  },
  patent: {
    name: 'Patent Portfolio',
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 0,
      grain: 0,
      media_impressions: 0,
      data: 0,
      labor: 0,
      energy: 0,
    },
    baseMaintenance: 1000,
    baseCost: 100000,
  },
  logistics_hub: {
    name: 'Logistics Hub',
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 0,
      grain: 0,
      media_impressions: 0,
      data: 0,
      labor: 0,
      energy: 0,
    },
    baseMaintenance: 3500,
    baseCost: 35000,
  },
  research_lab: {
    name: 'Research Laboratory',
    baseProduction: {
      steel: 0,
      fuel: 0,
      chips: 0,
      grain: 0,
      media_impressions: 0,
      data: 20,
      labor: -20,
      energy: -30,
    },
    baseMaintenance: 7000,
    baseCost: 90000,
  },
};

// Calculate production from assets
export const calculateProduction = (
  assets: Asset[],
  modifiers: ProductionModifiers
): ResourceInventory => {
  const production: ResourceInventory = {};
  
  // Initialize all resources to 0
  Object.keys(ASSET_DEFINITIONS.factory.baseProduction).forEach(type => {
    production[type] = 0;
  });

  assets.forEach(asset => {
    const def = ASSET_DEFINITIONS[asset.type];
    if (!def) return;

    // Calculate level multiplier (1.0 + 0.1 per level)
    const levelMultiplier = 1.0 + (asset.level - 1) * 0.1;
    
    // Apply R&D bonus
    const rndMultiplier = 1.0 + (modifiers.rndLevel * 0.05);
    
    // Apply logistics efficiency (reduces loss)
    const logisticsMultiplier = 1.0 + (modifiers.logisticsEfficiency * 0.2);
    
    // Apply department bonuses
    const deptMultiplier = 1.0 + (modifiers.departmentBonuses.rnd * 0.1);

    const totalMultiplier = levelMultiplier * rndMultiplier * logisticsMultiplier * deptMultiplier;

    Object.entries(def.baseProduction).forEach(([type, amount]) => {
      const resourceType = type as ResourceType;
      const adjustedAmount = Math.round(amount * totalMultiplier);
      production[resourceType] = (production[resourceType] || 0) + adjustedAmount;
    });
  });

  return production;
};

// Calculate maintenance costs
export const calculateMaintenanceCosts = (assets: Asset[]): number => {
  return assets.reduce((total, asset) => {
    const def = ASSET_DEFINITIONS[asset.type];
    if (!def) return total;
    // Maintenance scales with level
    const levelMultiplier = 1.0 + (asset.level - 1) * 0.15;
    return total + (def.baseMaintenance * levelMultiplier);
  }, 0);
};

// Calculate net profit from production
export const calculateProductionProfit = (
  production: ResourceInventory,
  market: MarketState,
  maintenanceCost: number
): number => {
  let revenue = 0;
  
  Object.entries(production).forEach(([type, amount]) => {
    if (amount > 0) {
      const price = getPrice(market, type as ResourceType);
      revenue += amount * price;
    }
  });

  return revenue - maintenanceCost;
};

// Get asset cost
export const getAssetCost = (assetType: AssetType, level: number = 1): number => {
  const def = ASSET_DEFINITIONS[assetType];
  if (!def) return 0;
  // Cost scales with level
  return Math.round(def.baseCost * (1 + (level - 1) * 0.5));
};

