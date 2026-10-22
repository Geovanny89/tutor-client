import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTeensGame } from '../../../context/TeensGameContext';
import { playEnglishPhrase } from '../../../utils/teenSpeech';

/**
 * SpeedTyperGame — El jugador escribe palabras en inglés contra el reloj.
 * Cada palabra correctamente escrita suma puntos. Errores restan tiempo.
 */

const GAME_DURATION = 45;

export default function SpeedTyperGame({ items = [], onWin, onLose }) {
  const { earnXp, earnCoins } = useTeensGame();
  const wordPool = items.length >= 5
    ? items.map((i) => i.word || i.english || i).filter(Boolean)
    : ['apple', 'friend', 'beautiful', 'tomorrow', 'adventure', 'keyboard', 'language', 'practice', 'challenge', 'vocabulary'];

  const getNextWord = useCallback(() => wordPool[Math.floor(Math.random() * wordPool.length)], [wordPool]);

  const [currentWord, setCurrentWord] = useState(() => getNextWord());
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [phase, setPhase] = useState('playing'); // 'playing' | 'win' | 'lose'
  const [feedback, setFeedback] = useState(null); // { type: 'correct'|'wrong', text }
  const [typed, setTyped] = useState([]); // historial de palabras
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentWord]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          finishGame(score, combo);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const finishGame = (finalScore, finalCombo) => {
    const won = finalScore >= 8;
    setPhase(won ? 'win' : 'lose');
    if (won) {
      earnXp(120);
      earnCoins(35);
      onWin?.();
    } else {
      onLose?.();
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (val.trim().toLowerCase() === currentWord.toLowerCase()) {
      const newScore = score + 1;
      const newCombo = combo + 1;
      setScore(newScore);
      setCombo(newCombo);
      setFeedback({ type: 'correct', text: `+1 ${newCombo > 2 ? `🔥 x${newCombo}` : ''}` });
      setTimeout(() => setFeedback(null), 600);
      setTyped((prev) => [...prev.slice(-4), { word: val, correct: true }]);
      setInput('');
      setCurrentWord(getNextWord());
      if (newScore >= 20) finishGame(newScore, newCombo);
    } else if (val.endsWith(' ') || val.endsWith('\n')) {
      // Escribió algo incorrecto con espacio = intento fallido
      const guess = val.trim();
      if (guess.length > 2) {
        setCombo(0);
        setFeedback({ type: 'wrong', text: `Incorrecto — era "${currentWord}"` });
        setTimeout(() => setFeedback(null), 1000);
        setTyped((prev) => [...prev.slice(-4), { word: guess, correct: false }]);
        setTimeLeft((t) => Math.max(1, t - 3)); // penalización de tiempo
      }
      setInput('');
    }
  };

  const progress = ((GAME_DURATION - timeLeft) / GAME_DURATION) * 100;
  const timePct = timeLeft / GAME_DURATION;
  const timerColor = timePct > 0.5 ? '#10b981' : timePct > 0.25 ? '#f59e0b' : '#ef4444';

  if (phase === 'win') return <Result win score={score} />;
  if (phase === 'lose') return <Result win={false} score={score} />;

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: '1.3rem', marginBottom: '0.5rem' }}>
        ⌨️ Speed Typer
      </h2>

      {/* HUD */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <HudPill label="Palabras" value={score} icon="✍️" />
        <HudPill label="Combo" value={`x${combo}`} icon="🔥" color={combo > 2 ? '#f97316' : undefined} />
        <HudPill label="Tiempo" value={`${timeLeft}s`} icon="⏱" color={timerColor} />
      </div>

      {/* Timer bar */}
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${100 - progress}%` }}
          style={{ height: '100%', background: timerColor, borderRadius: '999px', transition: 'width 1s linear, background 0.5s' }}
        />
      </div>

      {/* Palabra actual */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord}
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
          >
            <p style={{
              fontSize: '2.8rem', fontWeight: 900, color: '#fff',
              fontFamily: 'monospace', letterSpacing: '0.1em', margin: 0,
            }}>
              {currentWord.split('').map((ch, i) => {
                const typed = input[i];
                let color = 'rgba(255,255,255,0.3)';
                if (typed !== undefined) {
                  color = typed.toLowerCase() === ch.toLowerCase() ? '#10b981' : '#ef4444';
                }
                return <span key={i} style={{ color, transition: 'color 0.1s' }}>{ch}</span>;
              })}
            </p>
            <button
              type="button"
              onClick={() => {
                playEnglishPhrase(currentWord);
                if (inputRef.current) inputRef.current.focus();
              }}
              title="Escuchar pronunciación"
              style={{
                background: 'rgba(99, 102, 241, 0.25)',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#818cf8',
              }}
            >
              <Volume2 size={18} />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Feedback flash */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -25 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)',
                color: feedback.type === 'correct' ? '#10b981' : '#ef4444',
                fontWeight: 900, fontSize: '1.1rem', whiteSpace: 'nowrap', pointerEvents: 'none',
              }}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        value={input}
        onChange={handleInputChange}
        placeholder="Escribe aquí..."
        autoComplete="off"
        spellCheck={false}
        style={{
          width: '100%', padding: '1rem', borderRadius: '14px', boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(99,102,241,0.4)',
          color: '#fff', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace',
          textAlign: 'center', outline: 'none',
        }}
      />

      {/* Historial */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem', justifyContent: 'center' }}>
        {typed.map((t, i) => (
          <span key={i} style={{
            background: t.correct ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${t.correct ? '#10b981' : '#ef4444'}55`,
            color: t.correct ? '#6ee7b7' : '#fca5a5',
            borderRadius: '8px', padding: '0.2rem 0.5rem',
            fontSize: '0.78rem', fontFamily: 'monospace',
          }}>
            {t.correct ? '✓' : '✗'} {t.word}
          </span>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        Presiona ESPACIO después de un error para pasar. ¡Error = -3s!
      </p>
    </div>
  );
}

function HudPill({ label, value, icon, color = '#fff' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '12px', padding: '0.45rem 0.85rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: '0.1rem' }}>{icon} {label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

function Result({ win, score }) {
  return (
    <div style={{
      ...containerStyle, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', minHeight: '380px',
    }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} style={{ fontSize: '4rem' }}>
        {win ? '⌨️' : '⏰'}
      </motion.div>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', margin: 0 }}>
        {win ? '¡Turbo Fingers activado! 🚀' : 'El tiempo se agotó...'}
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Palabras correctas: {score}</p>
      {win && <p style={{ color: '#f59e0b', fontWeight: 700 }}>+120 XP · +35 Coins ⚡</p>}
    </div>
  );
}

const containerStyle = {
  background: 'linear-gradient(145deg, #0c0c22 0%, #0f172a 100%)',
  borderRadius: '20px', padding: '1.5rem', minHeight: '480px',
};
