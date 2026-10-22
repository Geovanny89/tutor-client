import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function WordMazeGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length >= 3 ? items : KIDS_ITEMS;
  }, [items]);

  // Pasos del laberinto (4 pasos hasta la meta)
  const steps = useMemo(() => {
    return [...pool].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [pool]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [isWon, setIsWon] = useState(false);

  const initStep = () => {
    if (currentStepIdx >= steps.length) {
      setIsWon(true);
      kidSpeak?.speakToby?.('¡LLEGASTE A LA META! 🧭 ⭐ ¡Cruzaste todo el laberinto!');
      onEarnStar?.(25);
      return;
    }

    const target = steps[currentStepIdx];
    const otherItems = KIDS_ITEMS.filter((k) => k.id !== target.id);
    const distractors = otherItems.sort(() => 0.5 - Math.random()).slice(0, 2);
    const stepOptions = [target, ...distractors].sort(() => 0.5 - Math.random());

    setOptions(stepOptions);

    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Para que Toby avance por el laberinto, pisa la casilla de [[ENGLISH: ${target.word}]]!`);
    }, 200);
  };

  useEffect(() => {
    initStep();
  }, [currentStepIdx, steps]);

  const handleStepClick = (item) => {
    const target = steps[currentStepIdx];
    if (item.id === target.id) {
      kidSpeak?.speakToby?.(`¡Paso dado! ¡Avanzamos con [[ENGLISH: ${item.word}]]!`);
      onEarnStar?.(10);
      setCurrentStepIdx((s) => s + 1);
    } else {
      kidSpeak?.speakToby?.(`¡Cuidado! Esa casilla es [[ENGLISH: ${item.word}]]. Para avanzar pisa [[ENGLISH: ${target.word}]].`);
    }
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setIsWon(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🧭 El Laberinto de Palabras (Word Maze)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Guía a Toby pisando las palabras correctas hasta llegar a la estrella
          </p>
        </div>
        <button
          onClick={handleRestart}
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

      {/* Camino visual del laberinto (Progreso de Toby) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '520px',
          margin: '0 auto 1.5rem',
          background: '#ecfdf5',
          border: '3px solid #10b981',
          borderRadius: '24px',
          padding: '1rem 1.5rem',
          position: 'relative',
        }}
      >
        {/* Pasos */}
        {steps.map((st, idx) => {
          const isPassed = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx;

          return (
            <React.Fragment key={idx}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  background: isPassed ? '#10b981' : isCurrent ? '#059669' : '#ffffff',
                  border: isCurrent ? '3px solid #34d399' : '2px solid #a7f3d0',
                  color: isPassed || isCurrent ? '#ffffff' : '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isCurrent ? '1.8rem' : '1.3rem',
                  fontWeight: 900,
                  transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: isCurrent ? '0 6px 14px rgba(5,150,105,0.3)' : 'none',
                }}
              >
                {isCurrent ? '🐶' : isPassed ? '🐾' : idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '4px',
                    background: isPassed ? '#10b981' : '#a7f3d0',
                    margin: '0 0.4rem',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Meta con estrella */}
        <div style={{ marginLeft: '0.8rem', fontSize: '2.5rem', animation: isWon ? 'bounce 1s infinite' : 'none' }}>
          ⭐
        </div>
      </div>

      {/* Casillas para pisar en el paso actual */}
      {!isWon ? (
        <div>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            ¿Qué casilla debe pisar Toby para avanzar?
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.85rem',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            {options.map((item) => (
              <button
                key={item.id}
                onClick={() => handleStepClick(item)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '3px solid var(--border)',
                  borderRadius: '22px',
                  padding: '1.25rem 0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06) translateY(-3px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span style={{ fontSize: '3rem', lineHeight: 1 }}>{item.emoji}</span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {item.word}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: '#ecfdf5', border: '3px solid #10b981', borderRadius: '22px', padding: '1.25rem', maxWidth: '440px', margin: '0 auto' }}>
          <span style={{ fontSize: '3rem' }}>🎉 🧭 🐶 ⭐</span>
          <h4 style={{ margin: '0.4rem 0', color: '#065f46', fontSize: '1.3rem', fontWeight: 900 }}>
            ¡Toby llegó a la estrella dorada!
          </h4>
          <button
            onClick={handleRestart}
            style={{
              marginTop: '0.5rem',
              background: '#059669',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.6rem 1.4rem',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            ¡Recorrer otro laberinto! 🧭
          </button>
        </div>
      )}
    </div>
  );
}
