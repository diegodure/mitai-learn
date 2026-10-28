import { useDroppable } from '@dnd-kit/core';

interface ContenedorProps {
  id: string;
  children: React.ReactNode;
  isOver: boolean;
  color?: 'red' | 'green' | 'gray' | 'blue' | 'brown';
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'ground'; // <-- Nueva propiedad
}

export const Contenedor = ({ 
  id, children, isOver, color = 'gray', size = 'medium', shape = 'circle'
}: ContenedorProps) => {
  const { setNodeRef } = useDroppable({ id });

  const colorMap = {
    red: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-600' },
    green: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-600' },
    brown: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-600' },
    gray: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-600' },
  };

  const sizeMap = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  };

  const theme = colorMap[color] || colorMap.gray;
  const sizeClass = sizeMap[size] || sizeMap.medium;

  // Si es 'ground', renderizamos un rectángulo verde con pasto
  if (shape === 'ground') {
    return (
      <div
        ref={setNodeRef}
        className={`
          w-64 h-32 rounded-2xl border-b-8 border-green-600 flex items-end justify-center pb-2 transition-all
          bg-green-300 relative overflow-hidden
          ${isOver ? 'scale-105 shadow-lg border-green-700' : ''}
        `}
      >
        {/* Textura de pasto simple */}
        <div className="absolute bottom-0 w-full h-8 bg-green-400 opacity-50"></div>
        <div className="flex flex-wrap gap-1 justify-center items-center z-10">
          {children}
        </div>
        <span className="absolute bottom-1 text-3xl text-green-700">🌱🌱🌱</span>
      </div>
    );
  }

  // Renderizado por defecto (círculo)
  return (
    <div
      ref={setNodeRef}
      className={`
        ${sizeClass} rounded-full border-4 border-dashed flex items-center justify-center transition-all
        ${isOver ? 'scale-105 border-4 shadow-lg' : ''}
        ${theme.bg} ${theme.border}
      `}
    >
      <div className="flex flex-wrap gap-1 justify-center items-center p-2">
        {children}
      </div>
    </div>
  );
};