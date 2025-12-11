import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const HUD = () => {
  const { profile, accounts, calculateNetWorth } = useGameStore();
  const netWorth = calculateNetWorth();
  const checking = accounts.find(a => a.type === 'checking')?.balance || 0;
  // const savings = accounts.find(a => a.type === 'savings')?.balance || 0; // Unused

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b-2 border-navy">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          {/* Age & Year */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <span className="text-navy/60 text-xs">Age</span>
            <span className="text-navy font-bold text-lg">{profile.age}</span>
          </motion.div>

          {/* Net Worth */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <span className="text-navy/60 text-xs">Net Worth</span>
            <span className="text-gold font-bold text-lg">
              ${netWorth.toLocaleString()}
            </span>
          </motion.div>

          {/* Checking */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <span className="text-navy/60 text-xs">Checking</span>
            <span className="text-navy font-bold text-lg">
              ${checking.toLocaleString()}
            </span>
          </motion.div>

          {/* Credit Score */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <span className="text-navy/60 text-xs">Credit</span>
            <span className="text-navy font-bold text-lg">{profile.creditScore}</span>
          </motion.div>

          {/* Happiness */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <span className="text-navy/60 text-xs">Happiness</span>
            <div className="flex items-center gap-2">
              <span className="text-navy font-bold text-lg">{profile.happiness}</span>
              <div className="flex-1 bg-navy/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-soft-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.happiness}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HUD;

