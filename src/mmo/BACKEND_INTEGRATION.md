# Backend Integration Guide

This document outlines how to integrate the MMO systems with a backend (e.g., Supabase) for real multiplayer support.

## Architecture Overview

The current implementation is fully local/client-side. All systems are designed to be easily replaced with backend calls.

## Key Integration Points

### 1. State Management (`worldStore.ts`)

**Current**: Zustand with local persistence  
**Backend**: Supabase Realtime + RLS

- Replace `persist` middleware with Supabase realtime subscriptions
- Store player state in `players` table
- Store world state in `worlds` table (one per season/instance)
- Use Supabase channels for real-time updates

### 2. Market System (`economy/markets.ts`)

**Current**: Local price calculations  
**Backend**: Server-side price engine

- Move price calculations to Supabase Edge Functions or RPC
- Use Supabase realtime to broadcast price updates
- Store market state in `markets` table with JSONB columns

### 3. Event System (`events/eventEngine.ts`)

**Current**: Random local events  
**Backend**: Server-controlled events

- Move event scheduling to Supabase Edge Functions
- Use Supabase cron jobs for periodic events
- Store events in `world_events` table
- Broadcast events via Supabase channels

### 4. AI System (`ai/aiLogic.ts`)

**Current**: Client-side AI simulation  
**Backend**: Server-side AI

- Move AI logic to Supabase Edge Functions
- Run AI decisions server-side to prevent cheating
- Store AI state in `ai_companies` table

### 5. Trading System (`trading/tradingEngine.ts`)

**Current**: Local trade offers  
**Backend**: Supabase realtime trading

- Store trade offers in `trade_offers` table
- Use Supabase realtime for offer notifications
- Use Supabase RPC for trade execution (atomic operations)

### 6. Alliances (`alliances/cartels.ts`)

**Current**: Local alliance state  
**Backend**: Supabase tables + realtime

- Store alliances in `alliances` table
- Store members in `alliance_members` table
- Use Supabase realtime for alliance updates
- Use RLS policies for access control

### 7. News Feed (`news/newsFeed.ts`)

**Current**: Local news generation  
**Backend**: Supabase storage

- Store news items in `news_items` table
- Use Supabase realtime for live news updates
- Generate news server-side for consistency

## Database Schema (Supabase)

```sql
-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  capital BIGINT NOT NULL,
  -- ... other player fields
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worlds table (one per season)
CREATE TABLE worlds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_end_timestamp TIMESTAMPTZ NOT NULL,
  market_state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id),
  type TEXT NOT NULL,
  level INTEGER NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alliances table
CREATE TABLE alliances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  leader_id UUID REFERENCES players(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trade offers table
CREATE TABLE trade_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_id UUID REFERENCES players(id),
  to_id UUID REFERENCES players(id),
  offer JSONB NOT NULL,
  request JSONB NOT NULL,
  status TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Migration Steps

1. **Setup Supabase Project**
   - Create new Supabase project
   - Run schema migrations
   - Enable Row Level Security (RLS)

2. **Replace State Management**
   - Install `@supabase/supabase-js`
   - Replace Zustand persist with Supabase client
   - Add realtime subscriptions

3. **Move Logic to Backend**
   - Create Supabase Edge Functions for game logic
   - Move AI simulation to server
   - Move market calculations to server

4. **Add Realtime Features**
   - Subscribe to market updates
   - Subscribe to player updates
   - Subscribe to alliance changes

5. **Testing**
   - Test with multiple clients
   - Verify realtime updates work
   - Test edge cases (disconnections, etc.)

## Security Considerations

- Use RLS policies to prevent unauthorized access
- Validate all actions server-side
- Use Supabase Auth for player authentication
- Rate limit actions to prevent abuse
- Sanitize all user inputs

## Performance Optimization

- Use database indexes for frequent queries
- Cache market prices (update every 5 seconds)
- Batch updates when possible
- Use Supabase connection pooling
- Consider Redis for high-frequency data

