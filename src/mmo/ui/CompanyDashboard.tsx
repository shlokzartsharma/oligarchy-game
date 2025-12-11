// Company Dashboard: Overview of company stats, assets, departments
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';

const CompanyDashboard = () => {
  const { player, assets } = useMmoStore();

  if (!player) return null;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-navy/10"
        >
          <div className="text-navy/70 text-sm">Capital</div>
          <div className="text-2xl font-bold text-soft-green">
            ${player.capital.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-navy/10"
        >
          <div className="text-navy/70 text-sm">Brand Reputation</div>
          <div className="text-2xl font-bold text-navy">{player.brandReputation}/100</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-navy/10"
        >
          <div className="text-navy/70 text-sm">Lobbying Power</div>
          <div className="text-2xl font-bold text-gold">{player.lobbyingPower}</div>
        </motion.div>
      </div>

      {/* Assets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
      >
        <h3 className="text-xl font-bold text-navy mb-4">Assets ({player.assets.length})</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {player.assets.length === 0 ? (
            <div className="col-span-3 text-navy/50 text-center py-8">
              No assets built yet
            </div>
          ) : (
            assets
              .filter(a => player.assets.includes(a.id))
              .map(asset => (
                <div key={asset.id} className="p-3 bg-navy/5 rounded-lg">
                  <div className="font-semibold text-navy">{asset.name}</div>
                  <div className="text-sm text-navy/70">Level {asset.level}</div>
                </div>
              ))
          )}
        </div>
      </motion.div>

      {/* Departments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
      >
        <h3 className="text-xl font-bold text-navy mb-4">Departments</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {Object.entries(player.departments).map(([dept, level]) => (
            <div key={dept} className="p-3 bg-navy/5 rounded-lg text-center">
              <div className="font-semibold text-navy capitalize">{dept}</div>
              <div className="text-2xl font-bold text-gold">{level}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
      >
        <h3 className="text-xl font-bold text-navy mb-4">Resources</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {Object.keys(player.rawResources).length === 0 ? (
            <div className="col-span-4 text-navy/50 text-center py-4">
              No resources stored
            </div>
          ) : (
            Object.entries(player.rawResources).map(([type, amount]) => (
              <div key={type} className="p-3 bg-navy/5 rounded-lg">
                <div className="font-semibold text-navy capitalize">{type.replace('_', ' ')}</div>
                <div className="text-lg font-bold text-navy">{amount.toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyDashboard;

