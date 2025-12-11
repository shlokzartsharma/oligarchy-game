import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Gender, AgeTrack } from '../types/game';

const avatars = ['👤', '👨', '👩', '🧑', '🐱', '🐶', '🐻', '🦊', '🐰', '🐸'];

const CharacterCreationScreen = () => {
  const navigate = useNavigate();
  const initializeGame = useGameStore((state) => state.initializeGame);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('non-binary');
  const [ageTrack, setAgeTrack] = useState<AgeTrack>('student');
  const [avatar, setAvatar] = useState('👤');

  const handleStart = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    initializeGame({
      name: name.trim(),
      gender,
      ageTrack,
      avatar,
    });

    navigate('/quick-play/difficulty');
  };

  return (
    <div className="min-h-screen bg-cream p-4 pt-24">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="text-navy/70 hover:text-navy transition-colors flex items-center gap-2 mb-4"
        >
          ← Back to Home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <h1 className="text-4xl font-bold text-navy mb-8 text-center">
            Create Your Character
          </h1>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-navy font-semibold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg border-2 border-navy/20 focus:border-navy focus:outline-none text-navy"
              />
            </div>

            {/* Age Track */}
            <div>
              <label className="block text-navy font-semibold mb-2">Age Track</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAgeTrack('student')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    ageTrack === 'student'
                      ? 'border-navy bg-navy text-cream'
                      : 'border-navy/20 bg-white text-navy hover:border-navy'
                  }`}
                >
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="font-bold">Student (14-18)</div>
                  <div className="text-sm mt-1">Learn the basics</div>
                </button>
                <button
                  onClick={() => setAgeTrack('adult')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    ageTrack === 'adult'
                      ? 'border-navy bg-navy text-cream'
                      : 'border-navy/20 bg-white text-navy hover:border-navy'
                  }`}
                >
                  <div className="text-2xl mb-2">💼</div>
                  <div className="font-bold">Adult (25-65)</div>
                  <div className="text-sm mt-1">Full career mode</div>
                </button>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-navy font-semibold mb-2">Gender</label>
              <div className="grid grid-cols-3 gap-4">
                {(['male', 'female', 'non-binary'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`p-3 rounded-lg border-2 transition-all capitalize ${
                      gender === g
                        ? 'border-navy bg-navy text-cream'
                        : 'border-navy/20 bg-white text-navy hover:border-navy'
                    }`}
                  >
                    {g.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-navy font-semibold mb-2">Avatar</label>
              <div className="grid grid-cols-5 gap-4">
                {avatars.map((av) => (
                  <button
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`p-4 rounded-lg border-2 transition-all text-4xl ${
                      avatar === av
                        ? 'border-gold bg-gold/20 scale-110'
                        : 'border-navy/20 bg-white hover:border-navy'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="w-full bg-navy text-cream px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-shadow mt-8"
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CharacterCreationScreen;

