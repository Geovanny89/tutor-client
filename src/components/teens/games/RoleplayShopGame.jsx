import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTeensGame } from '../../../context/TeensGameContext';
import { playEnglishPhrase } from '../../../utils/teenSpeech';

/**
 * RoleplayShopGame — El jugador simula conversaciones en contextos cotidianos.
 * Elige la respuesta correcta en un diálogo interactivo.
 * Tema: tiendas, restaurantes, aeropuerto, hotel.
 */

const SCENARIOS = [
  {
    id: 'coffee_shop',
    title: '☕ Coffee Shop',
    intro: 'You enter a coffee shop. The barista greets you.',
    avatar: '👨‍🍳',
    turns: [
      {
        npc: "Good morning! Welcome to Bean & Brew. What can I get for you today?",
        options: [
          { text: "I want one coffee please.", correct: false, feedback: 'A bit abrupt. Try "I\'d like" for polite requests.' },
          { text: "I'd like a large latte, please.", correct: true, feedback: '✅ Perfect! Polite and clear.' },
          { text: "Give me coffee.", correct: false, feedback: 'Too direct and rude for a shop context.' },
          { text: "Yes, I want something.", correct: false, feedback: "Too vague — you haven't said what you want." },
        ],
      },
      {
        npc: "Of course! Would you like any milk alternatives? We have oat, almond, or soy.",
        options: [
          { text: "I don't care.", correct: false, feedback: '"I don\'t care" sounds rude. Use "I don\'t mind" or specify.' },
          { text: "Oat milk, please!", correct: true, feedback: '✅ Concise and polite.' },
          { text: "What is oat milk?", correct: false, feedback: 'Relevant question but doesn\'t move the conversation forward.' },
          { text: "Normal milk is fine.", correct: true, feedback: '✅ Clear preference expressed politely.' },
        ],
      },
      {
        npc: "Great choice! That'll be $4.50. Would you like to pay by card or cash?",
        options: [
          { text: "Card, please.", correct: true, feedback: '✅ Short, natural, and clear.' },
          { text: "I pay card.", correct: false, feedback: '"I pay" is incorrect. Use "I\'ll pay by card" or just "Card, please."' },
          { text: "Yes.", correct: false, feedback: 'You need to specify which payment method.' },
          { text: "By card, thank you.", correct: true, feedback: '✅ Natural and polite.' },
        ],
      },
    ],
  },
  {
    id: 'hotel_checkin',
    title: '🏨 Hotel Check-In',
    intro: 'You arrive at a hotel. The receptionist greets you.',
    avatar: '🏨',
    turns: [
      {
        npc: "Good evening! Do you have a reservation with us?",
        options: [
          { text: "Yes, I made a reservation online.", correct: true, feedback: '✅ Clear and informative.' },
          { text: "I think yes.", correct: false, feedback: 'Too uncertain. If you have one, confirm confidently.' },
          { text: "Give me a room.", correct: false, feedback: 'Very rude — always acknowledge a question first.' },
          { text: "I booked a room for tonight.", correct: true, feedback: '✅ Natural and clear.' },
        ],
      },
      {
        npc: "May I have your last name, please?",
        options: [
          { text: "My name is John Smith.", correct: true, feedback: '✅ Appropriate response — you provided your name.' },
          { text: "What do you need?", correct: false, feedback: 'Confrontational — they already told you what they need.' },
          { text: "Why do you want it?", correct: false, feedback: 'Inappropriate — this is a standard check-in procedure.' },
          { text: "It\'s Rodriguez.", correct: true, feedback: '✅ Direct and polite.' },
        ],
      },
    ],
  },
];

export default function RoleplayShopGame({ onWin, onLose }) {
  const { earnXp, earnCoins } = useTeensGame();
  const [scenarioIdx] = useState(() => Math.floor(Math.random() * SCENARIOS.length));
  const scenario = SCENARIOS[scenarioIdx];
  const [turnIdx, setTurnIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [phase, setPhase] = useState('play'); // 'play' | 'result'

  const currentTurn = scenario.turns[turnIdx];
  const totalTurns = scenario.turns.length;

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const newHistory = [...history, {
      npc: currentTurn.npc,
      player: opt.text,
      correct: opt.correct,
      feedback: opt.feedback,
    }];
    setHistory(newHistory);
    if (opt.correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (turnIdx + 1 >= totalTurns) {
        setPhase('result');
        const won = (score + (opt.correct ? 1 : 0)) >= Math.ceil(totalTurns / 2);
        if (won) {
          earnXp(130);
          earnCoins(40);
          onWin?.();
        } else {
          onLose?.();
        }
      } else {
        setTurnIdx((i) => i + 1);
        setSelected(null);
      }
    }, 1200);
  };

  if (phase === 'result') {
    const finalScore = score;
    const won = finalScore >= Math.ceil(totalTurns / 2);
    return (
      <div style={{ ...containerStyle, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', minHeight: '420px' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div style={{ fontSize: '3.5rem' }}>{won ? '🎤' : '😓'}</div>
        </motion.div>
        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', margin: 0 }}>
          {won ? '¡Comunicación exitosa!' : 'Necesitas más práctica'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          {finalScore}/{totalTurns} respuestas correctas
        </p>
        {won && <p style={{ color: '#f59e0b', fontWeight: 700 }}>+130 XP · +40 Coins</p>}

        {/* Historial */}
        <div style={{ width: '100%', maxWidth: '480px', textAlign: 'left' }}>
          {history.map((h, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '0.75rem', marginBottom: '0.5rem',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', margin: '0 0 0.25rem' }}>
                {scenario.avatar} "{h.npc}"
              </p>
              <p style={{
                color: h.correct ? '#6ee7b7' : '#fca5a5',
                fontSize: '0.88rem', fontWeight: 700, margin: '0 0 0.2rem',
              }}>
                🧑 "{h.player}"
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: 0 }}>{h.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
        🛒 {scenario.title}
      </h2>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
        {scenario.intro}
      </p>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
        {scenario.turns.map((_, i) => (
          <div key={i} style={{
            width: `${Math.floor(100 / totalTurns) - 2}%`, height: '6px', borderRadius: '999px',
            background: i < turnIdx ? '#10b981' : i === turnIdx ? '#7c3aed' : 'rgba(255,255,255,0.15)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Chat bubble NPC */}
      <motion.div
        key={turnIdx}
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        style={{
          display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem',
        }}
      >
        <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{scenario.avatar}</span>
        <div style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '0 16px 16px 16px', padding: '0.9rem 1rem', flex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <p style={{ color: '#fff', fontSize: '0.95rem', margin: 0, fontStyle: 'italic', flex: 1 }}>
              "{currentTurn.npc}"
            </p>
            <button
              type="button"
              onClick={() => playEnglishPhrase(currentTurn.npc)}
              title="Escuchar"
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
      </motion.div>

      {/* Options */}
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.65rem' }}>
        🧑 Tu respuesta:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {currentTurn.options.map((opt, i) => {
          const isSel = selected?.text === opt.text;
          let bg = 'rgba(255,255,255,0.07)';
          let border = '1px solid rgba(255,255,255,0.15)';
          if (selected) {
            if (opt.correct && (isSel || selected?.correct)) {
              bg = 'rgba(16,185,129,0.2)'; border = '2px solid #10b981';
            } else if (isSel && !opt.correct) {
              bg = 'rgba(239,68,68,0.2)'; border = '2px solid #ef4444';
            }
          }
          return (
            <motion.button
              key={i} whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(opt)}
              style={{
                background: bg, border, borderRadius: '12px', padding: '0.85rem 1rem',
                color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                cursor: selected ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s',
              }}
            >
              "{opt.text}"
              {selected && isSel && (
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem' }}>
                  {opt.feedback}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const containerStyle = {
  background: 'linear-gradient(145deg, #0a1628 0%, #0f172a 100%)',
  borderRadius: '20px', padding: '1.5rem', minHeight: '480px',
};
