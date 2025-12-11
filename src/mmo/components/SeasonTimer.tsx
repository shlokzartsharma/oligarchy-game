import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';

const SeasonTimer = () => {
  const { seasonEndTimestamp } = useMmoStore();
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!seasonEndTimestamp) return;
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, seasonEndTimestamp - now);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        // Season ended - handled by game loop
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [seasonEndTimestamp]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = seasonEndTimestamp
    ? Math.max(0, Math.min(100, ((Date.now() - (seasonEndTimestamp - 300000)) / 300000) * 100))
    : 0;

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10">
      <h3 className="text-xl font-bold text-navy mb-3">Season Timer</h3>
      <div className="space-y-3">
        <div className="relative h-4 bg-navy/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-navy/70">Time Remaining:</span>
          <motion.span
            key={timeRemaining}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-navy"
          >
            {formatTime(timeRemaining)}
          </motion.span>
        </div>
        <div className="text-xs text-navy/60">
          Season ends when timer reaches 0:00. Final rankings will be calculated.
        </div>
      </div>
    </div>
  );
};

export default SeasonTimer;

