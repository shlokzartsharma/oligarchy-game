// Alliance Dashboard: Manage alliances, loyalty, betrayals
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';

const AllianceDashboard = () => {
  const { playerCompanyId, companies, alliances, formAlliance, leaveAlliance } = useMmoStore();
  const player = playerCompanyId ? companies.find(c => c.id === playerCompanyId) : null;
  const [allianceName, setAllianceName] = useState('');
  const currentAlliance = player?.allianceId 
    ? (alliances as any[]).find((a: any) => a.id === player.allianceId)
    : null;

  if (!player) return null;

  return (
    <div className="space-y-6">
      {currentAlliance ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-navy">{currentAlliance.name}</h3>
            <button
              onClick={() => leaveAlliance()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Leave Alliance
            </button>
          </div>
          
          <div className="mb-4">
            <div className="text-navy/70 mb-2">Members ({currentAlliance.members.length})</div>
            <div className="space-y-2">
              {(currentAlliance.members as any[]).map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-2 bg-navy/5 rounded">
                  <div>
                    <span className="font-semibold text-navy">{member.name}</span>
                    {member.isAI && <span className="text-sm text-navy/50 ml-2">(AI)</span>}
                  </div>
                  <div className="text-sm text-navy/70">
                    Loyalty: {currentAlliance.loyalty[member.id] || 50}/100
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-navy/5 rounded">
              <div className="text-navy/70 text-sm">Shared Resources</div>
              <div className="text-lg font-bold text-navy">
                {Object.keys(currentAlliance.sharedResources).length} types
              </div>
            </div>
            <div className="p-3 bg-navy/5 rounded">
              <div className="text-navy/70 text-sm">Lobbying Power</div>
              <div className="text-lg font-bold text-gold">{currentAlliance.lobbyingPower}</div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
        >
          <h3 className="text-2xl font-bold text-navy mb-4">Create Alliance</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={allianceName}
              onChange={(e) => setAllianceName(e.target.value)}
              placeholder="Alliance name"
              className="flex-1 p-2 border border-navy/20 rounded-lg"
            />
            <button
              onClick={() => {
                if (allianceName.trim()) {
                  formAlliance('', allianceName);
                  setAllianceName('');
                }
              }}
              className="px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:shadow-lg"
            >
              Create
            </button>
          </div>
        </motion.div>
      )}

      {/* Available Alliances */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
      >
        <h3 className="text-xl font-bold text-navy mb-4">Available Alliances</h3>
        {(alliances as any[]).filter((a: any) => a.id !== player.allianceId).length === 0 ? (
          <div className="text-navy/50 text-center py-4">No other alliances</div>
        ) : (
          <div className="space-y-2">
            {(alliances as any[])
              .filter((a: any) => a.id !== player.allianceId)
              .map((alliance: any) => (
                <div key={alliance.id} className="p-3 bg-navy/5 rounded">
                  <div className="font-semibold text-navy">{alliance.name}</div>
                  <div className="text-sm text-navy/70">
                    {alliance.members.length} members
                  </div>
                </div>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AllianceDashboard;

