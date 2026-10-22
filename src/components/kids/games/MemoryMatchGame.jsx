import React, { useState, useEffect, useMemo } from 'react';
import { Star, RotateCcw } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function MemoryMatchGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    const list = items && items.length >= 3 ? items : KIDS_ITEMS;
    return [...list].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [items]);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  const initGame = () => {
    const cardPairs = [];
    pool.forEach((item) => {
      // Carta con Imagen
      cardPairs.push({
        id: `${item.id}_img`,
        type: 'image',
        pairKey: item.id,
        content: item.emoji,
        label: item.word,
        item,
      });
      // Carta con Palabra Escrita en Inglés
      cardPairs.push({
        id: `${item.id}_txt`,
        type: 'text',
        pairKey: item.id,
        content: item.word,
        label: item.word,
        item,
      });
    });
    setCards(cardPairs.sort(() => 0.5 - Math.random()));
    setFlipped([]);
    setMatched([]);
    setIsLocked(false);
  };

  useEffect(() => {
    initGame();
  }, [pool]);

  const handleCardClick = (index) => {
    if (isLocked) return;
    if (flipped.includes(index) || matched.includes(cards[index].pairKey)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      if (card1.pairKey === card2.pairKey && card1.type !== card2.type) {
        // ¡Match!
        setTimeout(() => {
          setMatched((prev) => [...prev, card1.pairKey]);
          setFlipped([]);
          setIsLocked(false);
          kidSpeak?.speakToby?.(`¡Excelente! ¡Hiciste pareja con [[ENGLISH: ${card1.item.word}]]!`);
          onEarnStar?.(15);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  const isComplete = pool.length > 0 && matched.length === pool.length;

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🃏 Memorama Clásico
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Voltea las cartas y encuentra la pareja de dibujo y palabra
          </p>
        </div>
        <button
          onClick={initGame}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            background: 'var(--bg-surface)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={15} /> Reiniciar
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.85rem',
          maxWidth: '560px',
          margin: '0 auto',
        }}
      >
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.pairKey);
          const isCardMatched = matched.includes(card.pairKey);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              style={{
                aspectRatio: '1',
                borderRadius: '18px',
                border: isCardMatched ? '3px solid #10b981' : isFlipped ? '3px solid #ec4899' : '3px solid var(--border)',
                background: isCardMatched ? '#ecfdf5' : isFlipped ? '#ffffff' : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                color: isFlipped ? '#1e293b' : '#ffffff',
                fontSize: card.type === 'image' && isFlipped ? '2.8rem' : isFlipped ? '1.1rem' : '2rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isCardMatched ? 'default' : 'pointer',
                transform: isFlipped ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isFlipped ? '0 8px 16px rgba(236,72,153,0.2)' : '0 4px 8px rgba(0,0,0,0.1)',
                userSelect: 'none',
              }}
            >
              {isFlipped ? card.content : '❓'}
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div style={{ marginTop: '1.5rem', background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '18px', padding: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🎉 ⭐ 🐶</span>
          <h4 style={{ margin: '0.4rem 0 0.2rem', color: '#065f46', fontSize: '1.2rem', fontWeight: 900 }}>
            ¡Bieeeen hecho! ¡Completaste el Memorama!
          </h4>
          <button
            onClick={initGame}
            style={{
              marginTop: '0.75rem',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.6rem 1.4rem',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            ¡Jugar otra vez! ⭐
          </button>
        </div>
      )}
    </div>
  );
}
