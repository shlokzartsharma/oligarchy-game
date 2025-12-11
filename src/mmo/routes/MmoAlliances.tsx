import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';
import AllianceDashboard from '../ui/AllianceDashboard';

const MmoAlliances = () => {
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
          <h1 className="text-4xl font-bold text-navy">Alliances & Diplomacy</h1>
        </motion.div>

        <AllianceDashboard />
      </div>
    </div>
  );
};

export default MmoAlliances;

