// Diplomacy system: Invite, betray, leave alliances
// Handles alliance interactions and negotiations

import { Alliance, addAllianceMember, removeAllianceMember, updateLoyalty, shouldBetray } from './cartels';

export type DiplomacyAction = 
  | 'invite'
  | 'accept_invite'
  | 'reject_invite'
  | 'leave'
  | 'betray'
  | 'expel';

export interface DiplomacyEvent {
  id: string;
  type: DiplomacyAction;
  allianceId: string;
  fromId: string;
  toId: string;
  timestamp: number;
  result: 'success' | 'failed' | 'pending';
}

// Invite player/AI to alliance
export const inviteToAlliance = (
  alliance: Alliance,
  inviterId: string,
  targetId: string,
  targetName: string,
  isAI: boolean
): { alliance: Alliance; event: DiplomacyEvent } => {
  // Check if inviter is leader or member
  const inviter = alliance.members.find(m => m.id === inviterId);
  if (!inviter) {
    throw new Error('Only alliance members can invite');
  }

  // Check if target is already a member
  if (alliance.members.some(m => m.id === targetId)) {
    throw new Error('Target is already a member');
  }

  // For AI, auto-accept with some probability
  if (isAI) {
    const acceptProbability = 0.6; // 60% chance AI accepts
    if (Math.random() < acceptProbability) {
      const updatedAlliance = addAllianceMember(alliance, targetId, targetName, isAI);
      return {
        alliance: updatedAlliance,
        event: {
          id: `diplomacy-${Date.now()}`,
          type: 'accept_invite',
          allianceId: alliance.id,
          fromId: inviterId,
          toId: targetId,
          timestamp: Date.now(),
          result: 'success',
        },
      };
    }
  }

  // For players, return pending event (would need player confirmation in UI)
  return {
    alliance,
    event: {
      id: `diplomacy-${Date.now()}`,
      type: 'invite',
      allianceId: alliance.id,
      fromId: inviterId,
      toId: targetId,
      timestamp: Date.now(),
      result: 'pending',
    },
  };
};

// Accept alliance invite
export const acceptAllianceInvite = (
  alliance: Alliance,
  memberId: string,
  memberName: string,
  isAI: boolean
): Alliance => {
  return addAllianceMember(alliance, memberId, memberName, isAI);
};

// Leave alliance
export const leaveAlliance = (
  alliance: Alliance,
  memberId: string
): { alliance: Alliance; event: DiplomacyEvent } => {
  const updatedAlliance = removeAllianceMember(alliance, memberId);
  
  return {
    alliance: updatedAlliance,
    event: {
      id: `diplomacy-${Date.now()}`,
      type: 'leave',
      allianceId: alliance.id,
      fromId: memberId,
      toId: alliance.leaderId,
      timestamp: Date.now(),
      result: 'success',
    },
  };
};

// Betray alliance (steal resources and leave)
export const betrayAlliance = (
  alliance: Alliance,
  betrayerId: string
): { alliance: Alliance; stolenResources: Record<string, number>; event: DiplomacyEvent } => {
  const member = alliance.members.find(m => m.id === betrayerId);
  if (!member) {
    throw new Error('Member not found in alliance');
  }

  // Steal a portion of shared resources based on contribution
  const stealPercentage = Math.min(0.5, member.contribution / 10000); // Max 50%
  const stolenResources: Record<string, number> = {};
  
  Object.entries(alliance.sharedResources).forEach(([type, amount]) => {
    stolenResources[type] = Math.floor(amount * stealPercentage);
  });

  // Remove resources from alliance
  const updatedResources = { ...alliance.sharedResources };
  Object.entries(stolenResources).forEach(([type, amount]) => {
    updatedResources[type] = (updatedResources[type] || 0) - amount;
    if (updatedResources[type] <= 0) {
      delete updatedResources[type];
    }
  });

  const updatedAlliance = {
    ...removeAllianceMember(alliance, betrayerId),
    sharedResources: updatedResources,
  };

  return {
    alliance: updatedAlliance,
    stolenResources,
    event: {
      id: `diplomacy-${Date.now()}`,
      type: 'betray',
      allianceId: alliance.id,
      fromId: betrayerId,
      toId: alliance.leaderId,
      timestamp: Date.now(),
      result: 'success',
    },
  };
};

// Expel member from alliance (leader only)
export const expelFromAlliance = (
  alliance: Alliance,
  leaderId: string,
  targetId: string
): { alliance: Alliance; event: DiplomacyEvent } => {
  if (alliance.leaderId !== leaderId) {
    throw new Error('Only leader can expel members');
  }

  if (targetId === leaderId) {
    throw new Error('Leader cannot expel themselves');
  }

  const updatedAlliance = removeAllianceMember(alliance, targetId);

  return {
    alliance: updatedAlliance,
    event: {
      id: `diplomacy-${Date.now()}`,
      type: 'expel',
      allianceId: alliance.id,
      fromId: leaderId,
      toId: targetId,
      timestamp: Date.now(),
      result: 'success',
    },
  };
};

// Check for betrayals (called periodically)
export const checkAllianceBetrayals = (alliance: Alliance): {
  betrayals: string[];
  updatedAlliance: Alliance;
} => {
  const betrayals: string[] = [];
  let updatedAlliance = alliance;

  alliance.members.forEach(member => {
    if (shouldBetray(alliance, member.id)) {
      betrayals.push(member.id);
      // Auto-betray AI members
      if (member.isAI) {
        const result = betrayAlliance(updatedAlliance, member.id);
        updatedAlliance = result.alliance;
      }
    }
  });

  return {
    betrayals,
    updatedAlliance,
  };
};

