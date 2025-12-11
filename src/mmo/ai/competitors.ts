// AI competitor personalities and definitions
// Each AI has a unique personality that affects their behavior

export type AIPersonality = 
  | 'visionary'
  | 'baron'
  | 'shark'
  | 'politico'
  | 'ghost'
  | 'opportunist';

export interface AIPersonalityProfile {
  id: AIPersonality;
  name: string;
  description: string;
  traits: {
    aggression: number; // 0-1, likelihood to attack/sabotage
    expansionRate: number; // 0-1, how fast they expand
    riskTolerance: number; // 0-1, willingness to take risks
    marketManipulation: number; // 0-1, tendency to manipulate markets
    allianceTendency: number; // 0-1, likelihood to form alliances
    resourceFocus: string[]; // Preferred resource types
  };
}

export const AI_PERSONALITIES: Record<AIPersonality, AIPersonalityProfile> = {
  visionary: {
    id: 'visionary',
    name: 'The Visionary',
    description: 'Invests heavily, expands fast, high risk tolerance',
    traits: {
      aggression: 0.3,
      expansionRate: 0.9,
      riskTolerance: 0.8,
      marketManipulation: 0.4,
      allianceTendency: 0.5,
      resourceFocus: ['data', 'chips'],
    },
  },
  baron: {
    id: 'baron',
    name: 'The Baron',
    description: 'Controls raw materials, hoards resources',
    traits: {
      aggression: 0.5,
      expansionRate: 0.6,
      riskTolerance: 0.4,
      marketManipulation: 0.7,
      allianceTendency: 0.3,
      resourceFocus: ['steel', 'fuel', 'grain'],
    },
  },
  shark: {
    id: 'shark',
    name: 'The Shark',
    description: 'Hostile takeovers, aggressive pricing, sabotage',
    traits: {
      aggression: 0.9,
      expansionRate: 0.7,
      riskTolerance: 0.6,
      marketManipulation: 0.5,
      allianceTendency: 0.2,
      resourceFocus: [],
    },
  },
  politico: {
    id: 'politico',
    name: 'The Politico',
    description: 'Max lobbying, political influence',
    traits: {
      aggression: 0.4,
      expansionRate: 0.5,
      riskTolerance: 0.5,
      marketManipulation: 0.3,
      allianceTendency: 0.8,
      resourceFocus: ['media_impressions'],
    },
  },
  ghost: {
    id: 'ghost',
    name: 'The Ghost',
    description: 'Hoards assets quietly, low profile',
    traits: {
      aggression: 0.2,
      expansionRate: 0.4,
      riskTolerance: 0.3,
      marketManipulation: 0.2,
      allianceTendency: 0.1,
      resourceFocus: [],
    },
  },
  opportunist: {
    id: 'opportunist',
    name: 'The Opportunist',
    description: 'Adapts strategy based on market conditions',
    traits: {
      aggression: 0.6,
      expansionRate: 0.6,
      riskTolerance: 0.7,
      marketManipulation: 0.6,
      allianceTendency: 0.6,
      resourceFocus: [],
    },
  },
};

// Extended AI Company interface (extends base AICompany)
export interface EnhancedAICompany {
  id: string;
  name: string;
  industry: string;
  capital: number;
  revenueRate: number;
  territoriesOwned: string[];
  power: number;
  personality: AIPersonality;
  assets: string[]; // Asset IDs
  resources: Record<string, number>; // Resource inventory
  departments: {
    legal: number;
    pr: number;
    rnd: number;
    logistics: number;
    finance: number;
  };
  brandReputation: number;
  lobbyingPower: number;
  lastActionTime: number;
  targetPlayerId?: string; // If targeting player
}

// Create enhanced AI company
export const createEnhancedAICompany = (
  id: string,
  name: string,
  industry: string,
  personality: AIPersonality,
  baseCapital: number = 50000
): EnhancedAICompany => {
  // const personalityProfile = AI_PERSONALITIES[personality]; // Unused
  
  return {
    id,
    name,
    industry,
    capital: baseCapital,
    revenueRate: 3000,
    territoriesOwned: [],
    power: baseCapital / 1000,
    personality,
    assets: [],
    resources: {},
    departments: {
      legal: 1,
      pr: 1,
      rnd: 1,
      logistics: 1,
      finance: 1,
    },
    brandReputation: 50,
    lobbyingPower: 10,
    lastActionTime: Date.now(),
  };
};

