import React from 'react';

const STEPS = [
  { id: 'explanation', label: '1. Explicación & Teoría', icon: '💡' },
  { id: 'vocabulary', label: '2. Vocabulario & Audio', icon: '📚' },
  { id: 'roleplay', label: '3. Diálogo en Vivo con IA', icon: '💬' },
  { id: 'speech', label: '4. Desafío de Pronunciación', icon: '🎙️' },
];

export default function LessonStepper({ activeStep, onSelectStep }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '0.75rem',
      marginBottom: '1.75rem',
    }}>
      {STEPS.map((step) => {
        const isCurrent = activeStep === step.id;
        return (
          <button
            key={step.id}
            onClick={() => onSelectStep(step.id)}
            style={{
              background: isCurrent ? 'var(--primary)' : 'var(--bg-surface)',
              color: isCurrent ? 'var(--text-on-primary)' : 'var(--text-secondary)',
              border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              boxShadow: isCurrent ? '0 4px 14px rgba(5, 150, 105, 0.2)' : '0 2px 6px rgba(15, 23, 42, 0.02)',
            }}
          >
            <span>{step.icon}</span>
            <span>{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
