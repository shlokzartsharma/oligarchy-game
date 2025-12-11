// Alliance/Cartel system: Player-to-player and player-to-AI alliances
// Supports shared market manipulation, coordinated sabotage, pooled lobbying

export interface Alliance {
  id: string;
  name: string;
  leaderId: string; // Player who created the alliance
  members: AllianceMember[];
  createdAt: number;
  sharedResources: Record<string, number>; // Pooled resources
  marketManipulationPower: number; // Combined manipulation strength
  lobbyingPower: number; // Combined lobbying
  loyalty: Record<string, number>; // Member loyalty scores (0-100)
}

export interface AllianceMember {
  id: string; // Player or AI ID
  name: string;
  isAI: boolean;
  joinedAt: number;
  contribution: number; // Resources contributed
  betrayalRisk: number; // 0-1, likelihood to betray
}

// Create a new alliance
export const createAlliance = (leaderId: string, leaderName: string, allianceName: string): Alliance => {
  return {
    id: `alliance-${Date.now()}`,
    name: allianceName,
    leaderId,
    members: [{
      id: leaderId,
      name: leaderName,
      isAI: false,
      joinedAt: Date.now(),
      contribution: 0,
      betrayalRisk: 0.1, // Leader has low betrayal risk
    }],
    createdAt: Date.now(),
    sharedResources: {},
    marketManipulationPower: 0,
    lobbyingPower: 0,
    loyalty: {
      [leaderId]: 100,
    },
  };
};

// Add member to alliance
export const addAllianceMember = (
  alliance: Alliance,
  memberId: string,
  memberName: string,
  isAI: boolean
): Alliance => {
  const newMember: AllianceMember = {
    id: memberId,
    name: memberName,
    isAI,
    joinedAt: Date.now(),
    contribution: 0,
    betrayalRisk: isAI ? 0.3 : 0.2, // AI has higher betrayal risk
  };

  return {
    ...alliance,
    members: [...alliance.members, newMember],
    loyalty: {
      ...alliance.loyalty,
      [memberId]: 50, // Start at 50 loyalty
    },
  };
};

// Remove member from alliance (betrayal or leave)
export const removeAllianceMember = (alliance: Alliance, memberId: string): Alliance => {
  return {
    ...alliance,
    members: alliance.members.filter(m => m.id !== memberId),
    loyalty: Object.fromEntries(
      Object.entries(alliance.loyalty).filter(([id]) => id !== memberId)
    ),
  };
};

// Update member loyalty
export const updateLoyalty = (
  alliance: Alliance,
  memberId: string,
  change: number
): Alliance => {
  const currentLoyalty = alliance.loyalty[memberId] || 50;
  const newLoyalty = Math.max(0, Math.min(100, currentLoyalty + change));

  return {
    ...alliance,
    loyalty: {
      ...alliance.loyalty,
      [memberId]: newLoyalty,
    },
  };
};

// Check if member should betray
export const shouldBetray = (alliance: Alliance, memberId: string): boolean => {
  const member = alliance.members.find(m => m.id === memberId);
  if (!member) return false;

  const loyalty = alliance.loyalty[memberId] || 50;
  const betrayalChance = member.betrayalRisk * (1 - loyalty / 100);
  
  return Math.random() < betrayalChance;
};

// Contribute resources to alliance pool
export const contributeResources = (
  alliance: Alliance,
  memberId: string,
  resources: Record<string, number>
): Alliance => {
  const updatedResources = { ...alliance.sharedResources };
  
  Object.entries(resources).forEach(([type, amount]) => {
    updatedResources[type] = (updatedResources[type] || 0) + amount;
  });

  // Update member contribution
  const totalContribution = Object.values(resources).reduce((sum, val) => sum + val, 0);
  const updatedMembers = alliance.members.map(m =>
    m.id === memberId
      ? { ...m, contribution: m.contribution + totalContribution }
      : m
  );

  return {
    ...alliance,
    sharedResources: updatedResources,
    members: updatedMembers,
  };
};

// Use shared resources
export const useSharedResources = (
  alliance: Alliance,
  resources: Record<string, number>
): { alliance: Alliance; success: boolean } => {
  const updatedResources = { ...alliance.sharedResources };
  let success = true;

  // Check if enough resources
  Object.entries(resources).forEach(([type, amount]) => {
    if ((updatedResources[type] || 0) < amount) {
      success = false;
    }
  });

  if (!success) {
    return { alliance, success: false };
  }

  // Deduct resources
  Object.entries(resources).forEach(([type, amount]) => {
    updatedResources[type] = (updatedResources[type] || 0) - amount;
    if (updatedResources[type] <= 0) {
      delete updatedResources[type];
    }
  });

  return {
    alliance: {
      ...alliance,
      sharedResources: updatedResources,
    },
    success: true,
  };
};

