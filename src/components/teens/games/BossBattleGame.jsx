import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTeensGame } from '../../../context/TeensGameContext';
import { playEnglishPhrase } from '../../../utils/teenSpeech';

/**
 * BossBattleGame — El jugador reduce la vida del jefe respondiendo preguntas de vocabulario.
 * Cada respuesta correcta hace daño al jefe. Respuesta incorrecta hace daño al jugador.
 */
const BOSS = { name: 'Lord Vocabular', emoji: '👹', maxHp: 100 };

export default function BossBattleGame({ items = [], onWin, onLose }) {
  const { earnXp, earnCoins } = useTeensGame();

  const questions = useCallback(() =>
    items.slice(0, 8).map((item, i) => {
      const wrong = items.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [...wrong, item].sort(() => Math.random() - 0.5);
      return {
        word: item.word || item.english || item,
        spanish: item.spanish || item.translation || '???',
        options: opts.map((o) => o.spanish || o.translation || o),
        correct: item.spanish || item.translation || item,
      };
    }), [items]);

  const [qList] = useState(questions);
  const [qIdx, setQIdx] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(BOSS.maxHp);
  const [selected, setSelected] = useState(null);
  const [shake, setShake] = useState(false);
  const [bossShake, setBossShake] = useState(false);
  const [phase, setPhase] = useState('battle'); // 'battle' | 'win' | 'lose'

  if (!qList.length) return (
    <div style={containerStyle}>
      <p style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>
        No hay vocabulario suficiente para esta misión.
      </p>
    </div>
  );

  const current = qList[qIdx % qList.length];

  const handleAnswer = (opt) => {
    if (selected || phase !== 'battle') return;
    setSelected(opt);
    const isCorrect = opt === current.correct;

    if (isCorrect) {
      const dmg = Math.floor(Math.random() * 20) + 15;
      setBossShake(true);
      setTimeout(() => setBossShake(false), 500);
      const newBossHp = Math.max(0, bossHp - dmg);
      setBossHp(newBossHp);
      if (newBossHp <= 0) {
        setTimeout(() => {
          setPhase('win');
          earnXp(200);
          earnCoins(70);
          onWin?.();
        }, 800);
        return;
      }
    } else {
      const dmg = Math.floor(Math.random() * 15) + 10;
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const newPlayerHp = Math.max(0, playerHp - dmg);
      setPlayerHp(newPlayerHp);
      if (newPlayerHp <= 0) {
        setTimeout(() => {
          setPhase('lose');
          onLose?.();
        }, 800);
        return;
      }
    }

    setTimeout(() => {
      setSelected(null);
      setQIdx((i) => i + 1);
    }, 900);
  };

  if (phase === 'win') return <ResultScreen win emoji="⚔️" msg="¡Derrotaste a Lord Vocabular!" />;
  if (phase === 'lose') return <ResultScreen win={false} emoji="💀" msg="¡El jefe te venció! Inténtalo de nuevo." />;

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.4rem', marginBottom: '0.5rem' }}>
        ⚔️ Boss Battle: Vocabulary Duel
      </h2>

      {/* HP Bars */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <HpBar label="Tú" hp={playerHp} max={100} color="#10b981" shake={shake} />
        <HpBar label={BOSS.name} hp={bossHp} max={BOSS.maxHp} color="#ef4444" shake={bossShake} isEnemy />
      </div>

      {/* Boss */}
      <motion.div
        animate={bossShake ? { x: [-8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{ textAlign: 'center', fontSize: '5rem', marginBottom: '1rem' }}
      >
        {BOSS.emoji}
      </motion.div>

      {/* Question */}
      <div style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '16px', padding: '1.25rem', textAlign: 'center', marginBottom: '1.25rem',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 0.4rem', fontWeight: 700 }}>
          ¿Qué significa en español?
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 900, margin: 0, fontFamily: 'monospace' }}>
            {current.word}
          </p>
          <button
            type="button"
            onClick={() => playEnglishPhrase(current.word)}
            title="Escuchar pronunciación"
            style={{
              background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)',
              color: '#a78bfa', borderRadius: '50%', width: '38px', height: '38px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
            }}
          >
            <Volume2 size={17} />
          </button>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {current.options.map((opt) => {
          const isRight = opt === current.correct;
          const isSelected = selected === opt;
          let bg = 'rgba(255,255,255,0.08)';
          let border = '1px solid rgba(255,255,255,0.15)';
          if (selected) {
            if (isRight) { bg = 'rgba(16,185,129,0.25)'; border = '2px solid #10b981'; }
            else if (isSelected) { bg = 'rgba(239,68,68,0.25)'; border = '2px solid #ef4444'; }
          }
          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAnswer(opt)}
              style={{
                background: bg, border, borderRadius: '12px',
                padding: '0.85rem', color: '#fff', fontWeight: 700,
                fontSize: '0.95rem', cursor: selected ? 'default' : 'pointer',
                transition: 'all 0.25s',
              }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>
        Pregunta {(qIdx % qList.length) + 1} de {qList.length}
      </div>
    </div>
  );
}

function HpBar({ label, hp, max, color, shake, isEnemy }) {
  const pct = Math.round((hp / max) * 100);
  return (
    <motion.div
      animate={shake ? { x: [-5, 5, -4, 4, 0] } : {}}
      transition={{ duration: 0.35 }}
      style={{ flex: 1 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>
        <span>{isEnemy ? '👹' : '🧑‍🎓'} {label}</span>
        <span style={{ color }}>{hp}/{max}</span>
      </div>
      <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%', background: color, borderRadius: '999px' }}
        />
      </div>
    </motion.div>
  );
}

function ResultScreen({ win, emoji, msg }) {
  return (
    <div style={{ ...containerStyle, textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} style={{ fontSize: '5rem' }}>
        {emoji}
      </motion.div>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>{msg}</h2>
      {win && <p style={{ color: '#f59e0b', fontWeight: 700 }}>+200 XP · +70 Coins 🎉</p>}
    </div>
  );
}

const containerStyle = {
  background: 'linear-gradient(145deg, #1a0533 0%, #0f172a 100%)',
  borderRadius: '20px', padding: '1.5rem', minHeight: '480px',
};
