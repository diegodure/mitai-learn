import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useGameStore } from '../../store/useGameStore';
import { speechService } from '../../services/speechService';
import { type GameConfig } from '../../data/levels';

interface SelectionGameProps {
  config: GameConfig;
  onBack: () => void;
}

export const SelectionGame = ({ config, onBack }: SelectionGameProps) => {
  const { addStars } = useGameStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wrongSelection, setWrongSelection] = useState<number | null>(null);

  const handleOptionClick = (index: number, isCorrect: boolean) => {
    if (isCompleted) return;

    if (isCorrect) {
      setIsCompleted(true);
      speechService.speak({ text: '¡Muy bien! ¡Es el león!' });
      setShowConfetti(true);
      addStars(5);
      setTimeout(() => {
        setShowConfetti(false);
        onBack();
      }, 3000);
    } else {
      // Error amigable: sacudir la opción y sonar
      setWrongSelection(index);
      speechService.speak({ text: '¡Ups! Intenta de nuevo.' });
      setTimeout(() => setWrongSelection(null), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/80 p-3 rounded-full shadow-md text-xl z-10">
        ⬅️ Volver
      </button>

      <h2 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">{config.title}</h2>
      
      <button 
        onClick={() => speechService.speak({ text: config.instruction })}
        className="mb-8 bg-white/50 p-4 rounded-full shadow-sm text-3xl"
      >
        🔊
      </button>

      <div className="grid grid-cols-2 gap-6 md:gap-12 max-w-2xl">
        {config.selectionOptions?.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleOptionClick(index, option.isCorrect)}
            animate={wrongSelection === index ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`
              w-32 h-32 md:w-48 md:h-48 rounded-3xl shadow-xl flex items-center justify-center text-6xl md:text-8xl
              bg-white hover:bg-gray-50 transition-colors
              ${wrongSelection === index ? 'border-4 border-red-500' : ''}
            `}
          >
            {option.emoji}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-3xl font-bold text-green-600 bg-white px-8 py-4 rounded-full shadow-lg"
          >
            ¡Lo lograste! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} recycle={false} colors={['#f87171', '#34d399', '#fbbf24', '#60a5fa']} />}
    </div>
  );
};