import React, { useState, useEffect } from 'react';
import { RotateCcw, Check } from 'lucide-react';

const OPPOSITE_PAIRS = [
  { a: { word: 'Big', emoji: '🐘', spanish: 'Grande' }, b: { word: 'Small', emoji: '🐜', spanish: 'Pequeño' } },
  { a: { word: 'Happy', emoji: '😄', spanish: 'Feliz' }, b: { word: 'Sad', emoji: '😢', spanish: 'Triste' } },
  { a: { word: 'Hot', emoji: '🔥', spanish: 'Caliente' }, b: { word: 'Cold', emoji: '❄️', spanish: 'Frío' } },
  { a: { word: 'Day', emoji: '☀️', spanish: 'Día' }, b: { word: 'Night', emoji: '🌙', spanish: 'Noche' } },
  { a: { word: 'Fast', emoji: '🏎️', spanish: 'Rápido' }, b: { word: 'Slow', emoji: '🐢', spanish: 'Lento' } },
  { a: { word: 'Up', emoji: '⬆️', spanish: 'Arriba' }, b: { word: 'Down', emoji: '⬇️', spanish: 'Abajo' } },
];

export default function OppositesMatchGame({ onEarnStar, kidSpeak }) {
  const [pairs, setPairs] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const initGame = () => {
    const selected = [...OPPOSITE_PAIRS].sort(() => 0.5 - Math.random()).slice(0, 3);
    setPairs(selected);
    setSelectedLeft(null);
    setMatchedPairs([]);

    setTimeout(() => {
      kidSpeak?.speakToby?.('¡Opuestos en el espejo! Conecta cada palabra con su contrario.');
    }, 200);
  };

  useEffect(() => {
    initGame();
  }, []);

  const leftColumn = pairs.map((p) => p.a);
  const rightColumn = [...pairs.map((p) => p.b)].sort(() => 0.5 - Math.random());

  const handleSelectLeft = (item) => {
    if (matchedPairs.some((p) => p.a.word === item.word)) return;
    setSelectedLeft(item);
    kidSpeak?.speakEnglish?.(item.word);
  };

  const handleSelectRight = (item) => {
    if (!selectedLeft) {
      kidSpeak?.speakSpanish?.('¡Primero toca una palabra del lado izquierdo!');
      return;
    }
    if (matchedPairs.some((p) => p.b.word === item.word)) return;

    // Verificar si son opuestos
    const matchingPair = pairs.find(
      (p) => p.a.word === selectedLeft.word && p.b.word === item.word
    );

    if (matchingPair) {
      setMatchedPairs((prev) => [...prev, matchingPair]);
      setSelectedLeft(null);
      kidSpeak?.speakToby?.(`¡Exacto! El opuesto de [[ENGLISH: ${selectedLeft.word}]] es [[ENGLISH: ${item.word}]]!`);
      onEarnStar?.(15);
    } else {
      kidSpeak?.speakToby?.(`¡Ese no es el opuesto de [[ENGLISH: ${selectedLeft.word}]]! Intenta de nuevo.`);
    }
  };

  const isComplete = pairs.length > 0 && matchedPairs.length === pairs.length;

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🪞 Opuestos en el Espejo (Opposites Match)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Toca una palabra de la izquierda y luego su opuesto en la derecha
          </p>
        </div>
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
          <RotateCcw size={15} /> Reiniciar
        </button>
      </div>

      {/* Columnas izquierda y derecha */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
        {/* Columna Izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {leftColumn.map((item) => {
            const isMatched = matchedPairs.some((p) => p.a.word === item.word);
            const isSelected = selectedLeft?.word === item.word;

            return (
              <button
                key={item.word}
                onClick={() => handleSelectLeft(item)}
                disabled={isMatched}
                style={{
                  background: isMatched ? '#ecfdf5' : isSelected ? '#6366f1' : 'var(--bg-surface)',
                  color: isMatched ? '#065f46' : isSelected ? '#ffffff' : 'var(--text-primary)',
                  border: isMatched ? '2px solid #10b981' : isSelected ? '3px solid #4f46e5' : '2px solid var(--border)',
                  borderRadius: '18px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: isMatched ? 'default' : 'pointer',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ fontSize: '2.4rem' }}>{item.emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{item.word}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{item.spanish}</div>
                </div>
                {isMatched && <Check size={18} color="#10b981" style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>

        {/* Columna Derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {rightColumn.map((item) => {
            const isMatched = matchedPairs.some((p) => p.b.word === item.word);

            return (
              <button
                key={item.word}
                onClick={() => handleSelectRight(item)}
                disabled={isMatched}
                style={{
                  background: isMatched ? '#ecfdf5' : 'var(--bg-surface)',
                  color: isMatched ? '#065f46' : 'var(--text-primary)',
                  border: isMatched ? '2px solid #10b981' : '2px solid var(--border)',
                  borderRadius: '18px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: isMatched ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ fontSize: '2.4rem' }}>{item.emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{item.word}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{item.spanish}</div>
                </div>
                {isMatched && <Check size={18} color="#10b981" style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {isComplete && (
        <div style={{ background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '18px', padding: '1rem', maxWidth: '440px', margin: '0 auto' }}>
          <span style={{ fontSize: '2.5rem' }}>🪞 ⭐ 🐶</span>
          <h4 style={{ margin: '0.3rem 0', color: '#065f46', fontSize: '1.2rem', fontWeight: 900 }}>
            ¡Gran trabajo! ¡Emparejaste todos los opuestos!
          </h4>
        </div>
      )}
    </div>
  );
}
