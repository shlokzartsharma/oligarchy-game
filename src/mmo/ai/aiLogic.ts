// AI decision engine: Makes decisions based on personality and game state
// Future: Can be extended with behavior trees, neural networks, etc.

import { EnhancedAICompany, AI_PERSONALITIES } from './competitors';
import { randomFloat } from '../utils/random';

export type AIAction = 
  | 'expand_territory'
  | 'build_asset'
  | 'manipulate_market'
  | 'sabotage_player'
  | 'form_alliance'
  | 'invest_department'
  | 'trade_resources'
  | 'idle';

export interface AIDecision {
  action: AIAction;
  targetId?: string;
  resourceType?: string;
  assetType?: string;
  department?: string;
  priority: number; // 0-1, higher = more likely to execute
}

// Calculate AI decision based on personality and game state
export const calculateAIDecision = (
  ai: EnhancedAICompany,
  _playerCapital: number,
  playerPower: number,
  availableTerritories: number,
  marketConditions: 'BULL' | 'STABLE' | 'BEAR'
): AIDecision => {
  const personality = AI_PERSONALITIES[ai.personality];
  const decisions: AIDecision[] = [];

  // Expansion decision
  if (availableTerritories > 0 && ai.capital > 50000) {
    const expansionPriority = personality.traits.expansionRate * 
      (1 - (ai.territoriesOwned.length / 10)); // Less priority if already expanded
    decisions.push({
      action: 'expand_territory',
      priority: expansionPriority,
    });
  }

  // Build asset decision
  if (ai.capital > 40000) {
    const buildPriority = personality.traits.riskTolerance * 0.7;
    decisions.push({
      action: 'build_asset',
      assetType: 'factory',
      priority: buildPriority,
    });
  }

  // Market manipulation decision
  if (ai.capital > 30000 && personality.traits.marketManipulation > 0.5) {
    const manipulationPriority = personality.traits.marketManipulation * 
      (marketConditions === 'BEAR' ? 0.8 : 0.5); // More likely in bear markets
    decisions.push({
      action: 'manipulate_market',
      resourceType: personality.traits.resourceFocus[0] || 'steel',
      priority: manipulationPriority,
    });
  }

  // Sabotage decision (if aggressive and player is threat)
  if (personality.traits.aggression > 0.6 && playerPower > ai.power * 0.8) {
    const sabotagePriority = personality.traits.aggression * 
      (playerPower / (ai.power + 1)); // Higher if player is stronger
    decisions.push({
      action: 'sabotage_player',
      targetId: 'player',
      priority: Math.min(0.9, sabotagePriority),
    });
  }

  // Department investment decision
  if (ai.capital > 20000) {
    const deptPriority = 0.4;
    decisions.push({
      action: 'invest_department',
      department: 'rnd',
      priority: deptPriority,
    });
  }

  // Default: idle
  decisions.push({
    action: 'idle',
    priority: 0.1,
  });

  // Select highest priority decision
  decisions.sort((a, b) => b.priority - a.priority);
  const selected = decisions[0];

  // Apply randomness (sometimes choose second best)
  if (decisions.length > 1 && randomFloat(0, 1) < 0.2) {
    return decisions[1];
  }

  return selected;
};

// Execute AI action (returns effects)
export const executeAIAction = (
  ai: EnhancedAICompany,
  decision: AIDecision
): {
  success: boolean;
  capitalChange: number;
  powerChange: number;
  effects: Record<string, any>;
} => {
  const effects: Record<string, any> = {};
  let capitalChange = 0;
  let powerChange = 0;
  let success = false;

  switch (decision.action) {
    case 'expand_territory':
      if (ai.capital > 50000) {
        capitalChange = -50000;
        powerChange = 10;
        success = true;
        effects.territoryExpanded = true;
      }
      break;

    case 'build_asset':
      if (ai.capital > 40000) {
        capitalChange = -40000;
        powerChange = 5;
        success = true;
        effects.assetBuilt = decision.assetType;
      }
      break;

    case 'manipulate_market':
      if (ai.capital > 30000) {
        capitalChange = -30000;
        success = true;
        effects.marketManipulated = decision.resourceType;
      }
      break;

    case 'sabotage_player':
      if (ai.capital > 25000) {
        capitalChange = -25000;
        powerChange = 5;
        success = true;
        effects.sabotageExecuted = true;
      }
      break;

    case 'invest_department':
      if (ai.capital > 20000) {
        capitalChange = -20000;
        success = true;
        effects.departmentUpgraded = decision.department;
      }
      break;

    case 'idle':
      success = true;
      break;

    default:
      success = false;
  }

  return {
    success,
    capitalChange,
    powerChange,
    effects,
  };
};

// Update AI company state after action
export const updateAIAfterAction = (
  ai: EnhancedAICompany,
  actionResult: ReturnType<typeof executeAIAction>
): EnhancedAICompany => {
  return {
    ...ai,
    capital: Math.max(0, ai.capital + actionResult.capitalChange),
    power: Math.max(0, ai.power + actionResult.powerChange),
    lastActionTime: Date.now(),
  };
};

