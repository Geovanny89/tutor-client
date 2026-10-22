import React from 'react';
import { EmptyState } from './ProfessorUI';

export default function OverviewTab({ overview, academy }) {
  if (!academy) {
    return <EmptyState text="Crea tu academia en la pestaña «Mi Academia» para ver tus métricas." />;
  }

  const m = overview?.metrics || {};
  const cards = [
    { label: 'Estudiantes', value: m.students ?? 0 },
    { label: 'Activos', value: m.active ?? 0 },
    { label: 'Bloqueados', value: m.blocked ?? 0 },
    { label: 'Cupos estudiantes', value: m.spots_left ?? 0 },
    { label: 'Profesores equipo', value: `${m.professors ?? 1} / ${m.max_professors ?? 5}` },
    { label: 'Módulos propios', value: m.own_modules ?? 0 },
    { label: 'Lecciones propias', value: m.own_lessons ?? 0 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '1.15rem',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, marginBottom: '0.35rem' }}>
            {c.label}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}
