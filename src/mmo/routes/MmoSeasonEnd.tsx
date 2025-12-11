// Season End Screen: Rankings, Oligarch status, legacy perks

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWorldStore } from '../state/worldStore';
import { rankCompaniesByNCP, getOligarchs } from '../economy/scoring';
import { Company } from '../economy/companies';

const MmoSeasonEnd = () => {
  const navigate = useNavigate();
  const { companies, playerCompanyId, seasonResults, initializeWorld } = useWorldStore();

  // Calculate rankings if not already calculated
  const rankings = seasonResults?.rankings || (() => {
    const assetValues: Record<string, number> = {};
    const marketShares: Record<string, Record<string, number>> = {};
    const allianceStrengths: Record<string, number> = {};
    
    return rankCompaniesByNCP(companies, [], assetValues, marketShares, allianceStrengths);
  })();

  const oligarchs = getOligarchs(rankings, 10);
  const playerRanking = rankings.find(r => r.company.id === playerCompanyId);

  const isOligarch = playerRanking && oligarchs.some(o => o.company.id === playerCompanyId);

  const handleStartNextSeason = () => {
    initializeWorld();
    navigate('/quick-play/mmo/world');
  };

  return (
    <div className="min-h-screen bg-cream pt-20 pb-20">
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-navy mb-4">Season Complete</h1>
          <p className="text-xl text-navy/70">Final Rankings & Oligarch Status</p>
        </motion.div>

        {/* Player Result */}
        {playerRanking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-8 rounded-2xl p-8 border-4 ${
              isOligarch
                ? 'bg-gold/20 border-gold'
                : 'bg-white/50 border-navy/20'
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{isOligarch ? '👑' : '📊'}</div>
              <h2 className="text-3xl font-bold text-navy mb-2">
                {isOligarch ? 'You Are An Oligarch!' : `Rank #${playerRanking.rank}`}
              </h2>
              <div className="text-2xl font-bold text-gold mb-4">
                NCP: {playerRanking.ncp.total.toLocaleString()}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-navy/70">Cash</div>
                  <div className="font-bold">{Math.round(playerRanking.ncp.cash).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-navy/70">Assets</div>
                  <div className="font-bold">{Math.round(playerRanking.ncp.assetValue).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-navy/70">Market Cap</div>
                  <div className="font-bold">{Math.round(playerRanking.ncp.marketCap).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-navy/70">Influence</div>
                  <div className="font-bold">{Math.round(playerRanking.ncp.lobbyingPower + playerRanking.ncp.mediaInfluence).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 10 Oligarchs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10 mb-6"
        >
          <h2 className="text-2xl font-bold text-navy mb-4">Top 10 Oligarchs</h2>
          <div className="space-y-2">
            {oligarchs.map((ranking) => (
              <div
                key={ranking.company.id}
                className={`
                  p-4 rounded-lg flex items-center justify-between
                  ${ranking.company.id === playerCompanyId
                    ? 'bg-gold/20 border-2 border-gold'
                    : 'bg-navy/5 border border-navy/10'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gold w-8">
                    #{ranking.rank}
                  </div>
                  <div>
                    <div className="font-semibold text-navy">{ranking.company.name}</div>
                    <div className="text-sm text-navy/70 capitalize">{ranking.company.industry}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-navy">{ranking.ncp.total.toLocaleString()} NCP</div>
                  <div className="text-sm text-navy/70">Market Cap: ${ranking.company.marketCap.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-x-4"
        >
          <button
            onClick={handleStartNextSeason}
            className="px-8 py-4 bg-navy text-cream font-semibold rounded-xl hover:shadow-lg"
          >
            Start Next Season
          </button>
          <button
            onClick={() => navigate('/quick-play/mmo')}
            className="px-8 py-4 bg-navy/20 text-navy font-semibold rounded-xl hover:bg-navy/30"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MmoSeasonEnd;
