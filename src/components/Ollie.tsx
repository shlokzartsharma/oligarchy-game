import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface OllieProps {
  message: string;
  onClose?: () => void;
}

const Ollie = ({ message, onClose }: OllieProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-navy rounded-2xl p-6 shadow-2xl relative">
            {/* Speech bubble tail */}
            <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-navy" />
            
            {/* Ollie avatar */}
            <div className="absolute -bottom-12 left-4 w-16 h-16 bg-gold rounded-full flex items-center justify-center text-4xl">
              🐱
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-gold font-bold text-lg mb-2">Ollie the Fatcat</h3>
                <p className="text-cream text-sm leading-relaxed">{message}</p>
              </div>
              {onClose && (
                <button
                  onClick={handleClose}
                  className="text-cream/60 hover:text-cream transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Ollie;

