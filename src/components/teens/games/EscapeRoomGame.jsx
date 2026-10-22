import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTeensGame } from '../../../context/TeensGameContext';
import { playEnglishPhrase } from '../../../utils/teenSpeech';

/**
 * EscapeRoomGame — Habitación interactiva con 5 objetos clickeables.
 * Cada objeto tiene un acertijo en inglés. Resolver los 5 abre la puerta.
 */

const RIDDLES = [
  {
    id: 'safe',
    emoji: '🔐',
    label: 'Safe',
    pos: { top: '35%', left: '10%' },
    question: 'The opposite of "open" is:',
    options: ['Closed', 'Wide', 'Empty', 'Free'],
    answer: 'Closed',
    hint: 'You lock a door to keep it...',
  },
  {
    id: 'computer',
    emoji: '💻',
    label: 'Computer',
    pos: { top: '20%', left: '40%' },
    question: 'What do you call the text you type to enter a system?',
    options: ['Password', 'Username', 'Email', 'Code'],
    answer: 'Password',
    hint: 'It is secret and protects your account.',
  },
  {
    id: 'bookshelf',
    emoji: '📚',
    label: 'Bookshelf',
    pos: { top: '15%', right: '12%' },
    question: 'Fill in the blank: "Yesterday, she __ the book." (read)',
    options: ['read', 'reads', 'reading', 'readed'],
    answer: 'read',
    hint: '"Read" past tense is irregular — same spelling, different pronunciation.',
  },
  {
    id: 'clock',
    emoji: '🕰️',
    label: 'Clock',
    pos: { top: '55%', left: '30%' },
    question: 'Choose the correct sentence:',
    options: [
      'She don\'t like coffee.',
      'She doesn\'t likes coffee.',
      'She doesn\'t like coffee.',
      'She not likes coffee.',
    ],
    answer: "She doesn't like coffee.",
    hint: 'Third person singular uses "doesn\'t" + base verb.',
  },
  {
    id: 'window',
    emoji: '🪟',
    label: 'Window',
    pos: { top: '60%', right: '15%' },
    question: '"Nocturnal" means an animal that is active:',
    options: ['At night', 'In the morning', 'In winter', 'Underwater'],
    answer: 'At night',
    hint: 'Think about owls and bats.',
  },
];

export default function EscapeRoomGame({ onWin, onLose }) {
  const { earnXp, earnCoins, addItem } = useTeensGame();
  const [solved, setSolved] = useState([]);
  const [active, setActive] = useState(null);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('room'); // 'room' | 'win' | 'lose'

  const handleSelectObject = (riddle) => {
    if (solved.includes(riddle.id)) return;
    setActive(riddle);
    setSelected(null);
  };

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === active.answer;
    if (correct) {
      setTimeout(() => {
        const newSolved = [...solved, active.id];
        setSolved(newSolved);
        setActive(null);
        setSelected(null);
        if (newSolved.length >= RIDDLES.length) {
          setPhase('win');
          earnXp(180);
          earnCoins(60);
          addItem({ id: 'detective_badge', name: 'Detective Badge', emoji: '🔍', rarity: 'rare' });
          onWin?.();
        }
      }, 800);
    } else {
      setTimeout(() => {
        setSelected(null);
        // En escape room no castigamos con perder, solo dejan intentar de nuevo
      }, 900);
    }
  };

  if (phase === 'win') return (
    <EndScreen
      win
      title="¡Escapaste! 🎉"
      msg="Resolviste todos los acertijos y abriste la puerta."
      extras="+180 XP · +60 Coins · 🔍 Detective Badge"
    />
  );

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.3rem', marginBottom: '0.5rem' }}>
        🔐 Escape Room: The Locked Room
      </h2>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Haz clic en los objetos para resolver los acertijos en inglés y escapar.
      </p>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
        {RIDDLES.map((r) => (
          <div key={r.id} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: solved.includes(r.id) ? '#10b981' : 'rgba(255,255,255,0.1)',
            border: `2px solid ${solved.includes(r.id) ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
            transition: 'all 0.3s',
          }}>
            {solved.includes(r.id) ? '✓' : r.emoji}
          </div>
        ))}
      </div>

      {/* Habitación */}
      <div style={{
        position: 'relative', width: '100%', height: '280px',
        background: 'radial-gradient(ellipse at top, #2d1b4e 0%, #0f0a1f 100%)',
        borderRadius: '16px', border: '1px solid rgba(124,58,237,0.3)',
        overflow: 'hidden', marginBottom: '1rem',
      }}>
        {/* Piso */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.08)',
        }} />

        {RIDDLES.map((riddle) => (
          <motion.button
            key={riddle.id}
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectObject(riddle)}
            style={{
              position: 'absolute', ...riddle.pos,
              background: solved.includes(riddle.id) ? 'rgba(16,185,129,0.25)' : 'rgba(124,58,237,0.2)',
              border: `2px solid ${solved.includes(riddle.id) ? '#10b981' : 'rgba(124,58,237,0.5)'}`,
              borderRadius: '14px', padding: '0.6rem 0.8rem',
              cursor: solved.includes(riddle.id) ? 'default' : 'pointer',
              color: '#fff', fontSize: '1.6rem', lineHeight: 1,
              backdropFilter: 'blur(4px)',
              boxShadow: solved.includes(riddle.id) ? '0 0 12px rgba(16,185,129,0.4)' : '0 0 12px rgba(124,58,237,0.3)',
            }}
            title={riddle.label}
          >
            {riddle.emoji}
            {solved.includes(riddle.id) && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', fontSize: '0.8rem' }}>✅</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Modal de acertijo */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{
              background: 'rgba(15,10,31,0.96)',
              border: '1.5px solid rgba(124,58,237,0.45)',
              borderRadius: '18px', padding: '1.25rem', marginTop: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{active.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: 0, fontWeight: 700 }}>
                  {active.label}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: 0, flex: 1 }}>{active.question}</p>
                  <button
                    type="button"
                    onClick={() => playEnglishPhrase(active.question)}
                    title="Escuchar pregunta"
                    style={{
                      background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)',
                      color: '#a78bfa', borderRadius: '50%', width: '30px', height: '30px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    <Volume2 size={13} />
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {active.options.map((opt) => {
                const isRight = opt === active.answer;
                const isSel = selected === opt;
                let bg = 'rgba(255,255,255,0.07)';
                let border = '1px solid rgba(255,255,255,0.15)';
                if (selected) {
                  if (isRight) { bg = 'rgba(16,185,129,0.3)'; border = '2px solid #10b981'; }
                  else if (isSel) { bg = 'rgba(239,68,68,0.3)'; border = '2px solid #ef4444'; }
                }
                return (
                  <motion.button
                    key={opt} whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(opt)}
                    style={{
                      background: bg, border, borderRadius: '10px',
                      padding: '0.7rem', color: '#fff', fontWeight: 700,
                      fontSize: '0.88rem', cursor: selected ? 'default' : 'pointer',
                      transition: 'all 0.2s', textAlign: 'left',
                    }}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', margin: '0.75rem 0 0', fontStyle: 'italic' }}>
              💡 Pista: {active.hint}
            </p>

            <button
              onClick={() => setActive(null)}
              style={{
                marginTop: '0.75rem', background: 'none', border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.4)', borderRadius: '8px', padding: '0.4rem 0.9rem',
                fontSize: '0.82rem', cursor: 'pointer',
              }}
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EndScreen({ win, title, msg, extras }) {
  return (
    <div style={{
      ...containerStyle, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', minHeight: '400px',
    }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <div style={{ fontSize: '4rem' }}>{win ? '🎉' : '😓'}</div>
      </motion.div>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>{title}</h2>
      <p style={{ color: 'rgba(255,255,255,0.55)', margin: 0 }}>{msg}</p>
      {extras && <p style={{ color: '#f59e0b', fontWeight: 700 }}>{extras}</p>}
    </div>
  );
}

const containerStyle = {
  background: 'linear-gradient(145deg, #1a0a2e 0%, #0f172a 100%)',
  borderRadius: '20px', padding: '1.5rem', minHeight: '480px',
};
