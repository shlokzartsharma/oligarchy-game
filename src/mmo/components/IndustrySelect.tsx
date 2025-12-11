import { motion } from 'framer-motion';
import { industries } from '../data/industries';

interface IndustrySelectProps {
  onSelect: (industryId: string) => void;
  selectedIndustry?: string;
}

const IndustrySelect = ({ onSelect, selectedIndustry }: IndustrySelectProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {industries.map((industry) => (
        <motion.button
          key={industry.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(industry.id)}
          className={`
            p-6 rounded-xl border-2 transition-all
            ${
              selectedIndustry === industry.id
                ? 'border-gold bg-gold/10 shadow-lg'
                : 'border-navy/20 bg-white/50 hover:border-gold/50'
            }
          `}
        >
          <h3 className="text-xl font-bold text-navy mb-2">{industry.name}</h3>
          <p className="text-sm text-navy/70 mb-3">{industry.description}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-navy/60">Base Yield:</span>
              <span className="font-semibold text-soft-green">
                ${industry.baseYield.toLocaleString()}/cycle
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/60">Territory Multiplier:</span>
              <span className="font-semibold">{industry.territoryMultiplier}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/60">Risk:</span>
              <span
                className={`font-semibold ${
                  industry.riskLevel === 'low'
                    ? 'text-soft-green'
                    : industry.riskLevel === 'medium'
                    ? 'text-gold'
                    : 'text-soft-red'
                }`}
              >
                {industry.riskLevel.toUpperCase()}
              </span>
            </div>
            {industry.specialBonus && (
              <div className="mt-2 pt-2 border-t border-navy/10">
                <span className="text-gold font-semibold">✨ {industry.specialBonus}</span>
              </div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default IndustrySelect;

