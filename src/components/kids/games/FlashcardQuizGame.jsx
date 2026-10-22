import React, { useState, useEffect, useMemo } from 'react';
import { Check, X, RotateCcw, Volume2 } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function FlashcardQuizGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length >= 2 ? items : KIDS_ITEMS;
  }, [items]);

  const [card, setCard] = useState(null);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const nextCard = () => {
    const isMatching = Math.random() > 0.5;
    const baseItem = pool[Math.floor(Math.random() * pool.length)];

    let displayWord = baseItem.word;
    if (!isMatching) {
      const otherItems = pool.filter((p) => p.id !== baseItem.id);
      const other = otherItems[Math.floor(Math.random() * otherItems.length)] || baseItem;
      displayWord = other.word;
    }

    setCard({
      imageItem: baseItem,
      displayWord,
      isMatching: displayWord.toLowerCase() === baseItem.word.toLowerCase(),
    });
    setFeedback(null);

    setTimeout(() => {
      kidSpeak?.speakToby?.(`¿Este dibujo es [[ENGLISH: ${displayWord}]]? ¿Sí o no?`);
    }, 200);
  };

  useEffect(() => {
    nextCard();
  }, [pool]);

  const handleAnswer = (userSaysYes) => {
    if (feedback) return;
    const correct = userSaysYes === card.isMatching;

    if (correct) {
      setFeedback('correct');
      kidSpeak?.speakToby?.(`¡Muy bien! ¡Es [[ENGLISH: ${card.displayWord}]]!`);
      onEarnStar?.(15);
      setStreak((s) => s + 1);
      setTimeout(() => {
        nextCard();
      }, 900);
    } else {
      setFeedback('wrong');
      kidSpeak?.speakToby?.(`¡Oh no! Este dibujo es [[ENGLISH: ${card.imageItem.word}]]!`);
      setStreak(0);
      setTimeout(() => {
        nextCard();
      }, 1400);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          ⚡ Tarjetas de Velocidad (Flashcard Quiz)
        </h3>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
          ¿El dibujo coincide con la palabra? Toca SÍ o NO
        </p>
      </div>

      {/* Tarjeta Gigante */}
      <div
        style={{
          background: feedback === 'correct' ? '#ecfdf5' : feedback === 'wrong' ? '#fef2f2' : 'var(--bg-surface)',
          border: feedback === 'correct' ? '4px solid #10b981' : feedback === 'wrong' ? '4px solid #ef4444' : '3px solid var(--border)',
          borderRadius: '28px',
          padding: '2rem 1.5rem',
          maxWidth: '380px',
          margin: '0 auto 1.5rem',
          boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem',
          transform: feedback ? 'scale(1.03)' : 'scale(1)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <span style={{ fontSize: '5.5rem', lineHeight: 1 }}>{card?.imageItem?.emoji}</span>
        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
          "{card?.displayWord}"
        </div>
      </div>

      {/* Botones Sí y No */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem' }}>
        <button
          onClick={() => handleAnswer(false)}
          style={{
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '22px',
            padding: '1rem 2.2rem',
            fontWeight: 900,
            fontSize: '1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 18px rgba(239,68,68,0.3)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <X size={26} /> NO
        </button>

        <button
          onClick={() => handleAnswer(true)}
          style={{
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '22px',
            padding: '1rem 2.2rem',
            fontWeight: 900,
            fontSize: '1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 18px rgba(16,185,129,0.3)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Check size={26} /> SÍ
        </button>
      </div>

      {streak > 0 && (
        <div style={{ marginTop: '1.25rem', fontSize: '1rem', fontWeight: 900, color: '#f59e0b' }}>
          🔥 ¡Racha veloz: {streak} acierto{streak > 1 ? 's' : ''}!
        </div>
      )}
    </div>
  );
}
