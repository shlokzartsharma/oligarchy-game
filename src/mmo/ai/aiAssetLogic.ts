// AI Asset Logic: AI companies build, upgrade, and manage assets
// Uses the SAME APIs as the player

import { Company } from '../economy/companies';
import { Asset, AssetType, getBuildCost, getUpgradeCost, calculateAssetProfit, ASSET_DEFINITIONS } from '../economy/assets';
import { MarketState, getPrice } from '../economy/markets';
import { ResourceType } from '../economy/resources';
// import { randomChoice } from '../utils/random'; // Unused

export interface AIDecision {
  action: 'build' | 'upgrade' | 'shutdown' | 'loan' | 'idle';
  assetType?: AssetType;
  assetId?: string;
  loanAmount?: number;
  priority: number;
}

// Decide what AI should do based on game state
export const decideAIAction = (
  aiCompany: Company,
  assets: Asset[],
  marketState: MarketState,
  _distressedCompanies: string[],
  _phase: string
): AIDecision => {
  const companyAssets = assets.filter(a => aiCompany.assets.includes(a.id));
  const decisions: AIDecision[] = [];
  
  // Get market prices
  const marketPrices: Record<ResourceType, number> = {} as any;
  Object.keys(ASSET_DEFINITIONS.factory.baseProduction).forEach(type => {
    marketPrices[type as ResourceType] = getPrice(marketState, type as ResourceType);
  });
  
  // Calculate current profit per tick
  let currentProfit = 0;
  companyAssets.forEach(asset => {
    currentProfit += calculateAssetProfit(asset, marketPrices);
  });
  
  // Decision 1: Build new asset if profitable and have cash
  if (aiCompany.cash > 100000) {
    const assetTypes: AssetType[] = ['factory', 'farm', 'mine', 'refinery', 'data_center', 'media_network'];
    assetTypes.forEach(assetType => {
      const buildCost = getBuildCost(assetType, 1);
      if (aiCompany.cash >= buildCost) {
        // Estimate profit (simplified)
        const def = ASSET_DEFINITIONS[assetType];
        let estimatedRevenue = 0;
        Object.entries(def.baseProduction).forEach(([type, amount]) => {
          if (amount > 0) {
            estimatedRevenue += amount * marketPrices[type as ResourceType];
          }
        });
        const estimatedProfit = estimatedRevenue - def.baseUpkeep;
        
        if (estimatedProfit > 0) {
          decisions.push({
            action: 'build',
            assetType,
            priority: estimatedProfit / buildCost, // ROI
          });
        }
      }
    });
  }
  
  // Decision 2: Upgrade existing asset if profitable
  companyAssets.forEach(asset => {
    if (asset.level < 5) {
      const upgradeCost = getUpgradeCost(asset);
      if (aiCompany.cash >= upgradeCost) {
        // Estimate profit increase
        const currentProfit = calculateAssetProfit(asset, marketPrices);
        // Simplified: assume 30% profit increase per level
        const estimatedNewProfit = currentProfit * 1.3;
        const profitIncrease = estimatedNewProfit - currentProfit;
        
        if (profitIncrease > 0 && profitIncrease / upgradeCost > 0.1) { // At least 10% ROI
          decisions.push({
            action: 'upgrade',
            assetId: asset.id,
            priority: profitIncrease / upgradeCost,
          });
        }
      }
    }
  });
  
  // Decision 3: Take loan if low on cash but have assets
  if (aiCompany.cash < 50000 && companyAssets.length > 0 && aiCompany.debt < aiCompany.cash * 3) {
    const loanAmount = Math.min(100000, aiCompany.cash * 2);
    decisions.push({
      action: 'loan',
      loanAmount,
      priority: 0.5,
    });
  }
  
  // Decision 4: Shutdown unprofitable assets
  companyAssets.forEach(asset => {
    const profit = calculateAssetProfit(asset, marketPrices);
    if (profit < -1000) { // Losing more than $1000/tick
      decisions.push({
        action: 'shutdown',
        assetId: asset.id,
        priority: -profit / 1000, // Higher priority for bigger losses
      });
    }
  });
  
  // Default: idle
  decisions.push({
    action: 'idle',
    priority: 0.1,
  });
  
  // Select highest priority decision
  decisions.sort((a, b) => b.priority - a.priority);
  return decisions[0];
};

// Execute AI decision (returns what to do, actual execution happens in worldStore)
export const executeAIDecision = (
  decision: AIDecision,
  aiCompany: Company,
  assets: Asset[]
): {
  success: boolean;
  newCash?: number;
  newDebt?: number;
  assetToBuild?: AssetType;
  assetToUpgrade?: string;
  assetToShutdown?: string;
  loanAmount?: number;
} => {
  switch (decision.action) {
    case 'build':
      if (!decision.assetType) return { success: false };
      const buildCost = getBuildCost(decision.assetType, 1);
      if (aiCompany.cash < buildCost) return { success: false };
      return {
        success: true,
        newCash: aiCompany.cash - buildCost,
        assetToBuild: decision.assetType,
      };
      
    case 'upgrade':
      if (!decision.assetId) return { success: false };
      const asset = assets.find(a => a.id === decision.assetId);
      if (!asset || asset.level >= 5) return { success: false };
      const upgradeCost = getUpgradeCost(asset);
      if (aiCompany.cash < upgradeCost) return { success: false };
      return {
        success: true,
        newCash: aiCompany.cash - upgradeCost,
        assetToUpgrade: decision.assetId,
      };
      
    case 'shutdown':
      if (!decision.assetId) return { success: false };
      return {
        success: true,
        assetToShutdown: decision.assetId,
      };
      
    case 'loan':
      if (!decision.loanAmount) return { success: false };
      const maxLoan = Math.min(aiCompany.cash * 5, 500000);
      const loanAmount = Math.min(decision.loanAmount, maxLoan);
      return {
        success: true,
        newCash: aiCompany.cash + loanAmount,
        newDebt: aiCompany.debt + loanAmount,
        loanAmount,
      };
      
    case 'idle':
      return { success: true };
      
    default:
      return { success: false };
  }
};

