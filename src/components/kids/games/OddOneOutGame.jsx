import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function OddOneOutGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length >= 4 ? items : KIDS_ITEMS;
  }, [items]);

  const [round, setRound] = useState(0);
  const [targetItem, setTargetItem] = useState(null);
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const startRound = () => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const target = shuffled[0];
    const rest = shuffled.slice(1, 4);
    const roundOptions = [target, ...rest].sort(() => 0.5 - Math.random());

    setTargetItem(target);
    setOptions(roundOptions);
    setAnswered(false);
    setSelectedId(null);

    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Encuentra el dibujo de: [[ENGLISH: ${target.word}]]!`);
    }, 200);
  };

  useEffect(() => {
    startRound();
  }, [pool, round]);

  const handleSelect = (item) => {
    if (answered) return;
    setSelectedId(item.id);
    setAnswered(true);

    if (item.id === targetItem.id) {
      kidSpeak?.speakToby?.(`¡Muy bien! ¡Encontraste [[ENGLISH: ${item.word}]]!`);
      onEarnStar?.(15);
      setTimeout(() => {
        setRound((r) => r + 1);
      }, 1500);
    } else {
      kidSpeak?.speakToby?.(`¡Oh no! Ese dibujo es [[ENGLISH: ${item.word}]]. ¡Buscamos [[ENGLISH: ${targetItem.word}]]!`);
      setTimeout(() => {
        setAnswered(false);
        setSelectedId(null);
      }, 1500);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🕵️ El Intruso (Odd One Out)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Toby te dice qué dibujo buscar · ¡Encuéntralo entre las opciones!
          </p>
        </div>
        <button
          onClick={() => { kidSpeak?.speakToby?.(`¡Encuentra: [[ENGLISH: ${targetItem?.word}]]!`); }}
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
          <Volume2 size={16} /> Repetir audio
        </button>
      </div>

      {/* Tarjeta de indicación */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          borderRadius: '24px',
          padding: '1.25rem',
          maxWidth: '460px',
          margin: '0 auto 1.5rem',
          border: '3px solid #f59e0b',
          boxShadow: '0 8px 20px rgba(245,158,11,0.2)',
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 900, textTransform: 'uppercase', color: '#b45309' }}>
          Toby te pide encontrar:
        </span>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#78350f', margin: '0.25rem 0' }}>
          "{targetItem?.word}"
        </div>
        <span style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 700 }}>
          ({targetItem?.spanish})
        </span>
      </div>

      {/* 4 Opciones grandes para tocar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {options.map((item) => {
          const isSelected = selectedId === item.id;
          const isCorrect = item.id === targetItem?.id;

          let borderStyle = '3px solid var(--border)';
          let bgStyle = 'var(--bg-surface)';

          if (answered && isSelected) {
            borderStyle = isCorrect ? '4px solid #10b981' : '4px solid #ef4444';
            bgStyle = isCorrect ? '#ecfdf5' : '#fef2f2';
          }

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{
                aspectRatio: '1',
                borderRadius: '24px',
                border: borderStyle,
                background: bgStyle,
                cursor: answered ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
              }}
            >
              <span style={{ fontSize: '3.6rem', lineHeight: 1 }}>{item.emoji}</span>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {item.word}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
