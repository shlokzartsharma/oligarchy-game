import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';
import MarketDashboard from '../ui/MarketDashboard';
import Marketplace from '../trading/marketplace';

const MmoMarket = () => {
  const navigate = useNavigate();
  const { player, updateSystems } = useMmoStore();

  useEffect(() => {
    if (!player) {
      navigate('/quick-play/mmo');
      return;
    }

    // Update systems periodically
    const interval = setInterval(() => {
      updateSystems();
    }, 5000);

    return () => clearInterval(interval);
  }, [player, navigate, updateSystems]);

  if (!player) return null;

  return (
    <div className="min-h-screen bg-cream pt-20 pb-20">
      <div className="max-w-7xl mx-auto p-6">
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
          <h1 className="text-4xl font-bold text-navy">Market & Trading</h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <MarketDashboard />
          <Marketplace />
        </div>
      </div>
    </div>
  );
};

export default MmoMarket;

