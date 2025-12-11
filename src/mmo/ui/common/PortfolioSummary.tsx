// Portfolio Summary: High-level view of a company's portfolio
// Shows industries, key assets, territories, resources, market cap

import { motion } from 'framer-motion';
import { Company } from '../../economy/companies';

interface PortfolioSummaryProps {
  company: Company;
  compact?: boolean;
}

const PortfolioSummary = ({ company, compact = false }: PortfolioSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/50 backdrop-blur-sm rounded-xl border border-navy/10 ${compact ? 'p-4' : 'p-6'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-navy">{company.name}</h3>
          <p className="text-sm text-navy/70 capitalize">{company.industry}</p>
        </div>
        {company.isPlayer && (
          <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-semibold rounded-full">
            You
          </span>
        )}
      </div>

      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
        <div>
          <div className="text-navy/70 text-xs mb-1">Market Cap</div>
          <div className="font-bold text-soft-green">
            ${(company.marketCap / 1000).toFixed(0)}K
          </div>
        </div>
        <div>
          <div className="text-navy/70 text-xs mb-1">Cash</div>
          <div className="font-bold text-navy">
            ${(company.cash / 1000).toFixed(0)}K
          </div>
        </div>
        <div>
          <div className="text-navy/70 text-xs mb-1">Assets</div>
          <div className="font-bold text-navy">{company.assets.length}</div>
        </div>
        <div>
          <div className="text-navy/70 text-xs mb-1">Territories</div>
          <div className="font-bold text-navy">{company.territoriesOwned.length}</div>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 pt-4 border-t border-navy/10">
          <div className="text-navy/70 text-xs mb-2">Key Metrics</div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-navy/60">Reputation</div>
              <div className="font-semibold">{company.reputation}/100</div>
            </div>
            <div>
              <div className="text-navy/60">Lobbying</div>
              <div className="font-semibold">{company.lobbyingPower}</div>
            </div>
            <div>
              <div className="text-navy/60">Media</div>
              <div className="font-semibold">{company.mediaInfluence}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioSummary;

