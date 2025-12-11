// Gameplay Guide: Explains how to play the Offworld-style economic battle game

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface GameplayGuideProps {
  onClose?: () => void;
}

const GameplayGuide = ({ onClose }: GameplayGuideProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={() => {
          setIsOpen(false);
          onClose?.();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-cream rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-gold shadow-2xl"
        >
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-navy">How to Play</h1>
            <button
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
              className="text-navy/70 hover:text-navy transition-colors text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-6 text-navy/80">
            {/* The Loop */}
            <section>
              <h2 className="text-2xl font-bold text-navy mb-3">🔄 The Economic Battle Loop</h2>
              <p className="mb-4">
                The game runs in a repeating cycle. Every 1-2 minutes, a major economic shock hits the market.
                You have a limited window to react and make strategic decisions.
              </p>
              <div className="space-y-3">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h3 className="font-bold text-green-800 mb-1">1. CALM Phase</h3>
                  <p className="text-green-700">Your assets produce resources automatically. Markets update. Watch and wait for the next shock.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <h3 className="font-bold text-red-800 mb-1">2. SHOCK Phase</h3>
                  <p className="text-red-700">A major event hits! A breaking news overlay appears. Read the event and choose how to respond.</p>
                </div>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                  <h3 className="font-bold text-orange-800 mb-1">3. REACTION Phase (30 seconds)</h3>
                  <p className="text-orange-700">
                    <strong>This is when you act!</strong> You have 3 action points to spend. Make strategic moves:
                    buy shares in distressed companies, trade resources, attempt buyouts. AI competitors are also acting.
                  </p>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <h3 className="font-bold text-yellow-800 mb-1">4. RESOLUTION Phase</h3>
                  <p className="text-yellow-700">Markets settle. Power shifts. Weak companies may go bankrupt. Then back to CALM.</p>
                </div>
              </div>
            </section>

            {/* What You Can Do */}
            <section>
              <h2 className="text-2xl font-bold text-navy mb-3">⚡ What Actions Can You Take?</h2>
              <div className="space-y-3">
                <div className="bg-white/50 p-4 rounded-lg border border-navy/10">
                  <h3 className="font-bold text-navy mb-2">📈 Buy/Sell Shares</h3>
                  <p className="text-sm">
                    Click on any company in the "Other Companies" list, then click "Buy Shares". 
                    Owning shares gives you a stake in that company. If you own &gt;50%, you can attempt a buyout.
                  </p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg border border-navy/10">
                  <h3 className="font-bold text-navy mb-2">💼 Attempt Buyout</h3>
                  <p className="text-sm">
                    Acquire another company entirely! You need either &gt;50% ownership OR enough cash (1.5x their market cap).
                    Distressed companies (marked with ⚠️) are cheaper to buy (1.2x market cap).
                  </p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg border border-navy/10">
                  <h3 className="font-bold text-navy mb-2">🔄 Trade Resources</h3>
                  <p className="text-sm">
                    Your assets produce resources (steel, chips, data, etc.). You can trade these with other companies for cash.
                    Click on a company and select "Trade Resources" (coming soon in modal).
                  </p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg border border-navy/10">
                  <h3 className="font-bold text-navy mb-2">📰 Respond to Events</h3>
                  <p className="text-sm">
                    When a breaking event appears, you can choose how to respond. Your choices affect cash, reputation, and unlock opportunities.
                  </p>
                </div>
              </div>
            </section>

            {/* Strategy Tips */}
            <section>
              <h2 className="text-2xl font-bold text-navy mb-3">🎯 Strategy Tips</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Watch for distressed companies</strong> (red border, ⚠️ icon) - they're vulnerable to buyouts</li>
                <li><strong>Save action points</strong> for reaction phases - you only get 3 per event!</li>
                <li><strong>Your assets produce resources</strong> - sell them when prices spike during events</li>
                <li><strong>Events create opportunities</strong> - some industries benefit, others suffer. React accordingly.</li>
                <li><strong>Don't go bankrupt!</strong> Keep cash above $0. If you stay distressed too long, you're out.</li>
                <li><strong>Goal: Maximize NCP (Net Corporate Power)</strong> by season end to become an Oligarch (top 10)</li>
              </ul>
            </section>

            {/* What Happens Automatically */}
            <section>
              <h2 className="text-2xl font-bold text-navy mb-3">🤖 What Happens Automatically</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your assets produce resources every second</li>
                <li>Maintenance costs are deducted from your cash</li>
                <li>Market prices update based on supply and demand</li>
                <li>AI companies act during reaction phases</li>
                <li>News feed updates with world events</li>
                <li>Season timer counts down (20 minutes total)</li>
              </ul>
            </section>

            {/* UI Elements */}
            <section>
              <h2 className="text-2xl font-bold text-navy mb-3">🖥️ Understanding the UI</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Phase indicator</strong> (top right): Shows current game phase (Calm/Shock/Reaction/Resolution)</p>
                <p><strong>Action Points</strong> (during Reaction): Shows how many actions you have left (3 max)</p>
                <p><strong>Season Time</strong>: Countdown to season end</p>
                <p><strong>Your Company</strong> (left panel): Your stats, cash, resources, portfolio</p>
                <p><strong>Other Companies</strong> (left panel): Click to view details, buy shares, or attempt buyout</p>
                <p><strong>News Feed</strong> (right panel): Real-time updates on events, trades, bankruptcies</p>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
              className="px-8 py-3 bg-navy text-cream font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Got It! Let's Play
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameplayGuide;

