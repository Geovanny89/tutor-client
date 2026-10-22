import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function SpellingBeeGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length > 0 ? items : KIDS_ITEMS;
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = pool[currentIndex % pool.length];

  const word = useMemo(() => (currentItem?.word || 'CAT').toUpperCase(), [currentItem]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [balloonsLeft, setBalloonsLeft] = useState(4);

  const initWord = () => {
    setGuessedLetters([]);
    setBalloonsLeft(4);
    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Vamos a deletrear [[ENGLISH: ${currentItem?.word}]]! Toca las letras para armarla.`);
    }, 200);
  };

  useEffect(() => {
    initWord();
  }, [currentIndex, currentItem]);

  // Teclado con las letras de la palabra + distractores amigables
  const keyboard = useMemo(() => {
    const lettersInWord = word.split('');
    const extra = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((l) => !lettersInWord.includes(l));
    const distractors = extra.sort(() => 0.5 - Math.random()).slice(0, 4);
    const all = Array.from(new Set([...lettersInWord, ...distractors]));
    return all.sort();
  }, [word]);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || balloonsLeft <= 0) return;

    const nextGuessed = [...guessedLetters, letter];
    setGuessedLetters(nextGuessed);

    if (word.includes(letter)) {
      kidSpeak?.speakEnglish?.(letter);
      // ¿Completó la palabra?
      const isWon = word.split('').every((l) => nextGuessed.includes(l));
      if (isWon) {
        setTimeout(() => {
          kidSpeak?.speakToby?.(`¡FANTÁSTICO! 🐝 ¡Deletreaste [[ENGLISH: ${word}]] perfectamente!`);
          onEarnStar?.(20);
        }, 300);
      }
    } else {
      const nextBalloons = balloonsLeft - 1;
      setBalloonsLeft(nextBalloons);
      kidSpeak?.speakToby?.(`¡Oh, la letra [[ENGLISH: ${letter}]] no está! Te quedan ${nextBalloons} globos.`);
    }
  };

  const isWon = word.split('').every((l) => guessedLetters.includes(l));
  const isLost = balloonsLeft <= 0 && !isWon;

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🐝 El Ahorcado Amigable (Spelling Bee)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Elige las letras para formar la palabra y cuida los globos de Toby
          </p>
        </div>
        <button
          onClick={() => kidSpeak?.speakToby?.(`¡Deletreamos: [[ENGLISH: ${currentItem?.word}]]!`)}
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

      {/* Escena central: Toby + Globos + Imagen */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
          borderRadius: '26px',
          padding: '1.25rem',
          maxWidth: '520px',
          margin: '0 auto 1.5rem',
          border: '3px solid #eab308',
          boxShadow: '0 8px 20px rgba(234,179,8,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        {/* Globos flotando */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {[0, 1, 2, 3].map((idx) => {
            const hasBalloon = idx < balloonsLeft;
            return (
              <span
                key={idx}
                style={{
                  fontSize: '2.4rem',
                  opacity: hasBalloon ? 1 : 0.25,
                  transform: hasBalloon ? 'scale(1)' : 'scale(0.8)',
                  transition: 'all 0.3s',
                }}
              >
                🎈
              </span>
            );
          })}
        </div>

        {/* Imagen central */}
        <span style={{ fontSize: '4.5rem', lineHeight: 1 }}>{currentItem?.emoji}</span>

        {/* Casillas de letras */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          {word.split('').map((char, idx) => {
            const revealed = guessedLetters.includes(char) || isLost;
            return (
              <div
                key={idx}
                style={{
                  width: '42px',
                  height: '52px',
                  borderRadius: '14px',
                  border: '3px solid #ca8a04',
                  background: revealed ? '#ffffff' : '#fef08a',
                  color: isLost && !guessedLetters.includes(char) ? '#ef4444' : '#713f12',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
                }}
              >
                {revealed ? char : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Teclado amigable */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '480px', margin: '0 auto' }}>
        {keyboard.map((letter) => {
          const used = guessedLetters.includes(letter);
          const isCorrect = used && word.includes(letter);
          return (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={used || isWon || isLost}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                border: isCorrect ? '2px solid #10b981' : used ? '2px solid #cbd5e1' : '2px solid #ca8a04',
                background: isCorrect ? '#ecfdf5' : used ? '#e2e8f0' : '#ffffff',
                color: isCorrect ? '#065f46' : used ? '#94a3b8' : '#713f12',
                fontSize: '1.2rem',
                fontWeight: 900,
                cursor: used ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {(isWon || isLost) && (
        <div style={{ marginTop: '1.25rem' }}>
          <button
            onClick={() => setCurrentIndex((c) => c + 1)}
            style={{
              background: '#eab308',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              padding: '0.7rem 1.8rem',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 6px 14px rgba(234,179,8,0.3)',
            }}
          >
            {isWon ? '¡Siguiente Palabra! ⭐' : 'Intentar otra palabra 🐾'}
          </button>
        </div>
      )}
    </div>
  );
}
