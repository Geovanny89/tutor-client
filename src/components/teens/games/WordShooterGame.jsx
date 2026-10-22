import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTeensGame } from '../../../context/TeensGameContext';
import { playEnglishPhrase } from '../../../utils/teenSpeech';

/**
 * WordShooterGame — Aparecen "ovnis" con palabras en inglés. El jugador
 * hace clic en el que coincide con la traducción mostrada. Contra reloj.
 */
const GAME_DURATION = 30; // segundos
const SPAWN_INTERVAL = 1800; // ms entre ovnis

export default function WordShooterGame({ items = [], onWin, onLose }) {
  const { earnXp, earnCoins } = useTeensGame();
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [phase, setPhase] = useState('playing'); // 'playing' | 'win' | 'lose'
  const [hits, setHits] = useState([]); // { id, correct }
  const idRef = useRef(0);
  const itemPool = items.length >= 4 ? items : [...items, ...items, ...items].slice(0, 8);

  // Inicializar pregunta
  useEffect(() => {
    const random = itemPool[Math.floor(Math.random() * itemPool.length)];
    setCurrentTarget(random);
  }, []);

  // Timer de 30s
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          endGame(score, misses);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Spawn de objetivos
  useEffect(() => {
    if (phase !== 'playing' || !currentTarget) return;
    const spawn = setInterval(() => {
      const wrongItems = itemPool.filter((i) => (i.word || i) !== (currentTarget.word || currentTarget));
      const isCorrect = Math.random() > 0.4;
      const item = isCorrect
        ? currentTarget
        : wrongItems[Math.floor(Math.random() * wrongItems.length)];

      const newTarget = {
        id: ++idRef.current,
        word: item.word || item.english || item,
        isCorrect,
        x: Math.random() * 80 + 5, // % from left
        y: Math.random() * 60 + 10, // % from top
      };

      setTargets((prev) => [...prev.slice(-6), newTarget]);
    }, SPAWN_INTERVAL);
    return () => clearInterval(spawn);
  }, [phase, currentTarget]);

  const endGame = (finalScore, finalMisses) => {
    const won = finalScore >= 5;
    setPhase(won ? 'win' : 'lose');
    if (won) {
      earnXp(150);
      earnCoins(50);
      onWin?.();
    } else {
      onLose?.();
    }
  };

  const handleShoot = (target) => {
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
    setHits((prev) => [...prev, { id: target.id, correct: target.isCorrect }]);
    setTimeout(() => setHits((prev) => prev.filter((h) => h.id !== target.id)), 600);

    if (target.word) {
      playEnglishPhrase(target.word);
    }

    if (target.isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      // Siguiente pregunta
      const next = itemPool[Math.floor(Math.random() * itemPool.length)];
      setCurrentTarget(next);
      if (newScore >= 10) endGame(newScore, misses);
    } else {
      const newMisses = misses + 1;
      setMisses(newMisses);
      if (newMisses >= 5) endGame(score, newMisses);
    }
  };

  if (phase === 'win') return <Result win msg="¡Objetivo eliminado! Eres un tirador de élite." score={score} />;
  if (phase === 'lose') return <Result win={false} msg="Demasiadas fallas. Recalculando..." score={score} />;

  return (
    <div style={containerStyle}>
      {/* HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={hudPill}> 🎯 Aciertos: <strong>{score}</strong>/10 </div>
        <div style={{ ...hudPill, color: '#f97316' }}> ⚡ {timeLeft}s </div>
        <div style={{ ...hudPill, color: '#ef4444' }}> 💥 Fallos: {misses}/5 </div>
      </div>

      {/* Objetivo a buscar */}
      {currentTarget && (
        <div style={{
          textAlign: 'center', background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '14px', padding: '0.9rem 1.25rem', marginBottom: '1.25rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: '0 0 0.25rem', fontWeight: 700 }}>
            🔫 ¡Dispara al objetivo en inglés!
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 900 }}>
              {currentTarget.spanish || currentTarget.translation || (typeof currentTarget === 'string' ? currentTarget : currentTarget.word)}
            </span>
            {(currentTarget.word || currentTarget.english) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playEnglishPhrase(currentTarget.word || currentTarget.english);
                }}
                title="Pista auditiva (Inglés)"
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#f59e0b',
                  transition: 'transform 0.15s ease',
                }}
              >
                <Volume2 size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Campo de juego */}
      <div style={{
        position: 'relative', width: '100%', height: '280px',
        background: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 100%)',
        borderRadius: '16px', overflow: 'hidden',
        border: '1px solid rgba(99,102,241,0.3)',
      }}>
        {/* Retícula decorativa */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <AnimatePresence>
          {targets.map((t) => (
            <motion.button
              key={t.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleShoot(t)}
              style={{
                position: 'absolute',
                left: `${t.x}%`, top: `${t.y}%`,
                transform: 'translate(-50%, -50%)',
                background: 'rgba(99,102,241,0.25)',
                border: '2px solid rgba(99,102,241,0.6)',
                borderRadius: '12px', padding: '0.5rem 0.9rem',
                color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                cursor: 'crosshair',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 0 12px rgba(99,102,241,0.3)',
                zIndex: 10,
              }}
            >
              {t.word}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Hit indicators */}
        <AnimatePresence>
          {hits.map((h) => (
            <motion.div
              key={`hit-${h.id}`}
              initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -30 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)',
                color: h.correct ? '#10b981' : '#ef4444',
                fontWeight: 900, fontSize: '1.5rem', pointerEvents: 'none',
              }}
            >
              {h.correct ? '+1 ✓' : 'MISS!'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Result({ win, msg, score }) {
  return (
    <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', minHeight: '380px' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} style={{ fontSize: '4rem' }}>
        {win ? '🎯' : '💥'}
      </motion.div>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', margin: 0 }}>{msg}</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Aciertos: {score}</p>
      {win && <p style={{ color: '#f59e0b', fontWeight: 700 }}>+150 XP · +50 Coins 🏅</p>}
    </div>
  );
}

const containerStyle = {
  background: 'linear-gradient(145deg, #0f0a1f 0%, #0f172a 100%)',
  borderRadius: '20px', padding: '1.5rem', minHeight: '480px',
};

const hudPill = {
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '999px', padding: '0.4rem 0.9rem', fontSize: '0.85rem',
  fontWeight: 700, color: '#fff',
};
