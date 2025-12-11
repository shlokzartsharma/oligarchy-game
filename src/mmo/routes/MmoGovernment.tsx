import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';

const MmoGovernment = () => {
  const navigate = useNavigate();
  const { player } = useMmoStore();

  useEffect(() => {
    if (!player) {
      navigate('/quick-play/mmo');
      return;
    }
  }, [player, navigate]);

  if (!player) return null;

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
          <h1 className="text-4xl font-bold text-navy">Government & Policy</h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Government Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
          >
            <h2 className="text-2xl font-bold text-navy mb-4">Current Government</h2>
            <div className="space-y-3">
              <div>
                <div className="text-navy/70 text-sm">Ruling Faction</div>
                <div className="text-xl font-bold text-navy">Centrist</div>
              </div>
              <div>
                <div className="text-navy/70 text-sm">Regulatory Stance</div>
                <div className="text-xl font-bold text-navy">Moderate</div>
              </div>
              <div>
                <div className="text-navy/70 text-sm">Tax Rate</div>
                <div className="text-xl font-bold text-soft-red">25%</div>
              </div>
              <div>
                <div className="text-navy/70 text-sm">Antitrust Enforcement</div>
                <div className="text-xl font-bold text-navy">30/100</div>
              </div>
            </div>
          </motion.div>

          {/* Lobbying Influence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
          >
            <h2 className="text-2xl font-bold text-navy mb-4">Your Lobbying Power</h2>
            <div className="text-4xl font-bold text-gold mb-2">{player.lobbyingPower}</div>
            <p className="text-navy/70 mb-4">
              Higher lobbying power reduces your effective tax rate and increases policy influence.
            </p>
            <button className="px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:shadow-lg">
              Invest in Lobbying
            </button>
          </motion.div>

          {/* Active Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10 md:col-span-2"
          >
            <h2 className="text-2xl font-bold text-navy mb-4">Active Policies</h2>
            <div className="text-navy/50 text-center py-8">
              No active policies at this time
            </div>
          </motion.div>

          {/* Investigations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10 md:col-span-2"
          >
            <h2 className="text-2xl font-bold text-navy mb-4">Ongoing Investigations</h2>
            <div className="text-navy/50 text-center py-8">
              No active investigations
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MmoGovernment;

