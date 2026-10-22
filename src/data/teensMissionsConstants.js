// ─── Constantes: 15 Juegos / Misiones para Teens (Jóvenes) ──────────────────
// Categorías: Misterio, Combate, Lógica, Comunicación, Arcade RPG

export const TEEN_MISSION_CATEGORIES = [
  { id: 'mystery', label: '🕵️ Misterio y Rol', color: '#7c3aed' },
  { id: 'combat', label: '⚔️ Combate y Acción', color: '#dc2626' },
  { id: 'logic', label: '🧩 Lógica y Estrategia', color: '#2563eb' },
  { id: 'communication', label: '💬 Comunicación', color: '#059669' },
  { id: 'arcade', label: '🕹️ Arcade y Velocidad', color: '#d97706' },
];

export const TEEN_MISSIONS = [
  // ── Misterio y Rol ──────────────────────────────────────────────────────────
  {
    id: 'escape_room',
    category: 'mystery',
    title: 'Escape Room: The Locked Room',
    subtitle: 'Resuelve acertijos en inglés para escapar',
    emoji: '🔐',
    xpReward: 180,
    coinReward: 60,
    itemReward: { id: 'detective_badge', name: 'Detective Badge', emoji: '🔍', rarity: 'rare' },
    difficulty: 'Intermediate',
    isGlobal: true,   // disponible gratis (con anuncio)
    tags: ['reading', 'vocabulary', 'critical-thinking'],
  },
  {
    id: 'detective_lies',
    category: 'mystery',
    title: 'Detective de Mentiras',
    subtitle: 'Descubre quién miente analizando testimonios',
    emoji: '🕵️',
    xpReward: 160,
    coinReward: 50,
    itemReward: { id: 'magnifier', name: 'Magnifying Glass', emoji: '🔎', rarity: 'uncommon' },
    difficulty: 'Intermediate',
    isGlobal: true,
    tags: ['grammar', 'listening', 'past-tenses'],
  },
  {
    id: 'rpg_adventure',
    category: 'mystery',
    title: 'Elige tu Aventura',
    subtitle: 'Historia interactiva: tus decisiones definen el final',
    emoji: '📖',
    xpReward: 200,
    coinReward: 80,
    itemReward: { id: 'adventure_scroll', name: 'Adventure Scroll', emoji: '📜', rarity: 'epic' },
    difficulty: 'Advanced',
    isGlobal: false,
    tags: ['reading-comprehension', 'vocabulary', 'decision-making'],
  },
  {
    id: 'cyber_mission',
    category: 'mystery',
    title: 'Cyber Mission: Terminal Hack',
    subtitle: 'Interfaz de terminal: descifra comandos en inglés',
    emoji: '💻',
    xpReward: 220,
    coinReward: 90,
    itemReward: { id: 'hacker_chip', name: 'Cyber Chip', emoji: '🖥️', rarity: 'epic' },
    difficulty: 'Advanced',
    isGlobal: false,
    tags: ['technical-vocabulary', 'reading', 'spelling'],
  },

  // ── Combate y Acción ────────────────────────────────────────────────────────
  {
    id: 'boss_battle',
    category: 'combat',
    title: 'Boss Battle: Vocabulary Duel',
    subtitle: 'Reduce la vida del jefe con respuestas correctas',
    emoji: '⚔️',
    xpReward: 200,
    coinReward: 70,
    itemReward: { id: 'sword_light', name: 'Light Sword', emoji: '🗡️', rarity: 'rare' },
    difficulty: 'Intermediate',
    isGlobal: true,
    tags: ['vocabulary', 'speed', 'reflexes'],
  },
  {
    id: 'word_shooter',
    category: 'combat',
    title: 'Word Shooter',
    subtitle: 'Dispara a los objetivos con la traducción correcta',
    emoji: '🎯',
    xpReward: 150,
    coinReward: 50,
    itemReward: { id: 'sniper_scope', name: 'Sniper Scope', emoji: '🔭', rarity: 'uncommon' },
    difficulty: 'Beginner',
    isGlobal: true,
    tags: ['vocabulary', 'reaction-time', 'translation'],
  },
  {
    id: 'tower_defense',
    category: 'combat',
    title: 'Tower Defense: Grammar Wars',
    subtitle: 'Construye torretas corrigiendo gramática',
    emoji: '🏰',
    xpReward: 250,
    coinReward: 100,
    itemReward: { id: 'castle_shield', name: 'Castle Shield', emoji: '🛡️', rarity: 'legendary' },
    difficulty: 'Advanced',
    isGlobal: false,
    tags: ['grammar', 'strategy', 'correction'],
  },

  // ── Lógica y Estrategia ─────────────────────────────────────────────────────
  {
    id: 'crossword_pro',
    category: 'logic',
    title: 'Crucigrama Pro',
    subtitle: 'Crucigrama temático con definiciones en inglés',
    emoji: '🧩',
    xpReward: 140,
    coinReward: 45,
    itemReward: { id: 'puzzle_piece', name: 'Puzzle Master Badge', emoji: '🔣', rarity: 'uncommon' },
    difficulty: 'Intermediate',
    isGlobal: true,
    tags: ['vocabulary', 'spelling', 'definitions'],
  },
  {
    id: 'cipher_challenge',
    category: 'logic',
    title: 'Cipher Challenge',
    subtitle: 'Descifra mensajes secretos en inglés',
    emoji: '🔡',
    xpReward: 170,
    coinReward: 55,
    itemReward: { id: 'cipher_ring', name: 'Cipher Ring', emoji: '💍', rarity: 'rare' },
    difficulty: 'Intermediate',
    isGlobal: false,
    tags: ['spelling', 'vocabulary', 'critical-thinking'],
  },
  {
    id: 'grammar_chess',
    category: 'logic',
    title: 'Grammar Chess',
    subtitle: 'Mueve piezas seleccionando la oración correcta',
    emoji: '♟️',
    xpReward: 260,
    coinReward: 110,
    itemReward: { id: 'chess_king', name: 'Chess King', emoji: '👑', rarity: 'legendary' },
    difficulty: 'Advanced',
    isGlobal: false,
    tags: ['grammar', 'strategy', 'sentence-structure'],
  },

  // ── Comunicación ─────────────────────────────────────────────────────────────
  {
    id: 'debate_arena',
    category: 'communication',
    title: 'Debate Arena',
    subtitle: 'Defiende tu postura con argumentos en inglés',
    emoji: '🎤',
    xpReward: 220,
    coinReward: 80,
    itemReward: { id: 'mic_gold', name: 'Golden Mic', emoji: '🏆', rarity: 'epic' },
    difficulty: 'Advanced',
    isGlobal: false,
    tags: ['speaking', 'arguments', 'persuasion'],
  },
  {
    id: 'roleplay_shop',
    category: 'communication',
    title: 'Roleplay: English Shop',
    subtitle: 'Simula conversaciones en tiendas y restaurantes',
    emoji: '🛒',
    xpReward: 130,
    coinReward: 40,
    itemReward: { id: 'shop_bag', name: 'Shopping Bag', emoji: '🛍️', rarity: 'common' },
    difficulty: 'Beginner',
    isGlobal: true,
    tags: ['speaking', 'everyday-english', 'roleplay'],
  },
  {
    id: 'news_anchor',
    category: 'communication',
    title: 'News Anchor',
    subtitle: 'Lee y presenta noticias como un presentador',
    emoji: '📺',
    xpReward: 160,
    coinReward: 55,
    itemReward: { id: 'news_badge', name: 'Press Badge', emoji: '📰', rarity: 'uncommon' },
    difficulty: 'Intermediate',
    isGlobal: false,
    tags: ['reading', 'pronunciation', 'formal-english'],
  },

  // ── Arcade y Velocidad ──────────────────────────────────────────────────────
  {
    id: 'speed_typer',
    category: 'arcade',
    title: 'Speed Typer',
    subtitle: 'Escribe palabras en inglés contra el reloj',
    emoji: '⌨️',
    xpReward: 120,
    coinReward: 35,
    itemReward: { id: 'turbo_fingers', name: 'Turbo Fingers', emoji: '⚡', rarity: 'common' },
    difficulty: 'Beginner',
    isGlobal: true,
    tags: ['spelling', 'typing', 'speed'],
  },
  {
    id: 'word_runner',
    category: 'arcade',
    title: 'Word Runner',
    subtitle: 'Corre y salta seleccionando la traducción correcta',
    emoji: '🏃',
    xpReward: 145,
    coinReward: 48,
    itemReward: { id: 'running_shoes', name: 'Speed Shoes', emoji: '👟', rarity: 'uncommon' },
    difficulty: 'Beginner',
    isGlobal: true,
    tags: ['vocabulary', 'reflexes', 'translation'],
  },
];

// Las misiones globales (disponibles con anuncio en sección free)
export const GLOBAL_TEEN_MISSIONS = TEEN_MISSIONS.filter((m) => m.isGlobal);

// Misiones solo para academia / profesor
export const PREMIUM_TEEN_MISSIONS = TEEN_MISSIONS.filter((m) => !m.isGlobal);

// Buscar misión por ID
export function getTeenMissionById(id) {
  return TEEN_MISSIONS.find((m) => m.id === id) || null;
}

// Selector para el panel del profesor (para asignar juego a lección)
export const TEEN_GAME_SELECTOR = [
  { id: 'default', name: 'Rotación estándar (misiones globales)', emoji: '⭐', category: 'Global' },
  ...TEEN_MISSIONS.map((m) => ({
    id: m.id,
    name: m.title,
    emoji: m.emoji,
    category: m.category,
    difficulty: m.difficulty,
  })),
];

// Módulos de estudio predeterminados para el panel de campaña
export const DEFAULT_TEEN_STUDY_MODULES = [
  {
    id: 'teen_mod_grammar',
    name: '1. Gramática Avanzada para Jóvenes',
    level: 'B1',
    age_range: 'teens',
    icon: '⚡',
    description: 'Tiempos verbales en pasado, presente y futuro, verbos modales y conectores discursivos.',
    color_from: '#6366f1',
    color_to: '#8b5cf6',
    total_lessons: 3,
    xp_reward: 180,
    evaluation_status: 'pending',
  },
  {
    id: 'teen_mod_skills',
    name: '2. Habilidades Comunicativas Juveniles',
    level: 'B1',
    age_range: 'teens',
    icon: '🗣️',
    description: 'Describir, comparar, justificar opiniones, narrar experiencias y debatir temas de interés juvenil (tecnología, redes sociales, cultura pop).',
    color_from: '#10b981',
    color_to: '#059669',
    total_lessons: 4,
    xp_reward: 200,
    evaluation_status: 'pending',
  },
  {
    id: 'teen_mod_practical',
    name: '3. Enfoque Práctico y Situaciones Reales',
    level: 'B1',
    age_range: 'teens',
    icon: '🎯',
    description: 'Conversaciones en vivo, comprensión de textos orales y escritos, y simulaciones de situaciones reales.',
    color_from: '#f59e0b',
    color_to: '#d97706',
    total_lessons: 3,
    xp_reward: 190,
    evaluation_status: 'pending',
  },
];
