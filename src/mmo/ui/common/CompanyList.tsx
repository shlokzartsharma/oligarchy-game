// Company List: Shows all companies with portfolio summaries
// Used for viewing other companies, trading, acquisitions

import { motion } from 'framer-motion';
import { Company } from '../../economy/companies';
import PortfolioSummary from './PortfolioSummary';
import { useWorldStore } from '../../state/worldStore';

interface CompanyListProps {
  companies: Company[];
  playerCompanyId: string;
  onSelect?: (company: Company) => void;
  showActions?: boolean;
  distressedCompanies?: string[];
}

const CompanyList = ({ companies, playerCompanyId, onSelect, showActions = false, distressedCompanies = [] }: CompanyListProps) => {
  const { buyShares, attemptBuyout, phase, playerActionPoints } = useWorldStore();
  const canTakeAction = phase !== 'reaction' || playerActionPoints > 0;

  const handleBuyShares = (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    // Simple: buy 100 shares
    buyShares(company.id, 100);
  };

  const handleAttemptBuyout = (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    attemptBuyout(company.id);
  };

  return (
    <div className="space-y-4">
      {companies.length === 0 ? (
        <div className="text-center text-navy/50 py-8">No companies found</div>
      ) : (
        companies.map((company, index) => {
          const isDistressed = distressedCompanies.includes(company.id);
          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect && onSelect(company)}
              className={`${onSelect ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''} ${
                isDistressed ? 'border-2 border-red-500 rounded-lg p-2' : ''
              }`}
            >
              {isDistressed && (
                <div className="text-xs font-bold text-red-600 mb-1">⚠️ DISTRESSED</div>
              )}
              <PortfolioSummary company={company} compact={!showActions} />
              {showActions && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => onSelect && onSelect(company)}
                    className="px-4 py-2 bg-gold text-navy text-sm font-semibold rounded-lg hover:shadow-lg"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => handleBuyShares(company, e)}
                    disabled={!canTakeAction}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                      canTakeAction
                        ? 'bg-navy/10 text-navy hover:bg-navy/20'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Buy Shares
                  </button>
                  {company.id !== playerCompanyId && (
                    <button
                      onClick={(e) => handleAttemptBuyout(company, e)}
                      disabled={!canTakeAction}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                        canTakeAction
                          ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Attempt Buyout
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default CompanyList;
