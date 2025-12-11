// Trading engine: Player-to-player and player-to-AI trading
// Supports resource trading, asset trading, and marketplace

import { ResourceType } from '../economy/resources';
import { randomFloat } from '../utils/random';

export type TradeType = 'resource' | 'asset' | 'capital';

export interface TradeOffer {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  type: TradeType;
  offer: {
    resources?: Record<ResourceType, number>;
    assets?: string[]; // Asset IDs
    capital?: number;
  };
  request: {
    resources?: Record<ResourceType, number>;
    assets?: string[];
    capital?: number;
  };
  expiresAt: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

// Create a trade offer
export const createTradeOffer = (
  fromId: string,
  fromName: string,
  toId: string,
  toName: string,
  offer: TradeOffer['offer'],
  request: TradeOffer['request'],
  duration: number = 60000 // 60 seconds default
): TradeOffer => {
  return {
    id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fromId,
    fromName,
    toId,
    toName,
    type: offer.capital ? 'capital' : offer.assets ? 'asset' : 'resource',
    offer,
    request,
    expiresAt: Date.now() + duration,
    status: 'pending',
  };
};

// Accept a trade offer
export const acceptTrade = (offer: TradeOffer): TradeOffer => {
  if (offer.status !== 'pending') {
    throw new Error('Trade offer is not pending');
  }

  if (Date.now() > offer.expiresAt) {
    return {
      ...offer,
      status: 'expired',
    };
  }

  return {
    ...offer,
    status: 'accepted',
  };
};

// Reject a trade offer
export const rejectTrade = (offer: TradeOffer): TradeOffer => {
  return {
    ...offer,
    status: 'rejected',
  };
};

// Check if trade is valid (both parties have required resources)
export const validateTrade = (
  offer: TradeOffer,
  fromInventory: { resources?: Record<string, number>; assets?: string[]; capital?: number },
  toInventory: { resources?: Record<string, number>; assets?: string[]; capital?: number }
): { valid: boolean; reason?: string } => {
  // Check offer resources
  if (offer.offer.resources) {
    Object.entries(offer.offer.resources).forEach(([type, amount]) => {
      const available = fromInventory.resources?.[type] || 0;
      if (available < amount) {
        return { valid: false, reason: `Insufficient ${type} in offer` };
      }
    });
  }

  // Check offer assets
  if (offer.offer.assets) {
    offer.offer.assets.forEach(assetId => {
      if (!fromInventory.assets?.includes(assetId)) {
        return { valid: false, reason: `Asset ${assetId} not owned` };
      }
    });
  }

  // Check offer capital
  if (offer.offer.capital && (fromInventory.capital || 0) < offer.offer.capital) {
    return { valid: false, reason: 'Insufficient capital in offer' };
  }

  // Check request resources
  if (offer.request.resources) {
    Object.entries(offer.request.resources).forEach(([type, amount]) => {
      const available = toInventory.resources?.[type] || 0;
      if (available < amount) {
        return { valid: false, reason: `Insufficient ${type} in request` };
      }
    });
  }

  // Check request assets
  if (offer.request.assets) {
    offer.request.assets.forEach(assetId => {
      if (!toInventory.assets?.includes(assetId)) {
        return { valid: false, reason: `Asset ${assetId} not owned by recipient` };
      }
    });
  }

  // Check request capital
  if (offer.request.capital && (toInventory.capital || 0) < offer.request.capital) {
    return { valid: false, reason: 'Insufficient capital in request' };
  }

  return { valid: true };
};

// Execute trade (transfer resources/assets/capital)
export const executeTrade = (offer: TradeOffer): {
  fromChanges: { resources?: Record<string, number>; assets?: string[]; capital?: number };
  toChanges: { resources?: Record<string, number>; assets?: string[]; capital?: number };
} => {
  if (offer.status !== 'accepted') {
    throw new Error('Trade must be accepted before execution');
  }

  const fromChanges: any = {};
  const toChanges: any = {};

  // Transfer offer resources
  if (offer.offer.resources) {
    fromChanges.resources = {};
    toChanges.resources = {};
    Object.entries(offer.offer.resources).forEach(([type, amount]) => {
      fromChanges.resources[type] = -amount;
      toChanges.resources[type] = amount;
    });
  }

  // Transfer request resources
  if (offer.request.resources) {
    if (!fromChanges.resources) fromChanges.resources = {};
    if (!toChanges.resources) toChanges.resources = {};
    Object.entries(offer.request.resources).forEach(([type, amount]) => {
      fromChanges.resources[type] = (fromChanges.resources[type] || 0) + amount;
      toChanges.resources[type] = (toChanges.resources[type] || 0) - amount;
    });
  }

  // Transfer assets
  if (offer.offer.assets) {
    fromChanges.assets = offer.offer.assets.map(id => `-${id}`); // Negative indicates removal
    toChanges.assets = offer.offer.assets;
  }

  if (offer.request.assets) {
    if (!fromChanges.assets) fromChanges.assets = [];
    if (!toChanges.assets) toChanges.assets = [];
    fromChanges.assets.push(...offer.request.assets);
    toChanges.assets.push(...offer.request.assets.map(id => `-${id}`));
  }

  // Transfer capital
  if (offer.offer.capital) {
    fromChanges.capital = -offer.offer.capital;
    toChanges.capital = offer.offer.capital;
  }

  if (offer.request.capital) {
    fromChanges.capital = (fromChanges.capital || 0) + offer.request.capital;
    toChanges.capital = (toChanges.capital || 0) - offer.request.capital;
  }

  return { fromChanges, toChanges };
};

// Clean expired trades
export const cleanExpiredTrades = (offers: TradeOffer[]): TradeOffer[] => {
  const now = Date.now();
  return offers.map(offer => {
    if (offer.status === 'pending' && now > offer.expiresAt) {
      return { ...offer, status: 'expired' };
    }
    return offer;
  });
};

