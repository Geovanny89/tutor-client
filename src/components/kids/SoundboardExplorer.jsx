import React, { useState } from 'react';
import { Volume2, Turtle, Sparkles } from 'lucide-react';
import { KIDS_CATEGORIES, KIDS_ITEMS } from '../../data/kidsVocabulary';
import { kidAudio } from '../../utils/kidAudio';

export default function SoundboardExplorer({ onEarnStar, speak }) {
  const [activeCategory, setActiveCategory] = useState('animals');
  const [activeId, setActiveId] = useState(null);
  const [slowMode, setSlowMode] = useState(false);

  const filteredItems = KIDS_ITEMS.filter((i) => i.category === activeCategory);

  const handleCardClick = (item) => {
    setActiveId(item.id);
    kidAudio.playPop();

    const rate = slowMode ? 0.6 : 0.85;
    const textToSpeak = item.soundText || item.word;
    speak(textToSpeak, rate);

    if (onEarnStar) onEarnStar(2);

    setTimeout(() => {
      setActiveId(null);
    }, 600);
  };

  return (
    <div>
      {/* Category Pills */}
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '1.75rem',
      }}>
        {KIDS_CATEGORIES.map((cat) => {
          const isSelected = cat.id === activeCategory;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '999px',
                border: isSelected ? `3px solid ${cat.color}` : '2px solid var(--border)',
                background: isSelected ? cat.bg : 'var(--bg-surface)',
                color: isSelected ? cat.color : 'var(--text-secondary)',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                boxShadow: isSelected ? `0 6px 14px ${cat.color}33` : 'none',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode controls: Normal vs Lento */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <button
          onClick={() => setSlowMode(!slowMode)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.2rem',
            borderRadius: '999px',
            border: slowMode ? '2px solid #10b981' : '2px solid var(--border)',
            background: slowMode ? '#dcfce7' : 'var(--bg-base)',
            color: slowMode ? '#15803d' : 'var(--text-secondary)',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          <Turtle size={20} />
          <span>{slowMode ? 'Modo Lento: Activado 🐢' : 'Hablar más lento 🐢'}</span>
        </button>
      </div>

      {/* Grid of Large Picture Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '1.25rem',
      }}>
        {filteredItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleCardClick(item)}
              style={{
                background: item.cardBg || 'var(--bg-surface)',
                border: isActive ? `4px solid ${item.color || 'var(--primary)'}` : '3px solid var(--border)',
                borderRadius: '26px',
                padding: '1.5rem 0.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                textAlign: 'center',
                transform: isActive ? 'scale(1.12) translateY(-6px)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isActive
                  ? `0 14px 25px ${item.color || '#10b981'}44`
                  : '0 4px 10px rgba(0, 0, 0, 0.05)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.05)';
                  e.currentTarget.style.borderColor = item.color || 'var(--primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
            >
              <span style={{
                fontSize: '4.5rem',
                lineHeight: 1,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))',
              }}>
                {item.emoji}
              </span>

              <span style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: item.color || 'var(--text-primary)',
              }}>
                {item.word}
              </span>

              <span style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-subtle)',
                background: 'rgba(0,0,0,0.04)',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
              }}>
                {item.spanish}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
