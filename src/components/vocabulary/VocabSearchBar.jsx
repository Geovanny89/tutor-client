import React from 'react';
import { Search } from 'lucide-react';

const CEFR_COLORS = {
  all: { bg: 'var(--bg-muted)', text: 'var(--text-secondary)', border: 'var(--border-strong)' },
  A1:  { bg: 'var(--primary-bg)', text: 'var(--primary-text)', border: 'var(--primary-soft-2)' },
  A2:  { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  B1:  { bg: 'var(--warning-bg)', text: 'var(--accent-gold-text)', border: 'var(--accent-gold-border)' },
  B2:  { bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  C1:  { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
  C2:  { bg: '#FDF4FF', text: '#701A75', border: '#F0ABFC' },
};

export default function VocabSearchBar({ search, onSearch, cefrLevels, activeCEFR, onCEFR }) {
  return (
    <div style={{ marginBottom: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '0.85rem', width: '100%' }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          id="vocab-search-input"
          type="text"
          placeholder="Buscar palabra, traducción o etiqueta..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '0.75rem 1rem 0.75rem 2.75rem',
            border: '1.5px solid var(--border)',
            borderRadius: '12px',
            background: 'var(--bg-surface)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.92rem',
            color: 'var(--text-primary)',
            outline: 'none',
            boxShadow: 'var(--shadow-sm)',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--primary-light)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* CEFR Filter Pills */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        alignItems: 'center',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '0.25rem',
        scrollbarWidth: 'none',
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', marginRight: '0.2rem', flexShrink: 0 }}>
          Nivel:
        </span>
        {cefrLevels.map((lvl) => {
          const isActive = lvl === activeCEFR;
          const c = CEFR_COLORS[lvl] || CEFR_COLORS.all;
          return (
            <button
              key={lvl}
              id={`cefr-filter-${lvl}`}
              onClick={() => onCEFR(lvl)}
              style={{
                padding: '0.25rem 0.7rem',
                borderRadius: '999px',
                border: `1.5px solid ${isActive ? c.border : 'var(--border)'}`,
                background: isActive ? c.bg : 'var(--bg-surface)',
                color: isActive ? c.text : 'var(--text-subtle)',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 800 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              {lvl === 'all' ? 'Todos' : lvl}
            </button>
          );
        })}
      </div>
    </div>
  );
}
