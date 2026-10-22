import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Volume2, Sparkles, Check } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function SentenceTrainGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length > 0 ? items : KIDS_ITEMS;
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = pool[currentIndex % pool.length];

  // Oración sencilla para niños: "The [item] is happy" o "I like [item]"
  const targetSentence = useMemo(() => {
    const word = currentItem?.word || 'dog';
    return ['The', word.toLowerCase(), 'is', 'happy'];
  }, [currentItem]);

  const [scrambled, setScrambled] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isChooChoo, setIsChooChoo] = useState(false);

  const initRound = () => {
    const shuffled = [...targetSentence].sort(() => 0.5 - Math.random());
    setScrambled(shuffled);
    setSelectedWords([]);
    setIsChooChoo(false);

    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Ordena los vagones del tren para decir: "${targetSentence.join(' ')}"!`);
    }, 200);
  };

  useEffect(() => {
    initRound();
  }, [currentIndex, targetSentence]);

  const handleWordClick = (word, idx) => {
    const nextSelected = [...selectedWords, word];
    setSelectedWords(nextSelected);

    // Quitar de scrambled
    setScrambled((prev) => prev.filter((_, i) => i !== idx));
    kidSpeak?.speakEnglish?.(word);

    // Verificar si completó
    if (nextSelected.length === targetSentence.length) {
      if (nextSelected.join(' ') === targetSentence.join(' ')) {
        setIsChooChoo(true);
        setTimeout(() => {
          kidSpeak?.speakEnglish?.(targetSentence.join(' '));
          kidSpeak?.speakToby?.('¡CHOO CHOO! 🚂 ¡El tren de oraciones está en marcha!');
          onEarnStar?.(20);
        }, 300);
      } else {
        kidSpeak?.speakToby?.('¡Casi! Los vagones están en otro orden. ¡Intentémoslo de nuevo!');
        setTimeout(() => {
          initRound();
        }, 1400);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🚂 Tren de Oraciones (Sentence Train)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Toca las palabras en orden para armar la oración del tren
          </p>
        </div>
        <button
          onClick={initRound}
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
          <RotateCcw size={15} /> Reiniciar
        </button>
      </div>

      {/* Oración objetivo meta */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          borderRadius: '20px',
          padding: '0.85rem 1.5rem',
          maxWidth: '520px',
          margin: '0 auto 1.5rem',
          border: '2px solid #f97316',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
        }}
      >
        <span style={{ fontSize: '2rem' }}>{currentItem?.emoji}</span>
        <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#9a3412' }}>
          "{targetSentence.join(' ')}"
        </span>
      </div>

      {/* Tren armado con vagones */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          minHeight: '75px',
          padding: '1rem',
          background: '#ffedd5',
          borderRadius: '26px',
          border: '3px solid #f97316',
          maxWidth: '650px',
          margin: '0 auto 1.5rem',
          transform: isChooChoo ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {/* Locomotora */}
        <div style={{ fontSize: '3.2rem', lineHeight: 1 }}>🚂</div>

        {/* Vagones acoplados */}
        {selectedWords.map((word, idx) => (
          <div
            key={idx}
            style={{
              background: '#f97316',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '0.65rem 1.1rem',
              fontWeight: 900,
              fontSize: '1.1rem',
              boxShadow: '0 4px 10px rgba(249,115,22,0.3)',
              position: 'relative',
            }}
          >
            {word}
            {/* Ruedas del vagón */}
            <div style={{ position: 'absolute', bottom: '-8px', left: '10px', fontSize: '0.8rem' }}>⚫</div>
            <div style={{ position: 'absolute', bottom: '-8px', right: '10px', fontSize: '0.8rem' }}>⚫</div>
          </div>
        ))}

        {selectedWords.length < targetSentence.length && (
          <span style={{ color: '#9a3412', fontWeight: 700, fontSize: '0.9rem' }}>
            (Acopla el siguiente vagón...)
          </span>
        )}
      </div>

      {/* Palabras sueltas para elegir */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {scrambled.map((word, idx) => (
          <button
            key={idx}
            onClick={() => handleWordClick(word, idx)}
            style={{
              background: 'var(--bg-surface)',
              border: '2.5px solid #f97316',
              color: '#c2410c',
              borderRadius: '16px',
              padding: '0.65rem 1.4rem',
              fontWeight: 900,
              fontSize: '1.15rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {word}
          </button>
        ))}
      </div>

      {isChooChoo && (
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => setCurrentIndex((c) => c + 1)}
            style={{
              background: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              padding: '0.7rem 1.8rem',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            ¡Siguiente Tren! 🚂 ⭐
          </button>
        </div>
      )}
    </div>
  );
}
