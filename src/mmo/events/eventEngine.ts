// Event engine: Schedules and manages big cross-industry events
// Events cascade across multiple systems (government, media, sentiment, markets)

import { BigEvent, createBigEvent, MAJOR_EVENT_TEMPLATES } from './eventTypes';
import { randomChoice } from '../utils/random';

export interface EventEngineState {
  activeEvents: BigEvent[];
  lastEventTime: number;
  eventCooldown: number; // Minimum time between major events
  eventProbability: number; // Probability per check
  totalEventsThisSeason: number;
}

// Initialize event engine
export const createEventEngine = (): EventEngineState => {
  return {
    activeEvents: [],
    lastEventTime: Date.now(),
    eventCooldown: 60000, // 1 minute minimum between major events (reduced for Offworld-style loop)
    eventProbability: 0.15, // 15% chance per check
    totalEventsThisSeason: 0,
  };
};

// Check if a new event should trigger
export const shouldTriggerEvent = (engine: EventEngineState): boolean => {
  const now = Date.now();
  const timeSinceLastEvent = now - engine.lastEventTime;
  
  // Must wait for cooldown
  if (timeSinceLastEvent < engine.eventCooldown) {
    return false;
  }
  
  // Random chance
  return Math.random() < engine.eventProbability;
};

// Trigger a random major event
export const triggerRandomEvent = (engine: EventEngineState): {
  engine: EventEngineState;
  event: BigEvent | null;
} => {
  const eventTypes = Object.keys(MAJOR_EVENT_TEMPLATES);
  const eventType = randomChoice(eventTypes);
  
  // Determine severity (weighted toward high/critical for major events)
  const severityRoll = Math.random();
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'high';
  if (severityRoll < 0.1) severity = 'critical';
  else if (severityRoll < 0.4) severity = 'high';
  else if (severityRoll < 0.7) severity = 'medium';
  else severity = 'low';
  
  const event = createBigEvent(eventType, severity);
  
  if (!event) {
    return { engine, event: null };
  }
  
  return {
    engine: {
      ...engine,
      activeEvents: [...engine.activeEvents, event],
      lastEventTime: Date.now(),
      totalEventsThisSeason: engine.totalEventsThisSeason + 1,
    },
    event,
  };
};

// Update event engine (remove expired events)
export const updateEventEngine = (engine: EventEngineState): EventEngineState => {
  const now = Date.now();
  const activeEvents = engine.activeEvents.filter(e => now < e.expiresAt);
  
  return {
    ...engine,
    activeEvents,
  };
};

// Get active events by category
export const getActiveEventsByCategory = (
  engine: EventEngineState,
  category: BigEvent['category']
): BigEvent[] => {
  return engine.activeEvents.filter(e => e.category === category && Date.now() < e.expiresAt);
};

// Get most severe active event
export const getMostSevereEvent = (engine: EventEngineState): BigEvent | null => {
  const active = engine.activeEvents.filter(e => Date.now() < e.expiresAt);
  if (active.length === 0) return null;
  
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  active.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
  
  return active[0];
};

