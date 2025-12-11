// Department Panel: Upgrade departments
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';
import { getDepartmentUpgradeCost } from '../operations/departments';
import { DepartmentType } from '../operations/departments';

const DepartmentPanel = () => {
  const { playerCompanyId, companies, upgradeDepartment } = useMmoStore();
  const player = playerCompanyId ? companies.find(c => c.id === playerCompanyId) : null;

  if (!player) return null;

  const departments: { type: DepartmentType; name: string }[] = [
    { type: 'legal', name: 'Legal' },
    { type: 'pr', name: 'Public Relations' },
    { type: 'rnd', name: 'Research & Development' },
    { type: 'logistics', name: 'Logistics' },
    { type: 'finance', name: 'Finance' },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map(dept => {
        const currentLevel = player.departments[dept.type] || 1;
        const cost = getDepartmentUpgradeCost(dept.type, currentLevel);
        const canAfford = player.capital >= cost;
        const isMaxLevel = currentLevel >= 10;

        return (
          <motion.div
            key={dept.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-navy/10"
          >
            <h4 className="font-bold text-navy mb-2">{dept.name}</h4>
            <div className="text-2xl font-bold text-gold mb-2">Level {currentLevel}</div>
            {!isMaxLevel && (
              <>
                <div className="text-sm text-navy/70 mb-3">
                  Upgrade cost: ${cost.toLocaleString()}
                </div>
                <button
                  onClick={() => upgradeDepartment(dept.type)}
                  disabled={!canAfford}
                  className={`
                    w-full px-4 py-2 rounded-lg font-semibold transition-all
                    ${canAfford
                      ? 'bg-gold text-navy hover:shadow-lg'
                      : 'bg-navy/20 text-navy/50 cursor-not-allowed'
                    }
                  `}
                >
                  Upgrade
                </button>
              </>
            )}
            {isMaxLevel && (
              <div className="text-sm text-gold font-semibold">Max Level</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default DepartmentPanel;

