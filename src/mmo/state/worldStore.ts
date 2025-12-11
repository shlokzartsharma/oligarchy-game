// MMO World Store - Central game orchestrator
// This is the main game loop that coordinates all systems

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company, createCompany, buyShares as buySharesFn, updateSharePrice, getOwnershipPercentage, executeBuyout } from '../economy/companies';
import { MarketState, createInitialMarketState, updateMarketPrices, cleanExpiredManipulations, getPrice, updateSupplyDemand } from '../economy/markets';
import { Asset, AssetType, createAsset as createAssetHelper, getBuildCost, getUpgradeCost, getUpkeepCost, getProductionPerTick, ASSET_DEFINITIONS } from '../economy/assets';
import { ResourceType, getAllResourceTypes } from '../economy/resources';
import { BigEvent } from '../events/eventTypes';
import { EventEngineState, createEventEngine, updateEventEngine, shouldTriggerEvent, triggerRandomEvent } from '../events/eventEngine';
import { NewsFeedState, createNewsFeed, addNewsItem, ensureNewsfeedNotEmpty, generateCrisisNews, generatePlayerActionNews, generateAIActionNews, generateTakeoverNews } from '../news/newsFeed';
import { GovernmentState, createGovernmentState, getEffectiveTaxRate, startInvestigation } from '../politics/governmentStore';
import { MediaState, createMediaState, frameEvent } from '../media/mediaStore';
import { PeopleState, createPeopleState, updateSentiment, updateRetailInvestors, getSentimentReputationImpact } from '../people/peopleStore';
import { rankCompaniesByNCP, CompanyRanking } from '../economy/scoring';
import { industries } from '../data/industries';
import { randomChoice } from '../utils/random';
import { decideAIAction, executeAIDecision } from '../ai/aiAssetLogic';

const SEASON_DURATION_MS = 20 * 60 * 1000; // 20 minutes for testing (can be adjusted)
const TICK_INTERVAL_MS = 1000; // 1 second per tick
const REACTION_WINDOW_TICKS = 30; // 30 seconds for reaction phase
const MAX_ACTION_POINTS = 3; // Actions per reaction phase
const DISTRESS_THRESHOLD_CASH = 0; // Cash threshold for distress
const DISTRESS_THRESHOLD_TICKS = 60; // Ticks before bankruptcy
const EVENT_COOLDOWN_MS = 60000; // 1 minute minimum between events

// Helper: Get starting assets for an industry
const getStartingAssetsForIndustry = (industry: string): AssetType[] => {
  const baseAssets: Record<string, AssetType[]> = {
    tech: ['data_center', 'factory'],
    energy: ['refinery', 'mine'],
    agriculture: ['farm'],
    media: ['media_network'],
    finance: ['data_center'],
    retail: ['factory'],
  };
  
  return baseAssets[industry] || ['factory'];
};

type GamePhase = 'calm' | 'shock' | 'reaction' | 'resolution';

interface WorldStore {
  // Core state
  companies: Company[];
  playerCompanyId: string | null;
  assets: Asset[]; // All assets in the world
  
  // Market state
  marketState: MarketState;
  
  // Production state (embedded in companies)
  
  // Supporting systems
  governmentState: GovernmentState;
  mediaState: MediaState;
  peopleState: PeopleState;
  
  // Events
  currentEvents: BigEvent[];
  activeBreakingEvent: BigEvent | null;
  isBreakingEventActive: boolean;
  eventEngine: EventEngineState;
  
  // News
  newsFeed: NewsFeedState;
  
  // Season management
  seasonEndTimestamp: number | null;
  lastTickTimestamp: number | null;
  seasonEnded: boolean;
  seasonResults: { rankings: CompanyRanking[] } | null;
  
  // Game loop
  gameLoopInterval: ReturnType<typeof setInterval> | null;
  gameStarted: boolean; // Whether the game has been started

  // Offworld-style loop state
  phase: GamePhase;
  lastEventTimestamp: number | null;
  currentEventId: string | null;
  reactionTicksRemaining: number;
  playerActionPoints: number;
  maxActionPoints: number;
  distressedCompanies: string[];
  companyDistressTicks: Record<string, number>; // companyId -> ticks distressed

  // Actions
  initializeWorld: (options?: { industry?: string; difficulty?: string; playerName?: string }) => void;
  tick: (deltaMs: number) => void;
  startGameLoop: () => void;
  stopGameLoop: () => void;
  
  // Phase management
  enterShockPhase: (event: BigEvent) => void;
  enterReactionPhase: () => void;
  enterResolutionPhase: () => void;
  spendPlayerActionPoint: () => boolean;
  markCompanyDistressed: (companyId: string) => void;
  clearDistressedCompanies: () => void;
  
  // Asset actions (PRIMARY PLAYER ACTIONS)
  buildAsset: (assetType: AssetType, level?: number) => boolean;
  upgradeAsset: (assetId: string) => boolean;
  shutdownAsset: (assetId: string) => boolean;
  
  // Debt/leverage actions
  takeLoan: (amount: number) => boolean;
  repayLoan: (amount: number) => boolean;
  
  // Trading actions
  buyShares: (targetCompanyId: string, amount: number) => boolean;
  sellShares: (targetCompanyId: string, amount: number) => boolean;
  
  // Buyout
  attemptBuyout: (targetCompanyId: string) => boolean;
  
  // Event handling
  respondToEventChoice: (eventId: string, choiceId: string) => void;
  dismissBreakingEvent: () => void;
  
  // Computed properties - these should be computed by components from companies/playerCompanyId
  // But we include them here for backward compatibility with existing code
  player: Company | null;
  aiCompanies: Company[];
  systems: any; // SystemsState from systemsStore
  tradeOffers: any[];
  alliances: any[];
  // world: any; // Removed - use get() to access store
  
  // Additional methods
  tradeResource: (resourceType: ResourceType, amount: number, targetCompanyId?: string) => boolean;
  respondToCrisis: (eventId: string, choiceId: string) => void;
  formAlliance: (targetCompanyId?: string, allianceName?: string) => boolean;
  leaveAlliance: (allianceId?: string) => boolean;
  upgradeDepartment: (departmentId: string) => boolean;
  buyResource: (resourceType: ResourceType, amount: number) => boolean;
  updateSystems: () => void;
  expandTerritory: (territoryId: string) => boolean;
  undercutCompetitor: (targetCompanyId: string) => boolean;
  investInRD: (amount: number) => boolean;
  tickRevenue: () => void;
  endSeason: () => void;
}

export const useWorldStore = create<WorldStore>()(
  persist(
    (set, get) => ({
      companies: [],
      playerCompanyId: null,
      assets: [],
      marketState: createInitialMarketState(),
      governmentState: createGovernmentState(),
      mediaState: createMediaState(),
      peopleState: createPeopleState(),
      currentEvents: [],
      activeBreakingEvent: null,
      isBreakingEventActive: false,
      eventEngine: createEventEngine(),
      newsFeed: createNewsFeed(100),
      seasonEndTimestamp: null,
      lastTickTimestamp: null,
      seasonEnded: false,
      seasonResults: null,
      gameLoopInterval: null,
      gameStarted: false,
      phase: 'calm',
      lastEventTimestamp: null,
      currentEventId: null,
      reactionTicksRemaining: 0,
      playerActionPoints: 0,
      maxActionPoints: MAX_ACTION_POINTS,
      distressedCompanies: [],
      companyDistressTicks: {},

      initializeWorld: (options = {}) => {
        console.log('[worldStore] initializeWorld called with options:', options);
        const { industry = 'tech', playerName = 'Player' } = options;
        
        // Everyone starts with the same capital (100K base)
        const startingCash = 100000;
        console.log('[worldStore] Creating player company:', { playerName, industry, startingCash });
        const playerCompany = createCompany('player', playerName, industry, 'player', true, startingCash);
        console.log('[worldStore] Player company created:', playerCompany);
        
        // Create AI companies - all start with same capital
        const aiCompanies: Company[] = [];
        const industryIds = industries.map(ind => ind.id);
        console.log('[worldStore] Creating AI companies, industryIds:', industryIds);
        
        for (let i = 0; i < 5; i++) {
          const aiIndustry = randomChoice(industryIds);
          const aiName = `Corp ${String.fromCharCode(65 + i)}`;
          
          const aiCompany = createCompany(
            `ai-${i}`,
            aiName,
            aiIndustry,
            `ai-${i}`,
            false,
            startingCash // Same starting capital as player
          );
          
          aiCompanies.push(aiCompany);
        }
        
        console.log('[worldStore] Created', aiCompanies.length, 'AI companies');
        
        // Create assets for all companies
        const allCompanies = [playerCompany, ...aiCompanies];
        const allAssets: Asset[] = [];
        const companiesWithAssets = allCompanies.map(company => {
          const assetTypes = getStartingAssetsForIndustry(company.industry);
          const companyAssets: Asset[] = [];
          
          assetTypes.forEach(assetType => {
            const asset = createAssetHelper(assetType, company.id, 1, 1.0);
            companyAssets.push(asset);
            allAssets.push(asset);
          });
          
          return {
            ...company,
            assets: companyAssets.map(a => a.id),
          };
        });
        
        console.log('[worldStore] Created', allAssets.length, 'assets');
        
        // Initialize all systems
        const now = Date.now();
        const eventEngine = createEventEngine();
        eventEngine.eventCooldown = EVENT_COOLDOWN_MS; // Use shorter cooldown
        console.log('[worldStore] Initializing systems...');
        
        const newState = {
          companies: companiesWithAssets,
          playerCompanyId: 'player',
          assets: allAssets,
          marketState: createInitialMarketState(),
          governmentState: createGovernmentState(),
          mediaState: createMediaState(),
          peopleState: createPeopleState(),
          currentEvents: [],
          activeBreakingEvent: null,
          isBreakingEventActive: false,
          eventEngine,
          newsFeed: createNewsFeed(100),
          seasonEndTimestamp: now + SEASON_DURATION_MS,
          lastTickTimestamp: null,
          seasonEnded: false,
          seasonResults: null,
          gameLoopInterval: null,
          gameStarted: false, // Reset game started state
          phase: 'calm' as GamePhase,
          lastEventTimestamp: null,
          currentEventId: null,
          reactionTicksRemaining: 0,
          playerActionPoints: 0,
          maxActionPoints: MAX_ACTION_POINTS,
          distressedCompanies: [],
          companyDistressTicks: {},
          // Computed properties
          player: playerCompany,
          aiCompanies: aiCompanies,
          systems: {
            market: createInitialMarketState(),
            eventEngine,
            newsFeed: createNewsFeed(100),
            lastUpdate: now,
            updateInterval: 5000,
          },
          tradeOffers: [],
          alliances: [],
          // world: {} as any, // Removed
        };
        
        console.log('[worldStore] Setting state with', newState.companies.length, 'companies');
        set(newState);
        console.log('[worldStore] State set, companies:', get().companies.length);
      },

      enterShockPhase: (event: BigEvent) => {
        set({
          phase: 'shock',
          currentEventId: event.id,
          lastEventTimestamp: Date.now(),
          activeBreakingEvent: event,
          isBreakingEventActive: true,
          reactionTicksRemaining: REACTION_WINDOW_TICKS,
          playerActionPoints: MAX_ACTION_POINTS,
        });
      },

      enterReactionPhase: () => {
        set({
          phase: 'reaction',
          isBreakingEventActive: false,
          activeBreakingEvent: null,
        });
      },

      enterResolutionPhase: () => {
        set({
          phase: 'resolution',
          reactionTicksRemaining: 0,
          playerActionPoints: 0,
        });
        
        // After a brief resolution period, return to calm
        setTimeout(() => {
          const state = get();
          if (state.phase === 'resolution') {
            set({
              phase: 'calm',
              currentEventId: null,
            });
          }
        }, 5000); // 5 second resolution period
      },

      spendPlayerActionPoint: () => {
        const state = get();
        if (state.phase !== 'reaction' || state.playerActionPoints <= 0) {
          return false;
        }
        set({ playerActionPoints: state.playerActionPoints - 1 });
        return true;
      },

      markCompanyDistressed: (companyId: string) => {
        const state = get();
        if (!state.distressedCompanies.includes(companyId)) {
          set({
            distressedCompanies: [...state.distressedCompanies, companyId],
            companyDistressTicks: {
              ...state.companyDistressTicks,
              [companyId]: 0,
            },
          });
        }
      },

      clearDistressedCompanies: () => {
        set({
          distressedCompanies: [],
          companyDistressTicks: {},
        });
      },

      tick: (_deltaMs: number) => {
        const state = get();
        if (state.seasonEnded) return;

        const now = Date.now();
        let updatedCompanies = [...state.companies];
        let updatedAssets = [...state.assets];
        let updatedMarket = { ...state.marketState };
        let updatedGovernment = { ...state.governmentState };
        let updatedMedia = { ...state.mediaState };
        let updatedPeople = { ...state.peopleState };
        let updatedEventEngine = updateEventEngine(state.eventEngine);
        let updatedNewsFeed = { ...state.newsFeed };
        let updatedDistressedCompanies = [...state.distressedCompanies];
        let updatedDistressTicks = { ...state.companyDistressTicks };
        
        // ===== PHASE 1: AUTO-PRODUCTION & AUTO-SELL (CORE LOOP) =====
        // For each company: produce from assets, immediately sell at market price, subtract upkeep
        const totalProductionByResource: Record<string, number> = {};
        getAllResourceTypes().forEach(type => {
          totalProductionByResource[type] = 0;
        });
        
        // Get current market prices
        const marketPrices: Record<ResourceType, number> = {} as any;
        getAllResourceTypes().forEach(type => {
          marketPrices[type] = getPrice(updatedMarket, type);
        });
        
        updatedCompanies = updatedCompanies.map(company => {
          const companyAssets = updatedAssets.filter(a => company.assets.includes(a.id));
          
          let totalRevenue = 0;
          let totalUpkeep = 0;
          
          // For each asset: produce and immediately sell
          companyAssets.forEach(asset => {
            if (!asset) return;
            
            // Calculate production (handle both old and new asset formats)
            const production = asset.productionPerTick || (asset as any).productionRate || {};
            
            // Calculate revenue from positive production (resources produced)
            if (production && typeof production === 'object') {
              Object.entries(production).forEach(([type, amount]) => {
                if (amount && typeof amount === 'number' && amount > 0) {
                  const price = marketPrices[type as ResourceType] || 0;
                  totalRevenue += amount * price;
                  totalProductionByResource[type] = (totalProductionByResource[type] || 0) + amount;
                }
              });
            }
            
            // Add upkeep cost
            totalUpkeep += asset.upkeepCost || (asset as any).maintenanceCost || 0;
          });
          
          // Apply debt interest (per tick: annual rate / ticks per year)
          const ticksPerYear = 31536000 / TICK_INTERVAL_MS; // ~31.5M ticks per year
          const interestPayment = company.debt * (company.interestRate / ticksPerYear);
          
          // Net cash flow: revenue - upkeep - interest
          const netCashFlow = totalRevenue - totalUpkeep - interestPayment;
          const newCash = Math.max(0, company.cash + netCashFlow);
          const newDebt = company.debt + (interestPayment > company.cash ? interestPayment - company.cash : 0); // Debt increases if can't pay interest
          
          // Check for distress
          if (newCash <= DISTRESS_THRESHOLD_CASH || (company.debt > 0 && company.debt > company.cash * 2)) {
            if (!updatedDistressedCompanies.includes(company.id)) {
              updatedDistressedCompanies.push(company.id);
              updatedDistressTicks[company.id] = 0;
            }
            updatedDistressTicks[company.id] = (updatedDistressTicks[company.id] || 0) + 1;
          } else {
            // Remove from distress if recovered
            const distressIndex = updatedDistressedCompanies.indexOf(company.id);
            if (distressIndex >= 0) {
              updatedDistressedCompanies.splice(distressIndex, 1);
              delete updatedDistressTicks[company.id];
            }
          }
          
          return {
            ...company,
            cash: newCash,
            debt: newDebt,
            lastUpdate: now,
          };
        });
        
        // Update market supply based on total production
        getAllResourceTypes().forEach(resourceType => {
          const supplyDelta = totalProductionByResource[resourceType] || 0;
          updatedMarket = updateSupplyDemand(updatedMarket, resourceType as ResourceType, supplyDelta, 0);
        });
        
        // ===== PHASE 2: MARKET UPDATES =====
        updatedMarket = cleanExpiredManipulations(updatedMarket);
        updatedMarket = updateMarketPrices(updatedMarket);
        
        // ===== PHASE 3: EVENT TRIGGERING (only in calm/resolution) =====
        if ((state.phase === 'calm' || state.phase === 'resolution') && shouldTriggerEvent(updatedEventEngine)) {
          const result = triggerRandomEvent(updatedEventEngine);
          if (result.event) {
            updatedEventEngine = result.engine;
            const event = result.event;
            
            // Apply cascading event effects
            // Industry impacts
            updatedCompanies = updatedCompanies.map(company => {
              if (event.effects.industryImpacts?.[company.industry]) {
                const impact = event.effects.industryImpacts[company.industry];
                const revenueChange = (impact.revenueMultiplier || 1.0) - 1.0;
                const updatedCompany = updateSharePrice(company, {
                  revenueChange,
                  eventImpact: impact.reputationChange ? impact.reputationChange / 100 : 0,
                });
                return {
                  ...updatedCompany,
                  reputation: Math.max(0, Math.min(100, company.reputation + (impact.reputationChange || 0))),
                };
              }
              return company;
            });
            
            // Apply asset efficiency changes (PRIMARY EVENT EFFECT)
            if (event.effects.assetEfficiencyChanges) {
              updatedAssets = state.assets.map(asset => {
                const efficiencyChange = event.effects.assetEfficiencyChanges?.[asset.type];
                if (efficiencyChange) {
                  const newEfficiency = asset.efficiencyMultiplier * efficiencyChange;
                  return {
                    ...asset,
                    efficiencyMultiplier: newEfficiency,
                    productionPerTick: getProductionPerTick(asset.type, asset.level, newEfficiency),
                  };
                }
                return asset;
              });
            }
            
            // Apply asset upkeep changes
            if (event.effects.assetUpkeepChanges) {
              updatedAssets = (updatedAssets || state.assets).map(asset => {
                const upkeepChange = event.effects.assetUpkeepChanges?.[asset.type];
                if (upkeepChange) {
                  return {
                    ...asset,
                    upkeepCost: Math.round(asset.upkeepCost * upkeepChange),
                  };
                }
                return asset;
              });
            }
            
            // Apply interest rate changes
            if (event.effects.interestRateChange) {
              updatedCompanies = updatedCompanies.map(company => ({
                ...company,
                interestRate: company.interestRate * event.effects.interestRateChange!,
              }));
            }
            
            // Resource price changes
            if (event.effects.resourcePriceChanges) {
              Object.entries(event.effects.resourcePriceChanges).forEach(([resourceType, percentageChange]) => {
                const demandDelta = percentageChange > 0 ? 1000 : -1000;
                updatedMarket = updateSupplyDemand(updatedMarket, resourceType as ResourceType, 0, demandDelta);
              });
            }
            
            // Government effects
            if (event.effects.governmentReaction) {
              if (event.effects.governmentReaction.factionShift) {
                updatedGovernment = {
                  ...updatedGovernment,
                  faction: event.effects.governmentReaction.factionShift,
                };
              }
              if (event.effects.governmentReaction.investigationTargets) {
                event.effects.governmentReaction.investigationTargets.forEach(targetId => {
                  updatedGovernment = startInvestigation(updatedGovernment, targetId, 'antitrust', 'medium');
                });
              }
            }
            
            // Sentiment effects
            if (event.effects.sentimentChanges) {
              const factors: Parameters<typeof updateSentiment>[1] = {};
              if (event.effects.sentimentChanges.trustInCorporations) {
                factors.corporateScandal = event.effects.sentimentChanges.trustInCorporations < 0;
                factors.economicBoom = event.effects.sentimentChanges.trustInCorporations > 0;
              }
              if (event.effects.sentimentChanges.environmentalConcern) {
                factors.environmentalDisaster = event.effects.sentimentChanges.environmentalConcern > 0;
              }
              if (event.effects.sentimentChanges.economicOptimism) {
                factors.economicCrisis = event.effects.sentimentChanges.economicOptimism < 0;
                factors.economicBoom = event.effects.sentimentChanges.economicOptimism > 0;
              }
              updatedPeople = updateSentiment(updatedPeople, factors);
            }
            
            // Retail investor effects
            if (event.effects.retailInvestorReaction) {
              const factors: Parameters<typeof updateRetailInvestors>[1] = {};
              if (event.effects.retailInvestorReaction.riskAppetiteChange) {
                factors.marketCrash = event.effects.retailInvestorReaction.riskAppetiteChange < 0;
                factors.marketBoom = event.effects.retailInvestorReaction.riskAppetiteChange > 0;
              }
              updatedPeople = updateRetailInvestors(updatedPeople, factors);
            }
            
            // Media framing
            if (event.effects.mediaNarratives && event.effects.mediaNarratives.length > 0) {
              const narrative = event.effects.mediaNarratives[0];
              updatedMedia = frameEvent(updatedMedia, event.id, narrative.frame, narrative.outlets);
            }
            
            // Add event and news
            const newEvents = [...state.currentEvents, event];
            updatedNewsFeed = addNewsItem(updatedNewsFeed, generateCrisisNews(event.title, event.description, event.severity));
            
            // Enter shock phase
            get().enterShockPhase(event);
            
            set({
              companies: updatedCompanies,
              assets: updatedAssets,
              marketState: updatedMarket,
              governmentState: updatedGovernment,
              mediaState: updatedMedia,
              peopleState: updatedPeople,
              currentEvents: newEvents,
              eventEngine: updatedEventEngine,
              newsFeed: updatedNewsFeed,
              distressedCompanies: updatedDistressedCompanies,
              companyDistressTicks: updatedDistressTicks,
              lastTickTimestamp: now,
            });
            
            return; // Early return after shock
          }
        }
        
        // ===== PHASE 4: AI ACTIONS (every tick, not just reaction) =====
        // AI companies build, upgrade, take loans, shutdown assets
        if (Math.random() < 0.1) { // 10% chance per tick for AI to act
          updatedCompanies.forEach((company, index) => {
            if (!company.isPlayer) {
              const decision = decideAIAction(company, updatedAssets, updatedMarket, updatedDistressedCompanies, state.phase);
              const result = executeAIDecision(decision, company, updatedAssets);
              
              if (result.success) {
                // Apply decision results
                if (result.assetToBuild) {
                  // Build asset
                  const asset = createAssetHelper(result.assetToBuild, company.id, 1, 1.0);
                  updatedAssets.push(asset);
                  updatedCompanies[index] = {
                    ...company,
                    cash: result.newCash || company.cash,
                    assets: [...company.assets, asset.id],
                  };
                  updatedNewsFeed = addNewsItem(updatedNewsFeed, generateAIActionNews(
                    company.name,
                    `built a new ${ASSET_DEFINITIONS[result.assetToBuild].name}`,
                    { aiId: company.id }
                  ));
                } else if (result.assetToUpgrade) {
                  // Upgrade asset
                  const assetIndex = updatedAssets.findIndex(a => a.id === result.assetToUpgrade);
                  if (assetIndex >= 0) {
                    const asset = updatedAssets[assetIndex];
                    const newLevel = asset.level + 1;
                    updatedAssets[assetIndex] = {
                      ...asset,
                      level: newLevel,
                      upkeepCost: getUpkeepCost(asset.type, newLevel),
                      productionPerTick: getProductionPerTick(asset.type, newLevel, asset.efficiencyMultiplier),
                    };
                    updatedCompanies[index] = {
                      ...company,
                      cash: result.newCash || company.cash,
                    };
                  }
                } else if (result.assetToShutdown) {
                  // Shutdown asset
                  updatedAssets = updatedAssets.filter(a => a.id !== result.assetToShutdown);
                  updatedCompanies[index] = {
                    ...company,
                    assets: company.assets.filter(id => id !== result.assetToShutdown),
                  };
                } else if (result.loanAmount) {
                  // Take loan
                  updatedCompanies[index] = {
                    ...company,
                    cash: result.newCash || company.cash,
                    debt: result.newDebt || company.debt,
                  };
                }
              }
            }
          });
        }
        
        // ===== PHASE 5: REACTION PHASE TIMER =====
        if (state.phase === 'reaction') {
          const newReactionTicks = Math.max(0, state.reactionTicksRemaining - 1);
          if (newReactionTicks <= 0) {
            get().enterResolutionPhase();
          }
          set({
            companies: updatedCompanies,
            assets: updatedAssets,
            reactionTicksRemaining: newReactionTicks,
            marketState: updatedMarket,
            newsFeed: updatedNewsFeed,
            distressedCompanies: updatedDistressedCompanies,
            companyDistressTicks: updatedDistressTicks,
            lastTickTimestamp: now,
          });
          return;
        }
        
        // ===== PHASE 5: RESOLUTION & CALM (normal updates) =====
        // Apply sentiment effects to company reputation
        updatedCompanies = updatedCompanies.map(company => {
          const sentimentImpact = getSentimentReputationImpact(updatedPeople, company.industry, company.reputation);
          if (sentimentImpact !== 0) {
            return {
              ...company,
              reputation: Math.max(0, Math.min(100, company.reputation + sentimentImpact)),
            };
          }
          return company;
        });
        
        // Apply tax (simplified: reduce cash by tax rate on revenue)
        updatedCompanies = updatedCompanies.map(company => {
          const effectiveTaxRate = getEffectiveTaxRate(updatedGovernment, company.lobbyingPower);
          // Tax on production revenue (already calculated in production phase)
          const companyAssets = updatedAssets.filter(a => company.assets.includes(a.id));
          let productionRevenue = 0;
          companyAssets.forEach(asset => {
            Object.entries(asset.productionPerTick).forEach(([type, amount]) => {
              if (amount > 0) {
                productionRevenue += amount * marketPrices[type as ResourceType];
              }
            });
          });
          const taxAmount = productionRevenue * (effectiveTaxRate / 100);
          return {
            ...company,
            cash: Math.max(0, company.cash - taxAmount),
          };
        });
        
        // Check for bankruptcies (distressed for too long)
        updatedCompanies = updatedCompanies.filter(company => {
          const distressTicks = updatedDistressTicks[company.id] || 0;
          if (distressTicks >= DISTRESS_THRESHOLD_TICKS && !company.isPlayer) {
            // AI company goes bankrupt (removed from game)
            updatedNewsFeed = addNewsItem(updatedNewsFeed, {
              id: `news-bankruptcy-${Date.now()}`,
              category: 'headline',
              title: `${company.name} declares bankruptcy`,
              content: `${company.name} has been unable to recover from financial distress and has declared bankruptcy.`,
              timestamp: now,
              severity: 'high',
              relatedIds: [company.id],
            });
            return false;
          }
          return true;
        });
        
        // Update newsfeed
        const marketTrend: 'up' | 'down' | 'stable' = 'stable';
        const lastMajorEventTime = state.currentEvents.length > 0 
          ? Math.max(...state.currentEvents.map(e => e.startedAt))
          : 0;
        updatedNewsFeed = ensureNewsfeedNotEmpty(
          updatedNewsFeed,
          updatedCompanies,
          marketTrend,
          now - lastMajorEventTime
        );
        
        // Calculate asset values for NCP (use build cost as value)
        const assetValues: Record<string, number> = {};
        updatedAssets.forEach(asset => {
          assetValues[asset.id] = asset.buildCost;
        });
        
        // Calculate market shares based on production
        const marketShares: Record<string, Record<string, number>> = {};
        const industryProduction: Record<string, Record<string, number>> = {}; // industry -> companyId -> production
        
        updatedCompanies.forEach(company => {
          const companyAssets = updatedAssets.filter(a => company.assets.includes(a.id));
          let companyProduction = 0;
          companyAssets.forEach(asset => {
            Object.values(asset.productionPerTick).forEach(amount => {
              if (amount > 0) companyProduction += amount;
            });
          });
          
          if (!industryProduction[company.industry]) {
            industryProduction[company.industry] = {};
          }
          industryProduction[company.industry][company.id] = companyProduction;
        });
        
        // Calculate market share percentages
        Object.keys(industryProduction).forEach(industry => {
          const totalProduction = Object.values(industryProduction[industry]).reduce((a, b) => a + b, 0);
          Object.entries(industryProduction[industry]).forEach(([companyId, production]) => {
            if (!marketShares[companyId]) marketShares[companyId] = {};
            marketShares[companyId][industry] = totalProduction > 0 ? (production / totalProduction) * 100 : 0;
          });
        });
        
        const allianceStrengths: Record<string, number> = {}; // Ignored for now
        
        // Check for season end
        if (state.seasonEndTimestamp && now >= state.seasonEndTimestamp && !state.seasonEnded) {
          const rankings = rankCompaniesByNCP(
            updatedCompanies,
            state.assets,
            assetValues,
            marketShares,
            allianceStrengths
          );
          
          set({
            companies: updatedCompanies,
            marketState: updatedMarket,
            governmentState: updatedGovernment,
            mediaState: updatedMedia,
            peopleState: updatedPeople,
            eventEngine: updatedEventEngine,
            newsFeed: updatedNewsFeed,
            seasonEnded: true,
            seasonResults: { rankings },
            distressedCompanies: updatedDistressedCompanies,
            companyDistressTicks: updatedDistressTicks,
            lastTickTimestamp: now,
          });
          return;
        }
        
        // Normal state update
        set({
          companies: updatedCompanies,
          assets: updatedAssets,
          marketState: updatedMarket,
          governmentState: updatedGovernment,
          mediaState: updatedMedia,
          peopleState: updatedPeople,
          eventEngine: updatedEventEngine,
          newsFeed: updatedNewsFeed,
          distressedCompanies: updatedDistressedCompanies,
          companyDistressTicks: updatedDistressTicks,
          lastTickTimestamp: now,
        });
      },

      startGameLoop: () => {
        const state = get();
        if (state.gameLoopInterval) {
          console.log('[worldStore] Game loop already running');
          return; // Already running
        }
        
        console.log('[worldStore] Starting game loop');
        const interval = setInterval(() => {
          const currentState = get();
          const now = Date.now();
          const deltaMs = currentState.lastTickTimestamp 
            ? now - currentState.lastTickTimestamp 
            : TICK_INTERVAL_MS;
          
          currentState.tick(deltaMs);
        }, TICK_INTERVAL_MS);
        
        set({ gameLoopInterval: interval });
        console.log('[worldStore] Game loop started, interval ID:', interval);
      },

      stopGameLoop: () => {
        const state = get();
        if (state.gameLoopInterval) {
          clearInterval(state.gameLoopInterval);
          set({ gameLoopInterval: null });
        }
      },

      buildAsset: (assetType: AssetType, level: number = 1) => {
        const state = get();
        if (!state.playerCompanyId) return false;
        
        const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
        if (!playerCompany) return false;
        
        const buildCost = getBuildCost(assetType, level);
        if (playerCompany.cash < buildCost) return false;
        
        // Create asset
        const asset = createAssetHelper(assetType, playerCompany.id, level, 1.0);
        
        // Update company
        const updatedCompanies = state.companies.map(c => {
          if (c.id === state.playerCompanyId) {
            return {
              ...c,
              cash: c.cash - buildCost,
              assets: [...c.assets, asset.id],
            };
          }
          return c;
        });
        
        // Add asset to world
        const updatedAssets = [...state.assets, asset];
        
        // Generate news
        const newsItem = generatePlayerActionNews(
          playerCompany.name,
          `built a new ${ASSET_DEFINITIONS[assetType].name}`,
          { assetType, cost: buildCost }
        );
        const updatedNewsFeed = addNewsItem(state.newsFeed, newsItem);
        
        set({
          companies: updatedCompanies,
          assets: updatedAssets,
          newsFeed: updatedNewsFeed,
        });
        
        return true;
      },

      upgradeAsset: (assetId: string) => {
        const state = get();
        if (!state.playerCompanyId) return false;
        
        const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
        const asset = state.assets.find(a => a.id === assetId);
        
        if (!playerCompany || !asset) return false;
        if (!playerCompany.assets.includes(assetId)) return false; // Must own it
        if (asset.level >= 5) return false; // Max level
        
        const upgradeCost = getUpgradeCost(asset);
        if (playerCompany.cash < upgradeCost) return false;
        
        // Upgrade asset
        const newLevel = asset.level + 1;
        const upgradedAsset: Asset = {
          ...asset,
          level: newLevel,
          upkeepCost: getUpkeepCost(asset.type, newLevel),
          productionPerTick: getProductionPerTick(asset.type, newLevel, asset.efficiencyMultiplier),
        };
        
        // Update assets
        const updatedAssets = state.assets.map(a => a.id === assetId ? upgradedAsset : a);
        
        // Update company
        const updatedCompanies = state.companies.map(c => {
          if (c.id === state.playerCompanyId) {
            return {
              ...c,
              cash: c.cash - upgradeCost,
            };
          }
          return c;
        });
        
        // Generate news
        const newsItem = generatePlayerActionNews(
          playerCompany.name,
          `upgraded ${ASSET_DEFINITIONS[asset.type].name} to level ${upgradedAsset.level}`,
          { assetId, cost: upgradeCost }
        );
        const updatedNewsFeed = addNewsItem(state.newsFeed, newsItem);
        
        set({
          companies: updatedCompanies,
          assets: updatedAssets,
          newsFeed: updatedNewsFeed,
        });
        
        return true;
      },

      shutdownAsset: (assetId: string) => {
        const state = get();
        if (!state.playerCompanyId) return false;
        
        const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
        const asset = state.assets.find(a => a.id === assetId);
        
        if (!playerCompany || !asset) return false;
        if (!playerCompany.assets.includes(assetId)) return false;
        
        // Remove asset from company
        const updatedCompanies = state.companies.map(c => {
          if (c.id === state.playerCompanyId) {
            return {
              ...c,
              assets: c.assets.filter(id => id !== assetId),
              reputation: Math.max(0, c.reputation - 2), // Slight reputation penalty
            };
          }
          return c;
        });
        
        // Remove asset from world
        const updatedAssets = state.assets.filter(a => a.id !== assetId);
        
        // Generate news
        const newsItem = generatePlayerActionNews(
          playerCompany.name,
          `shut down ${ASSET_DEFINITIONS[asset.type].name}`,
          { assetId }
        );
        const updatedNewsFeed = addNewsItem(state.newsFeed, newsItem);
        
        set({
          companies: updatedCompanies,
          assets: updatedAssets,
          newsFeed: updatedNewsFeed,
        });
        
        return true;
      },

      takeLoan: (amount: number) => {
        const state = get();
        if (!state.playerCompanyId) return false;
        
        const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
        if (!playerCompany) return false;
        
        // Max loan: 5x current cash or 500k, whichever is lower
        const maxLoan = Math.min(playerCompany.cash * 5, 500000);
        if (amount > maxLoan) return false;
        
        // Update company
        const updatedCompanies = state.companies.map(c => {
          if (c.id === state.playerCompanyId) {
            return {
              ...c,
              cash: c.cash + amount,
              debt: c.debt + amount,
            };
          }
          return c;
        });
        
        // Generate news
        const newsItem = generatePlayerActionNews(
          playerCompany.name,
          `took out a $${amount.toLocaleString()} loan`,
          { amount }
        );
        const updatedNewsFeed = addNewsItem(state.newsFeed, newsItem);
        
        set({
          companies: updatedCompanies,
          newsFeed: updatedNewsFeed,
        });
        
        return true;
      },

      repayLoan: (amount: number) => {
        const state = get();
        if (!state.playerCompanyId) return false;
        
        const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
        if (!playerCompany) return false;
        
        if (playerCompany.cash < amount) return false;
        if (playerCompany.debt < amount) {
          amount = playerCompany.debt; // Can't repay more than debt
        }
        
        // Update company
        const updatedCompanies = state.companies.map(c => {
          if (c.id === state.playerCompanyId) {
            return {
              ...c,
              cash: c.cash - amount,
              debt: Math.max(0, c.debt - amount),
            };
          }
          return c;
        });
        
        set({ companies: updatedCompanies });
        return true;
      },

      buyShares: (targetCompanyId: string, amount: number) => {
        const state = get();
        if (!state.playerCompanyId) return false;
        
        // Check action points during reaction phase
        if (state.phase === 'reaction' && !state.spendPlayerActionPoint()) {
          return false;
        }
        
        const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
        const targetCompany = state.companies.find(c => c.id === targetCompanyId);
        
        if (!playerCompany || !targetCompany) return false;
        
        const result = buySharesFn(targetCompany, state.playerCompanyId, amount);
        if (!result.success) return false;
        
        const cost = result.cost;
        if (playerCompany.cash < cost) return false;
        
        // Update companies
        const updatedCompanies = state.companies.map(c => {
          if (c.id === state.playerCompanyId) {
            return { ...c, cash: c.cash - cost };
          }
          if (c.id === targetCompanyId) {
            return result.company;
          }
          return c;
        });
        
        // Generate news
        const newsItem = generatePlayerActionNews(
          playerCompany.name,
          `increased stake in ${targetCompany.name}`,
          { shares: amount, cost }
        );
        const updatedNewsFeed = addNewsItem(state.newsFeed, newsItem);
        
        set({
          companies: updatedCompanies,
          newsFeed: updatedNewsFeed,
        });
        
        return true;
      },
      
      sellShares: (targetCompanyId: string, amount: number) => {
        const state = get();
        if (!state.playerCompanyId) return false;
        
        const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
        const targetCompany = state.companies.find(c => c.id === targetCompanyId);
        
        if (!playerCompany || !targetCompany) return false;
        
        const sharesOwned = targetCompany.shareholders[state.playerCompanyId] || 0;
        if (sharesOwned < amount) return false;
        
        const salePrice = targetCompany.sharePrice * amount;
        
        // Update ownership
        const updatedShareholders = { ...targetCompany.shareholders };
        updatedShareholders[state.playerCompanyId] = sharesOwned - amount;
        if (updatedShareholders[state.playerCompanyId] <= 0) {
          delete updatedShareholders[state.playerCompanyId];
        }
        
        const updatedTargetCompany = {
          ...targetCompany,
          shareholders: updatedShareholders,
          freeFloat: targetCompany.freeFloat + amount,
        };
        
        // Update companies
        const updatedCompanies = state.companies.map(c => {
          if (c.id === state.playerCompanyId) {
            return { ...c, cash: c.cash + salePrice };
          }
          if (c.id === targetCompanyId) {
            return updatedTargetCompany;
          }
          return c;
        });
        
        set({ companies: updatedCompanies });
        return true;
      },
      
      tradeResource: (resourceType: ResourceType, amount: number, targetCompanyId?: string) => {
        const state = get();
        if (!state.playerCompanyId || !targetCompanyId) return false;
        
        // Check action points during reaction phase
        if (state.phase === 'reaction' && !state.spendPlayerActionPoint()) {
          return false;
        }
        
        const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
        const targetCompany = state.companies.find(c => c.id === targetCompanyId);
        
        if (!playerCompany || !targetCompany) return false;
        
        const playerResourceAmount = playerCompany.resources[resourceType] || 0;
        if (playerResourceAmount < amount) return false;
        
        const marketPrice = getPrice(state.marketState, resourceType);
        const tradeValue = marketPrice * amount;
        
        // Simple trade: player gives resource, gets cash
        const updatedCompanies = state.companies.map(c => {
          if (c.id === state.playerCompanyId) {
            const updatedResources = { ...c.resources };
            updatedResources[resourceType] = (updatedResources[resourceType] || 0) - amount;
            return { ...c, resources: updatedResources, cash: c.cash + tradeValue };
          }
          if (c.id === targetCompanyId) {
            const updatedResources = { ...c.resources };
            updatedResources[resourceType] = (updatedResources[resourceType] || 0) + amount;
            return { ...c, resources: updatedResources, cash: Math.max(0, c.cash - tradeValue) };
          }
          return c;
        });
        
        set({ companies: updatedCompanies });
        return true;
      },
      
      attemptBuyout: (targetCompanyId: string) => {
        const state = get();
        if (!state.playerCompanyId) return false;
        
        // Check action points during reaction phase
        if (state.phase === 'reaction' && !state.spendPlayerActionPoint()) {
          return false;
        }
        
        const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
        const targetCompany = state.companies.find(c => c.id === targetCompanyId);
        
        if (!playerCompany || !targetCompany) return false;
        
        // Calculate buyout cost based on assets and debt
        const targetAssets = state.assets.filter(a => targetCompany.assets.includes(a.id));
        const assetValue = targetAssets.reduce((sum, asset) => {
          return sum + asset.buildCost; // Simplified: use build cost as value
        }, 0);
        
        // Buyout cost = market cap + asset value - debt (distressed companies are cheaper)
        const isDistressed = state.distressedCompanies.includes(targetCompanyId);
        const baseValue = targetCompany.marketCap + assetValue - targetCompany.debt;
        const premiumMultiplier = isDistressed ? 1.1 : 1.3; // Distressed = 10% premium, normal = 30%
        const buyoutCost = baseValue * premiumMultiplier;
        
        const ownership = getOwnershipPercentage(targetCompany, state.playerCompanyId);
        const canBuyout = ownership > 50 || playerCompany.cash >= buyoutCost;
        
        if (!canBuyout) return false;
        
        // Execute buyout - transfer assets to player
        const result = executeBuyout(targetCompany, state.playerCompanyId, playerCompany.name);
        
        // Transfer assets to player company (targetAssets already declared above)
        const updatedAssets = state.assets.map(asset => {
          if (targetCompany.assets.includes(asset.id)) {
            // Change asset owner
            return {
              ...asset,
              id: asset.id.replace(targetCompany.id, state.playerCompanyId || 'player'), // New ID for player
            };
          }
          return asset;
        });
        
        // Update companies
        const updatedCompanies = state.companies.map(c => {
          if (c.id === state.playerCompanyId) {
            // Player gets target's assets and cash, pays buyout cost
            return {
              ...c,
              cash: c.cash - buyoutCost + targetCompany.cash,
              assets: [...c.assets, ...targetCompany.assets.map(aid => aid.replace(targetCompany.id, state.playerCompanyId || 'player'))],
            };
          }
          if (c.id === targetCompanyId) {
            return result.targetCompany;
          }
          return c;
        });
        
        // Generate news
        const newsItem = generateTakeoverNews(
          playerCompany.name, 
          targetCompany.name, 
          buyoutCost
        );
        // Update title if distressed
        if (isDistressed) {
          newsItem.title = `${playerCompany.name} acquires distressed ${targetCompany.name} in fire sale`;
        }
        const updatedNewsFeed = addNewsItem(state.newsFeed, newsItem);
        
        // Remove from distressed list
        const updatedDistressed = state.distressedCompanies.filter(id => id !== targetCompanyId);
        
        set({
          companies: updatedCompanies,
          assets: updatedAssets,
          newsFeed: updatedNewsFeed,
          distressedCompanies: updatedDistressed,
        });
        
        return true;
      },
      
      respondToEventChoice: (eventId: string, choiceId: string) => {
        const state = get();
        const event = state.currentEvents.find(e => e.id === eventId);
        if (!event || !event.decisions) return;
        
        const choice = event.decisions.find(d => d.id === choiceId);
        if (!choice) return;
        
        // Enter reaction phase when player makes a choice
        if (state.phase === 'shock') {
          state.enterReactionPhase();
        }
        
        // Apply choice effects
        if (state.playerCompanyId) {
          const playerCompany = state.companies.find(c => c.id === state.playerCompanyId);
          if (playerCompany) {
            const updatedCompanies = state.companies.map(c => {
              if (c.id === state.playerCompanyId) {
                return {
                  ...c,
                  cash: c.cash + (choice.consequences.cashChange || 0),
                  reputation: Math.max(0, Math.min(100, c.reputation + (choice.consequences.reputationChange || 0))),
                };
              }
              return c;
            });
            
            set({ companies: updatedCompanies });
          }
        }
        
        // Execute choice effect
        if (choice.effect) {
          choice.effect();
        }
      },

      dismissBreakingEvent: () => {
                set({
          activeBreakingEvent: null,
          isBreakingEventActive: false,
        });
      },
      
      // Computed properties - these are computed on access via getters in interface
      // Implementation: return null/empty initially, components compute from state
      player: null as Company | null,
      aiCompanies: [] as Company[],
      systems: {
        market: createInitialMarketState(),
        eventEngine: createEventEngine(),
        newsFeed: createNewsFeed(50),
        lastUpdate: Date.now(),
        updateInterval: 5000,
      } as any,
      tradeOffers: [] as any[],
      alliances: [] as any[],
      // world property removed - use get() to access store
      
      // Stub methods for missing functionality
      // tradeResource is implemented above (line ~1148)
      
      respondToCrisis: (eventId: string, choiceId: string) => {
        get().respondToEventChoice(eventId, choiceId);
      },
      
      formAlliance: (_targetCompanyId?: string, _allianceName?: string) => {
        console.warn('formAlliance not implemented yet');
        return false;
      },
      
      leaveAlliance: (_allianceId?: string) => {
        console.warn('leaveAlliance not implemented yet');
        return false;
      },
      
      upgradeDepartment: () => {
        console.warn('upgradeDepartment not implemented yet');
        return false;
      },
      
      buyResource: () => {
        console.warn('buyResource not implemented yet');
        return false;
      },
      
      updateSystems: () => {
        // Stub - systems are updated in the game loop
        console.warn('updateSystems should be called from game loop');
      },
      
      expandTerritory: () => {
        console.warn('expandTerritory not implemented yet');
        return false;
      },
      
      undercutCompetitor: () => {
        console.warn('undercutCompetitor not implemented yet');
        return false;
      },
      
      investInRD: () => {
        console.warn('investInRD not implemented yet');
        return false;
      },
      
      tickRevenue: () => {
        // Stub - revenue is calculated in tick
        console.warn('tickRevenue should be called from tick');
      },
      
      endSeason: () => {
        console.warn('endSeason not implemented yet');
      },
    }),
    {
      name: 'oligarchy-world-storage',
    }
  )
);

// Create a wrapper hook that adds computed properties
const useMmoStoreWithComputed = () => {
  const store = useWorldStore();
  const playerCompanyId = store.playerCompanyId;
  const companies = store.companies;
  
  // Compute player
  const player = playerCompanyId 
    ? companies.find(c => c.id === playerCompanyId) || null
    : null;
  
  // Compute AI companies
  const aiCompanies = companies.filter(c => !c.isPlayer);
  
  // Compute systems
  const systems = {
    market: store.marketState,
    eventEngine: store.eventEngine,
    newsFeed: store.newsFeed,
  };
  
  return {
    ...store,
    player,
    aiCompanies,
    systems,
    tradeOffers: [],
    alliances: [],
    // world: store, // Removed
  };
};

// Export alias for backward compatibility with existing code
export { useWorldStore as useMmoStore };
export { useMmoStoreWithComputed };
