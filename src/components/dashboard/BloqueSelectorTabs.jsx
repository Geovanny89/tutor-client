import React from 'react';

export default function BloqueSelectorTabs({ bloques, activeTab, onSelectTab }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'var(--font-display)' }}>
            Selecciona tu Bloque de Aprendizaje
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
            Los 5 bloques estructurados abarcan desde la fonética básica hasta el refinamiento idiomático nativo.
          </p>
        </div>
        <button
          onClick={() => onSelectTab('ALL')}
          style={{
            background: activeTab === 'ALL' ? '#059669' : '#FFFFFF',
            color: activeTab === 'ALL' ? '#FFFFFF' : '#475569',
            border: '1px solid #CBD5E1',
            padding: '0.4rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Ver Todos (36 Módulos)
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
        gap: '0.85rem',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {bloques.map((b) => {
          const isSelected = activeTab === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onSelectTab(b.id)}
              style={{
                background: isSelected ? '#ECFDF5' : '#FFFFFF',
                border: isSelected ? '2px solid #059669' : '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '1.1rem 1rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isSelected ? '0 4px 14px rgba(5, 150, 105, 0.12)' : '0 2px 6px rgba(15, 23, 42, 0.02)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: isSelected ? '#FFFFFF' : '#047857',
                  background: isSelected ? '#059669' : '#D1FAE5',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                }}>
                  {b.badge}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                  {b.orderMax - b.orderMin + 1} Módulos
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', lineHeight: '1.3' }}>
                {b.title.split(':')[0]}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem', lineHeight: '1.3' }}>
                {b.title.split(':')[1]?.trim()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
