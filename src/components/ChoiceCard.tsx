import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState } from 'react';

interface ChoiceCardProps {
  text: string;
  onSwipe: () => void;
  side: 'left' | 'right';
  color: string;
}

const ChoiceCard = ({ text, onSwipe, side, color }: ChoiceCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], side === 'left' ? [-15, 15] : [15, -15]);
  const opacity = useTransform(x, [-200, 0, 200], side === 'left' ? [0, 1, 0] : [0, 1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      onSwipe();
    } else {
      x.set(0);
    }
  };

  const handleClick = () => {
    if (!isDragging) {
      onSwipe();
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      whileDrag={{ scale: 1.05, zIndex: 10 }}
      className={`relative w-full max-w-md mx-auto cursor-grab active:cursor-grabbing ${
        side === 'left' ? 'origin-left' : 'origin-right'
      }`}
    >
      <motion.div
        className={`rounded-2xl p-8 shadow-2xl cursor-pointer ${
          side === 'left' ? 'bg-soft-green' : 'bg-soft-red'
        }`}
        style={{ backgroundColor: color }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-navy mb-4">
            {side === 'left' ? 'Choice A' : 'Choice B'}
          </h3>
          <p className="text-lg text-navy/90 leading-relaxed">{text}</p>
        </div>
        
        {isDragging && (
          <motion.div
            className="absolute top-4 right-4 text-4xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            👆
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChoiceCard;

