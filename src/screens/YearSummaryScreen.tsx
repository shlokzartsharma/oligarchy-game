import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const YearSummaryScreen = () => {
  const navigate = useNavigate();
  const { profile, accounts, investments, calculateNetWorth, marketCycle } = useGameStore();
  const netWorth = calculateNetWorth();

  // Generate historical data (simplified)
  const historicalData = Array.from({ length: profile.year }, (_, i) => ({
    year: i + 1,
    netWorth: Math.max(0, netWorth * (i + 1) / profile.year), // Simplified
  }));

  const checking = accounts.find(a => a.type === 'checking')?.balance || 0;
  const savings = accounts.find(a => a.type === 'savings')?.balance || 0;
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-cream p-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <h1 className="text-4xl font-bold text-navy mb-8 text-center">
            Year {profile.year} Summary
          </h1>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-cream rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-gold">
                ${netWorth.toLocaleString()}
              </div>
              <div className="text-sm text-navy/70 mt-1">Net Worth</div>
            </div>
            <div className="bg-cream rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">😊</div>
              <div className="text-2xl font-bold text-soft-green">
                {profile.happiness}
              </div>
              <div className="text-sm text-navy/70 mt-1">Happiness</div>
            </div>
            <div className="bg-cream rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-navy">
                {profile.creditScore}
              </div>
              <div className="text-sm text-navy/70 mt-1">Credit Score</div>
            </div>
          </div>

          {/* Account Breakdown */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-4">Account Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-cream rounded-lg">
                <span className="text-navy font-semibold">Checking</span>
                <span className="text-navy font-bold">${checking.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-cream rounded-lg">
                <span className="text-navy font-semibold">Savings</span>
                <span className="text-navy font-bold">${savings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-cream rounded-lg">
                <span className="text-navy font-semibold">Investments</span>
                <span className="text-navy font-bold">${totalInvestments.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Market Cycle */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-4">Market Cycle</h2>
            <div className="bg-cream rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-navy font-semibold capitalize">
                  {marketCycle.type} Market
                </span>
                <span className="text-navy/70 text-sm">
                  {marketCycle.type === 'bull' && '📈'}
                  {marketCycle.type === 'recession' && '📉'}
                  {marketCycle.type === 'bear' && '🐻'}
                  {marketCycle.type === 'normal' && '➡️'}
                </span>
              </div>
            </div>
          </div>

          {/* Net Worth Chart */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-4">Net Worth Over Time</h2>
            <div className="bg-cream rounded-lg p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0A2342" opacity={0.2} />
                  <XAxis dataKey="year" stroke="#0A2342" />
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
                    dataKey="netWorth"
                    stroke="#F5C451"
                    strokeWidth={3}
                    dot={{ fill: '#F5C451', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/quick-play/game')}
            className="w-full bg-navy text-cream px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
          >
            Continue to Next Year
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default YearSummaryScreen;

