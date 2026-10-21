import React, { useState, useEffect, useCallback } from 'react';
import { X, Check, Star, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Mini-juego de "Conectar" para niños.
 * El niño debe arrastrar o hacer clic en una palabra y luego en su dibujo (emoji).
 */
export default function MatchingGame({ items, onClose }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatched] = useState([]); // Array de IDs emparejados
  const [finished, setFinished] = useState(false);

  const init = useCallback(() => {
    // Tomar 4 items aleatorios del set
    const pool = [...items].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // El lado izquierdo son las palabras
    setLeftItems([...pool].sort(() => 0.5 - Math.random()));
    
    // El lado derecho son los emojis
    setRightItems([...pool].sort(() => 0.5 - Math.random()));
    
    setMatched([]);
    setSelectedLeft(null);
    setFinished(false);
  }, [items]);

  useEffect(() => {
    init();
  }, [init]);

  const handleLeftClick = (item) => {
    if (matches.includes(item.word)) return;
    setSelectedLeft(item);
  };

  const handleRightClick = (item) => {
    if (!selectedLeft || matches.includes(item.word)) return;

    if (selectedLeft.word === item.word) {
      // ¡Correcto!
      const newMatches = [...matches, item.word];
      setMatched(newMatches);
      setSelectedLeft(null);

      if (newMatches.length === leftItems.length) {
        setFinished(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      // ¡Incorrecto! Feedback visual simple
      setSelectedLeft(null);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-surface)', border: '4px solid var(--primary)',
        borderRadius: '32px', width: '100%', maxWidth: '680px', padding: '2rem',
        position: 'relative', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'var(--bg-base)', border: 'none', borderRadius: '50%',
          padding: '0.5rem', cursor: 'pointer', color: 'var(--text-subtle)'
        }}><X size={24} /></button>

        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
          ¡Une los dibujos! 🎨
        </h2>

        {!finished ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', margin: '2rem 0' }}>
            {/* Palabras */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leftItems.map((item) => {
                const isMatched = matches.includes(item.word);
                const isSelected = selectedLeft?.word === item.word;
                return (
                  <button
                    key={item.word}
                    onClick={() => handleLeftClick(item)}
                    disabled={isMatched}
                    style={{
                      padding: '1.25rem', borderRadius: '20px', fontSize: '1.4rem', fontWeight: 900,
                      background: isMatched ? 'var(--success-bg)' : (isSelected ? 'var(--primary-bg)' : 'var(--bg-base)'),
                      color: isMatched ? 'var(--success)' : (isSelected ? 'var(--primary)' : 'var(--text-primary)'),
                      border: `3px solid ${isMatched ? 'var(--success)' : (isSelected ? 'var(--primary)' : 'var(--border)')}`,
                      cursor: isMatched ? 'default' : 'pointer',
                      transition: 'all 0.2s', transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    {item.word} {isMatched && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Emojis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rightItems.map((item) => {
                const isMatched = matches.includes(item.word);
                return (
                  <button
                    key={item.word}
                    onClick={() => handleRightClick(item)}
                    disabled={isMatched}
                    style={{
                      padding: '1rem', borderRadius: '20px', fontSize: '3rem', lineHeight: 1,
                      background: isMatched ? 'var(--success-bg)' : 'var(--bg-base)',
                      border: `3px solid ${isMatched ? 'var(--success)' : 'var(--border)'}`,
                      cursor: isMatched ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {item.emoji || '⭐'}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ padding: '3rem 0' }}>
            <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)' }}>¡Increíble!</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Lo has hecho muy bien.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={init} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '1rem 2rem', borderRadius: '999px', border: 'none',
                background: 'var(--primary)', color: '#fff',
                fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer'
              }}><RefreshCw size={24} /> Jugar otra vez</button>
              <button onClick={onClose} style={{
                padding: '1rem 2rem', borderRadius: '999px', border: '2px solid var(--border)',
                background: 'transparent', color: 'var(--text-secondary)',
                fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer'
              }}>Salir</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-subtle)', fontWeight: 700 }}>
          {!finished && "Toca una palabra y luego su dibujo"}
        </div>
      </div>
    </div>
  );
}
