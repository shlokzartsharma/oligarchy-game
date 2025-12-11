import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="text-navy/70 hover:text-navy transition-colors flex items-center gap-2"
        >
          ← Back to Home
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl md:text-8xl font-bold text-navy mb-4"
        >
          Oligarchy
        </motion.h1>
        <motion.p
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl md:text-3xl text-gold mb-8"
        >
          Quick Play
        </motion.p>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-lg text-navy/70 mb-12"
        >
          Master financial literacy through interactive gameplay
        </motion.p>
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/quick-play/compliance')}
          className="bg-navy text-cream px-12 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Game
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SplashScreen;

