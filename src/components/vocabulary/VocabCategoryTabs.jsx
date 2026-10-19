import React from 'react';

export default function VocabCategoryTabs({ categories, active, onChange }) {
  return (
    <div style={{
      width: '100%',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      paddingBottom: '0.5rem',
      marginBottom: '1.25rem',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      display: 'flex',
      gap: '0.5rem',
      boxSizing: 'border-box',
    }}>
      {categories.map((cat) => {
        const isActive = cat.id === active;
        return (
          <button
            key={cat.id}
            id={`vocab-tab-${cat.id}`}
            onClick={() => onChange(cat.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '12px',
              border: isActive ? '1px solid #059669' : '1px solid var(--border)',
              background: isActive
                ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
                : 'var(--bg-surface)',
              color: isActive ? '#FFFFFF' : '#475569',
              fontFamily: 'var(--font-body)',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: isActive ? '0 4px 14px rgba(5,150,105,0.25)' : 'var(--shadow-sm)',
              transform: isActive ? 'translateY(-1px)' : 'none',
              transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <span style={{ fontSize: '1.05rem' }}>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
