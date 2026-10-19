import React from 'react';
import { Award, ArrowLeft } from 'lucide-react';

export default function EvaluationHeader({ evaluation, onBack }) {
  return (
    <>
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'transparent',
          border: 'none',
          color: 'var(--primary)',
          cursor: 'pointer',
          fontSize: '0.92rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} /> Volver al Módulo
      </button>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2.25rem',
        marginBottom: '2rem',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      }}>
        <div style={{
          width: '58px',
          height: '58px',
          borderRadius: '16px',
          background: 'var(--warning-bg)',
          border: '1px solid var(--accent-gold-border)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.85rem',
        }}>
          <Award size={32} color="var(--accent-gold-strong)" />
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          margin: '0 0 0.5rem 0',
          letterSpacing: '-0.02em',
        }}>
          {evaluation.title || 'Evaluación del Módulo'}
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Para certificar y aprobar este módulo necesitas al menos un <strong>{evaluation.passing_score || 70}%</strong>.
        </p>
      </div>
    </>
  );
}
