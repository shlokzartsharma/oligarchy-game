import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWorldStore } from '../state/worldStore';
import CompanyList from '../ui/common/CompanyList';
import PortfolioSummary from '../ui/common/PortfolioSummary';
import NewsFeedPanel from '../news/NewsFeedPanel';
import BreakingEventOverlay from '../ui/events/BreakingEventOverlay';
import GameplayGuide from '../ui/GameplayGuide';
import AssetManagementPanel from '../ui/AssetManagementPanel';

console.log('[MmoWorld] Module loaded');

const MmoWorld = () => {
  console.log('[MmoWorld] Component rendering');
  
  const navigate = useNavigate();
  const {
    companies,
    playerCompanyId,
    seasonEnded,
    activeBreakingEvent,
    isBreakingEventActive,
    newsFeed,
    seasonEndTimestamp,
    phase,
    playerActionPoints,
    maxActionPoints,
    reactionTicksRemaining,
    distressedCompanies,
    gameStarted,
    initializeWorld,
    startGameLoop,
    stopGameLoop,
    respondToEventChoice,
    // dismissBreakingEvent, // Unused
    enterReactionPhase,
  } = useWorldStore();

  console.log('[MmoWorld] Store state:', {
    companiesCount: companies.length,
    playerCompanyId,
    seasonEnded,
    hasNewsFeed: !!newsFeed,
  });
  
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [showTradeModal, setShowTradeModal] = useState<{ companyId: string; type: 'shares' | 'resource' } | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number>(0);
  const [showGuide, setShowGuide] = useState(false);

  // Initialize world on mount (but don't start game)
  useEffect(() => {
    console.log('[MmoWorld] useEffect: initialization check', { companiesCount: companies.length });
    
    if (companies.length === 0) {
      console.log('[MmoWorld] Initializing world...');
      // Initialize with default options (can be enhanced to use prior selections)
      initializeWorld({
        industry: 'tech',
        difficulty: 'medium',
        playerName: 'Player',
      });
      console.log('[MmoWorld] initializeWorld called');
    } else {
      console.log('[MmoWorld] World already initialized, skipping init');
    }
    
    return () => {
      console.log('[MmoWorld] Cleanup: stopping game loop');
      stopGameLoop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
  
  // Start game loop when gameStarted becomes true
  useEffect(() => {
    if (gameStarted && companies.length > 0) {
      console.log('[MmoWorld] Game started, starting game loop');
      startGameLoop();
      return () => {
        stopGameLoop();
      };
    }
  }, [gameStarted, companies.length, startGameLoop, stopGameLoop]);

  // Navigate to season end when season ends
  useEffect(() => {
    if (seasonEnded) {
      navigate('/quick-play/mmo/season-end');
    }
  }, [seasonEnded, navigate]);

  const playerCompany = companies.find(c => c.id === playerCompanyId);
  const otherCompanies = companies.filter(c => c.id !== playerCompanyId);
  const selectedCompany = selectedCompanyId ? companies.find(c => c.id === selectedCompanyId) : null;

  console.log('[MmoWorld] Render check:', {
    hasPlayerCompanyId: !!playerCompanyId,
    companiesCount: companies.length,
    hasPlayerCompany: !!playerCompany,
    otherCompaniesCount: otherCompanies.length,
    gameStarted,
  });
  
  // Handle start button click
  // const handleStartGame = () => { // Unused
  //   if (!gameStarted && companies.length > 0) {
  //     useWorldStore.setState({ gameStarted: true });
  //   }
  // };

  // Show loading state if world not initialized
  if (!playerCompanyId || companies.length === 0) {
    console.log('[MmoWorld] Rendering loading state');
    return (
      <div className="min-h-screen bg-cream pt-20 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-navy mb-2">Initializing World...</div>
          <div className="text-navy/70">Setting up companies and markets...</div>
          <div className="text-sm text-navy/50 mt-4">
            Companies: {companies.length}, Player ID: {playerCompanyId || 'null'}
          </div>
        </div>
      </div>
    );
  }

  // Fallback if player company not found but we have companies
  if (!playerCompany && companies.length > 0) {
    // Try to use first company as fallback
    const fallbackCompany = companies[0];
    return (
      <div className="min-h-screen bg-cream pt-20 pb-20">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-800">Warning: Player company not found. Showing first company as fallback.</p>
          </div>
          <h1 className="text-4xl font-bold text-navy mb-4">{fallbackCompany.name}</h1>
          <PortfolioSummary company={fallbackCompany} />
        </div>
      </div>
    );
  }

  if (!playerCompany) {
    console.log('[MmoWorld] No player company found, rendering error state');
    return (
      <div className="min-h-screen bg-cream pt-20 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-navy mb-2">No Player Company</div>
          <div className="text-navy/70">Please initialize the world first.</div>
          <div className="text-sm text-navy/50 mt-4">
            Debug: Companies: {companies.length}, Player ID: {playerCompanyId}, 
            Company IDs: {companies.map(c => c.id).join(', ')}
          </div>
        </div>
      </div>
    );
  }

  console.log('[MmoWorld] Rendering main game view', {
    playerCompanyName: playerCompany.name,
    otherCompaniesCount: otherCompanies.length,
  });

  const timeRemaining = seasonEndTimestamp ? Math.max(0, seasonEndTimestamp - Date.now()) : 0;
  const minutesRemaining = Math.floor(timeRemaining / 60000);
  const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);

  console.log('[MmoWorld] About to render main view');
  
  return (
    <div className="min-h-screen bg-cream pt-20 pb-20">
      {/* Debug banner - remove after debugging */}
      <div className="bg-red-500 text-white p-2 text-center text-sm">
        DEBUG: MmoWorld Component Rendered | Companies: {companies.length} | Player ID: {playerCompanyId || 'null'}
      </div>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-navy">{playerCompany.name}</h1>
              <p className="text-navy/70 capitalize">{playerCompany.industry}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-navy/70">Phase</div>
                <div className={`text-lg font-bold capitalize ${
                  phase === 'shock' ? 'text-red-600' :
                  phase === 'reaction' ? 'text-orange-600' :
                  phase === 'resolution' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {phase}
                  {phase === 'reaction' && (
                    <span className="text-sm ml-2">
                      ({Math.ceil(reactionTicksRemaining)}s)
                    </span>
                  )}
                </div>
              </div>
              {phase === 'reaction' && (
                <div className="text-right">
                  <div className="text-sm text-navy/70">Action Points</div>
                  <div className={`text-lg font-bold ${
                    playerActionPoints > 0 ? 'text-gold' : 'text-red-600'
                  }`}>
                    {playerActionPoints} / {maxActionPoints}
                  </div>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-navy/70">Season Time</div>
                <div className="text-xl font-bold text-navy">
                  {minutesRemaining}:{secondsRemaining.toString().padStart(2, '0')}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGuide(true)}
                className="px-6 py-2 rounded-xl bg-navy/10 text-navy font-semibold hover:bg-navy/20"
              >
                How to Play
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/quick-play/mmo/leaderboard')}
                className="px-6 py-2 rounded-xl bg-gold text-navy font-semibold hover:shadow-lg"
              >
                Leaderboard
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Player Company & Assets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Management Panel - PRIMARY ACTION INTERFACE */}
            <AssetManagementPanel />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
            >
              <h2 className="text-2xl font-bold text-navy mb-4">Your Company</h2>
              <PortfolioSummary company={playerCompany} />
            </motion.div>

            {/* Companies List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
            >
              <h2 className="text-2xl font-bold text-navy mb-4">Other Companies</h2>
              <CompanyList
                companies={otherCompanies}
                playerCompanyId={playerCompanyId || ''}
                onSelect={(company) => setSelectedCompanyId(company.id)}
                showActions={true}
                distressedCompanies={distressedCompanies}
                playerActionPoints={playerActionPoints}
                currentPhase={phase}
              />
            </motion.div>
          </div>

          {/* Right Column - News Feed */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NewsFeedPanel />
            </motion.div>
          </div>
        </div>

        {/* Selected Company Modal */}
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCompanyId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 border border-navy/10"
            >
              <h3 className="text-2xl font-bold text-navy mb-4">{selectedCompany.name}</h3>
              <PortfolioSummary company={selectedCompany} />
              
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    setShowTradeModal({ companyId: selectedCompany.id, type: 'shares' });
                    setTradeAmount(100);
                  }}
                  disabled={phase === 'reaction' && playerActionPoints <= 0}
                  className={`px-4 py-2 font-semibold rounded-lg ${
                    phase === 'reaction' && playerActionPoints <= 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gold text-navy hover:shadow-lg'
                  }`}
                >
                  Buy Shares
                </button>
                <button
                  onClick={() => {
                    setShowTradeModal({ companyId: selectedCompany.id, type: 'resource' });
                    setTradeAmount(10);
                  }}
                  className="px-4 py-2 bg-navy/10 text-navy font-semibold rounded-lg hover:bg-navy/20"
                >
                  Trade Resources
                </button>
                {playerCompany && playerCompany.cash >= selectedCompany.marketCap * 1.5 && (
                  <button
                    onClick={() => {
                      const { attemptBuyout } = useWorldStore.getState();
                      if (attemptBuyout(selectedCompany.id)) {
                        setSelectedCompanyId(null);
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                  >
                    Attempt Buyout
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setSelectedCompanyId(null)}
                className="mt-4 w-full px-4 py-2 bg-navy/20 text-navy font-semibold rounded-lg hover:bg-navy/30"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Trade Modal */}
        {showTradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowTradeModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 border border-navy/10"
            >
              <h3 className="text-xl font-bold text-navy mb-4">
                {showTradeModal.type === 'shares' ? 'Buy Shares' : 'Trade Resources'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-navy mb-2">Amount</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const { buyShares } = useWorldStore.getState();
                    if (showTradeModal.type === 'shares') {
                      buyShares(showTradeModal.companyId, tradeAmount);
                    } else {
                      // For resource trading, we'd need to select resource type
                      // For now, just close
                    }
                    setShowTradeModal(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gold text-navy font-semibold rounded-lg hover:shadow-lg"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowTradeModal(null)}
                  className="flex-1 px-4 py-2 bg-navy/20 text-navy font-semibold rounded-lg hover:bg-navy/30"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Breaking Event Overlay */}
        {isBreakingEventActive && activeBreakingEvent && (
          <BreakingEventOverlay
            event={activeBreakingEvent}
            onDecision={(choiceId) => {
              if (activeBreakingEvent) {
                respondToEventChoice(activeBreakingEvent.id, choiceId);
              }
            }}
            onDismiss={() => {
              enterReactionPhase();
            }}
          />
        )}

        {/* Gameplay Guide */}
        {showGuide && (
          <GameplayGuide onClose={() => setShowGuide(false)} />
        )}
      </div>
    </div>
  );
};

export default MmoWorld;
