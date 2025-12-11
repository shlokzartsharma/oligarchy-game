import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';
import { getIndustryById } from '../data/industries';
import { calculateNCP, rankCompaniesByNCP } from '../economy/scoring';

const MmoLeaderboard = () => {
  const navigate = useNavigate();
  const { companies, playerCompanyId, assets } = useMmoStore();

  // Calculate rankings using NCP
  const assetValues: Record<string, number> = {}; // TODO: Calculate from assets
  const marketShares: Record<string, Record<string, number>> = {}; // TODO: Calculate
  const allianceStrengths: Record<string, number> = {}; // TODO: Calculate

  const rankings = rankCompaniesByNCP(companies, assets, assetValues, marketShares, allianceStrengths);

  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-cream pt-20 pb-20">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/quick-play/mmo/world')}
            className="text-navy/70 hover:text-navy mb-4 flex items-center gap-2"
          >
            ← Back to World
          </button>
          <h1 className="text-4xl font-bold text-navy mb-2">Leaderboard</h1>
          <p className="text-navy/70">
            Rankings based on Net Corporate Power (NCP). Season ends when timer reaches 0:00.
          </p>
        </motion.div>

        {rankings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-12 border border-navy/10 text-center"
          >
            <div className="text-navy/50 text-lg">No companies found. Start playing to see rankings!</div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl border border-navy/10 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-navy font-bold">Rank</th>
                    <th className="px-6 py-4 text-left text-navy font-bold">Company</th>
                    <th className="px-6 py-4 text-left text-navy font-bold">Industry</th>
                    <th className="px-6 py-4 text-right text-navy font-bold">Market Cap</th>
                    <th className="px-6 py-4 text-right text-navy font-bold">Cash</th>
                    <th className="px-6 py-4 text-right text-navy font-bold">NCP</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((ranking, index) => {
                    const isPlayer = ranking.company.id === playerCompanyId;
                    const industry = getIndustryById(ranking.company.industry);

                    return (
                      <motion.tr
                        key={ranking.company.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          border-t border-navy/10
                          ${isPlayer ? 'bg-gold/20 font-semibold' : 'hover:bg-white/30'}
                        `}
                      >
                        <td className="px-6 py-4 text-navy font-bold">
                          {ranking.rank <= 3 ? getRankIcon(ranking.rank) : `#${ranking.rank}`}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-navy font-semibold">{ranking.company.name}</span>
                            {isPlayer && (
                              <span className="text-xs bg-gold text-navy px-2 py-1 rounded-full">
                                YOU
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-navy/70 capitalize">
                          {industry?.name || ranking.company.industry}
                        </td>
                        <td className="px-6 py-4 text-right text-soft-green font-semibold">
                          ${(ranking.company.marketCap / 1000).toFixed(0)}K
                        </td>
                        <td className="px-6 py-4 text-right text-navy">
                          ${(ranking.company.cash / 1000).toFixed(0)}K
                        </td>
                        <td className="px-6 py-4 text-right text-gold font-bold">
                          {ranking.ncp.total.toLocaleString()}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
        >
          <h3 className="text-xl font-bold text-navy mb-3">Scoring System</h3>
          <div className="space-y-2 text-sm text-navy/70">
            <p>
              <span className="font-semibold">NCP (Net Corporate Power) =</span> Cash + Assets + Market Cap + 
              Production + Market Share + Lobbying + Media Influence + Alliance Strength
            </p>
            <p className="text-xs text-navy/50 mt-2">
              Final rankings are calculated when the season timer ends. Top performers receive
              legacy bonuses for the next season.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MmoLeaderboard;
