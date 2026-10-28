import { useDraggable } from '@dnd-kit/core';

interface ArrastrableProps {
  id: string;
  emoji: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  isRotten?: boolean; // <-- Nueva propiedad
}

export const Arrastrable = ({ 
  id, 
  emoji, 
  disabled, 
  size = 'medium',
  isRotten = false // <-- Por defecto false
}: ArrastrableProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ 
    id, 
    disabled 
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const sizeClass = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl',
  }[size];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        ${sizeClass} cursor-grab active:cursor-grabbing select-none
        ${disabled ? 'opacity-30 pointer-events-none' : ''}
        ${isDragging ? 'z-50 relative' : 'relative'}
        ${isRotten ? 'grayscale opacity-60 brightness-75 sepia' : ''} // <-- Filtro CSS
      `}
    >
      {emoji}
    </div>
  );
};