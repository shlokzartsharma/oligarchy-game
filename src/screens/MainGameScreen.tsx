import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import HUD from '../components/HUD';
import ChoiceCard from '../components/ChoiceCard';
import Ollie from '../components/Ollie';
import { YearEvent } from '../types/game';
import { soundManager } from '../utils/sounds';
import { Confetti } from '../utils/confetti';
// import { quizzes } from '../data/quizzes'; // Unused

const MainGameScreen = () => {
  const navigate = useNavigate();
  const {
    profile,
    events,
    completedQuizzes,
    advanceYear,
    makeChoice,
    calculateNetWorth,
  } = useGameStore();

  // Redirect if game not initialized
  useEffect(() => {
    if (!profile.name) {
      navigate('/quick-play/character');
    }
  }, [profile.name, navigate]);

  const [currentEvent, setCurrentEvent] = useState<YearEvent | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ollieMessage, setOllieMessage] = useState('');
  const [showYearBanner, setShowYearBanner] = useState(false);
  const [previousNetWorth] = useState(calculateNetWorth());

  useEffect(() => {
    // Check if we need to show a quiz
    if (profile.ageTrack === 'student') {
      if (profile.age === 14 && !completedQuizzes.includes('checking-savings')) {
        navigate('/quick-play/quiz/checking-savings');
        return;
      }
      if (profile.age === 15 && !completedQuizzes.includes('credit-cards')) {
        navigate('/quick-play/quiz/credit-cards');
        return;
      }
      if (profile.age === 17 && !completedQuizzes.includes('investing-basics')) {
        navigate('/quick-play/quiz/investing-basics');
        return;
      }
    }

    // Show year banner
    setShowYearBanner(true);
    setTimeout(() => setShowYearBanner(false), 2000);

    // Get current event
    if (events.length > 0 && !currentEvent) {
      setCurrentEvent(events[0]);
    } else if (events.length === 0 && currentEvent) {
      setCurrentEvent(null);
      // No more events, go to summary
      setTimeout(() => {
        navigate('/quick-play/summary');
      }, 1000);
    }
  }, [profile.age, profile.year, events, completedQuizzes, navigate, profile.ageTrack, currentEvent]);

  useEffect(() => {
    const currentNetWorth = calculateNetWorth();
    if (currentNetWorth > previousNetWorth) {
      soundManager.playKaching();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [profile.netWorth, calculateNetWorth, previousNetWorth]);

  const handleAdvanceYear = () => {
    advanceYear();
  };

  const handleChoice = (choiceIndex: 0 | 1) => {
    if (!currentEvent) return;

    const choice = choiceIndex === 0 ? currentEvent.choiceA : currentEvent.choiceB;
    makeChoice(choiceIndex, currentEvent);

    // Show message
    if (choice.consequences.message) {
      setOllieMessage(choice.consequences.message);
    }

    // Play sound
    if (choice.consequences.wealth && choice.consequences.wealth > 0) {
      soundManager.playKaching();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (choice.consequences.wealth && choice.consequences.wealth < 0) {
      soundManager.playThud();
    }

    // Clear current event - will be updated by useEffect when events change
    setCurrentEvent(null);
  };

  // Check win condition
  const netWorth = calculateNetWorth();
  const isWin = netWorth >= 1000000;
  const isGameOver =
    (profile.ageTrack === 'student' && profile.age > 18) ||
    (profile.ageTrack === 'adult' && profile.age > 65);

  if (isWin || isGameOver) {
    setTimeout(() => navigate('/quick-play/retirement'), 1000);
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <HUD />

      {/* Year Banner */}
      <AnimatePresence>
        {showYearBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-0 right-0 z-40 bg-gold text-navy py-4 text-center"
          >
            <h2 className="text-3xl font-bold">
              Age {profile.age} - Year {profile.year}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      <div className="max-w-4xl mx-auto p-4">
        {currentEvent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Event Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-3xl font-bold text-navy mb-4">
                {currentEvent.title}
              </h2>
              <p className="text-lg text-navy/80 leading-relaxed">
                {currentEvent.description}
              </p>
            </motion.div>

            {/* Choice Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <ChoiceCard
                text={currentEvent.choiceA.text}
                onSwipe={() => handleChoice(0)}
                side="left"
                color="#A6D49F"
              />
              <ChoiceCard
                text={currentEvent.choiceB.text}
                onSwipe={() => handleChoice(1)}
                side="right"
                color="#D66D6D"
              />
            </div>

            <p className="text-center text-navy/60 text-sm">
              Swipe or click to make your choice
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-navy/70 mb-6">Processing your year...</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdvanceYear}
              className="bg-navy text-cream px-8 py-4 rounded-full text-lg font-bold"
            >
              Continue
            </motion.button>
          </motion.div>
        )}
      </div>

      {ollieMessage && (
        <Ollie
          message={ollieMessage}
          onClose={() => setOllieMessage('')}
        />
      )}
    </div>
  );
};

export default MainGameScreen;

