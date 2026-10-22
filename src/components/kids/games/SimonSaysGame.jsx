import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function SimonSaysGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length >= 3 ? items : KIDS_ITEMS;
  }, [items]);

  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);

  const startRound = () => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const nextTarget = shuffled[0];
    const rest = shuffled.slice(1, 4);
    const roundOptions = [nextTarget, ...rest].sort(() => 0.5 - Math.random());

    setTarget(nextTarget);
    setOptions(roundOptions);

    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Simón dice: toca [[ENGLISH: ${nextTarget.word}]]!`);
    }, 200);
  };

  useEffect(() => {
    startRound();
  }, [pool, round]);

  const handleTouch = (item) => {
    if (item.id === target.id) {
      kidSpeak?.speakToby?.(`¡Excelente! ¡Tocaste [[ENGLISH: ${item.word}]]!`);
      onEarnStar?.(15);
      setStreak((s) => s + 1);
      setTimeout(() => {
        setRound((r) => r + 1);
      }, 1200);
    } else {
      kidSpeak?.speakToby?.(`¡Oh oh! Ese dibujo es [[ENGLISH: ${item.word}]]. ¡Simón dijo que tocaras [[ENGLISH: ${target.word}]]!`);
      setStreak(0);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          👑 Simón Dice (Simon Says)
        </h3>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
          Escucha con mucha atención a Simón y toca el dibujo correcto
        </p>
      </div>

      {/* Toby Simón Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: '#ffffff',
          borderRadius: '26px',
          padding: '1.25rem',
          maxWidth: '500px',
          margin: '0 auto 1.5rem',
          boxShadow: '0 10px 24px rgba(59,130,246,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
          <span style={{ fontSize: '3rem', animation: 'bounce 1.5s infinite' }}>🐶👑</span>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.9 }}>
              Simón Dice:
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, lineHeight: 1.2 }}>
              ¡Toca "{target?.word}"! {target?.spanish ? <span style={{ fontSize: '0.9rem', opacity: 0.85, fontWeight: 700 }}>({target.spanish})</span> : null}
            </div>
          </div>
        </div>
        <button
          onClick={() => kidSpeak?.speakToby?.(`¡Simón dice: toca [[ENGLISH: ${target?.word}]]!`)}
          style={{
            background: 'rgba(255,255,255,0.25)',
            border: '2px solid rgba(255,255,255,0.6)',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="Escuchar otra vez"
        >
          <Volume2 size={20} />
        </button>
      </div>

      {/* Opciones */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          maxWidth: '540px',
          margin: '0 auto',
        }}
      >
        {options.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTouch(item)}
            style={{
              background: 'var(--bg-surface)',
              border: '3px solid var(--border)',
              borderRadius: '22px',
              padding: '1.25rem 0.75rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 6px 14px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06) translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: '3.4rem', lineHeight: 1 }}>{item.emoji}</span>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {item.word}
            </span>
          </button>
        ))}
      </div>

      {streak > 0 && (
        <div style={{ marginTop: '1.25rem', fontSize: '0.9rem', fontWeight: 800, color: '#3b82f6' }}>
          🔥 ¡Racha de Simón: {streak} acierto{streak > 1 ? 's' : ''}!
        </div>
      )}
    </div>
  );
}
