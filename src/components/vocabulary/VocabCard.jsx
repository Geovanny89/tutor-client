import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

const CEFR_BADGE = {
  A1: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
  A2: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  B1: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  B2: { bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  C1: { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
  C2: { bg: '#FDF4FF', text: '#701A75', border: '#F0ABFC' },
};

const TYPE_ICON = {
  irregular: '⚡',
  regular: '✅',
  auxiliary: '🔧',
  emotion: '💛',
  descriptive: '🎨',
  concrete: '📦',
  abstract: '💭',
  greeting: '👋',
  classroom: '📚',
  shopping: '🛒',
  travel: '✈️',
  social: '🤝',
  polite: '🎩',
  opinion: '💬',
  agreement: '👍',
  hedging: '🤔',
  contrast: '⚖️',
  academic: '🎓',
  conclusion: '🏁',
  frequency: '🔁',
  degree: '📊',
  place: '📍',
  time: '⏰',
  manner: '🌀',
  result: '➡️',
  addition: '➕',
  // Alphabet
  vowel: '🔵',
  consonant: '🟢',
  // Numbers
  cardinal: '🔢',
  ordinal: '🏅',
  fraction: '½',
  multiplier: '✖️',
  group: '📦',
  percentage: '％',
};

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US';
  utt.rate = 0.85;
  window.speechSynthesis.speak(utt);
}

export default function VocabCard({ word, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const badge = CEFR_BADGE[word.level] || CEFR_BADGE.A1;
  const typeIcon = TYPE_ICON[word.type] || '📝';

  return (
    <div
      id={`vocab-card-${word.word.replace(/\s+/g, '-').toLowerCase()}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(word)}
      style={{
        background: 'var(--bg-surface)',
        border: `1.5px solid ${hovered ? '#10B981' : 'var(--border)'}`,
        borderRadius: '16px',
        padding: '1.25rem',
        cursor: 'pointer',
        boxShadow: hovered ? '0 8px 24px rgba(5,150,105,0.12)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
      }}
    >
      {/* Top row: CEFR badge + type icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{
          padding: '0.2rem 0.65rem',
          borderRadius: '999px',
          background: badge.bg,
          color: badge.text,
          border: `1px solid ${badge.border}`,
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}>
          {word.level}
        </span>
        <span style={{ fontSize: '1.1rem' }} title={word.type}>{typeIcon}</span>
      </div>

      {/* Word + pronunciation */}
      <div style={{ marginBottom: '0.4rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.35rem',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.2,
        }}>
          {word.word}
        </h3>
        <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>
          {word.pronunciation}
        </span>
      </div>

      {/* Translation */}
      <p style={{
        color: '#047857',
        fontWeight: 600,
        fontSize: '0.95rem',
        marginBottom: '0.75rem',
      }}>
        {word.translation}
      </p>

      {/* Example sentence */}
      <p style={{
        color: '#64748B',
        fontSize: '0.83rem',
        fontStyle: 'italic',
        lineHeight: 1.5,
        borderLeft: '3px solid #D1FAE5',
        paddingLeft: '0.6rem',
        marginBottom: '1rem',
      }}>
        "{word.example}"
      </p>

      {/* Bottom: Tags + Audio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {(word.tags || []).slice(0, 2).map((tag) => (
            <span key={tag} style={{
              padding: '0.15rem 0.5rem',
              background: '#F1F5F9',
              color: '#64748B',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
            }}>
              {tag}
            </span>
          ))}
        </div>

        <button
          id={`vocab-speak-${word.word.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={(e) => { e.stopPropagation(); speak(word.word); }}
          title="Escuchar pronunciación"
          style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: '#ECFDF5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#A7F3D0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ECFDF5')}
        >
          <Volume2 size={15} color="#059669" />
        </button>
      </div>
    </div>
  );
}
