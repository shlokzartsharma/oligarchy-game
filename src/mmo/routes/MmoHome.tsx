import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';
import IndustrySelect from '../components/IndustrySelect';

const MmoHome = () => {
  const navigate = useNavigate();
  const { companies, playerCompanyId, initializeWorld } = useMmoStore();
  const [playerName, setPlayerName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  // If player already exists, redirect to world
  useEffect(() => {
    if (playerCompanyId && companies.length > 0) {
      navigate('/quick-play/mmo/world');
    }
  }, [playerCompanyId, companies.length, navigate]);

  const handleStart = () => {
    if (!playerName.trim() || !selectedIndustry) return;

    // Initialize world with player's choices
    initializeWorld({
      industry: selectedIndustry,
      difficulty: 'medium',
      playerName: playerName.trim(),
    });
    
    // Navigate to world (initialization happens synchronously)
    navigate('/quick-play/mmo/world');
  };

  // Show loading or nothing while redirecting
  if (playerCompanyId && companies.length > 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-navy">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-20 pb-20">
      <div className="max-w-4xl mx-auto p-6">
        <Link
          to="/"
          className="text-navy/70 hover:text-navy transition-colors flex items-center gap-2 mb-4"
        >
          ← Back to Home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-navy mb-4">Oligarchy MMO</h1>
          <p className="text-xl text-navy/70">
            Build your empire. Control territories. Dominate the market.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-navy/10 mb-6"
        >
          <h2 className="text-2xl font-bold text-navy mb-4">How It Works</h2>
          <div className="space-y-4 text-navy/80">
            <div>
              <h3 className="font-bold text-navy mb-2">🔄 The Economic Battle Loop</h3>
              <p>
                Every 1-2 minutes, a major economic shock hits. You get a 30-second reaction window with 3 action points
                to make strategic moves: buy shares, trade resources, or attempt buyouts. Survive and dominate to become an Oligarch.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-navy mb-2">⚡ Strategic Actions</h3>
              <p>
                During <strong>Reaction phases</strong>, you can buy shares in other companies, trade resources, or attempt hostile takeovers.
                Watch for distressed companies (⚠️) - they're vulnerable and cheaper to acquire!
              </p>
            </div>
            <div>
              <h3 className="font-bold text-navy mb-2">🏭 Automatic Production</h3>
              <p>
                Your assets produce resources automatically (steel, chips, data, etc.). These can be sold for cash or traded.
                Maintenance costs are deducted each second, so manage your cash flow carefully.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-navy mb-2">🏆 Become an Oligarch</h3>
              <p>
                Compete in 20-minute seasons. Your Net Corporate Power (NCP) is calculated from cash, assets, market cap, and influence.
                Top 10 companies become Oligarchs. Survive the shocks, outmaneuver competitors, and dominate!
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-navy/10 mb-6"
        >
          <h2 className="text-2xl font-bold text-navy mb-4">Create Your Company</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-navy font-semibold mb-2">Company Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your company name"
                className="w-full px-4 py-3 rounded-xl border-2 border-navy/20 focus:border-gold focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-navy font-semibold mb-4">Choose Your Industry</label>
              <IndustrySelect
                selectedIndustry={selectedIndustry}
                onSelect={setSelectedIndustry}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={!playerName.trim() || !selectedIndustry}
            className={`
              px-8 py-4 rounded-full text-lg font-bold transition-all
              ${
                playerName.trim() && selectedIndustry
                  ? 'bg-navy text-cream hover:shadow-lg'
                  : 'bg-navy/30 text-cream/50 cursor-not-allowed'
              }
            `}
          >
            Start Your Empire
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default MmoHome;

