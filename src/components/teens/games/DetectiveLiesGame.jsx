import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTeensGame } from '../../../context/TeensGameContext';
import { playEnglishPhrase } from '../../../utils/teenSpeech';

/**
 * DetectiveLiesGame — Se presenta un crimen. 3 sospechosos dan testimonios.
 * El jugador debe encontrar al que miente analizando sus respuestas gramaticales.
 */

const CASES = [
  {
    id: 'museum_theft',
    title: 'El Robo del Museo',
    crime: 'Last night, a priceless painting disappeared from the City Museum between 8 PM and 11 PM.',
    suspects: [
      {
        name: 'Alice',
        emoji: '👩‍🦰',
        testimony: 'At 9 PM, I was watching a movie at home. My roommate can confirm this. I never went to the museum.',
        grammarNote: 'Uses "was watching" (past continuous) correctly for an ongoing action.',
        isLiar: false,
      },
      {
        name: 'Bob',
        emoji: '🧔',
        testimony: 'I were at the restaurant until 10 PM. I eated dinner with my boss and then I go home directly.',
        grammarNote: '⚠️ "I were" (should be "was"), "eated" (should be "ate"), "I go" (should be "I went") — multiple past tense errors.',
        isLiar: true,
      },
      {
        name: 'Carlos',
        emoji: '🧑‍💼',
        testimony: 'I was at the gym from 7 PM to 9:30 PM. After that, I drove home and went to bed early.',
        grammarNote: 'Past simple and continuous used correctly for completed sequential actions.',
        isLiar: false,
      },
    ],
    explanation: 'Bob lies — his testimony contains critical grammatical errors ("I were", "eated", "I go") that reveal fabricated alibi.',
  },
  {
    id: 'library_sabotage',
    title: 'El Sabotaje de la Biblioteca',
    crime: 'The school library database was hacked yesterday morning. Someone deleted 500 student records.',
    suspects: [
      {
        name: 'Emma',
        emoji: '👩‍💻',
        testimony: 'Yesterday morning I was study in the cafeteria. My friend Sarah seen me there from 9 to 11 AM.',
        grammarNote: '⚠️ "I was study" (should be "studying"), "seen" (should be "saw") — progressive and irregular verb errors.',
        isLiar: true,
      },
      {
        name: 'David',
        emoji: '👦',
        testimony: 'I was playing basketball with my team. We had a scheduled practice from 8 AM to 11 AM. The coach can verify.',
        grammarNote: 'Past continuous and simple past used correctly with logical alibi.',
        isLiar: false,
      },
      {
        name: 'Sofia',
        emoji: '👧',
        testimony: 'I wasn\'t at school yesterday. I had a doctor\'s appointment and my mom took me there at 9 AM.',
        grammarNote: 'Negative past construction "wasn\'t" and simple past used accurately.',
        isLiar: false,
      },
    ],
    explanation: 'Emma lies — "I was study" and "seen" instead of "saw" expose her fabricated story.',
  },
];

export default function DetectiveLiesGame({ onWin, onLose }) {
  const { earnXp, earnCoins, addItem } = useTeensGame();
  const [caseIdx] = useState(() => Math.floor(Math.random() * CASES.length));
  const currentCase = CASES[caseIdx];

  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [activeSuspect, setActiveSuspect] = useState(null);
  const [phase, setPhase] = useState('investigate'); // 'investigate' | 'result'

  const handleAccuse = (suspect) => {
    if (selected) return;
    setSelected(suspect.name);
    setRevealed(true);
    const correct = suspect.isLiar;
    setTimeout(() => {
      setPhase('result');
      if (correct) {
        earnXp(160);
        earnCoins(50);
        addItem({ id: 'magnifier', name: 'Magnifying Glass', emoji: '🔎', rarity: 'uncommon' });
        onWin?.();
      } else {
        onLose?.();
      }
    }, 1200);
  };

  if (phase === 'result') {
    const accused = currentCase.suspects.find((s) => s.name === selected);
    const correct = accused?.isLiar;
    return (
      <ResultScreen
        win={correct}
        explanation={currentCase.explanation}
        accusedName={selected}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.3rem', marginBottom: '0.25rem' }}>
        🕵️ Detective de Mentiras
      </h2>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
        Lee los testimonios y encuentra al que miente usando errores gramaticales como pistas.
      </p>

      {/* Caso */}
      <div style={{
        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: '14px', padding: '1rem', marginBottom: '1.25rem',
      }}>
        <p style={{ color: '#fca5a5', fontWeight: 800, fontSize: '0.85rem', margin: '0 0 0.35rem' }}>
          🚨 CASO: {currentCase.title}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>
          {currentCase.crime}
        </p>
      </div>

      {/* Sospechosos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {currentCase.suspects.map((suspect) => {
          const isSelected = selected === suspect.name;
          return (
            <motion.div
              key={suspect.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{
                background: isSelected
                  ? (suspect.isLiar ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)')
                  : 'rgba(255,255,255,0.05)',
                border: isSelected
                  ? `2px solid ${suspect.isLiar ? '#ef4444' : '#10b981'}`
                  : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '14px', padding: '1rem',
                cursor: selected ? 'default' : 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{suspect.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#fff', fontSize: '1rem' }}>{suspect.name}</strong>
                    <button
                      onClick={() => setActiveSuspect(activeSuspect === suspect.name ? null : suspect.name)}
                      style={{
                        background: 'rgba(255,255,255,0.08)', border: 'none',
                        borderRadius: '8px', padding: '0.25rem 0.6rem',
                        color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', cursor: 'pointer',
                      }}
                    >
                      {activeSuspect === suspect.name ? 'Ocultar' : 'Ver testimonio'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {activeSuspect === suspect.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', margin: '0 0 0.5rem' }}>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontStyle: 'italic', margin: 0, lineHeight: 1.5, flex: 1 }}>
                            "{suspect.testimony}"
                          </p>
                          <button
                            type="button"
                            onClick={() => playEnglishPhrase(suspect.testimony)}
                            title="Escuchar testimonio"
                            style={{
                              background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
                              color: '#a78bfa', borderRadius: '50%', width: '32px', height: '32px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', flexShrink: 0,
                            }}
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                        {revealed && (
                          <p style={{
                            fontSize: '0.8rem', color: suspect.isLiar ? '#fca5a5' : '#6ee7b7',
                            fontWeight: 700, margin: 0,
                          }}>
                            📝 {suspect.grammarNote}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!selected && (
                    <button
                      onClick={() => handleAccuse(suspect)}
                      style={{
                        marginTop: '0.65rem',
                        background: 'rgba(239,68,68,0.2)', border: '1.5px solid rgba(239,68,68,0.4)',
                        borderRadius: '10px', padding: '0.45rem 1rem',
                        color: '#fca5a5', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                      }}
                    >
                      🔴 Acusar a {suspect.name}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ResultScreen({ win, explanation, accusedName }) {
  return (
    <div style={{
      ...containerStyle, display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center', gap: '1rem', minHeight: '400px', justifyContent: 'center',
    }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
        <div style={{ fontSize: '4rem' }}>{win ? '🎉' : '😞'}</div>
      </motion.div>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', margin: 0 }}>
        {win ? `¡Correcto! ${accusedName} era el mentiroso.` : `Incorrecto. ${accusedName} era inocente.`}
      </h2>
      <div style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px', padding: '1rem', maxWidth: '420px',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', margin: 0 }}>{explanation}</p>
      </div>
      {win && <p style={{ color: '#f59e0b', fontWeight: 700 }}>+160 XP · +50 Coins · 🔎 Magnifying Glass</p>}
    </div>
  );
}

const containerStyle = {
  background: 'linear-gradient(145deg, #0f0c22 0%, #0f172a 100%)',
  borderRadius: '20px', padding: '1.5rem', minHeight: '480px',
};
