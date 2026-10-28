import { useState } from 'react'; // <--- Importar useState
import { BotonGigante } from '../../components/ui/BotonGigante';
import { useGameStore } from '../../store/useGameStore';
import { useScreenTime } from '../../hooks/useScreenTime';
import { motion, AnimatePresence } from 'framer-motion';
import { ContarManzanas } from '../contar/ContarManzanas'; // <--- Importar el juego

import { GameEngine } from '../game/GameEngine';
import { levels } from '../../data/levels';

export const MundoSemilla = () => {
  const { stars, avatar, addStars } = useGameStore();
  const { showPauseModal, handleResume } = useScreenTime();
  
  // Estado para controlar si estamos en el juego de contar
  const [isPlayingContar, setIsPlayingContar] = useState(false);

  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame) {
    const config = levels.find(l => l.id === selectedGame);
    if (config) {
      return <GameEngine config={config} onBack={() => setSelectedGame(null)} />;
    }
  }

  // Si está jugando a contar, mostramos el juego
  if (isPlayingContar) {
    return <ContarManzanas onBack={() => setIsPlayingContar(false)} />;
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-100 p-6 flex flex-col items-center">
      
      {/* Barra superior: Estrellas y Avatar */}
      <div className="w-full max-w-md flex justify-between items-center mb-8 bg-white/50 p-4 rounded-full shadow-sm">
        <div className="flex items-center gap-2 text-2xl font-bold text-yellow-600">
          <span>⭐</span> {stars}
        </div>
        <div className="text-4xl">
          {avatar === 'semilla' ? '🌱' : '🐣'}
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-green-800 mb-10 text-center">
        Mundo Semilla 🌿
      </h1>

      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <BotonGigante onClick={() => setSelectedGame('contar-manzanas')} color="bg-red-400" icon="🍎">
          Contar
        </BotonGigante>
        <BotonGigante onClick={() => setSelectedGame('clasificar-colores')} color="bg-blue-400" icon="🎨">
          Colores
        </BotonGigante>
        <BotonGigante onClick={() => setSelectedGame('clasificar-tamanos')} color="bg-green-400" icon="📏">
          Tamaños
        </BotonGigante>
        <BotonGigante onClick={() => setSelectedGame('seleccionar-animal')} color="bg-purple-400" icon="🦁">
          Animales
        </BotonGigante>
        <BotonGigante onClick={() => setSelectedGame('sacar-podridas')} color="bg-amber-500" icon="🍂">
          Podridas
        </BotonGigante>
        <BotonGigante onClick={() => setSelectedGame('del-arbol-al-suelo')} color="bg-teal-400" icon="🌳">
          Del Árbol
        </BotonGigante>
      </div>

      {/* Modal de Pausa Activa (Salud y Bienestar) */}
      <AnimatePresence>
        {showPauseModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="text-6xl mb-4">🧘‍♂️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Hora de un descanso!
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Mira lejos por la ventana y estírate por 5 minutos para cuidar tus ojitos.
              </p>
              <button
                onClick={handleResume}
                className="bg-green-500 text-white font-bold py-3 px-6 rounded-full text-xl w-full hover:bg-green-600 transition-colors"
              >
                ¡Ya me estiré!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};