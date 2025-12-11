import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Difficulty } from '../types/game';

const difficulties: { level: Difficulty; title: string; description: string; inheritance: string }[] = [
  {
    level: 'easy',
    title: 'Easy - Wealthy Private School',
    description: 'NYC wealthy private school background',
    inheritance: '$2M immediately, $8M at age 30',
  },
  {
    level: 'medium',
    title: 'Medium - Middle-Class Brooklyn',
    description: 'Middle-class Brooklyn background',
    inheritance: '$1M house + $100K assets at age 30',
  },
  {
    level: 'hard',
    title: 'Hard - Working-Class Queens',
    description: 'Working-class Queens background',
    inheritance: '$0 - Start from scratch',
  },
];

const DifficultySelectionScreen = () => {
  const navigate = useNavigate();
  const { profile, initializeGame } = useGameStore();

  const handleSelect = (difficulty: Difficulty) => {
    initializeGame({
      ...profile,
      difficulty,
    });

    if (profile.ageTrack === 'adult') {
      navigate('/quick-play/profession');
    } else {
      navigate('/quick-play/game');
    }
  };

  return (
    <div className="min-h-screen bg-cream p-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-navy/70 hover:text-navy transition-colors flex items-center gap-2 mb-4"
        >
          ← Back to Home
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-navy mb-8 text-center"
        >
          Choose Your Difficulty
        </motion.h1>

        <div className="grid md:grid-cols-3 gap-6">
          {difficulties.map((diff, index) => (
            <motion.button
              key={diff.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(diff.level)}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all text-left border-2 border-navy/10 hover:border-navy"
            >
              <div className="text-4xl mb-4">
                {diff.level === 'easy' && '💰'}
                {diff.level === 'medium' && '🏠'}
                {diff.level === 'hard' && '💪'}
              </div>
              <h2 className="text-2xl font-bold text-navy mb-2">{diff.title}</h2>
              <p className="text-navy/70 mb-4">{diff.description}</p>
              <div className="bg-cream rounded-lg p-3">
                <p className="text-sm text-navy/80 font-semibold">Inheritance:</p>
                <p className="text-sm text-navy">{diff.inheritance}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelectionScreen;

