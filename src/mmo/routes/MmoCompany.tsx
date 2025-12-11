import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMmoStore } from '../state/worldStore';
import { getIndustryById } from '../data/industries';
import DepartmentPanel from '../ui/DepartmentPanel';

const MmoCompany = () => {
  const navigate = useNavigate();
  const { player, investInRD } = useMmoStore();
  const [revenueHistory, setRevenueHistory] = useState<{ time: string; revenue: number }[]>([]);

  useEffect(() => {
    if (!player) {
      navigate('/quick-play/mmo');
      return;
    }

    // Track revenue history
    const interval = setInterval(() => {
      setRevenueHistory((prev) => {
        const newEntry = {
          time: new Date().toLocaleTimeString(),
          revenue: player.revenueRate,
        };
        const updated = [...prev, newEntry];
        // Keep last 20 entries
        return updated.slice(-20);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [player, navigate]);

  if (!player) return null;

  const industry = getIndustryById(player.industry);

  return (
    <div className="min-h-screen bg-cream pt-20 pb-20">
      <div className="max-w-6xl mx-auto p-6">
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
          <h1 className="text-4xl font-bold text-navy mb-2">{player.name}</h1>
          <p className="text-navy/70 text-lg">{industry?.name}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Company Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
          >
            <h2 className="text-2xl font-bold text-navy mb-4">Company Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-navy/70">Capital:</span>
                <span className="font-bold text-soft-green">
                  ${(player.capital || player.cash).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy/70">Revenue Rate:</span>
                <span className="font-bold text-navy">
                  ${player.revenueRate.toLocaleString()}/cycle
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy/70">Territories Owned:</span>
                <span className="font-bold text-navy">{player.territoriesOwned.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy/70">Power:</span>
                <span className="font-bold text-navy">{Math.round(player.power || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy/70">Season Score:</span>
                <span className="font-bold text-gold">
                  {(player.seasonScore || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy/70">Brand Reputation:</span>
                <span className="font-bold text-navy">{(player.brandReputation ?? player.reputation)}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy/70">Lobbying Power:</span>
                <span className="font-bold text-gold">{player.lobbyingPower}</span>
              </div>
              {(player.scandals || []).length > 0 && (
                <div className="mt-4 pt-4 border-t border-navy/10">
                  <div className="text-navy/70 mb-2">Active Scandals:</div>
                  <div className="text-red-600 font-semibold">{(player.scandals || []).length}</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Industry Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
          >
            <h2 className="text-2xl font-bold text-navy mb-4">Industry Details</h2>
            {industry && (
              <div className="space-y-3">
                <div>
                  <p className="text-navy/70 mb-2">{industry.description}</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/70">Base Yield:</span>
                  <span className="font-bold">
                    ${industry.baseYield.toLocaleString()}/cycle
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/70">Territory Multiplier:</span>
                  <span className="font-bold">{industry.territoryMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/70">Risk Level:</span>
                  <span className="font-bold">{industry.riskLevel.toUpperCase()}</span>
                </div>
                {industry.specialBonus && (
                  <div className="mt-4 pt-4 border-t border-navy/10">
                    <span className="text-gold font-semibold">✨ {industry.specialBonus}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10 mb-6"
        >
          <h2 className="text-2xl font-bold text-navy mb-4">Revenue History</h2>
          {revenueHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0A2342" opacity={0.1} />
                <XAxis dataKey="time" stroke="#0A2342" />
                <YAxis stroke="#0A2342" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF8ED',
                    border: '1px solid #0A2342',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#A6D49F"
                  strokeWidth={2}
                  dot={{ fill: '#A6D49F', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-navy/50">
              Revenue data will appear here as you play...
            </div>
          )}
        </motion.div>

        {/* Departments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10 mb-6"
        >
          <h2 className="text-2xl font-bold text-navy mb-4">Departments</h2>
          <DepartmentPanel />
        </motion.div>

        {/* Upgrades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
        >
          <h2 className="text-2xl font-bold text-navy mb-4">Company Upgrades</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (investInRD(50000)) {
                  // Success feedback could be added here
                }
              }}
              disabled={!player || (player.capital || player.cash) < 50000}
              className={`
                p-4 rounded-xl border-2 text-left transition-all
                ${
                  player && (player.capital || player.cash) >= 50000
                    ? 'border-gold bg-gold/10 hover:shadow-lg cursor-pointer'
                    : 'border-navy/20 bg-navy/5 cursor-not-allowed opacity-50'
                }
              `}
            >
              <h3 className="font-bold text-navy mb-2">Research & Development</h3>
              <p className="text-sm text-navy/70 mb-2">
                Invest $50,000 to increase revenue rate by 10%
              </p>
              <p className="text-xs text-navy/50">
                {industry?.id === 'tech' && '✨ Tech bonus: 20% more effective'}
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (player && (player.capital || player.cash) >= 30000) {
                  // Launch PR campaign
                }
              }}
              disabled={!player || (player.capital || player.cash) < 30000}
              className={`
                p-4 rounded-xl border-2 text-left transition-all
                ${
                  player && (player.capital || player.cash) >= 30000
                    ? 'border-gold bg-gold/10 hover:shadow-lg cursor-pointer'
                    : 'border-navy/20 bg-navy/5 cursor-not-allowed opacity-50'
                }
              `}
            >
              <h3 className="font-bold text-navy mb-2">PR Campaign</h3>
              <p className="text-sm text-navy/70">
                Launch campaign to improve brand reputation
              </p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MmoCompany;

