import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, RotateCcw, Sparkles, Check } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function WordBingoGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    const list = items && items.length >= 6 ? items : KIDS_ITEMS;
    return [...list].sort(() => 0.5 - Math.random());
  }, [items]);

  const [board, setBoard] = useState([]);
  const [marked, setMarked] = useState([]); // indices
  const [calledWord, setCalledWord] = useState(null);
  const [hasBingo, setHasBingo] = useState(false);

  const initGame = () => {
    const boardItems = pool.slice(0, 9);
    setBoard(boardItems);
    setMarked([]);
    setHasBingo(false);

    // Call first word
    const firstWord = boardItems[Math.floor(Math.random() * boardItems.length)];
    setCalledWord(firstWord);

    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Atención amiguito! Primera palabra del Bingo: ¡[[ENGLISH: ${firstWord.word}]]!`);
    }, 300);
  };

  useEffect(() => {
    initGame();
  }, [pool]);

  const callNextWord = (currentMarked) => {
    const remaining = board.filter((_, idx) => !currentMarked.includes(idx));
    if (remaining.length === 0) return;
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setCalledWord(next);
    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Siguiente palabra del Bingo: [[ENGLISH: ${next.word}]]!`);
    }, 400);
  };

  const handleCellClick = (item, idx) => {
    if (marked.includes(idx) || hasBingo) return;

    if (calledWord && item.id === calledWord.id) {
      // Correcto
      const nextMarked = [...marked, idx];
      setMarked(nextMarked);
      kidSpeak?.speakToby?.(`¡Correcto! Marcaste [[ENGLISH: ${item.word}]]!`);
      onEarnStar?.(10);

      // Check lines for Bingo (rows or cols or 3 marked)
      if (nextMarked.length >= 3 && !hasBingo) {
        setHasBingo(true);
        kidSpeak?.speakToby?.('¡BIIINGO! 🎱 ¡Ganaste el Bingo de Palabras! ¡Eres un súper campeón!');
        onEarnStar?.(25);
      } else {
        callNextWord(nextMarked);
      }
    } else {
      kidSpeak?.speakToby?.(`¡Esa casilla no es! Buscamos [[ENGLISH: ${calledWord?.word}]]!`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🎱 Bingo de Palabras (Word Bingo)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Escucha la palabra que canta Toby y márcala en tu cartón
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => kidSpeak?.speakToby?.(`¡Buscamos en el cartón: [[ENGLISH: ${calledWord?.word}]]!`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: 'var(--bg-surface)',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <Volume2 size={16} /> Repetir
          </button>
          <button
            onClick={initGame}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              background: 'var(--bg-surface)',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} /> Nuevo cartón
          </button>
        </div>
      </div>

      {/* Cartel palabra cantada */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
          borderRadius: '24px',
          padding: '1rem',
          maxWidth: '440px',
          margin: '0 auto 1.25rem',
          border: '3px solid #8b5cf6',
          boxShadow: '0 8px 18px rgba(139,92,246,0.2)',
        }}
      >
        <span style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', color: '#6d28d9' }}>
          Palabra Cantada:
        </span>
        <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#5b21b6', margin: '0.15rem 0' }}>
          "{calledWord?.word}"
        </div>
        <span style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 700 }}>
          ¡Tócala en tu cartón abajo!
        </span>
      </div>

      {/* Cartón 3x3 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          maxWidth: '420px',
          margin: '0 auto',
          background: '#ede9fe',
          padding: '0.85rem',
          borderRadius: '24px',
          border: '3px solid #8b5cf6',
        }}
      >
        {board.map((item, idx) => {
          const isMarked = marked.includes(idx);
          return (
            <button
              key={`${item.id}_${idx}`}
              onClick={() => handleCellClick(item, idx)}
              style={{
                aspectRatio: '1',
                borderRadius: '18px',
                border: isMarked ? '3px solid #10b981' : '2px solid #c4b5fd',
                background: isMarked ? '#ecfdf5' : '#ffffff',
                cursor: isMarked ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transform: isMarked ? 'scale(0.96)' : 'scale(1)',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{item.emoji}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: '0.2rem', color: '#334155' }}>
                {item.word}
              </span>
              {isMarked && (
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: '#10b981',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={13} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {hasBingo && (
        <div style={{ marginTop: '1.5rem', background: '#ecfdf5', border: '3px solid #10b981', borderRadius: '20px', padding: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🎉 🎱 🐶 ⭐</span>
          <h4 style={{ margin: '0.3rem 0', color: '#065f46', fontSize: '1.3rem', fontWeight: 900 }}>
            ¡¡BIIINGO!! ¡Ganaste!
          </h4>
          <button
            onClick={initGame}
            style={{
              marginTop: '0.5rem',
              background: '#8b5cf6',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.6rem 1.4rem',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            ¡Jugar otro cartón! 🎱
          </button>
        </div>
      )}
    </div>
  );
}
