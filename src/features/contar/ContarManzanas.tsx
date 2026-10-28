import { useState, useEffect } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useGameStore } from '../../store/useGameStore';
import { speechService } from '../../services/speechService';

// --- Componente de Manzana Arrastrable ---
const ManzanaArrastrable = ({ id, disabled }: { id: string; disabled: boolean }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`text-6xl cursor-grab active:cursor-grabbing select-none ${
        disabled ? 'opacity-30 pointer-events-none' : ''
      }`}
    >
      🍎
    </div>
  );
};

// --- Componente del Canasto (Zona de Soltar) ---
const Canasto = ({ children, isOver }: { children: React.ReactNode; isOver: boolean }) => {
  const { setNodeRef } = useDroppable({ id: 'canasto' });

  return (
    <div
      ref={setNodeRef}
      className={`w-48 h-48 rounded-full border-4 border-dashed flex items-center justify-center transition-colors ${
        isOver ? 'border-green-500 bg-green-100' : 'border-gray-400 bg-white/50'
      }`}
    >
      {children}
    </div>
  );
};

// --- Pantalla Principal del Juego ---
export const ContarManzanas = ({ onBack }: { onBack: () => void }) => {
  const { addStars } = useGameStore();
  const [targetNumber] = useState(() => Math.floor(Math.random() * 5) + 1);
  const [manzanasEnCanasto, setManzanasEnCanasto] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // 1. Efecto SOLO para reproducir la instrucción al montar (sin isCompleted)
  useEffect(() => {
    const timer = setTimeout(() => {
      speechService.speak({
        text: `Arrastra ${targetNumber} manzanas al canasto. ¡Tú puedes!`,
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      // No detenemos el audio aquí para evitar cortar el audio de éxito
    };
  }, [targetNumber]);

  // 2. Sincronizar isCompleted cuando cambia manzanasEnCanasto
  useEffect(() => {
    setIsCompleted(manzanasEnCanasto.length === targetNumber);
  }, [manzanasEnCanasto, targetNumber]);

  // 3. Limpieza al desmontar (solo cuando el componente desaparece)
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    setIsOver(false);
    const { over, active } = event;

    if (over && over.id === 'canasto') {
      if (!manzanasEnCanasto.includes(active.id as string)) {
        setManzanasEnCanasto((prev) => [...prev, active.id as string]);
      }
    }
  };

  const handleSuccess = () => {
    setIsCompleted(true);
    speechService.speak({ text: '¡Muy bien! ¡Lo lograste!' });
    setShowConfetti(true);
    addStars(5);
    setTimeout(() => {
      setShowConfetti(false);
      onBack();
    }, 3000);
  };

  const handleBack = () => {
    speechService.stop();
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 bg-white/80 p-3 rounded-full shadow-md text-xl z-10"
      >
        ⬅️ Volver
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Arrastra las manzanas al canasto!
        </h2>
        <p className="text-xl text-gray-600 mb-4">Coloca esta cantidad:</p>
        <motion.div
          key={targetNumber}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-8xl font-extrabold text-red-600 drop-shadow-lg"
        >
          {targetNumber}
        </motion.div>
        <button
          onClick={() => speechService.speak({ text: `Coloca ${targetNumber} manzanas` })}
          className="text-3xl bg-white/50 p-3 rounded-full shadow-sm mt-4"
          aria-label="Escuchar instrucción"
        >
          🔊
        </button>
      </div>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragOver={(event) => setIsOver(event.over?.id === 'canasto')}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-4xl">
          <div className="flex flex-wrap gap-2 justify-center max-w-[200px] min-h-[150px] items-center bg-white/40 p-4 rounded-2xl">
            {[...Array(5)].map((_, i) => {
              const id = `manzana-${i}`;
              const isAlreadyInBasket = manzanasEnCanasto.includes(id);
              return (
                <ManzanaArrastrable
                  key={id}
                  id={id}
                  disabled={isAlreadyInBasket || isCompleted}
                />
              );
            })}
          </div>

          <Canasto isOver={isOver}>
            <div className="flex flex-wrap gap-1 justify-center items-center p-2">
              {manzanasEnCanasto.map((id) => (
                <motion.div
                  key={id}
                  initial={{ scale: 0, y: -50 }}
                  animate={{ scale: 1, y: 0 }}
                  className="text-4xl"
                >
                  🍎
                </motion.div>
              ))}
            </div>
          </Canasto>
        </div>
      </DndContext>

      <AnimatePresence>
        {isCompleted && (
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={handleSuccess}
            className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full text-2xl shadow-xl transition-transform active:scale-95"
          >
            ¡Lo lograste! 🎉
          </motion.button>
        )}
      </AnimatePresence>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
          colors={['#f87171', '#34d399', '#fbbf24', '#60a5fa']}
        />
      )}
    </div>
  );
};