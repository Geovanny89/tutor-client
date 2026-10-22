import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2, ArrowLeft, ArrowRight } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function CatchAnswerGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length >= 3 ? items : KIDS_ITEMS;
  }, [items]);

  const [target, setTarget] = useState(null);
  const [basketPos, setBasketPos] = useState(50); // % de izquierda a derecha (0 a 100)
  const [fallingItems, setFallingItems] = useState([]);
  const [score, setScore] = useState(0);

  const startRound = () => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const nextTarget = shuffled[0];
    const rest = shuffled.slice(1, 4);
    const roundList = [nextTarget, ...rest].sort(() => 0.5 - Math.random());

    setTarget(nextTarget);
    setFallingItems(
      roundList.map((item, idx) => ({
        ...item,
        uniqueId: `${item.id}_${Date.now()}_${idx}`,
        left: 15 + idx * 23,
      }))
    );

    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Mueve la canasta de Toby y atrapa: [[ENGLISH: ${nextTarget.word}]]!`);
    }, 200);
  };

  useEffect(() => {
    startRound();
  }, [pool]);

  const handleCatch = (item) => {
    if (item.id === target.id) {
      kidSpeak?.speakToby?.(`¡Bien atrapado! ¡Ese es [[ENGLISH: ${item.word}]]!`);
      onEarnStar?.(15);
      setScore((s) => s + 1);
      setTimeout(() => {
        startRound();
      }, 1000);
    } else {
      kidSpeak?.speakToby?.(`¡Ese objeto era [[ENGLISH: ${item.word}]]! ¡Buscamos [[ENGLISH: ${target.word}]]!`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          🧺 Atrapa la Respuesta (Catch the Answer)
        </h3>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
          Atrapa los objetos correctos que caen del cielo en la canasta de Toby
        </p>
      </div>

      {/* Cartel objetivo */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
          borderRadius: '22px',
          padding: '0.75rem 1.5rem',
          maxWidth: '440px',
          margin: '0 auto 1.25rem',
          border: '3px solid #d946ef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#86198f' }}>
            Atrapa con la canasta:
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#701a75' }}>
            "{target?.word}" {target?.spanish ? <span style={{ fontSize: '0.85rem', opacity: 0.85, fontWeight: 700 }}>({target.spanish})</span> : null}
          </div>
        </div>
        <button
          onClick={() => kidSpeak?.speakToby?.(`¡Atrapa en la canasta: [[ENGLISH: ${target?.word}]]!`)}
          style={{
            background: '#d946ef',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Volume2 size={18} />
        </button>
      </div>

      {/* Área del juego arcade */}
      <div
        style={{
          height: '280px',
          maxWidth: '600px',
          margin: '0 auto 1rem',
          position: 'relative',
          background: 'linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: '26px',
          border: '3px solid #d946ef',
          overflow: 'hidden',
        }}
      >
        {/* Objetos cayendo - tocables directamente */}
        {fallingItems.map((item) => (
          <button
            key={item.uniqueId}
            onClick={() => handleCatch(item)}
            style={{
              position: 'absolute',
              top: '40px',
              left: `${item.left}%`,
              background: '#ffffff',
              border: '2px solid #d946ef',
              borderRadius: '20px',
              padding: '0.6rem 0.8rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 14px rgba(217,70,239,0.2)',
              animation: 'bounce 2.2s ease-in-out infinite',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{item.emoji}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#701a75', marginTop: '0.2rem' }}>
              {item.word}
            </span>
          </button>
        ))}

        {/* Toby y su Cesta abajo */}
        <div
          style={{
            position: 'absolute',
            bottom: '15px',
            left: `${basketPos}%`,
            transform: 'translateX(-50%)',
            transition: 'left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: '2.6rem', lineHeight: 1 }}>🐶</span>
          <span style={{ fontSize: '3rem', lineHeight: 1 }}>🧺</span>
        </div>
      </div>

      {/* Controles de movimiento de la canasta */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          onClick={() => setBasketPos((p) => Math.max(15, p - 20))}
          style={{
            background: '#d946ef',
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            padding: '0.75rem 1.6rem',
            fontWeight: 900,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 6px 14px rgba(217,70,239,0.3)',
          }}
        >
          <ArrowLeft size={18} /> Izquierda
        </button>
        <button
          onClick={() => setBasketPos((p) => Math.min(85, p + 20))}
          style={{
            background: '#d946ef',
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            padding: '0.75rem 1.6rem',
            fontWeight: 900,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 6px 14px rgba(217,70,239,0.3)',
          }}
        >
          Derecha <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
