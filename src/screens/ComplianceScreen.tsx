import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Ollie from '../components/Ollie';

const ComplianceScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream p-4">
      <div className="max-w-3xl mx-auto pt-20">
        <Link
          to="/"
          className="text-navy/70 hover:text-navy transition-colors flex items-center gap-2 mb-4"
        >
          ← Back to Home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl mb-8"
        >
          <h1 className="text-4xl font-bold text-navy mb-6">Educational Intent</h1>
          <div className="space-y-4 text-navy/80 leading-relaxed">
            <p>
              Welcome to <strong>Oligarchy: Quick Play</strong> - an educational game designed to teach financial literacy through interactive gameplay.
            </p>
            <p>
              This game simulates real-world financial scenarios to help you learn about:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Banking and account management</li>
              <li>Credit scores and credit cards</li>
              <li>Budgeting and saving</li>
              <li>Investing and market cycles</li>
              <li>Long-term financial planning</li>
            </ul>
            <p className="mt-6">
              <strong>Note:</strong> This is an educational simulation. Real-world financial decisions should be made with professional advice.
            </p>
          </div>
        </motion.div>

        <Ollie message="Hi! I'm Ollie, your financial guide. I'll help you learn about money management throughout your journey. Ready to start?" />

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/quick-play/character')}
          className="w-full bg-navy text-cream px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
};

export default ComplianceScreen;

