import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Confetti } from '../utils/confetti';
import { soundManager } from '../utils/sounds';
import { useEffect, useState } from 'react';

const RetirementScreen = () => {
  const navigate = useNavigate();
  const { profile, calculateNetWorth, resetGame } = useGameStore();
  const netWorth = calculateNetWorth();
  const [showConfetti, setShowConfetti] = useState(true);
  const isWin = netWorth >= 1000000;
  const isStudent = profile.ageTrack === 'student';

  useEffect(() => {
    soundManager.playSuccess();
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  const handleNewGame = () => {
    resetGame();
    navigate('/quick-play');
  };

  return (
    <div className="min-h-screen bg-cream p-4 pt-24">
      {showConfetti && <Confetti />}

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-8xl mb-6"
          >
            {isWin ? '🎉' : isStudent ? '🎓' : '🏖️'}
          </motion.div>

          <h1 className="text-5xl font-bold text-navy mb-4">
            {isStudent ? 'Graduation!' : 'Retirement!'}
          </h1>

          <div className="bg-gold/20 rounded-xl p-6 mb-8">
            <div className="text-4xl font-bold text-gold mb-2">
              ${netWorth.toLocaleString()}
            </div>
            <div className="text-xl text-navy/70">Final Net Worth</div>
          </div>

          {isWin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-soft-green/20 rounded-xl p-6 mb-8 border-2 border-soft-green"
            >
              <h2 className="text-3xl font-bold text-navy mb-2">
                🏆 Millionaire Achievement Unlocked!
              </h2>
              <p className="text-lg text-navy/80">
                You've reached $1,000,000! Unlock Oligarchy MMO (Utopia Mode) coming soon!
              </p>
            </motion.div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-cream rounded-xl p-6">
              <div className="text-2xl mb-2">😊</div>
              <div className="text-2xl font-bold text-navy">{profile.happiness}</div>
              <div className="text-sm text-navy/70">Happiness</div>
            </div>
            <div className="bg-cream rounded-xl p-6">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-2xl font-bold text-navy">{profile.creditScore}</div>
              <div className="text-sm text-navy/70">Credit Score</div>
            </div>
            <div className="bg-cream rounded-xl p-6">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-navy">{profile.year}</div>
              <div className="text-sm text-navy/70">Years Played</div>
            </div>
          </div>

          <div className="bg-navy/5 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-xl font-bold text-navy mb-4">What You Learned</h3>
            <ul className="space-y-2 text-navy/80">
              <li>✓ Banking and account management</li>
              <li>✓ Credit scores and responsible credit use</li>
              <li>✓ Budgeting and saving strategies</li>
              <li>✓ Investing basics and market cycles</li>
              <li>✓ Long-term financial planning</li>
            </ul>
          </div>

          <div className="bg-navy/5 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-navy mb-2">Continue Learning</h3>
            <p className="text-navy/70 mb-4">
              Check out these educational resources to deepen your financial knowledge:
            </p>
            <div className="space-y-2 text-left">
              <a
                href="https://www.youtube.com/results?search_query=financial+literacy+basics"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-soft-green hover:text-soft-green/80 underline"
              >
                📺 Financial Literacy YouTube Videos
              </a>
              <a
                href="https://www.investopedia.com/financial-literacy-4689751"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-soft-green hover:text-soft-green/80 underline"
              >
                📚 Investopedia Financial Literacy Guide
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewGame}
              className="flex-1 bg-navy text-cream px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
            >
              New Game
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex-1 bg-gold text-navy px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
            >
              Main Menu
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RetirementScreen;

