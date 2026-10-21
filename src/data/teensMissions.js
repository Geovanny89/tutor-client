/**
 * Sistema de Misiones y Gamificación para Jóvenes (8-16 años).
 */

export const TEEN_RANKS = [
  { minXp: 0, maxXp: 499, title: 'Novato de Bronce', tier: 'Bronce', badge: '🥉', color: '#cd7f32', bg: '#fff7ed' },
  { minXp: 500, maxXp: 999, title: 'Explorador de Plata', tier: 'Plata', badge: '🥈', color: '#94a3b8', bg: '#f8fafc' },
  { minXp: 1000, maxXp: 1999, title: 'Aventurero de Oro', tier: 'Oro', badge: '🥇', color: '#eab308', bg: '#fefce8' },
  { minXp: 2000, maxXp: 3499, title: 'Guardián de Diamante', tier: 'Diamante', badge: '💎', color: '#06b6d4', bg: '#ecfeff' },
  { minXp: 3500, maxXp: 999999, title: 'Maestro Bilingüe', tier: 'Maestro', badge: '👑', color: '#8b5cf6', bg: '#f5f3ff' },
];

export const getRankByXp = (xp = 0) => {
  return TEEN_RANKS.find((r) => xp >= r.minXp && xp <= r.maxXp) || TEEN_RANKS[0];
};

export const INITIAL_DAILY_QUESTS = [
  {
    id: 'quiz_challenge',
    title: 'Reto Relámpago',
    description: 'Supera 3 preguntas de inglés sin equivocarte',
    rewardXp: 60,
    icon: '⚡',
    target: 3,
    type: 'interactive_quiz',
  },
  {
    id: 'vocab_explorer',
    title: 'Cazador de Palabras',
    description: 'Aprende o repasa 5 palabras nuevas en Vocabulario',
    rewardXp: 40,
    icon: '📖',
    target: 5,
    type: 'vocab',
    link: '/vocabulary',
  },
  {
    id: 'tutor_chat',
    title: 'Mensaje al Tutor IA',
    description: 'Envía un mensaje en inglés a tu tutor virtual',
    rewardXp: 50,
    icon: '🎙️',
    target: 1,
    type: 'tutor',
    link: '/tutor',
  },
  {
    id: 'module_quest',
    title: 'Misión de Campaña',
    description: 'Completa o practica en una lección de tu módulo',
    rewardXp: 100,
    icon: '⚔️',
    target: 1,
    type: 'lesson',
  },
];

export const TEEN_QUIZ_QUESTIONS = [
  {
    question: 'How do you say "¿Qué onda / Cómo estás?" informally to a friend in English?',
    options: ['What\'s up?', 'Good night', 'Where is food?', 'Goodbye'],
    correct: 0,
    explanation: '"What\'s up?" es la forma más común y genial de saludar a amigos.',
  },
  {
    question: 'Which word means "juegos de video"?',
    options: ['Board books', 'Video games', 'Paper songs', 'Car toys'],
    correct: 1,
    explanation: '"Video games" son videojuegos.',
  },
  {
    question: 'Complete: "I want to ___ with my friends after school."',
    options: ['hang out', 'sleepy', 'yesterday', 'chair'],
    correct: 0,
    explanation: '"Hang out" significa pasar el rato con amigos.',
  },
  {
    question: 'What is the opposite of "boring" (aburrido)?',
    options: ['Slow', 'Exciting', 'Cold', 'Dark'],
    correct: 1,
    explanation: '"Exciting" significa emocionante.',
  },
  {
    question: 'If you really like a music song, you say: "This song is ___!"',
    options: ['fire / awesome', 'water', 'floor', 'clock'],
    correct: 0,
    explanation: '"Fire" o "awesome" se usa para algo genial o increíble.',
  },
  {
    question: 'Choose the correct sentence:',
    options: ['She have a dog', 'She has a dog', 'She having dog', 'She are dog'],
    correct: 1,
    explanation: 'Para he/she/it usamos "has".',
  },
];
