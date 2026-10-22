import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Check, Sparkles } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function DragDropGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    const list = items && items.length >= 3 ? items : KIDS_ITEMS;
    return [...list].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [items]);

  const [targets, setTargets] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [paired, setPaired] = useState({}); // { [targetId]: labelId }

  const initGame = () => {
    setTargets([...pool].sort(() => 0.5 - Math.random()));
    setLabels([...pool].sort(() => 0.5 - Math.random()));
    setSelectedLabel(null);
    setPaired({});
  };

  useEffect(() => {
    initGame();
  }, [pool]);

  const handleSelectLabel = (labelItem) => {
    // Si ya está emparejada, no hacer nada
    if (Object.values(paired).includes(labelItem.id)) return;
    setSelectedLabel(labelItem);
    kidSpeak?.speakEnglish?.(labelItem.word);
  };

  const handleTargetClick = (targetItem) => {
    if (!selectedLabel) {
      kidSpeak?.speakSpanish?.('¡Primero toca una palabra y luego su dibujo!');
      return;
    }

    if (paired[targetItem.id]) return;

    if (selectedLabel.id === targetItem.id) {
      // ¡Acierto!
      const newPaired = { ...paired, [targetItem.id]: selectedLabel.id };
      setPaired(newPaired);
      setSelectedLabel(null);
      kidSpeak?.speakToby?.(`¡Muy bien! ¡Emparejaste [[ENGLISH: ${targetItem.word}]]!`);
      onEarnStar?.(15);

      if (Object.keys(newPaired).length === targets.length) {
        setTimeout(() => {
          kidSpeak?.speakToby?.('¡Increíble! ¡Completaste todos los dibujos!');
        }, 600);
      }
    } else {
      // Error
      kidSpeak?.speakToby?.('¡Casi! Intenta unirla con el dibujo correcto.');
      setSelectedLabel(null);
    }
  };

  // Drag & drop nativo para desktop
  const handleDragStart = (e, labelItem) => {
    e.dataTransfer.setData('text/plain', labelItem.id);
    setSelectedLabel(labelItem);
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    const labelId = e.dataTransfer.getData('text/plain');
    const labelItem = labels.find((l) => l.id === labelId);
    if (!labelItem) return;

    if (labelItem.id === targetItem.id) {
      const newPaired = { ...paired, [targetItem.id]: labelItem.id };
      setPaired(newPaired);
      setSelectedLabel(null);
      kidSpeak?.speakEnglish?.(targetItem.word);
      onEarnStar?.(15);
    } else {
      kidSpeak?.speakToby?.('¡Ese dibujo no coincide con esa palabra! Intenta de nuevo.');
    }
  };

  const isComplete = targets.length > 0 && Object.keys(paired).length === targets.length;

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🎯 Arrastrar y Soltar
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Toca o arrastra la palabra en inglés hacia su dibujo correspondiente
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

      {/* Tarjetas / Objetivos con dibujos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          maxWidth: '650px',
          margin: '0 auto 1.5rem',
        }}
      >
        {targets.map((item) => {
          const isMatched = !!paired[item.id];
          return (
            <div
              key={item.id}
              onClick={() => handleTargetClick(item)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, item)}
              style={{
                background: isMatched ? '#ecfdf5' : 'var(--bg-surface)',
                border: isMatched ? '3px solid #10b981' : '3px dashed #06b6d4',
                borderRadius: '24px',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: isMatched ? 'default' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isMatched ? '0 8px 18px rgba(16,185,129,0.18)' : '0 4px 10px rgba(0,0,0,0.04)',
              }}
            >
              <span style={{ fontSize: '3.8rem', lineHeight: 1 }}>{item.emoji}</span>
              <div
                style={{
                  minHeight: '38px',
                  width: '100%',
                  borderRadius: '12px',
                  background: isMatched ? '#10b981' : '#f1f5f9',
                  color: isMatched ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                  padding: '0.3rem 0.6rem',
                  boxSizing: 'border-box',
                }}
              >
                {isMatched ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Check size={16} /> {item.word}
                  </span>
                ) : (
                  'Toca aquí'
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Palabras sueltas para arrastrar o tocar */}
      <div style={{ marginTop: '1rem' }}>
        <p style={{ margin: '0 0 0.6rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {selectedLabel ? `Seleccionaste: "${selectedLabel.word}" → Ahora toca su dibujo arriba` : 'Toca una palabra:'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {labels.map((item) => {
            const isUsed = Object.values(paired).includes(item.id);
            const isSelected = selectedLabel?.id === item.id;

            return (
              <button
                key={item.id}
                draggable={!isUsed}
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => handleSelectLabel(item)}
                disabled={isUsed}
                style={{
                  background: isUsed
                    ? '#e2e8f0'
                    : isSelected
                    ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
                    : '#ffffff',
                  color: isUsed ? '#94a3b8' : isSelected ? '#ffffff' : '#0891b2',
                  border: isUsed ? '2px solid transparent' : '2.5px solid #06b6d4',
                  borderRadius: '16px',
                  padding: '0.65rem 1.4rem',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  cursor: isUsed ? 'default' : 'pointer',
                  transform: isSelected ? 'scale(1.08) translateY(-3px)' : 'scale(1)',
                  boxShadow: isSelected ? '0 10px 20px rgba(6,182,212,0.35)' : '0 3px 6px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: isUsed ? 0.45 : 1,
                }}
              >
                {item.word}
              </button>
            );
          })}
        </div>
      </div>

      {isComplete && (
        <div style={{ marginTop: '1.5rem', background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '18px', padding: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🌟 🐶 🎯</span>
          <h4 style={{ margin: '0.4rem 0 0.2rem', color: '#065f46', fontSize: '1.2rem', fontWeight: 900 }}>
            ¡Excelente trabajo! ¡Emparejaste todas las palabras!
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
