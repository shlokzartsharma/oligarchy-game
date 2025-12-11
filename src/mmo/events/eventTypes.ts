// Big, cross-industry event types that reshape the world
// Events have cascading effects across multiple systems

export type EventCategory = 
  | 'macro'
  | 'sectoral'
  | 'political'
  | 'corporate'
  | 'environmental'
  | 'tech';

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface BigEvent {
  id: string;
  category: EventCategory;
  type: string;
  title: string;
  description: string;
  severity: EventSeverity;
  duration: number; // milliseconds
  startedAt: number;
  expiresAt: number;
  
  // Cross-system effects
  effects: EventEffects;
  
  // Visual/narrative
  headline: string;
  subheadline: string;
  icon?: string;
  
  // Decisions for players
  decisions?: EventDecision[];
}

export interface EventEffects {
  // Asset efficiency changes (PRIMARY EFFECT)
  assetEfficiencyChanges?: Record<string, number>; // assetType -> efficiency multiplier (e.g., 2.0 = 200%, 0.6 = 60%)
  
  // Asset upkeep changes
  assetUpkeepChanges?: Record<string, number>; // assetType -> upkeep multiplier
  
  // Market effects
  resourcePriceChanges?: Record<string, number>; // resource -> percentage change
  marketVolatility?: number; // 0-1 multiplier
  
  // Debt interest changes
  interestRateChange?: number; // Multiplier for all debt interest rates (e.g., 2.0 = double interest)
  
  // Industry effects (simplified)
  industryImpacts?: Record<string, IndustryImpact>; // industry -> impact
  
  // Government effects
  governmentReaction?: {
    policyChanges?: string[]; // Policy IDs to enact
    investigationTargets?: string[]; // Company IDs
    factionShift?: 'pro_business' | 'populist' | 'green' | 'nationalist';
  };
  
  // Sentiment effects
  sentimentChanges?: {
    trustInCorporations?: number;
    angerAtMonopolies?: number;
    environmentalConcern?: number;
    economicOptimism?: number;
  };
  
  // Media effects
  mediaNarratives?: Array<{
    frame: 'pro_business' | 'anti_corporate' | 'crisis' | 'opportunity';
    outlets: string[]; // Outlet IDs that will push this
  }>;
  
  // Retail investor effects
  retailInvestorReaction?: {
    riskAppetiteChange?: number;
    memeStockManiaChange?: number;
    industryHype?: Record<string, number>; // industry -> enthusiasm change
  };
}

export interface IndustryImpact {
  revenueMultiplier: number; // 0.5 = 50% revenue
  costMultiplier: number; // 1.5 = 150% costs
  reputationChange: number; // -10 to +10
  marketShareShift: number; // -20 to +20 percentage points
}

export interface EventDecision {
  id: string;
  text: string;
  cost?: number;
  effect: () => void; // Action to take
  consequences: {
    reputationChange?: number;
    cashChange?: number;
    marketCapChange?: number;
    unlocks?: string[];
  };
}

// Major event definitions
export const MAJOR_EVENT_TEMPLATES: Record<string, {
  category: EventCategory;
  title: string;
  description: string;
  severity: EventSeverity;
  baseDuration: number;
  getEffects: (severity: EventSeverity) => EventEffects;
}> = {
  global_oil_shock: {
    category: 'sectoral',
    title: 'Global Oil Supply Shock',
    description: 'Major geopolitical crisis disrupts global oil supply chains',
    severity: 'high',
    baseDuration: 120000, // 2 minutes
    getEffects: (severity) => ({
      // DIRECT ASSET EFFECTS
      assetEfficiencyChanges: {
        refinery: severity === 'critical' ? 3.0 : severity === 'high' ? 2.0 : 1.5, // Refineries boom
        factory: severity === 'critical' ? 0.6 : severity === 'high' ? 0.7 : 0.8, // Factories suffer (energy costs)
        farm: severity === 'critical' ? 0.7 : severity === 'high' ? 0.8 : 0.9, // Farms hurt by logistics
      },
      assetUpkeepChanges: {
        factory: 1.4, // Higher energy costs
        farm: 1.3, // Higher transport costs
      },
      resourcePriceChanges: {
        fuel: severity === 'critical' ? 300 : severity === 'high' ? 200 : 150,
        energy: severity === 'critical' ? 250 : severity === 'high' ? 180 : 120,
      },
      sentimentChanges: {
        trustInCorporations: -10,
        angerAtMonopolies: +15,
        economicOptimism: -20,
      },
      governmentReaction: {
        policyChanges: ['price_cap_oil'],
        factionShift: 'populist',
      },
    }),
  },
  
  tech_antitrust_crackdown: {
    category: 'political',
    title: 'Major Tech Antitrust Investigation',
    description: 'Government launches sweeping antitrust investigation into tech sector',
    severity: 'high',
    baseDuration: 180000, // 3 minutes
    getEffects: (_severity) => ({
      industryImpacts: {
        tech: {
          revenueMultiplier: 0.9,
          costMultiplier: 1.2, // Legal costs
          reputationChange: -10,
          marketShareShift: -15,
        },
      },
      governmentReaction: {
        investigationTargets: [], // Will be populated with large tech companies
        policyChanges: ['antitrust_tech'],
      },
      sentimentChanges: {
        trustInCorporations: -5,
        angerAtMonopolies: +10,
      },
    }),
  },
  
  climate_disaster: {
    category: 'environmental',
    title: 'Major Climate Disaster',
    description: 'Catastrophic weather event disrupts global supply chains',
    severity: 'critical',
    baseDuration: 150000,
    getEffects: (_severity) => ({
      resourcePriceChanges: {
        grain: 150,
        steel: 80,
      },
      industryImpacts: {
        agriculture: {
          revenueMultiplier: 0.6,
          costMultiplier: 1.5,
          reputationChange: -5,
          marketShareShift: -10,
        },
        energy: {
          revenueMultiplier: 1.0,
          costMultiplier: 1.0,
          reputationChange: -15, // Blamed for climate change
          marketShareShift: -5,
        },
        retail: {
          revenueMultiplier: 0.85,
          costMultiplier: 1.3,
          reputationChange: 0,
          marketShareShift: 0,
        },
      },
      sentimentChanges: {
        environmentalConcern: +30,
        trustInCorporations: -10,
        angerAtMonopolies: +5,
      },
      governmentReaction: {
        policyChanges: ['green_regulations'],
        factionShift: 'green',
      },
    }),
  },
  
  market_crash: {
    category: 'macro',
    title: 'Global Market Crash',
    description: 'Panic selling triggers massive market correction',
    severity: 'critical',
    baseDuration: 90000,
    getEffects: (_severity) => ({
      marketVolatility: 0.8,
      industryImpacts: {
        finance: {
          revenueMultiplier: 0.7,
          costMultiplier: 1.0,
          reputationChange: -20,
          marketShareShift: -20,
        },
        tech: {
          revenueMultiplier: 0.8,
          costMultiplier: 1.0,
          reputationChange: -10,
          marketShareShift: -15,
        },
      },
      sentimentChanges: {
        economicOptimism: -40,
        trustInCorporations: -15,
      },
      retailInvestorReaction: {
        riskAppetiteChange: -30,
        memeStockManiaChange: -20,
      },
    }),
  },
  
  data_breach_mega: {
    category: 'corporate',
    title: 'Mega Data Breach Exposed',
    description: 'Massive data breach affects millions, reveals corporate negligence',
    severity: 'high',
    baseDuration: 120000,
    getEffects: (_severity) => ({
      industryImpacts: {
        tech: {
          revenueMultiplier: 0.95,
          costMultiplier: 1.3, // Fines and remediation
          reputationChange: -15,
          marketShareShift: -10,
        },
        finance: {
          revenueMultiplier: 0.9,
          costMultiplier: 1.2,
          reputationChange: -10,
          marketShareShift: -5,
        },
      },
      sentimentChanges: {
        trustInCorporations: -20,
        angerAtMonopolies: +10,
      },
      governmentReaction: {
        policyChanges: ['data_privacy_regulation'],
        investigationTargets: [], // Will be populated
      },
    }),
  },
  
  chip_shortage: {
    category: 'sectoral',
    title: 'Global Semiconductor Shortage',
    description: 'Critical chip shortage disrupts tech and automotive industries',
    severity: 'high',
    baseDuration: 180000,
    getEffects: (severity) => ({
      // DIRECT ASSET EFFECTS
      assetEfficiencyChanges: {
        factory: severity === 'critical' ? 0.5 : severity === 'high' ? 0.6 : 0.7, // Factories can't produce
        data_center: severity === 'critical' ? 0.8 : severity === 'high' ? 0.9 : 0.95, // Data centers less affected
      },
      assetUpkeepChanges: {
        factory: 1.5, // Higher costs to source chips
      },
      resourcePriceChanges: {
        chips: 250,
      },
      sentimentChanges: {
        economicOptimism: -10,
      },
    }),
  },
  
  rate_hike: {
    category: 'macro',
    title: 'Central Bank Rate Hike',
    description: 'Interest rates double across the board',
    severity: 'high',
    baseDuration: 180000,
    getEffects: (_severity) => ({
      interestRateChange: 2.0, // Double all debt interest
      assetEfficiencyChanges: {
        // No direct asset changes, but debt becomes expensive
      },
      sentimentChanges: {
        economicOptimism: -15,
      },
    }),
  },
};

// Create a big event from template
export const createBigEvent = (
  eventType: string,
  severity: EventSeverity = 'high'
): BigEvent | null => {
  const template = MAJOR_EVENT_TEMPLATES[eventType];
  if (!template) return null;
  
  const now = Date.now();
  const duration = template.baseDuration * (severity === 'critical' ? 1.5 : severity === 'high' ? 1.2 : 1.0);
  
  return {
    id: `event-${eventType}-${now}`,
    category: template.category,
    type: eventType,
    title: template.title,
    description: template.description,
    severity,
    duration,
    startedAt: now,
    expiresAt: now + duration,
    effects: template.getEffects(severity),
    headline: template.title,
    subheadline: template.description,
  };
};

