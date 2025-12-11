// Crisis Action Card: Response to world events
import { motion } from 'framer-motion';
import { useMmoStore } from '../../state/worldStore';

interface CrisisActionCardProps {
  eventTitle: string;
  eventDescription: string;
  eventId: string;
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

const CrisisActionCard = ({ eventTitle, eventDescription, eventId, optionA, optionB }: CrisisActionCardProps) => {
  const { playerCompanyId, companies, respondToCrisis } = useMmoStore();
  const player = playerCompanyId ? companies.find(c => c.id === playerCompanyId) : null;
  const canAffordA = player ? (player.capital || player.cash) >= optionA.cost : false;
  const canAffordB = player ? (player.capital || player.cash) >= optionB.cost : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50/50 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-300"
    >
      <h3 className="text-2xl font-bold text-yellow-900 mb-2">⚠️ {eventTitle}</h3>
      <p className="text-yellow-800/70 mb-4">{eventDescription}</p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            optionA.effect();
            respondToCrisis(eventId, 'optionA');
          }}
          disabled={!canAffordA}
          className={`
            p-4 rounded-xl border-2 text-left transition-all
            ${canAffordA
              ? 'border-yellow-500 bg-yellow-100/50 hover:shadow-lg cursor-pointer'
              : 'border-yellow-200 bg-yellow-50/30 cursor-not-allowed opacity-50'
            }
          `}
        >
          <div className="font-bold text-yellow-900 mb-1">{optionA.text}</div>
          <div className="text-sm text-yellow-700/70">Cost: ${optionA.cost.toLocaleString()}</div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            optionB.effect();
            respondToCrisis(eventId, 'optionB');
          }}
          disabled={!canAffordB}
          className={`
            p-4 rounded-xl border-2 text-left transition-all
            ${canAffordB
              ? 'border-yellow-500 bg-yellow-100/50 hover:shadow-lg cursor-pointer'
              : 'border-yellow-200 bg-yellow-50/30 cursor-not-allowed opacity-50'
            }
          `}
        >
          <div className="font-bold text-yellow-900 mb-1">{optionB.text}</div>
          <div className="text-sm text-yellow-700/70">Cost: ${optionB.cost.toLocaleString()}</div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CrisisActionCard;

