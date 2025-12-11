// Company structure with equity, portfolios, and non-terminal buyouts
// This replaces the simple Player/AICompany distinction with a unified Company model

export interface Company {
  id: string;
  name: string;
  industry: string;
  ceoId: string; // 'player' or AI ID
  isPlayer: boolean;
  
  // Equity structure
  totalShares: number;
  freeFloat: number; // Shares available for trading
  sharePrice: number;
  marketCap: number; // sharePrice * totalShares
  
  // Ownership tracking (who owns how many shares)
  shareholders: Record<string, number>; // shareholderId -> shares owned
  
  // Financials
  cash: number;
  debt: number;
  interestRate: number; // Annual interest rate on debt (e.g., 0.12 = 12%)
  revenueRate: number;
  
  // Assets & inventory
  assets: string[]; // Asset IDs
  resources: Record<string, number>; // Resource inventory
  goods: Record<string, number>; // Goods inventory
  
  // Production
  productionCapacity: number; // Total production per tick
  productionQueue: ProductionOrder[];
  
  // Influence & reputation
  reputation: number; // 0-100
  brandReputation?: number; // Alias for reputation
  lobbyingPower: number;
  mediaInfluence: number;
  power?: number; // Computed power score
  seasonScore?: number; // Score for current season
  
  // Departments (optional, for UI)
  departments?: Record<string, number>;
  
  // Territories
  territoriesOwned: string[];
  
  // Alliances
  allianceId?: string;
  
  // Additional optional properties
  scandals?: string[];
  capital?: number; // Alias for cash (for backward compatibility)
  rawResources?: Record<string, number>; // Alias for resources
  
  // Status
  isSubsidiary: boolean; // If acquired by another company
  parentCompanyId?: string; // If acquired
  isFounderEmeritus: boolean; // If former player company was acquired
  
  // Meta
  foundedAt: number;
  lastUpdate: number;
}

export interface ProductionOrder {
  id: string;
  resourceType: string;
  amount: number;
  targetGood?: string; // If converting resource to good
  startedAt: number;
  duration: number; // milliseconds
}

// Create a new company
export const createCompany = (
  id: string,
  name: string,
  industry: string,
  ceoId: string,
  isPlayer: boolean,
  startingCash: number = 100000
): Company => {
  const totalShares = 1000000; // 1M shares standard
  const initialSharePrice = startingCash / totalShares; // $0.10 per share initially
  
  return {
    id,
    name,
    industry,
    ceoId,
    isPlayer,
    totalShares,
    freeFloat: totalShares * 0.3, // 30% float initially
    sharePrice: initialSharePrice,
    marketCap: initialSharePrice * totalShares,
    shareholders: {
      [ceoId]: totalShares * 0.7, // CEO owns 70% initially
    },
    cash: startingCash,
    debt: 0,
    interestRate: 0.12, // 12% annual, ~0.033% per tick
    revenueRate: 0,
    assets: [],
    resources: {},
    goods: {},
    productionCapacity: 0,
    productionQueue: [],
    reputation: 50,
    lobbyingPower: 10,
    mediaInfluence: 0,
    territoriesOwned: [],
    isSubsidiary: false,
    isFounderEmeritus: false,
    foundedAt: Date.now(),
    lastUpdate: Date.now(),
  };
};

// Update share price based on company performance
export const updateSharePrice = (
  company: Company,
  factors: {
    revenueChange?: number;
    eventImpact?: number; // -1 to 1, negative = bad news
    sentimentImpact?: number; // -1 to 1
    marketTrend?: number; // -1 to 1
  }
): Company => {
  let priceMultiplier = 1.0;
  
  // Revenue impact (10% revenue change = 5% price change)
  if (factors.revenueChange) {
    priceMultiplier *= (1 + factors.revenueChange * 0.5);
  }
  
  // Event impact (major events move prices significantly)
  if (factors.eventImpact) {
    priceMultiplier *= (1 + factors.eventImpact * 0.2);
  }
  
  // Sentiment impact (public sentiment affects retail trading)
  if (factors.sentimentImpact) {
    priceMultiplier *= (1 + factors.sentimentImpact * 0.1);
  }
  
  // Market trend (overall market direction)
  if (factors.marketTrend) {
    priceMultiplier *= (1 + factors.marketTrend * 0.05);
  }
  
  // Add some volatility (random walk)
  const volatility = 0.02; // 2% random movement
  priceMultiplier *= (1 + (Math.random() - 0.5) * volatility);
  
  // Clamp price changes (max 50% up or down per update)
  priceMultiplier = Math.max(0.5, Math.min(1.5, priceMultiplier));
  
  const newPrice = company.sharePrice * priceMultiplier;
  const newMarketCap = newPrice * company.totalShares;
  
  return {
    ...company,
    sharePrice: newPrice,
    marketCap: newMarketCap,
    lastUpdate: Date.now(),
  };
};

// Buy shares in a company
export const buyShares = (
  company: Company,
  buyerId: string,
  shares: number,
  pricePerShare?: number
): { company: Company; cost: number; success: boolean } => {
  const purchasePrice = pricePerShare || company.sharePrice;
  const totalCost = shares * purchasePrice;
  
  // Check if enough shares available
  if (shares > company.freeFloat) {
    return { company, cost: 0, success: false };
  }
  
  // Update ownership
  const newShareholders = { ...company.shareholders };
  newShareholders[buyerId] = (newShareholders[buyerId] || 0) + shares;
  
  // Reduce free float
  const newFreeFloat = company.freeFloat - shares;
  
  return {
    company: {
      ...company,
      shareholders: newShareholders,
      freeFloat: newFreeFloat,
      lastUpdate: Date.now(),
    },
    cost: totalCost,
    success: true,
  };
};

// Get ownership percentage
export const getOwnershipPercentage = (company: Company, shareholderId: string): number => {
  const sharesOwned = company.shareholders[shareholderId] || 0;
  return (sharesOwned / company.totalShares) * 100;
};

// Check if buyout threshold reached (>50% ownership)
export const isBuyoutThreshold = (company: Company, shareholderId: string): boolean => {
  return getOwnershipPercentage(company, shareholderId) > 50;
};

// Execute buyout/acquisition
export const executeBuyout = (
  targetCompany: Company,
  acquirerId: string,
  _acquirerName: string
): {
  targetCompany: Company;
  payout: number;
  founderState: 'founder_emeritus' | 'new_company';
} => {
  // Calculate payout (premium over market cap)
  const premium = 1.3; // 30% premium
  const payout = targetCompany.marketCap * premium;
  
  // Mark as subsidiary
  const acquiredCompany: Company = {
    ...targetCompany,
    isSubsidiary: true,
    parentCompanyId: acquirerId,
    ceoId: acquirerId, // New CEO
    lastUpdate: Date.now(),
  };
  
  // If it was a player company, mark founder as emeritus
  const founderState = targetCompany.isPlayer ? 'founder_emeritus' : 'new_company';
  
  return {
    targetCompany: acquiredCompany,
    payout,
    founderState,
  };
};

// Calculate portfolio value for a company
export const calculatePortfolioValue = (company: Company, assetValues: Record<string, number>): number => {
  let value = company.cash;
  
  // Add asset values
  company.assets.forEach(assetId => {
    value += assetValues[assetId] || 0;
  });
  
  // Add resource values (at market prices)
  // This would need market prices passed in
  
  // Add goods values
  // This would need market prices passed in
  
  // Subtract debt
  value -= company.debt;
  
  return value;
};

