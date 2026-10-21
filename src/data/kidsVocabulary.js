/**
 * Vocabulario visual especialmente curado para niños pre-lectores (3 a 7 años).
 * Enfocado en reconocimiento visual inmediato (emojis e iconos gigantes),
 * colores distintivos y sonidos fáciles de pronunciar en inglés.
 */

export const KIDS_CATEGORIES = [
  { id: 'animals', label: 'Animales', emoji: '🦁', color: '#10b981', bg: '#ecfdf5' },
  { id: 'food', label: 'Comida', emoji: '🍎', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'colors', label: 'Colores', emoji: '🎨', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'nature', label: 'Naturaleza', emoji: '🌈', color: '#06b6d4', bg: '#ecfeff' },
  { id: 'vehicles', label: 'Vehículos', emoji: '🚀', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'toys', label: 'Juguetes', emoji: '🧸', color: '#ec4899', bg: '#fdf2f8' },
  { id: 'numbers', label: 'Números', emoji: '🔢', color: '#14b8a6', bg: '#f0fdfa' },
];

export const KIDS_ITEMS = [
  // Animales
  { id: 'dog', word: 'Dog', spanish: 'Perro', emoji: '🐶', category: 'animals', color: '#f59e0b', soundText: 'Woof woof! Dog' },
  { id: 'cat', word: 'Cat', spanish: 'Gato', emoji: '🐱', category: 'animals', color: '#f97316', soundText: 'Meow! Cat' },
  { id: 'lion', word: 'Lion', spanish: 'León', emoji: '🦁', category: 'animals', color: '#eab308', soundText: 'Roar! Lion' },
  { id: 'elephant', word: 'Elephant', spanish: 'Elefante', emoji: '🐘', category: 'animals', color: '#64748b', soundText: 'Elephant' },
  { id: 'monkey', word: 'Monkey', spanish: 'Mono', emoji: '🐒', category: 'animals', color: '#b45309', soundText: 'Ooh ooh aah aah! Monkey' },
  { id: 'rabbit', word: 'Rabbit', spanish: 'Conejo', emoji: '🐰', category: 'animals', color: '#ec4899', soundText: 'Hop hop! Rabbit' },
  { id: 'cow', word: 'Cow', spanish: 'Vaca', emoji: '🐮', category: 'animals', color: '#059669', soundText: 'Moo! Cow' },
  { id: 'pig', word: 'Pig', spanish: 'Cerdito', emoji: '🐷', category: 'animals', color: '#f43f5e', soundText: 'Oink oink! Pig' },
  { id: 'fish', word: 'Fish', spanish: 'Pez', emoji: '🐟', category: 'animals', color: '#0284c7', soundText: 'Blub blub! Fish' },
  { id: 'bird', word: 'Bird', spanish: 'Pájaro', emoji: '🐦', category: 'animals', color: '#06b6d4', soundText: 'Chirp chirp! Bird' },
  { id: 'duck', word: 'Duck', spanish: 'Pato', emoji: '🦆', category: 'animals', color: '#10b981', soundText: 'Quack quack! Duck' },
  { id: 'frog', word: 'Frog', spanish: 'Rana', emoji: '🐸', category: 'animals', color: '#22c55e', soundText: 'Ribbit ribbit! Frog' },
  { id: 'bear', word: 'Bear', spanish: 'Oso', emoji: '🐻', category: 'animals', color: '#78350f', soundText: 'Bear' },
  { id: 'panda', word: 'Panda', spanish: 'Panda', emoji: '🐼', category: 'animals', color: '#334155', soundText: 'Panda' },

  // Comida
  { id: 'apple', word: 'Apple', spanish: 'Manzana', emoji: '🍎', category: 'food', color: '#ef4444' },
  { id: 'banana', word: 'Banana', spanish: 'Plátano', emoji: '🍌', category: 'food', color: '#eab308' },
  { id: 'pizza', word: 'Pizza', spanish: 'Pizza', emoji: '🍕', category: 'food', color: '#f97316' },
  { id: 'icecream', word: 'Ice Cream', spanish: 'Helado', emoji: '🍦', category: 'food', color: '#ec4899' },
  { id: 'milk', word: 'Milk', spanish: 'Leche', emoji: '🥛', category: 'food', color: '#3b82f6' },
  { id: 'cookie', word: 'Cookie', spanish: 'Galleta', emoji: '🍪', category: 'food', color: '#b45309' },
  { id: 'strawberry', word: 'Strawberry', spanish: 'Fresa', emoji: '🍓', category: 'food', color: '#f43f5e' },
  { id: 'watermelon', word: 'Watermelon', spanish: 'Sandía', emoji: '🍉', category: 'food', color: '#10b981' },
  { id: 'cake', word: 'Cake', spanish: 'Pastel', emoji: '🍰', category: 'food', color: '#ec4899' },
  { id: 'burger', word: 'Burger', spanish: 'Hamburguesa', emoji: '🍔', category: 'food', color: '#d97706' },

  // Colores
  { id: 'red', word: 'Red', spanish: 'Rojo', emoji: '🔴', category: 'colors', color: '#ef4444', cardBg: '#fee2e2' },
  { id: 'blue', word: 'Blue', spanish: 'Azul', emoji: '🔵', category: 'colors', color: '#3b82f6', cardBg: '#dbeafe' },
  { id: 'green', word: 'Green', spanish: 'Verde', emoji: '🟢', category: 'colors', color: '#22c55e', cardBg: '#dcfce7' },
  { id: 'yellow', word: 'Yellow', spanish: 'Amarillo', emoji: '🟡', category: 'colors', color: '#eab308', cardBg: '#fef9c3' },
  { id: 'orange_c', word: 'Orange', spanish: 'Naranja', emoji: '🟠', category: 'colors', color: '#f97316', cardBg: '#ffedd5' },
  { id: 'pink', word: 'Pink', spanish: 'Rosa', emoji: '💗', category: 'colors', color: '#ec4899', cardBg: '#fce7f3' },
  { id: 'purple', word: 'Purple', spanish: 'Morado', emoji: '🟣', category: 'colors', color: '#a855f7', cardBg: '#f3e8ff' },
  { id: 'white', word: 'White', spanish: 'Blanco', emoji: '⚪', category: 'colors', color: '#94a3b8', cardBg: '#f8fafc' },
  { id: 'black', word: 'Black', spanish: 'Negro', emoji: '⚫', category: 'colors', color: '#1e293b', cardBg: '#e2e8f0' },

  // Naturaleza
  { id: 'sun', word: 'Sun', spanish: 'Sol', emoji: '☀️', category: 'nature', color: '#f59e0b' },
  { id: 'moon', word: 'Moon', spanish: 'Luna', emoji: '🌙', category: 'nature', color: '#6366f1' },
  { id: 'star', word: 'Star', spanish: 'Estrella', emoji: '⭐', category: 'nature', color: '#eab308' },
  { id: 'cloud', word: 'Cloud', spanish: 'Nube', emoji: '☁️', category: 'nature', color: '#38bdf8' },
  { id: 'rain', word: 'Rain', spanish: 'Lluvia', emoji: '🌧️', category: 'nature', color: '#0284c7' },
  { id: 'flower', word: 'Flower', spanish: 'Flor', emoji: '🌸', category: 'nature', color: '#ec4899' },
  { id: 'tree', word: 'Tree', spanish: 'Árbol', emoji: '🌳', category: 'nature', color: '#15803d' },
  { id: 'rainbow', word: 'Rainbow', spanish: 'Arcoíris', emoji: '🌈', category: 'nature', color: '#8b5cf6' },
  { id: 'fire', word: 'Fire', spanish: 'Fuego', emoji: '🔥', category: 'nature', color: '#ea580c' },
  { id: 'snow', word: 'Snow', spanish: 'Nieve', emoji: '❄️', category: 'nature', color: '#0ea5e9' },

  // Vehículos
  { id: 'car', word: 'Car', spanish: 'Coche', emoji: '🚗', category: 'vehicles', color: '#ef4444' },
  { id: 'airplane', word: 'Airplane', spanish: 'Avión', emoji: '✈️', category: 'vehicles', color: '#3b82f6' },
  { id: 'train', word: 'Train', spanish: 'Tren', emoji: '🚂', category: 'vehicles', color: '#10b981' },
  { id: 'bus', word: 'Bus', spanish: 'Autobús', emoji: '🚌', category: 'vehicles', color: '#eab308' },
  { id: 'rocket', word: 'Rocket', spanish: 'Cohete', emoji: '🚀', category: 'vehicles', color: '#8b5cf6' },
  { id: 'bicycle', word: 'Bicycle', spanish: 'Bicicleta', emoji: '🚲', category: 'vehicles', color: '#06b6d4' },
  { id: 'boat', word: 'Boat', spanish: 'Barco', emoji: '⛵', category: 'vehicles', color: '#0284c7' },

  // Juguetes
  { id: 'teddy', word: 'Teddy Bear', spanish: 'Oso de peluche', emoji: '🧸', category: 'toys', color: '#b45309' },
  { id: 'ball', word: 'Ball', spanish: 'Pelota', emoji: '⚽', category: 'toys', color: '#059669' },
  { id: 'balloon', word: 'Balloon', spanish: 'Globo', emoji: '🎈', category: 'toys', color: '#ef4444' },
  { id: 'guitar', word: 'Guitar', spanish: 'Guitarra', emoji: '🎸', category: 'toys', color: '#f59e0b' },
  { id: 'paint', word: 'Paint', spanish: 'Pintura', emoji: '🎨', category: 'toys', color: '#8b5cf6' },
  { id: 'present', word: 'Present', spanish: 'Regalo', emoji: '🎁', category: 'toys', color: '#ec4899' },

  // Números
  { id: 'num_1', word: 'One', spanish: 'Uno', emoji: '1️⃣', category: 'numbers', color: '#ef4444' },
  { id: 'num_2', word: 'Two', spanish: 'Dos', emoji: '2️⃣', category: 'numbers', color: '#f97316' },
  { id: 'num_3', word: 'Three', spanish: 'Tres', emoji: '3️⃣', category: 'numbers', color: '#f59e0b' },
  { id: 'num_4', word: 'Four', spanish: 'Cuatro', emoji: '4️⃣', category: 'numbers', color: '#10b981' },
  { id: 'num_5', word: 'Five', spanish: 'Cinco', emoji: '5️⃣', category: 'numbers', color: '#06b6d4' },
  { id: 'num_6', word: 'Six', spanish: 'Seis', emoji: '6️⃣', category: 'numbers', color: '#3b82f6' },
  { id: 'num_7', word: 'Seven', spanish: 'Siete', emoji: '7️⃣', category: 'numbers', color: '#8b5cf6' },
  { id: 'num_8', word: 'Eight', spanish: 'Ocho', emoji: '8️⃣', category: 'numbers', color: '#ec4899' },
  { id: 'num_9', word: 'Nine', spanish: 'Nueve', emoji: '9️⃣', category: 'numbers', color: '#f43f5e' },
  { id: 'num_10', word: 'Ten', spanish: 'Diez', emoji: '🔟', category: 'numbers', color: '#059669' },
];

export const getRandomKidItems = (count = 4, excludeIds = []) => {
  const pool = KIDS_ITEMS.filter((item) => !excludeIds.includes(item.id));
  return [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
};
