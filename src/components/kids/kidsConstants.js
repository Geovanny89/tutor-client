import { KIDS_ITEMS } from '../../data/kidsVocabulary';

// ─── 4 JUEGOS GLOBALES POR DEFECTO (Institutos, Globales y Juego Libre) ──────
export const CORE_GAME_TYPES = [
  {
    id: 'listen',
    name: 'Escucha y Toca',
    label: 'Escucha y Toca',
    emoji: '🎯',
    desc: '¡Escucha y toca el dibujo!',
    color: '#06b6d4',
    bg: '#ecfeff',
  },
  {
    id: 'bubble',
    name: 'Revienta Burbujas',
    label: 'Revienta Burbujas',
    emoji: '🎈',
    desc: '¡Explota la burbuja correcta!',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    id: 'memory',
    name: 'Parejas Mágicas',
    label: 'Parejas Mágicas',
    emoji: '🃏',
    desc: '¡Encuentra los dos dibujos!',
    color: '#ec4899',
    bg: '#fdf2f8',
  },
  {
    id: 'explorer',
    name: 'Pizarra de Dibujos',
    label: 'Pizarra de Dibujos',
    emoji: '🌈',
    desc: '¡Toca para escuchar cómo se dice!',
    color: '#10b981',
    bg: '#ecfdf5',
  },
];

export const GAME_TYPES = CORE_GAME_TYPES;

// ─── 15 JUEGOS DISPONIBLES PARA GENERAR LECCIONES CON IA (PROFESOR) ───────────
export const AI_LESSON_GAMES = [
  { id: 'default', name: 'Rotación estándar (4 juegos globales)', emoji: '⭐', categoryName: 'Global' },

  // Vocabulario y Asociación Visual
  { id: 'memory_match', name: 'Memorama Clásico', emoji: '🃏', categoryName: 'Asociación Visual', desc: 'Encuentra las parejas de imagen y palabra.' },
  { id: 'drag_drop', name: 'Arrastrar y Soltar', emoji: '🎯', categoryName: 'Asociación Visual', desc: 'Une cada etiqueta con el dibujo correcto.' },
  { id: 'odd_one_out', name: 'El Intruso', emoji: '🕵️', categoryName: 'Asociación Visual', desc: 'Toca el objeto que no encaja o el que se pide.' },
  { id: 'word_bingo', name: 'Bingo de Palabras', emoji: '🎱', categoryName: 'Asociación Visual', desc: 'Marca casillas en el cartón al escuchar la palabra.' },

  // Comprensión Auditiva
  { id: 'simon_says', name: 'Simón Dice', emoji: '👑', categoryName: 'Comprensión Auditiva', desc: 'Toby da órdenes veloces: toca lo correcto.' },
  { id: 'balloon_pop', name: 'Explota el Globo', emoji: '🎈', categoryName: 'Comprensión Auditiva', desc: 'Revienta el globo antes de que suba.' },
  { id: 'sound_box', name: 'Caja de Sonidos', emoji: '📻', categoryName: 'Comprensión Auditiva', desc: 'Escucha el sonido y descubre de qué objeto se trata.' },

  // Ortografía y Escritura
  { id: 'spelling_bee', name: 'Ahorcado Amigable', emoji: '🐝', categoryName: 'Ortografía', desc: 'Elige letras para formar la palabra y cuida los globos.' },
  { id: 'letter_rain', name: 'Lluvia de Letras', emoji: '🌧️', categoryName: 'Ortografía', desc: 'Atrapa letras que caen en el orden correcto.' },
  { id: 'word_search', name: 'Sopa de Letras', emoji: '🔍', categoryName: 'Ortografía', desc: 'Encuentra palabras en la cuadrícula de letras.' },

  // Gramática y Oraciones
  { id: 'sentence_train', name: 'Tren de Oraciones', emoji: '🚂', categoryName: 'Gramática', desc: 'Ordena los vagones con palabras: ¡Choo choo!' },
  { id: 'opposites_match', name: 'Opuestos en el Espejo', emoji: '🪞', categoryName: 'Gramática', desc: 'Conecta conceptos contrarios (Big ↔ Small).' },

  // Agilidad y Arcade
  { id: 'catch_answer', name: 'Atrapa la Respuesta', emoji: '🧺', categoryName: 'Arcade', desc: 'Mueve la cesta y atrapa los objetos que caen.' },
  { id: 'flashcard_quiz', name: 'Tarjetas de Velocidad', emoji: '⚡', categoryName: 'Arcade', desc: '¿Coincide la imagen? Presiona SÍ o NO contra reloj.' },
  { id: 'word_maze', name: 'El Laberinto de Palabras', emoji: '🧭', categoryName: 'Arcade', desc: 'Guía a Toby pisando las palabras de la lección.' },
];

export const KIDS_GAMES = AI_LESSON_GAMES;

// Busca un juego por su ID
export function getKidGameById(id) {
  // Primero buscar en los 4 core globales
  const core = CORE_GAME_TYPES.find((g) => g.id === id);
  if (core) return core;

  // Luego buscar en los 15 de IA
  const aiGame = AI_LESSON_GAMES.find((g) => g.id === id);
  if (aiGame) {
    return {
      id: aiGame.id,
      name: aiGame.name,
      label: aiGame.name,
      emoji: aiGame.emoji,
      desc: aiGame.desc || '¡Juega y aprende con Toby!',
      color: '#8b5cf6',
      bg: '#f5f3ff',
    };
  }

  return CORE_GAME_TYPES[0];
}

// Extrae el vocabulario de una lección individual y lo adapta para los juegos
export function extractLessonItems(lesson) {
  const vocab = lesson?.content?.vocabulary || [];
  const emojis = ['🌟', '🎈', '🐶', '🐱', '🍎', '🚀', '🎨', '🌈', '🍦', '🍪', '🦁', '⭐', '🐸', '🦋', '🌺', '🐠', '🍕', '🚗', '☀️', '🌙', '⚽', '🎸'];
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  const extracted = vocab
    .map((v, idx) => {
      const wordClean = (v.word || '').trim();
      if (!wordClean) return null;
      const existing = KIDS_ITEMS.find((k) => k.word.toLowerCase() === wordClean.toLowerCase());
      if (existing) return { ...existing, id: `${existing.id}_l${idx}` };
      return {
        id: `custom_${idx}_${wordClean.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        word: wordClean.charAt(0).toUpperCase() + wordClean.slice(1),
        spanish: v.translation || wordClean,
        emoji: emojis[idx % emojis.length],
        color: colors[idx % colors.length],
        category: 'custom',
        soundText: wordClean,
      };
    })
    .filter(Boolean);

  if (extracted.length > 0 && extracted.length < 4) {
    const extras = KIDS_ITEMS.filter((k) => !extracted.some((e) => e.word.toLowerCase() === k.word.toLowerCase()));
    return [...extracted, ...extras.slice(0, 4 - extracted.length)];
  }
  return extracted.length >= 4 ? extracted : KIDS_ITEMS.slice(0, 8);
}
