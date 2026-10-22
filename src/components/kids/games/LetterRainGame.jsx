import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, RotateCcw } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function LetterRainGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length > 0 ? items : KIDS_ITEMS;
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = pool[currentIndex % pool.length];
  const targetWord = (currentItem?.word || 'SUN').toUpperCase();

  const [neededIndex, setNeededIndex] = useState(0); // Qué letra toca presionar
  const [fallingLetters, setFallingLetters] = useState([]);

  const spawnRain = () => {
    const letters = targetWord.split('');
    const distractors = ['A', 'E', 'O', 'T', 'S', 'P', 'R', 'M'];
    const mixed = [...letters, ...distractors.slice(0, 3)].sort(() => 0.5 - Math.random());

    setFallingLetters(
      mixed.map((char, idx) => ({
        id: `${char}_${Date.now()}_${idx}`,
        char,
        left: 10 + idx * 11,
        color: ['#0284c7', '#06b6d4', '#3b82f6', '#8b5cf6'][idx % 4],
      }))
    );
  };

  useEffect(() => {
    setNeededIndex(0);
    spawnRain();
    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Lluvia de letras! Atrapa las gotas para formar [[ENGLISH: ${currentItem?.word}]]!`);
    }, 200);
  }, [currentIndex, currentItem]);

  const handleCatchLetter = (letterObj) => {
    const expectedLetter = targetWord[neededIndex];

    if (letterObj.char === expectedLetter) {
      // Correcto
      const nextIdx = neededIndex + 1;
      setNeededIndex(nextIdx);
      kidSpeak?.speakEnglish?.(letterObj.char);

      // Quitar la letra que ya atrapó
      setFallingLetters((prev) => prev.filter((l) => l.id !== letterObj.id));

      if (nextIdx === targetWord.length) {
        setTimeout(() => {
          kidSpeak?.speakToby?.(`¡Bravo! 🌧️ ¡Completaste la palabra [[ENGLISH: ${targetWord}]]!`);
          onEarnStar?.(20);
        }, 300);
      }
    } else {
      kidSpeak?.speakToby?.(`¡Buscamos la letra [[ENGLISH: ${expectedLetter}]]!`);
    }
  };

  const isComplete = neededIndex === targetWord.length;

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🌧️ Lluvia de Letras (Letter Rain)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Toca las gotas con las letras en el orden correcto
          </p>
        </div>
        <button
          onClick={() => kidSpeak?.speakToby?.(`¡Formamos: [[ENGLISH: ${currentItem?.word}]]!`)}
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
          <Volume2 size={16} /> Escuchar
        </button>
      </div>

      {/* Imagen guía + Casillas */}
      <div
        style={{
          background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
          borderRadius: '24px',
          padding: '1rem',
          maxWidth: '460px',
          margin: '0 auto 1.25rem',
          border: '3px solid #0284c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <span style={{ fontSize: '3.6rem', lineHeight: 1 }}>{currentItem?.emoji}</span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {targetWord.split('').map((char, idx) => {
            const isFilled = idx < neededIndex;
            return (
              <div
                key={idx}
                style={{
                  width: '38px',
                  height: '48px',
                  borderRadius: '12px',
                  border: idx === neededIndex ? '3px solid #0284c7' : '2px solid #7dd3fc',
                  background: isFilled ? '#0284c7' : '#ffffff',
                  color: isFilled ? '#ffffff' : '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  transform: idx === neededIndex ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}
              >
                {isFilled ? char : '_'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gotas de lluvia con letras flotando */}
      <div
        style={{
          height: '240px',
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
          background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '26px',
          border: '3px solid #7dd3fc',
          overflow: 'hidden',
        }}
      >
        {fallingLetters.map((l) => (
          <button
            key={l.id}
            onClick={() => handleCatchLetter(l)}
            style={{
              position: 'absolute',
              top: '40px',
              left: `${l.left}%`,
              width: '56px',
              height: '70px',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: `linear-gradient(180deg, ${l.color}dd, ${l.color})`,
              color: '#ffffff',
              border: '2px solid #ffffff',
              fontSize: '1.6rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(2,132,199,0.3)',
              animation: 'bounce 2.5s ease-in-out infinite',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {l.char}
          </button>
        ))}
      </div>

      {isComplete && (
        <div style={{ marginTop: '1.25rem' }}>
          <button
            onClick={() => setCurrentIndex((c) => c + 1)}
            style={{
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              padding: '0.7rem 1.8rem',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            ¡Siguiente Palabra! ⭐
          </button>
        </div>
      )}
    </div>
  );
}
