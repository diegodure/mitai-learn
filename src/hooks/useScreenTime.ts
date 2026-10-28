import { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useScreenTime = () => {
  const { 
    currentScreenTime, 
    maxScreenTime, 
    incrementScreenTime, 
    resetScreenTime 
  } = useGameStore();
  
  const [showPauseModal, setShowPauseModal] = useState(false);

  useEffect(() => {
    // Si ya se alcanzó el límite, mostramos el modal y no seguimos contando
    if (currentScreenTime >= maxScreenTime) {
      setShowPauseModal(true);
      return;
    }

    // Contador que suma 1 cada minuto (60,000 ms)
    const interval = setInterval(() => {
      incrementScreenTime();
    }, 60000); 

    return () => clearInterval(interval);
  }, [currentScreenTime, maxScreenTime, incrementScreenTime]);

  const handleResume = () => {
    // El niño hizo la pausa activa, reiniciamos el contador
    resetScreenTime();
    setShowPauseModal(false);
  };

  return {
    showPauseModal,
    handleResume,
    currentScreenTime,
    maxScreenTime,
  };
};