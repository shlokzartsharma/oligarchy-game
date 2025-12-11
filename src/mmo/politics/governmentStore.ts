// Government system: Policy, regulation, and political influence
// Government reacts to lobbying, sentiment, events, and media

export type PoliticalFaction = 
  | 'pro_business'
  | 'populist'
  | 'green'
  | 'nationalist'
  | 'centrist';

export type PolicyType = 
  | 'tax_rate'
  | 'antitrust_enforcement'
  | 'subsidy_program'
  | 'regulation'
  | 'tariff'
  | 'investigation';

export interface Policy {
  id: string;
  type: PolicyType;
  name: string;
  description: string;
  targetIndustry?: string; // If industry-specific
  effect: PolicyEffect;
  enactedAt: number;
  expiresAt?: number; // If temporary
  active: boolean;
}

export interface PolicyEffect {
  taxRateChange?: number; // Percentage point change
  antitrustLevel?: number; // 0-100, higher = more enforcement
  subsidyAmount?: number; // Per company per tick
  regulationStrictness?: number; // 0-100
  tariffRate?: number; // Percentage on imports
  blocksMergers?: boolean; // Blocks mergers above threshold
  breaksMonopolies?: boolean; // Can force divestment
}

export interface GovernmentState {
  faction: PoliticalFaction;
  regulatoryStance: 'laissez_faire' | 'moderate' | 'strict';
  taxRate: number; // Base corporate tax rate (0-50%)
  antitrustEnforcement: number; // 0-100
  activePolicies: Policy[];
  pendingBills: Policy[];
  investigations: Investigation[];
  lobbyingInfluence: Record<string, number>; // companyId -> influence (0-100)
  lastUpdate: number;
}

export interface Investigation {
  id: string;
  targetCompanyId: string;
  type: 'antitrust' | 'fraud' | 'environmental' | 'labor';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startedAt: number;
  progress: number; // 0-100
}

// Initialize government
export const createGovernmentState = (): GovernmentState => {
  return {
    faction: 'centrist',
    regulatoryStance: 'moderate',
    taxRate: 25, // 25% base
    antitrustEnforcement: 30, // Moderate
    activePolicies: [],
    pendingBills: [],
    investigations: [],
    lobbyingInfluence: {},
    lastUpdate: Date.now(),
  };
};

// Enact a policy
export const enactPolicy = (
  government: GovernmentState,
  policy: Policy
): GovernmentState => {
  return {
    ...government,
    activePolicies: [...government.activePolicies, policy],
    lastUpdate: Date.now(),
  };
};

// Repeal a policy
export const repealPolicy = (
  government: GovernmentState,
  policyId: string
): GovernmentState => {
  return {
    ...government,
    activePolicies: government.activePolicies.filter(p => p.id !== policyId),
    lastUpdate: Date.now(),
  };
};

// Update lobbying influence
export const updateLobbyingInfluence = (
  government: GovernmentState,
  companyId: string,
  change: number
): GovernmentState => {
  const current = government.lobbyingInfluence[companyId] || 0;
  const newInfluence = Math.max(0, Math.min(100, current + change));
  
  return {
    ...government,
    lobbyingInfluence: {
      ...government.lobbyingInfluence,
      [companyId]: newInfluence,
    },
    lastUpdate: Date.now(),
  };
};

// Start an investigation
export const startInvestigation = (
  government: GovernmentState,
  targetCompanyId: string,
  type: Investigation['type'],
  severity: Investigation['severity']
): GovernmentState => {
  const investigation: Investigation = {
    id: `investigation-${Date.now()}`,
    targetCompanyId,
    type,
    severity,
    startedAt: Date.now(),
    progress: 0,
  };
  
  return {
    ...government,
    investigations: [...government.investigations, investigation],
    lastUpdate: Date.now(),
  };
};

// Check if merger would be blocked
export const wouldBlockMerger = (
  government: GovernmentState,
  acquirerMarketCap: number,
  targetMarketCap: number,
  combinedMarketShare: number // Combined market share in relevant industry
): boolean => {
  // Block if:
  // 1. Antitrust enforcement is high AND combined market share > 40%
  // 2. There's an active policy blocking mergers
  // 3. Combined market cap > threshold and enforcement is active
  
  const hasBlockingPolicy = government.activePolicies.some(
    p => p.active && p.effect.blocksMergers
  );
  
  if (hasBlockingPolicy) return true;
  
  if (government.antitrustEnforcement > 50 && combinedMarketShare > 40) {
    return true;
  }
  
  const totalMarketCap = acquirerMarketCap + targetMarketCap;
  if (totalMarketCap > 500000000 && government.antitrustEnforcement > 70) {
    return true;
  }
  
  return false;
};

// Calculate effective tax rate for a company
export const getEffectiveTaxRate = (
  government: GovernmentState,
  companyLobbyingInfluence: number
): number => {
  let rate = government.taxRate;
  
  // Lobbying reduces tax (max 10% reduction)
  const lobbyingReduction = Math.min(10, companyLobbyingInfluence * 0.1);
  rate -= lobbyingReduction;
  
  // Apply policy modifiers
  government.activePolicies.forEach(policy => {
    if (policy.active && policy.effect.taxRateChange) {
      rate += policy.effect.taxRateChange;
    }
  });
  
  return Math.max(0, Math.min(50, rate));
};

