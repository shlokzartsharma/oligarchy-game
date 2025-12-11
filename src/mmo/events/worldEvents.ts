// World events: crises, shocks, scandals that affect the game
// Events apply modifiers for 30-90 seconds

import { ResourceType } from '../economy/resources';

export type EventType = 
  | 'supply_chain_collapse'
  | 'patent_lawsuit'
  | 'raw_material_shortage'
  | 'interest_rate_hike'
  | 'pr_scandal'
  | 'ceo_resignation'
  | 'natural_disaster'
  | 'black_swan'
  | 'market_crash'
  | 'regulatory_change'
  | 'labor_strike'
  | 'cyber_attack';

export interface WorldEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  duration: number; // milliseconds
  startedAt: number;
  expiresAt: number;
  modifiers: EventModifiers;
  affectedResource?: ResourceType;
  affectedTerritory?: string;
}

export interface EventModifiers {
  // Market effects
  inflationRate?: number; // Percentage change
  marketVolatility?: number; // 0-1 multiplier
  
  // Production effects
  productionMultiplier?: number; // 0.5 = 50% production
  maintenanceCostMultiplier?: number; // 1.5 = 150% costs
  
  // Resource effects
  resourceShortage?: ResourceType; // Which resource is affected
  resourcePriceMultiplier?: number; // Price change for affected resource
  
  // Company effects
  brandReputationChange?: number; // -10 to +10
  legalShieldReduction?: number; // 0-1, reduces legal protection
  logisticsEfficiencyReduction?: number; // 0-1, reduces logistics
  
  // Global effects
  globalRevenueMultiplier?: number; // Affects all revenue
  sabotageCooldownReduction?: number; // Reduces cooldown times
}

// Event definitions
export const EVENT_DEFINITIONS: Record<EventType, {
  title: string;
  description: string;
  baseDuration: number; // milliseconds
  severity: WorldEvent['severity'];
  getModifiers: (severity: WorldEvent['severity']) => EventModifiers;
}> = {
  supply_chain_collapse: {
    title: 'Supply Chain Collapse',
    description: 'Critical supply chain disruptions affect global logistics',
    baseDuration: 60000, // 60 seconds
    severity: 'high',
    getModifiers: (severity) => ({
      logisticsEfficiencyReduction: severity === 'critical' ? 0.5 : severity === 'high' ? 0.3 : 0.2,
      maintenanceCostMultiplier: severity === 'critical' ? 1.5 : severity === 'high' ? 1.3 : 1.2,
      globalRevenueMultiplier: severity === 'critical' ? 0.7 : severity === 'high' ? 0.85 : 0.9,
    }),
  },
  patent_lawsuit: {
    title: 'Patent Infringement Lawsuit',
    description: 'Major patent dispute threatens industry innovation',
    baseDuration: 90000, // 90 seconds
    severity: 'medium',
    getModifiers: (severity) => ({
      legalShieldReduction: severity === 'high' ? 0.4 : severity === 'medium' ? 0.3 : 0.2,
      brandReputationChange: severity === 'high' ? -5 : severity === 'medium' ? -3 : -2,
    }),
  },
  raw_material_shortage: {
    title: 'Raw Material Shortage',
    description: 'Critical raw materials become scarce',
    baseDuration: 45000, // 45 seconds
    severity: 'medium',
    getModifiers: (severity) => ({
      resourcePriceMultiplier: severity === 'high' ? 2.0 : severity === 'medium' ? 1.5 : 1.3,
      productionMultiplier: severity === 'high' ? 0.6 : severity === 'medium' ? 0.75 : 0.85,
    }),
  },
  interest_rate_hike: {
    title: 'Interest Rate Hike',
    description: 'Central banks raise interest rates, increasing borrowing costs',
    baseDuration: 120000, // 120 seconds
    severity: 'medium',
    getModifiers: (severity) => ({
      maintenanceCostMultiplier: severity === 'high' ? 1.4 : severity === 'medium' ? 1.2 : 1.1,
      globalRevenueMultiplier: severity === 'high' ? 0.9 : severity === 'medium' ? 0.95 : 0.98,
    }),
  },
  pr_scandal: {
    title: 'PR Scandal',
    description: 'Corporate scandal damages public trust',
    baseDuration: 75000, // 75 seconds
    severity: 'medium',
    getModifiers: (severity) => ({
      brandReputationChange: severity === 'critical' ? -10 : severity === 'high' ? -7 : severity === 'medium' ? -5 : -3,
      globalRevenueMultiplier: severity === 'critical' ? 0.8 : severity === 'high' ? 0.9 : 0.95,
    }),
  },
  ceo_resignation: {
    title: 'CEO Resignation',
    description: 'Leadership crisis shakes investor confidence',
    baseDuration: 60000,
    severity: 'low',
    getModifiers: (severity) => ({
      brandReputationChange: severity === 'high' ? -5 : severity === 'medium' ? -3 : -2,
      globalRevenueMultiplier: severity === 'high' ? 0.9 : 0.95,
    }),
  },
  natural_disaster: {
    title: 'Natural Disaster',
    description: 'Natural disaster disrupts operations in affected regions',
    baseDuration: 90000,
    severity: 'high',
    getModifiers: (severity) => ({
      productionMultiplier: severity === 'critical' ? 0.4 : severity === 'high' ? 0.6 : 0.75,
      maintenanceCostMultiplier: severity === 'critical' ? 2.0 : severity === 'high' ? 1.5 : 1.2,
    }),
  },
  black_swan: {
    title: 'Black Swan Event',
    description: 'Unpredictable system-wide volatility',
    baseDuration: 60000,
    severity: 'critical',
    getModifiers: (_severity) => ({
      marketVolatility: 0.8,
      globalRevenueMultiplier: 0.7,
      productionMultiplier: 0.8,
      maintenanceCostMultiplier: 1.3,
      brandReputationChange: -3,
    }),
  },
  market_crash: {
    title: 'Market Crash',
    description: 'Sudden market downturn affects all industries',
    baseDuration: 120000,
    severity: 'high',
    getModifiers: (severity) => ({
      globalRevenueMultiplier: severity === 'critical' ? 0.6 : severity === 'high' ? 0.75 : 0.85,
      marketVolatility: 0.6,
    }),
  },
  regulatory_change: {
    title: 'Regulatory Change',
    description: 'New regulations impact industry operations',
    baseDuration: 150000,
    severity: 'medium',
    getModifiers: (severity) => ({
      maintenanceCostMultiplier: severity === 'high' ? 1.3 : severity === 'medium' ? 1.2 : 1.1,
      legalShieldReduction: severity === 'high' ? 0.3 : 0.2,
    }),
  },
  labor_strike: {
    title: 'Labor Strike',
    description: 'Workforce strikes disrupt production',
    baseDuration: 60000,
    severity: 'medium',
    getModifiers: (severity) => ({
      productionMultiplier: severity === 'high' ? 0.5 : severity === 'medium' ? 0.7 : 0.85,
    }),
  },
  cyber_attack: {
    title: 'Cyber Attack',
    description: 'Cybersecurity breach affects operations',
    baseDuration: 45000,
    severity: 'high',
    getModifiers: (severity) => ({
      productionMultiplier: severity === 'critical' ? 0.3 : severity === 'high' ? 0.6 : 0.8,
      brandReputationChange: severity === 'critical' ? -8 : severity === 'high' ? -5 : -3,
    }),
  },
};

// Create a world event
export const createWorldEvent = (
  type: EventType,
  severity: WorldEvent['severity'] = 'medium',
  affectedResource?: ResourceType,
  affectedTerritory?: string
): WorldEvent => {
  const def = EVENT_DEFINITIONS[type];
  const now = Date.now();
  const duration = def.baseDuration * (severity === 'critical' ? 1.5 : severity === 'high' ? 1.2 : 1.0);

  return {
    id: `event-${type}-${now}`,
    type,
    title: def.title,
    description: def.description,
    severity,
    duration,
    startedAt: now,
    expiresAt: now + duration,
    modifiers: def.getModifiers(severity),
    affectedResource,
    affectedTerritory,
  };
};

// Check if event is active
export const isEventActive = (event: WorldEvent): boolean => {
  return Date.now() < event.expiresAt;
};

// Get active events
export const getActiveEvents = (events: WorldEvent[]): WorldEvent[] => {
  return events.filter(isEventActive);
};

// Combine event modifiers
export const combineEventModifiers = (events: WorldEvent[]): EventModifiers => {
  const active = getActiveEvents(events);
  const combined: EventModifiers = {};

  active.forEach(event => {
    Object.entries(event.modifiers).forEach(([key, value]) => {
      const modifierKey = key as keyof EventModifiers;
      if (typeof value === 'number') {
        if (modifierKey.includes('Multiplier') || modifierKey.includes('Rate')) {
          (combined as any)[modifierKey] = ((combined[modifierKey] as number) || 1) * (1 + value);
        } else if (modifierKey.includes('Change') || modifierKey.includes('Reduction')) {
          (combined as any)[modifierKey] = ((combined[modifierKey] as number) || 0) + value;
        } else {
          (combined as any)[modifierKey] = value;
        }
      } else {
        (combined as any)[modifierKey] = value;
      }
    });
  });

  return combined;
};

