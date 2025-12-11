import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';
import { ActionCardData } from '../types';
import { randomChoice } from '../utils/random';

const ActionCard = () => {
  const { playerCompanyId, companies, aiCompanies, expandTerritory, undercutCompetitor, investInRD } = useMmoStore();
  const player = playerCompanyId ? companies.find(c => c.id === playerCompanyId) : null;
  const world = useMmoStore.getState() as any;
  const [currentAction, setCurrentAction] = useState<ActionCardData | null>(null);
  const [lastActionTime, setLastActionTime] = useState(Date.now());

  useEffect(() => {
    if (!player) return;

    const generateAction = (): ActionCardData => {
      const availableTerritories = (world.territories || []).filter(
        (t: any) => !t.owner || t.owner !== player.id
      );
      const availableCompetitors = aiCompanies.filter(c => (c.capital || c.cash || 0) > 0);

      const actions: ActionCardData[] = [];

      // Expand territory action
      if (availableTerritories.length > 0) {
        const territory = randomChoice(availableTerritories) as any;
        actions.push({
          id: 'expand',
          title: 'Territory Expansion Opportunity',
          description: `A prime location has become available: ${territory?.name || 'Unknown'}. Seize this opportunity to expand your influence.`,
          choiceA: {
            text: 'Expand Now',
            effect: () => {
              expandTerritory(territory?.id || '');
            },
          },
          choiceB: {
            text: 'Wait for Better Deal',
            effect: () => {
              // No effect, just wait
            },
          },
        });
      }

      // Undercut competitor action
      if (availableCompetitors.length > 0) {
        const competitor = randomChoice(availableCompetitors);
        actions.push({
          id: 'undercut',
          title: 'Competitive Advantage',
          description: `${competitor.name} is vulnerable. Launch an aggressive pricing campaign to reduce their market share.`,
          choiceA: {
            text: 'Launch Campaign',
            effect: () => {
              undercutCompetitor(competitor.id);
            },
          },
          choiceB: {
            text: 'Focus on Growth',
            effect: () => {
              // No effect
            },
          },
        });
      }

      // R&D investment action
      actions.push({
        id: 'rd',
        title: 'Research & Development',
        description: 'Invest in innovation to boost your revenue rate and gain a competitive edge.',
        choiceA: {
          text: 'Invest $50K',
            effect: () => {
              investInRD(50000);
            },
        },
        choiceB: {
          text: 'Save Capital',
          effect: () => {
            // No effect
          },
        },
      });

      return randomChoice(actions);
    };

    const showAction = () => {
      setCurrentAction(generateAction());
      setLastActionTime(Date.now());
    };

    // Show initial action
    showAction();

    // Show new action every 30 seconds
    const interval = setInterval(showAction, 30000);

    return () => clearInterval(interval);
  }, [player, world, aiCompanies, expandTerritory, undercutCompetitor, investInRD, lastActionTime]);

  if (!currentAction || !player) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentAction.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
      >
        <h3 className="text-2xl font-bold text-navy mb-2">{currentAction.title}</h3>
        <p className="text-navy/70 mb-6">{currentAction.description}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              currentAction.choiceA.effect();
              setCurrentAction(null);
              setTimeout(() => setCurrentAction(null), 100);
            }}
            className="p-4 rounded-xl bg-soft-green text-white font-bold hover:shadow-lg transition-shadow"
          >
            {currentAction.choiceA.text}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              currentAction.choiceB.effect();
              setCurrentAction(null);
              setTimeout(() => setCurrentAction(null), 100);
            }}
            className="p-4 rounded-xl bg-soft-red text-white font-bold hover:shadow-lg transition-shadow"
          >
            {currentAction.choiceB.text}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActionCard;

