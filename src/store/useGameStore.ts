import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  // Datos del niño
  stars: number;
  avatar: string;
  unlockedItems: string[];
  
  // Configuración de salud y padre
  maxScreenTime: number; // en minutos
  currentScreenTime: number;
  isDyslexicFont: boolean;
  isDarkMode: boolean;
  
  // Acciones
  addStars: (amount: number) => void;
  spendStars: (amount: number) => void;
  unlockItem: (item: string) => void;
  setAvatar: (avatar: string) => void;
  setMaxScreenTime: (minutes: number) => void;
  incrementScreenTime: () => void;
  resetScreenTime: () => void;
  toggleDyslexicFont: () => void;
  toggleDarkMode: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      stars: 0,
      avatar: 'semilla',
      unlockedItems: ['semilla'],
      maxScreenTime: 20,
      currentScreenTime: 0,
      isDyslexicFont: false,
      isDarkMode: false,

      addStars: (amount) => set((state) => ({ stars: state.stars + amount })),
      spendStars: (amount) => set((state) => ({ 
        stars: Math.max(0, state.stars - amount) 
      })),
      unlockItem: (item) => set((state) => ({ 
        unlockedItems: [...state.unlockedItems, item] 
      })),
      setAvatar: (avatar) => set({ avatar }),
      setMaxScreenTime: (minutes) => set({ maxScreenTime: minutes }),
      incrementScreenTime: () => set((state) => ({ 
        currentScreenTime: state.currentScreenTime + 1 
      })),
      resetScreenTime: () => set({ currentScreenTime: 0 }),
      toggleDyslexicFont: () => set((state) => ({ 
        isDyslexicFont: !state.isDyslexicFont 
      })),
      toggleDarkMode: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode 
      })),
    }),
    {
      name: 'mitai-storage', // Nombre de la clave en localStorage
    }
  )
);