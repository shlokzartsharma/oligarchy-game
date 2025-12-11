// Asset Management Panel: Primary player action interface
// Shows assets, profit per tick, and build/upgrade buttons

import { motion } from 'framer-motion';
import { useWorldStore } from '../state/worldStore';
import { AssetType, ASSET_DEFINITIONS, getBuildCost, getUpgradeCost, calculateAssetProfit } from '../economy/assets';
import { ResourceType } from '../economy/resources';
import { getPrice } from '../economy/markets';

const AssetManagementPanel = () => {
  const {
    companies,
    playerCompanyId,
    assets,
    marketState,
    buildAsset,
    upgradeAsset,
    shutdownAsset,
    takeLoan,
    repayLoan,
  } = useWorldStore();

  const playerCompany = companies.find(c => c.id === playerCompanyId);
  if (!playerCompany) return null;

  const playerAssets = assets.filter(a => playerCompany.assets.includes(a.id));
  
  // Calculate profit per tick
  const marketPrices: Record<ResourceType, number> = {} as any;
  Object.keys(ASSET_DEFINITIONS.factory.baseProduction).forEach(type => {
    marketPrices[type as ResourceType] = getPrice(marketState, type as ResourceType);
  });

  let totalProfitPerTick = 0;
  let totalUpkeep = 0;
  playerAssets.forEach(asset => {
    if (asset) {
      const profit = calculateAssetProfit(asset, marketPrices);
      totalProfitPerTick += profit;
      totalUpkeep += asset.upkeepCost || 0;
    }
  });

  // Debt interest per tick
  const ticksPerYear = 31536000 / 1000; // ~31.5M ticks per year
  const interestPerTick = playerCompany.debt * (playerCompany.interestRate / ticksPerYear);
  const netProfitPerTick = totalProfitPerTick - interestPerTick;

  // Available asset types to build
  const availableAssetTypes: AssetType[] = ['factory', 'farm', 'mine', 'refinery', 'data_center', 'media_network'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
    >
      <h2 className="text-2xl font-bold text-navy mb-4">Asset Management</h2>
      
      {/* Profit Display - CRITICAL */}
      <div className="bg-gold/20 border-2 border-gold rounded-lg p-4 mb-6">
        <div className="text-sm text-navy/70 mb-1">Net Profit Per Second</div>
        <div className={`text-3xl font-bold ${netProfitPerTick >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {netProfitPerTick >= 0 ? '+' : ''}${netProfitPerTick.toFixed(0)}/sec
        </div>
        <div className="text-xs text-navy/60 mt-2">
          Revenue: +${totalProfitPerTick.toFixed(0)}/sec | 
          Upkeep: -${totalUpkeep.toFixed(0)}/sec | 
          Interest: -${interestPerTick.toFixed(0)}/sec
        </div>
      </div>

      {/* Debt Display */}
      {playerCompany.debt > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-red-700">Debt</div>
              <div className="text-lg font-bold text-red-600">${playerCompany.debt.toLocaleString()}</div>
            </div>
            <button
              onClick={() => {
                const repayAmount = Math.min(playerCompany.cash, playerCompany.debt);
                if (repayAmount > 0) repayLoan(repayAmount);
              }}
              disabled={playerCompany.cash <= 0}
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Repay ${Math.min(playerCompany.cash, playerCompany.debt).toLocaleString()}
            </button>
          </div>
        </div>
      )}

      {/* Build Assets */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-navy mb-3">Build New Asset</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableAssetTypes.map(assetType => {
            const buildCost = getBuildCost(assetType, 1);
            const canAfford = playerCompany.cash >= buildCost;
            
            return (
              <motion.button
                key={assetType}
                whileHover={canAfford ? { scale: 1.02 } : {}}
                whileTap={canAfford ? { scale: 0.98 } : {}}
                onClick={() => canAfford && buildAsset(assetType, 1)}
                disabled={!canAfford}
                className={`
                  p-3 rounded-lg border-2 text-left text-sm transition-all
                  ${canAfford
                    ? 'border-gold bg-gold/10 hover:bg-gold/20 cursor-pointer'
                    : 'border-navy/20 bg-navy/5 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className="font-bold text-navy">{ASSET_DEFINITIONS[assetType].name}</div>
                <div className="text-xs text-navy/70 mt-1">${buildCost.toLocaleString()}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Take Loan */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-navy mb-3">Leverage</h3>
        <button
          onClick={() => {
            const loanAmount = Math.min(100000, playerCompany.cash * 2);
            takeLoan(loanAmount);
          }}
          className="w-full px-4 py-3 bg-navy/10 text-navy font-semibold rounded-lg hover:bg-navy/20 border border-navy/20"
        >
          Take Loan ($100K max)
        </button>
      </div>

      {/* Current Assets */}
      <div>
        <h3 className="text-lg font-bold text-navy mb-3">Your Assets ({playerAssets.length})</h3>
        {playerAssets.length === 0 ? (
          <div className="text-center text-navy/50 py-4">No assets. Build one to start producing!</div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {playerAssets.map(asset => {
              if (!asset || !asset.type) return null;
              
              const assetDef = ASSET_DEFINITIONS[asset.type];
              if (!assetDef) return null;
              
              const profit = calculateAssetProfit(asset, marketPrices);
              const upgradeCost = getUpgradeCost(asset);
              const canUpgrade = asset.level < 5 && playerCompany.cash >= upgradeCost;
              
              return (
                <div
                  key={asset.id}
                  className="bg-white/50 rounded-lg p-3 border border-navy/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-navy">
                        {assetDef.name} (Lv {asset.level || 1})
                      </div>
                      <div className={`text-sm ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}${profit.toFixed(0)}/sec
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canUpgrade && upgradeCost > 0 && (
                        <button
                          onClick={() => upgradeAsset(asset.id)}
                          className="px-3 py-1 bg-gold text-navy text-xs font-semibold rounded hover:bg-gold/80"
                        >
                          Upgrade (${upgradeCost.toLocaleString()})
                        </button>
                      )}
                      <button
                        onClick={() => shutdownAsset(asset.id)}
                        className="px-3 py-1 bg-red-500/10 text-red-600 text-xs font-semibold rounded hover:bg-red-500/20"
                      >
                        Shutdown
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-navy/60">
                    Upkeep: ${(asset.upkeepCost || 0).toLocaleString()}/sec
                    {asset.efficiencyMultiplier !== undefined && asset.efficiencyMultiplier !== 1.0 && (
                      <span className="ml-2">
                        Efficiency: {(asset.efficiencyMultiplier * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AssetManagementPanel;

