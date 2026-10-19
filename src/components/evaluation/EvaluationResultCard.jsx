import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function EvaluationResultCard({ result, onContinue, onRetry }) {
  return (
    <div style={{
      background: result.passed ? '#ECFDF5' : '#FEF2F2',
      border: result.passed ? '2px solid #059669' : '2px solid #EF4444',
      borderRadius: '20px',
      padding: '2.25rem',
      marginBottom: '2rem',
      textAlign: 'center',
      boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
        {result.passed ? '🎉' : '📚'}
      </div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: result.passed ? '#065F46' : '#991B1B', margin: '0 0 0.5rem 0' }}>
        {result.passed ? '¡Felicitaciones! Has Aprobado el Módulo' : 'Sigue Practicando'}
      </h2>

      <div style={{
        fontSize: '3rem',
        fontWeight: 900,
        color: result.passed ? '#059669' : '#DC2626',
        fontFamily: 'var(--font-display)',
      }}>
        {result.score}%
      </div>

      <p style={{ color: '#334155', fontSize: '1.05rem', marginTop: '0.5rem', maxWidth: '540px', margin: '0.5rem auto 0 auto' }}>
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
            background: '#059669',
            color: '#FFFFFF',
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
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
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
