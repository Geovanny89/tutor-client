import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function BalloonPopGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    return items && items.length >= 3 ? items : KIDS_ITEMS;
  }, [items]);

  const [target, setTarget] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [poppedId, setPoppedId] = useState(null);

  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const spawnBalloons = () => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const nextTarget = shuffled[0];
    const rest = shuffled.slice(1, 4);
    const roundItems = [nextTarget, ...rest].sort(() => 0.5 - Math.random());

    setTarget(nextTarget);
    setPoppedId(null);
    setBalloons(
      roundItems.map((item, idx) => ({
        ...item,
        uniqueId: `${item.id}_${Date.now()}_${idx}`,
        color: colors[idx % colors.length],
        left: 12 + idx * 23,
      }))
    );

    setTimeout(() => {
      kidSpeak?.speakToby?.(`¡Explota el globo con [[ENGLISH: ${nextTarget.word}]]!`);
    }, 200);
  };

  useEffect(() => {
    spawnBalloons();
  }, [pool]);

  const handlePop = (balloon) => {
    if (poppedId) return;

    if (balloon.id === target.id) {
      setPoppedId(balloon.uniqueId);
      kidSpeak?.speakToby?.(`¡Pop pop! ¡Reventaste [[ENGLISH: ${balloon.word}]]! ¡Excelente!`);
      onEarnStar?.(15);
      setTimeout(() => {
        spawnBalloons();
      }, 1100);
    } else {
      kidSpeak?.speakToby?.(`¡Ese globo es [[ENGLISH: ${balloon.word}]]! ¡Buscamos [[ENGLISH: ${target.word}]]!`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          🎈 Explota el Globo (Pop the Balloon)
        </h3>
        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
          Escucha a Toby y revienta el globo correcto
        </p>
      </div>

      {/* Target indicator */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          borderRadius: '24px',
          padding: '0.85rem 1.5rem',
          maxWidth: '440px',
          margin: '0 auto 1.5rem',
          border: '3px solid #ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#991b1b' }}>
            Explota el globo:
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#7f1d1d' }}>
            "{target?.word}" {target?.spanish ? <span style={{ fontSize: '0.9rem', opacity: 0.85, fontWeight: 700 }}>({target.spanish})</span> : null}
          </div>
        </div>
        <button
          onClick={() => kidSpeak?.speakToby?.(`¡Explota el globo con [[ENGLISH: ${target?.word}]]!`)}
          style={{
            background: '#ef4444',
            border: 'none',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
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

      {/* Área de Globos Flotantes */}
      <div
        style={{
          height: '320px',
          maxWidth: '650px',
          margin: '0 auto',
          position: 'relative',
          background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)',
          borderRadius: '30px',
          border: '3px solid #38bdf8',
          overflow: 'hidden',
          boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.06)',
        }}
      >
        {balloons.map((b) => {
          const isPopped = poppedId === b.uniqueId;
          return (
            <button
              key={b.uniqueId}
              onClick={() => handlePop(b)}
              style={{
                position: 'absolute',
                bottom: '30px',
                left: `${b.left}%`,
                transform: isPopped ? 'scale(1.5)' : 'scale(1)',
                opacity: isPopped ? 0 : 1,
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'bounce 2.2s ease-in-out infinite',
              }}
            >
              {/* Forma del Globo */}
              <div
                style={{
                  width: '90px',
                  height: '110px',
                  borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                  background: `linear-gradient(135deg, ${b.color}ee, ${b.color})`,
                  boxShadow: `0 8px 18px ${b.color}55, inset -4px -4px 8px rgba(0,0,0,0.2), inset 4px 4px 8px rgba(255,255,255,0.4)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{b.emoji}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                  {b.word}
                </span>
                {/* Nudo del globo */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    width: '10px',
                    height: '6px',
                    background: b.color,
                    borderRadius: '2px',
                  }}
                />
              </div>
              {/* Cuerda del globo */}
              <div style={{ width: '2px', height: '28px', background: '#94a3b8' }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
