import { Industry } from '../types';

// Industries are now meaningfully different with unique mechanics
export const industries: Industry[] = [
  {
    id: 'tech',
    name: 'Technology',
    description: 'High innovation, volatile markets. Vulnerable to regulation and obsolescence, but can disrupt other industries.',
    baseYield: 6000,
    territoryMultiplier: 1.3,
    riskLevel: 'high',
    specialBonus: 'R&D 30% more effective, can short other companies, vulnerable to antitrust',
  },
  {
    id: 'energy',
    name: 'Energy',
    description: 'Critical infrastructure. Profits from supply shocks, vulnerable to environmental regulation and public sentiment.',
    baseYield: 5000,
    territoryMultiplier: 1.5,
    riskLevel: 'medium',
    specialBonus: 'Territory costs -20%, profits from oil shocks, vulnerable to green policies',
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    description: 'Essential and stable. Weather-dependent, resistant to economic cycles, vulnerable to climate events.',
    baseYield: 3000,
    territoryMultiplier: 0.9,
    riskLevel: 'low',
    specialBonus: 'Recession-resistant, vulnerable to droughts/floods, low regulatory risk',
  },
  {
    id: 'media',
    name: 'Media',
    description: 'Influence and narrative control. Can manipulate public sentiment and government policy through PR campaigns.',
    baseYield: 4000,
    territoryMultiplier: 1.1,
    riskLevel: 'medium',
    specialBonus: 'PR campaigns 50% more effective, can frame events, vulnerable to trust crises',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Capital markets and banking. Can short companies, profit from volatility, but vulnerable to regulation.',
    baseYield: 5500,
    territoryMultiplier: 1.2,
    riskLevel: 'high',
    specialBonus: 'Can short other companies, profit from market crashes, vulnerable to financial regulation',
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Consumer goods and distribution. Stable margins, vulnerable to supply chain disruptions and consumer sentiment.',
    baseYield: 3500,
    territoryMultiplier: 1.0,
    riskLevel: 'low',
    specialBonus: 'Stable revenue, vulnerable to logistics shocks, benefits from consumer confidence',
  },
];

export const getIndustryById = (id: string): Industry | undefined => {
  return industries.find(ind => ind.id === id);
};

