// src/features/game/GameEngine.tsx
import { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useGameStore } from '../../store/useGameStore';
import { speechService } from '../../services/speechService';
import { Arrastrable } from '../../components/ui/Arrastrable';
import { Contenedor } from '../../components/ui/Contenedor';
import { type GameConfig } from '../../data/levels';
import { SelectionGame } from './SelectionGame'; 

interface GameEngineProps {
  config: GameConfig;
  onBack: () => void;
}

export const GameEngine = ({ config, onBack }: GameEngineProps) => {
  const { addStars } = useGameStore();
  const [placedItems, setPlacedItems] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOver, setIsOver] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Audio inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      speechService.speak({ text: config.instruction });
    }, 500);
    return () => clearTimeout(timer);
  }, [config.instruction]);

  // Sincronizar completado
  useEffect(() => {
    if (config.type === 'counting' && config.targetNumber) {
      // Conteo: completado cuando se alcanza el número objetivo
      setIsCompleted(placedItems.length === config.targetNumber);
    } else {
      // Clasificación: completado cuando TODOS los ítems están colocados
      setIsCompleted(placedItems.length === config.items.length);
    }
  }, [placedItems, config]);

  const handleDragEnd = (event: DragEndEvent) => {
    setIsOver(null);
    const { over, active } = event;
    if (!over) return;

    const draggedItem = config.items.find(i => i.id === active.id);
    const container = config.containers.find(c => c.id === over.id);
    if (!draggedItem || !container) return;

    // Validación: acepta 'all', o si coincide el color, o si coincide el tamaño
    const isAccepted = 
      container.accepts === 'all' || 
      container.accepts === draggedItem.color ||
      container.accepts === draggedItem.size;

    if (isAccepted) {
      setPlacedItems(prev => [...prev, active.id as string]);
      
      if (config.type === 'counting') {
        const count = placedItems.length + 1;
        speechService.speak({ text: `¡${count}!` });
      }
    } else {
      setFeedback('¡Ups! Esa no va aquí.');
      speechService.speak({ text: '¡Ups! Esa no va aquí. Intenta con otra.' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleSuccess = () => {
    speechService.speak({ text: '¡Muy bien! ¡Lo lograste!' });
    setShowConfetti(true);
    addStars(5);
    setTimeout(() => {
      setShowConfetti(false);
      onBack();
    }, 3000);
  };

  if (config.type === 'selection') {
    return <SelectionGame config={config} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/80 p-3 rounded-full shadow-md text-xl z-10">
        ⬅️ Volver
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{config.title}</h2>
      <p className="text-xl text-gray-600 mb-4">{config.instruction}</p>

      {config.targetNumber && (
        <motion.div
          key={config.targetNumber}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-8xl font-extrabold text-red-600 drop-shadow-lg mb-6"
        >
          {config.targetNumber}
        </motion.div>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragOver={(e) => setIsOver(e.over?.id as string)}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-4xl">
          
          {/* Origen (con fondo de árbol si aplica) */}
          <div className={`flex flex-wrap gap-4 justify-center max-w-[250px] min-h-[150px] items-center p-4 rounded-2xl relative ${
            config.id === 'del-arbol-al-suelo' 
              ? 'bg-green-200/50 border-4 border-green-300' 
              : 'bg-white/40'
          }`}>
            {/* Ícono de árbol si es el juego del árbol */}
            {config.id === 'del-arbol-al-suelo' && (
              <div className="absolute -top-6 text-4xl">🌳</div>
            )}
            {config.items
              .filter(item => !placedItems.includes(item.id))
              .map(item => (
                <Arrastrable
                    key={item.id}
                    id={item.id}
                    emoji={item.emoji}
                    size={item.size}
                    isRotten={item.isRotten} // <-- Pasar la propiedad
                    disabled={isCompleted}
                />
              ))}
          </div>

          {/* Contenedores */}
          <div className="flex gap-8 flex-wrap justify-center items-end">
            {config.containers.map(container => {
              // Determinar el color del contenedor
              let containerColor: 'red' | 'green' | 'blue' | 'brown' | 'gray' = 'gray';
              if (container.accepts === 'red') containerColor = 'red';
              else if (container.accepts === 'green') containerColor = 'green';
              else if (container.accepts === 'blue') containerColor = 'blue';
              else if (container.accepts === 'brown') containerColor = 'brown';
              // Para tamaños, usamos colores distintos
              else if (container.accepts === 'large') containerColor = 'blue';
              else if (container.accepts === 'small') containerColor = 'red';

              // Determinar el tamaño del contenedor
              let containerSize: 'small' | 'medium' | 'large' = 'medium';
              if (container.accepts === 'large') containerSize = 'large';
              else if (container.accepts === 'small') containerSize = 'small';

              return (
                <Contenedor
                    key={container.id}
                    id={container.id}
                    isOver={isOver === container.id}
                    color={containerColor}
                    size={containerSize}
                    shape={container.shape} // <-- Pasar la propiedad
                >
                  {placedItems
                    .filter(id => {
                      const item = config.items.find(i => i.id === id);
                      return item?.color === container.accepts || 
                             item?.size === container.accepts || 
                             container.accepts === 'all';
                    })
                    .map(id => {
                      const item = config.items.find(i => i.id === id);
                      return (
                        <motion.div 
                          key={id} 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className={`${
                            item?.size === 'large' ? 'text-6xl' : 
                            item?.size === 'small' ? 'text-3xl' : 'text-4xl'
                          }`}
                        >
                          {item?.emoji}
                        </motion.div>
                      );
                    })}
                </Contenedor>
              );
            })}
          </div>
        </div>
      </DndContext>

      {/* Feedback de error */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-20 bg-yellow-200 text-yellow-800 font-bold px-6 py-2 rounded-full shadow-md">
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

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

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} recycle={false} colors={['#f87171', '#34d399', '#fbbf24', '#60a5fa']} />}
    </div>
  );
};