import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';

const RevenueTicker = () => {
  const { player, tickRevenue } = useMmoStore();
  const [lastCapital, setLastCapital] = useState((player?.capital || player?.cash) || 0);
  const [showGain, setShowGain] = useState(false);
  const [gainAmount, setGainAmount] = useState(0);

  useEffect(() => {
    if (!player) return;

    // Set up revenue tick interval
    const interval = setInterval(() => {
      tickRevenue();
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [player, tickRevenue]);

  useEffect(() => {
    if (!player) return;

    const currentCapital = player.capital || player.cash;
    const difference = currentCapital - lastCapital;

    if (difference > 0) {
      setGainAmount(difference);
      setShowGain(true);
      setTimeout(() => setShowGain(false), 2000);
    }

    setLastCapital(currentCapital);
  }, [player?.capital || player?.cash, lastCapital]);

  if (!player) return null;

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-navy">Capital</h3>
        <div className="relative">
          <motion.div
            key={player.capital || player.cash}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-soft-green"
          >
            ${(player.capital || player.cash).toLocaleString()}
          </motion.div>
          <AnimatePresence>
            {showGain && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute -top-8 right-0 text-lg font-bold text-soft-green"
              >
                +${gainAmount.toLocaleString()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-navy/70">Revenue Rate:</span>
          <span className="font-semibold text-navy">
            ${player.revenueRate.toLocaleString()}/cycle
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-navy/70">Territories:</span>
          <span className="font-semibold text-navy">
            {player.territoriesOwned.length}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-navy/70">Power:</span>
          <span className="font-semibold text-navy">{Math.round(player.power || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueTicker;

