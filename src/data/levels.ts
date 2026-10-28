export interface GameConfig {
  id: string;
  type: 'counting' | 'classification' | 'selection'; // <-- Nuevo tipo 'selection'
  title: string;
  instruction: string;
  targetNumber?: number;
  items: {
    id: string;
    emoji: string;
    color?: 'red' | 'green' | 'yellow' | 'brown';
    size?: 'small' | 'medium' | 'large';
    isRotten?: boolean; // <-- Para el filtro
  }[];
  containers: {
    id: string;
    label: string;
    accepts: string;
    shape?: 'circle' | 'ground'; // <-- Para el juego del árbol
  }[];
  selectionOptions?: { emoji: string; isCorrect: boolean }[]; // <-- Para el juego de selección
}

export const levels: GameConfig[] = [
  // ... (contar-manzanas y clasificar-colores quedan igual) ...

  {
    id: 'clasificar-tamanos',
    type: 'classification',
    title: '¡Ordena las manzanas!',
    instruction: 'Pon las manzanas grandes en el canasto grande y las pequeñas en el canasto pequeño.',
    items: [
      { id: 'large-1', emoji: '🍎', size: 'large' },
      { id: 'large-2', emoji: '🍎', size: 'large' },
      { id: 'small-1', emoji: '🍎', size: 'small' },
      { id: 'small-2', emoji: '🍎', size: 'small' },
    ],
    containers: [
      { id: 'big-container', label: 'Grande', accepts: 'large' },
      { id: 'small-container', label: 'Pequeño', accepts: 'small' },
    ],
  },
  {
    id: 'seleccionar-animal',
    type: 'selection', // <-- Tu nueva idea
    title: '¡Encuentra al León!',
    instruction: 'Toca el león.',
    items: [], // No usamos arrastrar
    containers: [],
    selectionOptions: [
      { emoji: '🦁', isCorrect: true },
      { emoji: '🐶', isCorrect: false },
      { emoji: '🐱', isCorrect: false },
      { emoji: '🐸', isCorrect: false },
    ]
  },
  {
    id: 'sacar-podridas',
    type: 'classification',
    title: '¡Saca las manzanas podridas!',
    instruction: 'Las manzanas podridas no sirven. Arrástralas al basurero.',
    items: [
      { id: 'good-1', emoji: '🍎', color: 'red' },
      { id: 'good-2', emoji: '🍎', color: 'red' },
      { id: 'bad-1', emoji: '🍎', color: 'brown', isRotten: true }, // <-- Filtro CSS
      { id: 'bad-2', emoji: '🍎', color: 'brown', isRotten: true },
    ],
    containers: [
      { id: 'good-container', label: 'Buenas', accepts: 'red' },
      { id: 'bad-container', label: 'Basurero', accepts: 'brown' },
    ],
  },
  {
    id: 'del-arbol-al-suelo',
    type: 'classification',
    title: '¡Las manzanas caen del árbol!',
    instruction: 'El árbol está arriba. Arrastra las manzanas al suelo.',
    items: [
      { id: 'tree-1', emoji: '🍎', color: 'red' },
      { id: 'tree-2', emoji: '🍎', color: 'red' },
      { id: 'tree-3', emoji: '🍏', color: 'green' },
    ],
    containers: [
      { id: 'floor-container', label: 'Suelo', accepts: 'all', shape: 'ground' }, // <-- Rectángulo de pasto
    ],
  },
];