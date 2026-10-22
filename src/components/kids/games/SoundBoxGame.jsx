import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, Sparkles, Play } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function SoundBoxGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length >= 3 ? items : KIDS_ITEMS;
  }, [items]);

  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [round, setRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const startRound = () => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const nextTarget = shuffled[0];
    const rest = shuffled.slice(1, 4);
    const roundOptions = [nextTarget, ...rest].sort(() => 0.5 - Math.random());

    setTarget(nextTarget);
    setOptions(roundOptions);

    setTimeout(() => {
      playSound(nextTarget);
    }, 300);
  };

  useEffect(() => {
    startRound();
  }, [pool, round]);

  const playSound = (item = target) => {
    if (!item) return;
    setIsPlaying(true);
    const sound = item.soundText || item.word;
    kidSpeak?.speakEnglish?.(sound);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  const handleSelect = (item) => {
    if (item.id === target.id) {
      kidSpeak?.speakToby?.(`¡Muy bien de oído! ¡Ese sonido es de [[ENGLISH: ${item.word}]]!`);
      onEarnStar?.(15);
      setTimeout(() => {
        setRound((r) => r + 1);
      }, 1300);
    } else {
      kidSpeak?.speakToby?.(`¡Ese sonido no era de [[ENGLISH: ${item.word}]]! Escucha la caja mágica de nuevo.`);
      playSound();
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          📻 Caja de Sonidos (Sound Box)
        </h3>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
          Toca la caja mágica, escucha el sonido y descubre qué objeto es
        </p>
      </div>

      {/* Caja mágica interactiva */}
      <div style={{ marginBottom: '1.75rem' }}>
        <button
          onClick={() => playSound()}
          style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            color: '#ffffff',
            border: '4px solid #ccfbf1',
            borderRadius: '30px',
            padding: '1.75rem 2.5rem',
            cursor: 'pointer',
            boxShadow: isPlaying ? '0 0 35px #14b8a6aa' : '0 12px 28px rgba(20,184,166,0.3)',
            transform: isPlaying ? 'scale(1.06)' : 'scale(1)',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <span style={{ fontSize: '4.5rem', animation: isPlaying ? 'pulse 0.5s infinite' : 'none' }}>
            📻
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Volume2 size={20} /> {isPlaying ? '¡Escuchando...!' : '¡Toca para escuchar el sonido!'}
          </span>
        </button>
      </div>

      {/* Opciones */}
      <p style={{ margin: '0 0 0.75rem', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
        ¿A cuál de estos dibujos pertenece el sonido?
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          maxWidth: '520px',
          margin: '0 auto',
        }}
      >
        {options.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            style={{
              background: 'var(--bg-surface)',
              border: '3px solid var(--border)',
              borderRadius: '22px',
              padding: '1.25rem 0.5rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 6px 14px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: '3.3rem', lineHeight: 1 }}>{item.emoji}</span>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {item.word}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
