// Central manager for subsystems
// This coordinates all the different game systems and ensures they work together
// 
// BACKEND INTEGRATION NOTES:
// - This store is designed to be easily replaced with backend calls
// - For Supabase integration:
//   1. Replace createSystemsState() with a fetch from Supabase realtime subscriptions
//   2. Replace updateSystems() with a Supabase RPC call or realtime update handler
//   3. Add optimistic updates for better UX
//   4. Use Supabase channels for real-time market price updates
//   5. Store market state in a 'systems' table with JSONB columns
//   6. Use Supabase triggers to update prices based on supply/demand calculations

import { MarketState, createInitialMarketState, updateMarketPrices, cleanExpiredManipulations } from '../economy/markets';
import { EventEngineState, createEventEngine, updateEventEngine, triggerRandomEvent } from '../events/eventEngine';
import { NewsFeedState, createNewsFeed, addNewsItem } from '../news/newsFeed';
import { ResourceType } from '../economy/resources';

export interface SystemsState {
  market: MarketState;
  eventEngine: EventEngineState;
  newsFeed: NewsFeedState;
  lastUpdate: number;
  updateInterval: number; // milliseconds
}

// Initialize all systems
export const createSystemsState = (): SystemsState => {
  return {
    market: createInitialMarketState(),
    eventEngine: createEventEngine(),
    newsFeed: createNewsFeed(50),
    lastUpdate: Date.now(),
    updateInterval: 5000, // Update every 5 seconds
  };
};

// Update all systems (called periodically)
export const updateSystems = (
  state: SystemsState,
  _availableTerritories?: string[],
  _availableResources?: ResourceType[]
): SystemsState => {
  const now = Date.now();

  // Update market prices
  let updatedMarket = cleanExpiredManipulations(state.market);
  updatedMarket = updateMarketPrices(updatedMarket);

  // Update event engine
  let updatedEventEngine = updateEventEngine(state.eventEngine);
  
  // Check for new events
  if (shouldTriggerEvent(updatedEventEngine)) {
    const eventResult = triggerRandomEvent(updatedEventEngine);
    updatedEventEngine = eventResult.engine;
  }

  return {
    ...state,
    market: updatedMarket,
    eventEngine: updatedEventEngine,
    lastUpdate: now,
  };
};

// Helper to check if event should trigger (from eventEngine)
const shouldTriggerEvent = (engine: EventEngineState): boolean => {
  const now = Date.now();
  const timeSinceLastEvent = now - engine.lastEventTime;
  
  if (timeSinceLastEvent < engine.eventCooldown) {
    return false;
  }
  
  return Math.random() < engine.eventProbability;
};

// Get market price for a resource
export const getMarketPrice = (state: SystemsState, resourceType: ResourceType): number => {
  return state.market.prices[resourceType]?.currentPrice || 0;
};

// Get active events
export const getActiveEvents = (state: SystemsState) => {
  return state.eventEngine.activeEvents.filter((e: any) => Date.now() < e.expiresAt);
};

// Add news item
export const addNews = (state: SystemsState, newsItem: any): SystemsState => {
  return {
    ...state,
    newsFeed: addNewsItem(state.newsFeed, newsItem),
  };
};

