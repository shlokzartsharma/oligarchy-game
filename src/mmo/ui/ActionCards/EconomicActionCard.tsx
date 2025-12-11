// Economic Action Card: Investment decisions, market actions
import { motion } from 'framer-motion';
import { useMmoStore } from '../../state/worldStore';

interface EconomicActionCardProps {
  title: string;
  description: string;
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

const EconomicActionCard = ({ title, description, optionA, optionB }: EconomicActionCardProps) => {
  const { playerCompanyId, companies } = useMmoStore();
  const player = playerCompanyId ? companies.find(c => c.id === playerCompanyId) : null;
  const canAffordA = player ? (player.capital || player.cash) >= optionA.cost : false;
  const canAffordB = player ? (player.capital || player.cash) >= optionB.cost : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
    >
      <h3 className="text-2xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-navy/70 mb-4">{description}</p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={optionA.effect}
          disabled={!canAffordA}
          className={`
            p-4 rounded-xl border-2 text-left transition-all
            ${canAffordA
              ? 'border-gold bg-gold/10 hover:shadow-lg cursor-pointer'
              : 'border-navy/20 bg-navy/5 cursor-not-allowed opacity-50'
            }
          `}
        >
          <div className="font-bold text-navy mb-1">{optionA.text}</div>
          <div className="text-sm text-navy/70">Cost: ${optionA.cost.toLocaleString()}</div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={optionB.effect}
          disabled={!canAffordB}
          className={`
            p-4 rounded-xl border-2 text-left transition-all
            ${canAffordB
              ? 'border-gold bg-gold/10 hover:shadow-lg cursor-pointer'
              : 'border-navy/20 bg-navy/5 cursor-not-allowed opacity-50'
            }
          `}
        >
          <div className="font-bold text-navy mb-1">{optionB.text}</div>
          <div className="text-sm text-navy/70">Cost: ${optionB.cost.toLocaleString()}</div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EconomicActionCard;

