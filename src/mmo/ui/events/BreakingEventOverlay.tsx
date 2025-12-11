// Breaking Event Overlay: Full-screen cinematic event display
// Shows big events with decisions and animated effects

import { motion, AnimatePresence } from 'framer-motion';
import { BigEvent } from '../../events/eventTypes';
import { useState } from 'react';

interface BreakingEventOverlayProps {
  event: BigEvent | null;
  onDecision?: (decisionId: string) => void;
  onDismiss?: () => void;
}

const BreakingEventOverlay = ({ event, onDecision, onDismiss }: BreakingEventOverlayProps) => {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  if (!event) return null;

  const handleDecision = (decisionId: string) => {
    setSelectedDecision(decisionId);
    if (onDecision) {
      onDecision(decisionId);
    }
    // Auto-dismiss after a delay
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 2000);
  };

  const getSeverityColor = (severity: BigEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 border-red-500 bg-red-50';
      case 'high':
        return 'text-orange-600 border-orange-500 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 border-yellow-500 bg-yellow-50';
      case 'low':
        return 'text-blue-600 border-blue-500 bg-blue-50';
      default:
        return 'text-navy border-navy bg-cream';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`
            max-w-3xl w-full mx-4 rounded-2xl border-4 p-8 shadow-2xl
            ${getSeverityColor(event.severity)}
          `}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-6xl mb-4"
            >
              {event.icon || '⚠️'}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-2"
            >
              {event.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl opacity-90"
            >
              {event.subheadline}
            </motion.p>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/20 rounded-xl p-6 mb-6"
          >
            <p className="text-lg leading-relaxed">{event.description}</p>
          </motion.div>

          {/* Impact Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-sm opacity-80 mb-1">Severity</div>
              <div className="text-2xl font-bold capitalize">{event.severity}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-sm opacity-80 mb-1">Duration</div>
              <div className="text-2xl font-bold">
                {Math.round(event.duration / 1000)}s
              </div>
            </div>
          </motion.div>

          {/* Decisions */}
          {event.decisions && event.decisions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <div className="text-lg font-semibold mb-3">How will you respond?</div>
              {event.decisions.map((decision) => (
                <motion.button
                  key={decision.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDecision(decision.id)}
                  disabled={selectedDecision !== null}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left transition-all
                    ${
                      selectedDecision === decision.id
                        ? 'border-gold bg-gold/20'
                        : selectedDecision !== null
                        ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                        : 'border-white/30 bg-white/10 hover:bg-white/20 cursor-pointer'
                    }
                  `}
                >
                  <div className="font-semibold mb-1">{decision.text}</div>
                  {decision.cost && (
                    <div className="text-sm opacity-80">Cost: ${decision.cost.toLocaleString()}</div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Dismiss button */}
          {(!event.decisions || event.decisions.length === 0) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={onDismiss}
              className="mt-6 w-full px-6 py-3 bg-white/20 rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              Continue
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BreakingEventOverlay;

