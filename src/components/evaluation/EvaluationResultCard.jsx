import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function EvaluationResultCard({ result, onContinue, onRetry }) {
  return (
    <div style={{
      background: result.passed ? 'var(--primary-bg)' : 'var(--error-bg)',
      border: result.passed ? '2px solid var(--primary)' : '2px solid var(--error)',
      borderRadius: '20px',
      padding: '2.25rem',
      marginBottom: '2rem',
      textAlign: 'center',
      boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
        {result.passed ? '🎉' : '📚'}
      </div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: result.passed ? 'var(--primary-text)' : 'var(--error-strong)', margin: '0 0 0.5rem 0' }}>
        {result.passed ? '¡Felicitaciones! Has Aprobado el Módulo' : 'Sigue Practicando'}
      </h2>

      <div style={{
        fontSize: '3rem',
        fontWeight: 900,
        color: result.passed ? 'var(--primary)' : 'var(--error-strong)',
        fontFamily: 'var(--font-display)',
      }}>
        {result.score}%
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.5rem', maxWidth: '540px', margin: '0.5rem auto 0 auto' }}>
        {result.feedback || (result.passed ? 'Has demostrado dominio de los conceptos esenciales de este módulo.' : 'Repasa las lecciones y vuelve a intentarlo cuando estés listo.')}
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.75rem' }}>
        <button
          onClick={onContinue}
          style={{
            borderRadius: '12px',
            padding: '0.85rem 1.85rem',
            fontWeight: 800,
            fontSize: '1rem',
            background: 'var(--primary)',
            color: 'var(--text-on-primary)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
          }}
        >
          Continuar a los Módulos 🚀
        </button>

        {!result.passed && (
          <button
            onClick={onRetry}
            style={{
              borderRadius: '12px',
              padding: '0.85rem 1.4rem',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <RotateCcw size={16} /> Reintentar Examen
          </button>
        )}
      </div>
    </div>
  );
}
