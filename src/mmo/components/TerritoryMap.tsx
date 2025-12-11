import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';
import { Territory } from '../types';
import { getTerritoryCost } from '../data/territories';

const TerritoryMap = () => {
  const { world, player, expandTerritory } = useMmoStore();

  const handleTerritoryClick = (territory: Territory) => {
    if (!player) return;
    if (territory.owner === player.id) return; // Already owned

    expandTerritory(territory.id);
  };

  const getTerritoryColor = (territory: Territory): string => {
    if (!territory.owner) return 'bg-gray-200 border-gray-300';
    if (territory.owner === 'player') return 'bg-soft-green border-soft-green';
    
    // AI owned
    return 'bg-soft-red border-soft-red';
  };

  const getTerritoryOpacity = (territory: Territory): string => {
    if (!player) return 'opacity-100';
    if (territory.owner === player.id) return 'opacity-100';
    
    const cost = getTerritoryCost(territory);
    if (player.capital < cost) return 'opacity-50';
    
    return 'opacity-100';
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10">
      <h3 className="text-2xl font-bold text-navy mb-4">Territory Control</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {world.territories.map((territory) => {
          const cost = getTerritoryCost(territory);
          const canAfford = player ? player.capital >= cost : false;
          const isOwned = territory.owner === player?.id;

          return (
            <motion.button
              key={territory.id}
              whileHover={canAfford && !isOwned ? { scale: 1.1 } : {}}
              whileTap={canAfford && !isOwned ? { scale: 0.95 } : {}}
              onClick={() => handleTerritoryClick(territory)}
              disabled={isOwned || !canAfford}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                ${getTerritoryColor(territory)}
                ${getTerritoryOpacity(territory)}
                ${isOwned ? 'cursor-default' : canAfford ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed'}
              `}
            >
              <div className="text-white font-bold text-sm mb-1">{territory.name}</div>
              <div className="text-white/80 text-xs">
                ${territory.baseYield.toLocaleString()}/cycle
              </div>
              {!isOwned && (
                <div className="text-white/90 text-xs mt-1 font-semibold">
                  ${cost.toLocaleString()}
                </div>
              )}
              {isOwned && (
                <div className="text-white/90 text-xs mt-1">✓ Owned</div>
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-navy/70">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-soft-green rounded"></div>
          <span className="text-navy/70">Your Territory</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-soft-red rounded"></div>
          <span className="text-navy/70">Competitor</span>
        </div>
      </div>
    </div>
  );
};

export default TerritoryMap;

