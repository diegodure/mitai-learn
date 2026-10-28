import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface BotonGiganteProps {
  onClick: () => void;
  children: ReactNode;
  color?: string; // Clase de Tailwind para el color de fondo
  icon?: ReactNode;
}

export const BotonGigante = ({ 
  onClick, 
  children, 
  color = 'bg-pink-300', 
  icon 
}: BotonGiganteProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center 
        p-6 rounded-[2rem] shadow-lg 
        ${color} text-white font-bold text-2xl
        min-w-[150px] min-h-[150px]
        transition-colors duration-200
      `}
    >
      {icon && <div className="mb-2 text-4xl">{icon}</div>}
      {children}
    </motion.button>
  );
};