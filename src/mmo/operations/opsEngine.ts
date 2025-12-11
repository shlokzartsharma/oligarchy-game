// Operations engine: Applies department effects to game systems
// This coordinates how departments affect production, legal, PR, etc.

import { getDepartmentBonuses } from './departments';
import { ProductionModifiers } from '../economy/production';
import { DepartmentType } from './departments';

export interface DepartmentState {
  legal: number;
  pr: number;
  rnd: number;
  logistics: number;
  finance: number;
}

// Convert department state to production modifiers
export const getProductionModifiers = (departments: DepartmentState): ProductionModifiers => {
  const bonuses = getDepartmentBonuses(departments);
  
  return {
    rndLevel: departments.rnd,
    logisticsEfficiency: bonuses.logisticsEfficiency,
    departmentBonuses: {
      legal: bonuses.legalShieldLevel,
      pr: bonuses.brandReputationBonus,
      rnd: bonuses.productionMultiplier,
      logistics: bonuses.logisticsEfficiency,
      finance: bonuses.interestRateReduction,
    },
  };
};

// Calculate effective legal shield
export const getLegalShield = (departments: DepartmentState): number => {
  const bonuses = getDepartmentBonuses(departments);
  return Math.min(1.0, bonuses.legalShieldLevel); // Cap at 100%
};

// Calculate effective brand reputation
export const getBrandReputation = (
  baseReputation: number,
  departments: DepartmentState
): number => {
  const bonuses = getDepartmentBonuses(departments);
  return baseReputation + bonuses.brandReputationBonus;
};

// Calculate effective interest rate
export const getEffectiveInterestRate = (
  baseRate: number,
  departments: DepartmentState
): number => {
  const bonuses = getDepartmentBonuses(departments);
  return Math.max(0, baseRate * (1 - bonuses.interestRateReduction));
};

// Check if department upgrade is affordable
export const canAffordDepartmentUpgrade = (
  type: DepartmentType,
  currentLevel: number,
  capital: number
): boolean => {
  const { getDepartmentUpgradeCost } = require('./departments');
  const cost = getDepartmentUpgradeCost(type, currentLevel);
  return capital >= cost;
};

