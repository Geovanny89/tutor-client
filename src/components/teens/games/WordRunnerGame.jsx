import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTeensGame } from '../../../context/TeensGameContext';
import { playEnglishPhrase } from '../../../utils/teenSpeech';

/**
 * WordRunnerGame — Plataformer simplificado. El personaje corre y el jugador
 * debe hacer clic en la plataforma con la traducción correcta antes de caer.
 * Implementado como selección secuencial de opciones con animación de "correr".
 */

export default function WordRunnerGame({ items = [], onWin, onLose }) {
  const { earnXp, earnCoins } = useTeensGame();

  const questions = (() => {
    const pool = items.length >= 4 ? items : [...items, ...items].slice(0, 6);
    return pool.slice(0, 8).map((item, i) => {
      const word = item.word || item.english || item;
      const correct = item.spanish || item.translation || word;
      const wrongs = pool
        .filter((_, j) => j !== i)
        .map((o) => o.spanish || o.translation || o)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const opts = [...wrongs, correct].sort(() => Math.random() - 0.5);
      return { word, correct, options: opts };
    });
  })();

  const [qIdx, setQIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState(null);
  const [runnerX, setRunnerX] = useState(0); // progress 0-100%
  const [phase, setPhase] = useState('running'); // 'running' | 'win' | 'lose'

  if (!questions.length) return (
    <div style={containerStyle}>
      <p style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>No hay vocabulario suficiente.</p>
    </div>
  );

  const current = questions[qIdx % questions.length];
  const totalQ = questions.length;

  const handlePlatform = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === current.correct;

    if (correct) {
      const nextX = Math.min(100, ((qIdx + 1) / totalQ) * 100);
      setRunnerX(nextX);
      setTimeout(() => {
        const nextIdx = qIdx + 1;
        if (nextIdx >= totalQ) {
          setPhase('win');
          earnXp(145);
          earnCoins(48);
          onWin?.();
        } else {
          setQIdx(nextIdx);
          setSelected(null);
        }
      }, 900);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        if (newLives <= 0) {
          setPhase('lose');
          onLose?.();
        } else {
          setSelected(null);
        }
      }, 900);
    }
  };

  if (phase === 'win') return <Result win totalQ={totalQ} />;
  if (phase === 'lose') return <Result win={false} />;

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.3rem', marginBottom: '0.5rem' }}>
        🏃 Word Runner
      </h2>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '1rem' }}>
        Salta a la plataforma con la traducción correcta y corre hasta la meta.
      </p>

      {/* HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ color: '#fff', fontWeight: 800 }}>
          {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.85rem' }}>
          {qIdx + 1}/{totalQ}
        </span>
      </div>

      {/* Track / Pista */}
      <div style={{
        position: 'relative', width: '100%', height: '80px',
        background: 'linear-gradient(180deg, #1a1a3e 0%, #0f0a1f 70%, #6d28d9 70%, #4c1d95 100%)',
        borderRadius: '14px', marginBottom: '1.25rem', overflow: 'hidden',
        border: '1px solid rgba(124,58,237,0.4)',
      }}>
        {/* Pista */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'rgba(109,40,217,0.6)',
          borderTop: '2px solid rgba(167,139,250,0.4)',
        }} />

        {/* Línea de progreso */}
        <div style={{
          position: 'absolute', top: '10px', left: '5%', right: '5%', height: '3px',
          background: 'rgba(255,255,255,0.1)', borderRadius: '999px',
        }}>
          <motion.div
            animate={{ width: `${runnerX}%` }}
            transition={{ duration: 0.5 }}
            style={{ height: '100%', background: '#10b981', borderRadius: '999px' }}
          />
        </div>

        {/* Personaje corredor */}
        <motion.div
          animate={{ left: `${5 + runnerX * 0.88}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute', bottom: '25%', fontSize: '2rem', lineHeight: 1,
            filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.6))',
          }}
        >
          🏃
        </motion.div>

        {/* Meta */}
        <div style={{ position: 'absolute', right: '3%', bottom: '20%', fontSize: '1.8rem' }}>🏁</div>
      </div>

      {/* Pregunta */}
      <div style={{
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '14px', padding: '0.9rem', textAlign: 'center', marginBottom: '1.25rem',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: '0 0 0.3rem', fontWeight: 700 }}>
          🏃 ¿Cuál es la traducción de...?
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <p style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, margin: 0, fontFamily: 'monospace' }}>
            {current.word}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playEnglishPhrase(current.word);
            }}
            title="Escuchar pronunciación"
            style={{
              background: 'rgba(124, 58, 237, 0.25)',
              border: '1px solid rgba(167, 139, 250, 0.4)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#c4b5fd',
            }}
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      {/* Plataformas (opciones) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {current.options.map((opt) => {
          const isRight = opt === current.correct;
          const isSel = selected === opt;
          let bg = 'linear-gradient(135deg, rgba(109,40,217,0.3) 0%, rgba(79,70,229,0.2) 100%)';
          let border = '2px solid rgba(124,58,237,0.4)';
          let color = '#fff';

          if (selected) {
            if (isRight) { bg = 'rgba(16,185,129,0.3)'; border = '2px solid #10b981'; }
            else if (isSel) { bg = 'rgba(239,68,68,0.3)'; border = '2px solid #ef4444'; }
          }

          return (
            <motion.button
              key={opt}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handlePlatform(opt)}
              style={{
                background: bg, border, borderRadius: '14px',
                padding: '1rem', color, fontWeight: 800, fontSize: '1rem',
                cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>
                {isSel ? (isRight ? '✅' : '❌') : '🪨'}
              </span>
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Result({ win, totalQ }) {
  return (
    <div style={{
      ...containerStyle, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', minHeight: '380px',
    }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} style={{ fontSize: '4rem' }}>
        {win ? '🏁' : '💥'}
      </motion.div>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', margin: 0 }}>
        {win ? '¡Llegaste a la meta!' : '¡Te quedaste sin vidas!'}
      </h2>
      {win && <p style={{ color: '#f59e0b', fontWeight: 700 }}>+145 XP · +48 Coins 👟</p>}
    </div>
  );
}

const containerStyle = {
  background: 'linear-gradient(145deg, #0f0c1f 0%, #0f172a 100%)',
  borderRadius: '20px', padding: '1.5rem', minHeight: '480px',
};
