// Sabotage Action Card: Hostile actions against competitors
import { motion } from 'framer-motion';
import { useMmoStore } from '../../state/worldStore';

interface SabotageActionCardProps {
  targetName: string;
  targetId: string;
  optionA: {
    text: string;
    cost: number;
    effect: () => void;
  };
  optionB: {
    text: string;
    cost: number;
    effect: () => void;
  };
}

const SabotageActionCard = ({ targetName, targetId, optionA, optionB }: SabotageActionCardProps) => {
  const { playerCompanyId, companies } = useMmoStore();
  const player = playerCompanyId ? companies.find(c => c.id === playerCompanyId) : null;
  const world = useMmoStore.getState() as any;
  const canAffordA = player ? (player.capital || player.cash) >= optionA.cost : false;
  const canAffordB = player ? (player.capital || player.cash) >= optionB.cost : false;
  
  // Check cooldown
  const lastSabotage = (world as any).sabotageCooldowns?.[targetId] || 0;
  const cooldownActive = Date.now() - lastSabotage < 60000;
  const cooldownRemaining = Math.ceil((60000 - (Date.now() - lastSabotage)) / 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50/50 backdrop-blur-sm rounded-xl p-6 border-2 border-red-200"
    >
      <h3 className="text-2xl font-bold text-red-900 mb-2">Sabotage: {targetName}</h3>
      <p className="text-red-700/70 mb-4">Hostile actions against competitor</p>
      
      {cooldownActive && (
        <div className="mb-4 p-2 bg-red-100 rounded text-red-800 text-sm">
          Cooldown: {cooldownRemaining}s remaining
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={optionA.effect}
          disabled={!canAffordA || cooldownActive}
          className={`
            p-4 rounded-xl border-2 text-left transition-all
            ${canAffordA && !cooldownActive
              ? 'border-red-500 bg-red-100/50 hover:shadow-lg cursor-pointer'
              : 'border-red-200 bg-red-50/30 cursor-not-allowed opacity-50'
            }
          `}
        >
          <div className="font-bold text-red-900 mb-1">{optionA.text}</div>
          <div className="text-sm text-red-700/70">Cost: ${optionA.cost.toLocaleString()}</div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={optionB.effect}
          disabled={!canAffordB || cooldownActive}
          className={`
            p-4 rounded-xl border-2 text-left transition-all
            ${canAffordB && !cooldownActive
              ? 'border-red-500 bg-red-100/50 hover:shadow-lg cursor-pointer'
              : 'border-red-200 bg-red-50/30 cursor-not-allowed opacity-50'
            }
          `}
        >
          <div className="font-bold text-red-900 mb-1">{optionB.text}</div>
          <div className="text-sm text-red-700/70">Cost: ${optionB.cost.toLocaleString()}</div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SabotageActionCard;

