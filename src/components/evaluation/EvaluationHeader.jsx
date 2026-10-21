import React from 'react';
import { Award, ArrowLeft, Timer } from 'lucide-react';

const formatTime = (totalSeconds) => {
  const s = Math.max(0, totalSeconds || 0);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export default function EvaluationHeader({ evaluation, timeLeft, timeLimitMinutes, onBack }) {
  const hasTimer = typeof timeLeft === 'number' && timeLeft !== null;
  const urgent = hasTimer && timeLeft <= 60;

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
          Para certificar y aprobar este módulo necesitas al menos un <strong>{evaluation.min_pass_score || 70}%</strong>.
        </p>

        {hasTimer && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.25rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '999px',
              background: urgent ? 'var(--error-bg)' : 'var(--primary-bg)',
              border: `1px solid ${urgent ? 'var(--error-border)' : 'var(--primary-soft-2)'}`,
              color: urgent ? 'var(--error-strong)' : 'var(--primary-text)',
              fontWeight: 800,
              fontSize: '1rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <Timer size={18} />
            <span>{formatTime(timeLeft)}</span>
            {timeLimitMinutes ? (
              <span style={{ fontWeight: 600, fontSize: '0.8rem', opacity: 0.8 }}>
                / {timeLimitMinutes} min
              </span>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
