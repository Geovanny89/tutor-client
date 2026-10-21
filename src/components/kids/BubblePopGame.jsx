import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Sparkles, RefreshCw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KIDS_ITEMS } from '../../data/kidsVocabulary';
import { kidAudio } from '../../utils/kidAudio';

const BUBBLE_COLORS = [
  'radial-gradient(circle at 30% 30%, #fef08a, #f59e0b)',
  'radial-gradient(circle at 30% 30%, #bae6fd, #0284c7)',
  'radial-gradient(circle at 30% 30%, #bbf7d0, #16a34a)',
  'radial-gradient(circle at 30% 30%, #fbcfe8, #db2777)',
  'radial-gradient(circle at 30% 30%, #e9d5ff, #9333ea)',
  'radial-gradient(circle at 30% 30%, #fed7aa, #ea580c)',
];

export default function BubblePopGame({ onEarnStar, speak }) {
  const [bubbles, setBubbles] = useState([]);
  const [target, setTarget] = useState(null);
  const [poppedId, setPoppedId] = useState(null);
  const [score, setScore] = useState(0);

  const spawnBubbles = useCallback(() => {
    // Select 5 random items
    const selected = [...KIDS_ITEMS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    // Pick 1 as the target
    const currentTarget = selected[Math.floor(Math.random() * selected.length)];
    setTarget(currentTarget);

    // Generate positions and colors
    const newBubbles = selected.map((item, idx) => ({
      ...item,
      color: BUBBLE_COLORS[idx % BUBBLE_COLORS.length],
      animDelay: `${idx * 0.4}s`,
      animDuration: `${2.5 + (idx % 3) * 0.5}s`,
    }));

    setBubbles(newBubbles);
    setPoppedId(null);

    setTimeout(() => {
      speak(`Pop the ${currentTarget.word}!`, 0.85);
    }, 250);
  }, [speak]);

  useEffect(() => {
    spawnBubbles();
  }, [spawnBubbles]);

  const handlePop = (item) => {
    if (item.id === target.id) {
      // Correct pop!
      setPoppedId(item.id);
      kidAudio.playPop();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
      speak(`Pop! ${target.word}!`, 0.9);
      setScore((s) => s + 10);
      if (onEarnStar) onEarnStar(10);

      setTimeout(() => {
        spawnBubbles();
      }, 1200);
    } else {
      // Incorrect bubble
      kidAudio.playTryAgain();
      speak(target.word, 0.85);
    }
  };

  if (!target) return null;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #dbeafe 0%, #eff6ff 100%)',
      border: '4px solid #3b82f6',
      borderRadius: '32px',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      minHeight: '480px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 30px -10px rgba(59, 130, 246, 0.25)',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#fef08a',
          color: '#854d0e',
          padding: '0.5rem 1.25rem',
          borderRadius: '999px',
          fontWeight: 900,
          fontSize: '1.1rem',
          boxShadow: '0 4px 10px rgba(234, 179, 8, 0.25)',
        }}>
          <Star fill="#eab308" color="#eab308" size={22} />
          <span>Burbujas: {score / 10}</span>
        </div>

        <button
          onClick={spawnBubbles}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ffffff',
            border: '2px solid #cbd5e1',
            borderRadius: '999px',
            padding: '0.45rem 1rem',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} /> Nuevas burbujas
        </button>
      </div>

      {/* Target prompt */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '1rem 1.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1rem',
        border: '3px solid #60a5fa',
        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.15)',
        marginBottom: '2rem',
      }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e40af' }}>
          ¡Revienta la burbuja con:
        </span>
        <button
          onClick={() => speak(target.word, 0.85)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '0.6rem 1.2rem',
            fontWeight: 900,
            fontSize: '1.3rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
          }}
        >
          <Volume2 size={24} />
          <span>"{target.word}"</span>
        </button>
      </div>

      {/* Floating Bubbles Stage */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem 0',
      }}>
        {bubbles.map((b) => {
          const isPopped = poppedId === b.id;

          return (
            <button
              key={b.id}
              onClick={() => handlePop(b)}
              disabled={isPopped}
              className="bubble-item"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: b.color,
                border: '3px solid rgba(255, 255, 255, 0.8)',
                boxShadow: 'inset -6px -6px 12px rgba(0,0,0,0.1), inset 6px 6px 12px rgba(255,255,255,0.7), 0 10px 20px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                animation: `floatUpDown ${b.animDuration} ease-in-out infinite alternate`,
                animationDelay: b.animDelay,
                transform: isPopped ? 'scale(1.4)' : 'scale(1)',
                opacity: isPopped ? 0 : 1,
                transition: 'transform 0.25s, opacity 0.25s',
              }}
            >
              <span style={{ fontSize: '3.6rem', lineHeight: 1, filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.15))' }}>
                {b.emoji}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes floatUpDown {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(4deg); }
          100% { transform: translateY(0px) rotate(-4deg); }
        }
        .bubble-item:hover {
          transform: scale(1.15) !important;
        }
      `}</style>
    </div>
  );
}
