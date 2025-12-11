import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { professions } from '../data/professions';

const ProfessionSelectionScreen = () => {
  const navigate = useNavigate();
  const { profile, initializeGame } = useGameStore();

  const handleSelect = (professionName: string) => {
    initializeGame({
      ...profile,
      profession: professionName,
    });
    navigate('/quick-play/game');
  };

  return (
    <div className="min-h-screen bg-cream p-4 pt-24">
      <div className="max-w-5xl mx-auto">
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
          Choose Your Profession
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {professions.map((prof, index) => (
            <motion.button
              key={prof.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(prof.name)}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-left border-2 border-navy/10 hover:border-navy"
            >
              <h3 className="text-xl font-bold text-navy mb-2">{prof.name}</h3>
              <p className="text-navy/70 text-sm mb-3">{prof.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-gold font-bold text-lg">
                  ${prof.salary.toLocaleString()}/year
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionSelectionScreen;

