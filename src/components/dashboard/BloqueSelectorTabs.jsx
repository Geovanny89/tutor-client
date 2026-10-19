import React from 'react';
import { LayoutGrid } from 'lucide-react';

export default function BloqueSelectorTabs({ bloques, activeTab, onSelectTab, collapsed = false, onToggleCollapse }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>
            Selecciona tu Bloque de Aprendizaje
          </h2>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
            Los 5 bloques estructurados abarcan desde la fonética básica hasta el refinamiento idiomático nativo.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="bloques-toggle-mobile"
              style={{
                background: 'var(--bg-surface)',
                color: 'var(--primary)',
                border: '1px solid var(--primary-soft-2)',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LayoutGrid size={15} /> Cambiar bloque
            </button>
          )}

          <button
            onClick={() => onSelectTab('ALL')}
            style={{
              background: activeTab === 'ALL' ? 'var(--primary)' : 'var(--bg-surface)',
              color: activeTab === 'ALL' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--border-strong)',
              padding: '0.4rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Ver Todos
          </button>
        </div>
      </div>

      <div className={`bloques-grid${collapsed ? ' is-collapsed' : ''}`}>
        {bloques.map((b) => {
          const isSelected = activeTab === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onSelectTab(b.id)}
              className={`bloque-card${isSelected ? ' is-selected' : ''}`}
              style={{
                background: isSelected ? 'var(--primary-bg)' : 'var(--bg-surface)',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
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
                  color: isSelected ? 'var(--text-on-primary)' : 'var(--primary-hover)',
                  background: isSelected ? 'var(--primary)' : 'var(--primary-soft)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                }}>
                  {b.badge}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)' }}>
                  {b.orderMax - b.orderMin + 1} Módulos
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                {b.title.split(':')[0]}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.3' }}>
                {b.title.split(':')[1]?.trim()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
