import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';

const MmoMedia = () => {
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
          <h1 className="text-4xl font-bold text-navy">Media & PR</h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Media Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
          >
            <h2 className="text-2xl font-bold text-navy mb-4">Your Media Outlets</h2>
            <div className="text-navy/50 text-center py-8">
              No media outlets owned
            </div>
            <button className="w-full px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:shadow-lg">
              Browse Available Outlets
            </button>
          </motion.div>

          {/* PR Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
          >
            <h2 className="text-2xl font-bold text-navy mb-4">Active PR Campaigns</h2>
            <div className="text-navy/50 text-center py-8">
              No active campaigns
            </div>
            <button className="w-full px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:shadow-lg">
              Launch Campaign
            </button>
          </motion.div>

          {/* Public Sentiment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10 md:col-span-2"
          >
            <h2 className="text-2xl font-bold text-navy mb-4">Public Sentiment</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-navy/5 rounded-lg">
                <div className="text-navy/70 text-sm mb-1">Trust in Corporations</div>
                <div className="text-2xl font-bold text-navy">50/100</div>
              </div>
              <div className="p-4 bg-navy/5 rounded-lg">
                <div className="text-navy/70 text-sm mb-1">Anger at Monopolies</div>
                <div className="text-2xl font-bold text-soft-red">30/100</div>
              </div>
              <div className="p-4 bg-navy/5 rounded-lg">
                <div className="text-navy/70 text-sm mb-1">Economic Optimism</div>
                <div className="text-2xl font-bold text-soft-green">60/100</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MmoMedia;

