// Department system: Legal, PR, R&D, HR, Logistics, Finance
// Each department provides bonuses and unlocks capabilities

export type DepartmentType = 
  | 'legal'
  | 'pr'
  | 'rnd'
  | 'logistics'
  | 'finance';

export interface Department {
  type: DepartmentType;
  name: string;
  description: string;
  level: number; // 1-10
  costPerLevel: number; // Cost to upgrade to next level
  maxLevel: number;
  bonuses: {
    [level: number]: DepartmentBonus;
  };
}

export interface DepartmentBonus {
  description: string;
  effects: {
    legalShieldLevel?: number; // Reduces lawsuit losses
    brandReputationBonus?: number; // Increases brand
    productionMultiplier?: number; // Boosts production
    logisticsEfficiency?: number; // Improves supply flow
    interestRateReduction?: number; // Reduces borrowing costs
    unlock?: string; // Unlocks new capability
  };
}

// Department definitions
export const DEPARTMENT_DEFINITIONS: Record<DepartmentType, {
  name: string;
  description: string;
  baseCost: number;
  getBonus: (level: number) => DepartmentBonus;
}> = {
  legal: {
    name: 'Legal Department',
    description: 'Protects against lawsuits and regulatory actions',
    baseCost: 25000,
    getBonus: (level) => ({
      description: `Level ${level}: Legal protection and reduced lawsuit costs`,
      effects: {
        legalShieldLevel: level * 0.1, // 10% per level
      },
    }),
  },
  pr: {
    name: 'Public Relations',
    description: 'Manages brand reputation and crisis response',
    baseCost: 20000,
    getBonus: (level) => ({
      description: `Level ${level}: Brand reputation and scandal mitigation`,
      effects: {
        brandReputationBonus: level * 2, // +2 per level
      },
    }),
  },
  rnd: {
    name: 'Research & Development',
    description: 'Boosts production and unlocks innovations',
    baseCost: 30000,
    getBonus: (level) => ({
      description: `Level ${level}: Production efficiency and innovation`,
      effects: {
        productionMultiplier: level * 0.05, // 5% per level
      },
    }),
  },
  logistics: {
    name: 'Logistics',
    description: 'Improves supply chain efficiency',
    baseCost: 22000,
    getBonus: (level) => ({
      description: `Level ${level}: Supply chain optimization`,
      effects: {
        logisticsEfficiency: level * 0.08, // 8% per level
      },
    }),
  },
  finance: {
    name: 'Finance',
    description: 'Optimizes capital and reduces costs',
    baseCost: 18000,
    getBonus: (level) => ({
      description: `Level ${level}: Financial optimization`,
      effects: {
        interestRateReduction: level * 0.03, // 3% per level
      },
    }),
  },
};

// Get department cost for next level
export const getDepartmentUpgradeCost = (type: DepartmentType, currentLevel: number): number => {
  const def = DEPARTMENT_DEFINITIONS[type];
  return def.baseCost * (currentLevel + 1); // Cost increases with level
};

// Get all department bonuses
export const getDepartmentBonuses = (departments: Record<DepartmentType, number>) => {
  const bonuses: {
    legalShieldLevel: number;
    brandReputationBonus: number;
    productionMultiplier: number;
    logisticsEfficiency: number;
    interestRateReduction: number;
  } = {
    legalShieldLevel: 0,
    brandReputationBonus: 0,
    productionMultiplier: 0,
    logisticsEfficiency: 0,
    interestRateReduction: 0,
  };

  Object.entries(departments).forEach(([type, level]) => {
    const deptType = type as DepartmentType;
    const bonus = DEPARTMENT_DEFINITIONS[deptType].getBonus(level);
    
    if (bonus.effects.legalShieldLevel) {
      bonuses.legalShieldLevel += bonus.effects.legalShieldLevel;
    }
    if (bonus.effects.brandReputationBonus) {
      bonuses.brandReputationBonus += bonus.effects.brandReputationBonus;
    }
    if (bonus.effects.productionMultiplier) {
      bonuses.productionMultiplier += bonus.effects.productionMultiplier;
    }
    if (bonus.effects.logisticsEfficiency) {
      bonuses.logisticsEfficiency += bonus.effects.logisticsEfficiency;
    }
    if (bonus.effects.interestRateReduction) {
      bonuses.interestRateReduction += bonus.effects.interestRateReduction;
    }
  });

  return bonuses;
};

