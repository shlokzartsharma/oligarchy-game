// Legacy system: Dynasty perks after seasons
// Players accumulate legacy points that unlock permanent bonuses

export type LegacyPerkType = 
  | 'starting_capital_bonus'
  | 'revenue_multiplier'
  | 'territory_discount'
  | 'department_unlock'
  | 'asset_discount'
  | 'market_insight'
  | 'alliance_bonus'
  | 'sabotage_resistance';

export interface LegacyPerk {
  id: LegacyPerkType;
  name: string;
  description: string;
  cost: number; // Legacy points required
  effect: LegacyPerkEffect;
}

export interface LegacyPerkEffect {
  startingCapitalBonus?: number; // Percentage
  revenueMultiplier?: number; // Multiplier (e.g., 1.1 = 10% bonus)
  territoryDiscount?: number; // Percentage discount
  departmentUnlock?: string; // Department type unlocked at start
  assetDiscount?: number; // Percentage discount on assets
  marketInsight?: boolean; // See market trends early
  allianceBonus?: number; // Bonus to alliance loyalty
  sabotageResistance?: number; // Reduces sabotage effectiveness
}

// Legacy perk definitions
export const LEGACY_PERKS: Record<LegacyPerkType, LegacyPerk> = {
  starting_capital_bonus: {
    id: 'starting_capital_bonus',
    name: 'Wealthy Dynasty',
    description: 'Start each season with 20% more capital',
    cost: 100,
    effect: {
      startingCapitalBonus: 20,
    },
  },
  revenue_multiplier: {
    id: 'revenue_multiplier',
    name: 'Business Acumen',
    description: 'Permanent 10% revenue multiplier',
    cost: 150,
    effect: {
      revenueMultiplier: 1.1,
    },
  },
  territory_discount: {
    id: 'territory_discount',
    name: 'Expansion Expertise',
    description: '15% discount on territory expansion',
    cost: 120,
    effect: {
      territoryDiscount: 15,
    },
  },
  department_unlock: {
    id: 'department_unlock',
    name: 'Corporate Infrastructure',
    description: 'Start with one department at level 2',
    cost: 200,
    effect: {
      departmentUnlock: 'rnd', // Example
    },
  },
  asset_discount: {
    id: 'asset_discount',
    name: 'Construction Connections',
    description: '10% discount on all asset construction',
    cost: 130,
    effect: {
      assetDiscount: 10,
    },
  },
  market_insight: {
    id: 'market_insight',
    name: 'Market Savvy',
    description: 'See market trends 30 seconds early',
    cost: 180,
    effect: {
      marketInsight: true,
    },
  },
  alliance_bonus: {
    id: 'alliance_bonus',
    name: 'Diplomatic Legacy',
    description: '+20 starting loyalty in alliances',
    cost: 140,
    effect: {
      allianceBonus: 20,
    },
  },
  sabotage_resistance: {
    id: 'sabotage_resistance',
    name: 'Fortified Operations',
    description: '30% reduction in sabotage effectiveness',
    cost: 160,
    effect: {
      sabotageResistance: 30,
    },
  },
};

// Calculate legacy points from season score
export const calculateLegacyPoints = (seasonScore: number): number => {
  // 1 point per 1000 score, with diminishing returns
  return Math.floor(seasonScore / 1000);
};

// Apply legacy perks to player
export const applyLegacyPerks = (
  baseStats: {
    startingCapital: number;
    revenueRate: number;
    departments: Record<string, number>;
  },
  activePerks: LegacyPerkType[]
): {
  startingCapital: number;
  revenueRate: number;
  departments: Record<string, number>;
  otherBonuses: Omit<LegacyPerkEffect, 'startingCapitalBonus' | 'revenueMultiplier' | 'departmentUnlock'>;
} => {
  let startingCapital = baseStats.startingCapital;
  let revenueRate = baseStats.revenueRate;
  const departments = { ...baseStats.departments };
  const otherBonuses: any = {};

  activePerks.forEach(perkId => {
    const perk = LEGACY_PERKS[perkId];
    if (!perk) return;

    if (perk.effect.startingCapitalBonus) {
      startingCapital *= (1 + perk.effect.startingCapitalBonus / 100);
    }

    if (perk.effect.revenueMultiplier) {
      revenueRate *= perk.effect.revenueMultiplier;
    }

    if (perk.effect.departmentUnlock) {
      departments[perk.effect.departmentUnlock] = Math.max(
        departments[perk.effect.departmentUnlock] || 0,
        2
      );
    }

    if (perk.effect.territoryDiscount) {
      otherBonuses.territoryDiscount = perk.effect.territoryDiscount;
    }

    if (perk.effect.assetDiscount) {
      otherBonuses.assetDiscount = perk.effect.assetDiscount;
    }

    if (perk.effect.marketInsight) {
      otherBonuses.marketInsight = true;
    }

    if (perk.effect.allianceBonus) {
      otherBonuses.allianceBonus = perk.effect.allianceBonus;
    }

    if (perk.effect.sabotageResistance) {
      otherBonuses.sabotageResistance = perk.effect.sabotageResistance;
    }
  });

  return {
    startingCapital: Math.round(startingCapital),
    revenueRate: Math.round(revenueRate),
    departments,
    otherBonuses,
  };
};

// Check if player can afford perk
export const canAffordPerk = (legacyPoints: number, perkId: LegacyPerkType): boolean => {
  const perk = LEGACY_PERKS[perkId];
  return legacyPoints >= perk.cost;
};

