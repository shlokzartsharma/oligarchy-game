// MMO Game Types
export type MarketCycle = 'BULL' | 'STABLE' | 'BEAR';

export interface Player {
  id: string;
  name: string;
  industry: string;
  capital: number;
  revenueRate: number;
  territoriesOwned: string[];
  power: number;
  seasonScore: number;
  // New fields
  assets: string[]; // Asset IDs
  rawResources: Record<string, number>; // Resource inventory
  goods: Record<string, number>; // Finished products
  departments: {
    legal: number;
    pr: number;
    rnd: number;
    logistics: number;
    finance: number;
  };
  lobbyingPower: number;
  brandReputation: number;
  scandals: string[]; // Scandal IDs
  insuranceContracts: string[]; // Insurance contract IDs
  rndLevel: number; // R&D Level (renamed from R&DLevel for valid JS)
  legalShieldLevel: number;
  logisticsEfficiency: number;
  allianceId?: string; // Current alliance ID
  legacyPoints: number;
  activeLegacyPerks: string[]; // Legacy perk IDs
}

export interface Territory {
  id: string;
  name: string;
  baseYield: number;
  owner: string | null; // null = neutral, player id = owned
  resistanceScore: number;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  baseYield: number;
  territoryMultiplier: number;
  riskLevel: 'low' | 'medium' | 'high';
  specialBonus?: string;
}

export interface WorldState {
  seasonEndTimestamp: number;
  territories: Territory[];
  globalMarketModifier: MarketCycle;
  marketCycleStartTime: number;
  // New fields
  marketPrices: Record<string, number>; // Resource prices
  newsEvents: any[]; // News items
  activeEvents: any[]; // World events
  alliances: any[]; // Alliance list
  sabotageCooldowns: Record<string, number>; // Cooldown timestamps
}

export interface ActionCardData {
  id: string;
  title: string;
  description: string;
  choiceA: {
    text: string;
    effect: () => void;
  };
  choiceB: {
    text: string;
    effect: () => void;
  };
}

export interface AICompany {
  id: string;
  name: string;
  industry: string;
  capital: number;
  revenueRate: number;
  territoriesOwned: string[];
  power: number;
  // Extended fields (optional for backward compatibility)
  personality?: string;
  assets?: string[];
  resources?: Record<string, number>;
  departments?: {
    legal: number;
    pr: number;
    rnd: number;
    logistics: number;
    finance: number;
  };
  brandReputation?: number;
  lobbyingPower?: number;
}

