// Net Corporate Power (NCP) calculation
// This is the primary scoring metric for determining Oligarch status

import { Company } from './companies';
import { Asset } from './assets';

export interface NCPBreakdown {
  cash: number;
  assetValue: number;
  marketCap: number;
  productionCapacity: number;
  marketShare: number;
  lobbyingPower: number;
  mediaInfluence: number;
  allianceStrength: number;
  total: number;
}

// Calculate Net Corporate Power for a company
export const calculateNCP = (
  company: Company,
  _assets: Asset[], // Unused but kept for API compatibility
  assetValues: Record<string, number>,
  marketShare: Record<string, number>, // industry -> market share %
  allianceStrength: number = 0
): NCPBreakdown => {
  // Cash component (1:1, but capped at 10M for scoring)
  const cashComponent = Math.min(company.cash, 10000000) * 0.1;
  
  // Asset value component
  const assetValue = company.assets.reduce((sum, assetId) => {
    return sum + (assetValues[assetId] || 0);
  }, 0);
  const assetComponent = assetValue * 0.15;
  
  // Market cap component (normalized)
  const marketCapComponent = (company.marketCap / 1000000) * 50; // $1M market cap = 50 NCP
  
  // Production capacity component
  const productionComponent = company.productionCapacity * 2;
  
  // Market share component (weighted by industry importance)
  const marketShareComponent = Object.values(marketShare).reduce((sum, share) => sum + share, 0) * 10;
  
  // Lobbying power component
  const lobbyingComponent = company.lobbyingPower * 5;
  
  // Media influence component
  const mediaComponent = company.mediaInfluence * 3;
  
  // Alliance strength component
  const allianceComponent = allianceStrength * 2;
  
  const total = 
    cashComponent +
    assetComponent +
    marketCapComponent +
    productionComponent +
    marketShareComponent +
    lobbyingComponent +
    mediaComponent +
    allianceComponent;
  
  return {
    cash: cashComponent,
    assetValue: assetComponent,
    marketCap: marketCapComponent,
    productionCapacity: productionComponent,
    marketShare: marketShareComponent,
    lobbyingPower: lobbyingComponent,
    mediaInfluence: mediaComponent,
    allianceStrength: allianceComponent,
    total: Math.round(total),
  };
};

// Rank companies by NCP
export const rankCompaniesByNCP = (
  companies: Company[],
  assets: Asset[],
  assetValues: Record<string, number>,
  marketShares: Record<string, Record<string, number>>, // companyId -> industry -> share
  allianceStrengths: Record<string, number> // companyId -> strength
): Array<{ company: Company; ncp: NCPBreakdown; rank: number }> => {
  const rankings = companies.map(company => {
    const marketShare = marketShares[company.id] || {};
    const allianceStrength = allianceStrengths[company.id] || 0;
    const ncp = calculateNCP(company, assets, assetValues, marketShare, allianceStrength);
    
    return { company, ncp, rank: 0 }; // rank will be set after sorting
  });
  
  // Sort by total NCP descending
  rankings.sort((a, b) => b.ncp.total - a.ncp.total);
  
  // Assign ranks
  rankings.forEach((ranking, index) => {
    ranking.rank = index + 1;
  });
  
  return rankings;
};

// Determine Oligarch status (top N companies)
export const getOligarchs = (
  rankings: Array<{ company: Company; ncp: NCPBreakdown; rank: number }>,
  topN: number = 10
): Array<{ company: Company; ncp: NCPBreakdown; rank: number }> => {
  return rankings.slice(0, topN);
};

// Export CompanyRanking type
export type CompanyRanking = {
  company: Company;
  ncp: NCPBreakdown;
  rank: number;
};

