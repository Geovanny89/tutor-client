import React from 'react';
import { Volume2 } from 'lucide-react';

export default function EvaluationQuestionCard({
  q,
  qIndex,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  onSpeakQuestion,
}) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '1.75rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 800,
          color: 'var(--primary-text)',
          background: 'var(--primary-bg)',
          border: '1px solid var(--primary-soft-2)',
          padding: '0.25rem 0.65rem',
          borderRadius: '999px',
        }}>
          Pregunta {qIndex + 1} de {totalQuestions}
        </span>

        <button
          onClick={() => onSpeakQuestion(q.question)}
          title="Escuchar pregunta en inglés"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          <Volume2 size={15} /> Escuchar
        </button>
      </div>

      <h3 style={{
        fontSize: '1.18rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        margin: '0 0 1.25rem 0',
        lineHeight: '1.5',
      }}>
        {q.question}
      </h3>

      {/* Options */}
      {q.options && q.options.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {q.options.map((opt, optIndex) => {
            const isSelected = selectedAnswer === optIndex;
            return (
              <button
                key={optIndex}
                onClick={() => onSelectOption(qIndex, optIndex)}
                style={{
                  background: isSelected ? 'var(--primary-bg)' : 'var(--bg-base)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '1rem 1.35rem',
                  textAlign: 'left',
                  color: isSelected ? 'var(--primary-text)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.98rem',
                  transition: 'all 0.15s',
                }}
              >
                <span>{opt}</span>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: isSelected ? '6px solid var(--primary)' : '2px solid var(--border-strong)',
                  background: isSelected ? 'var(--bg-surface)' : 'transparent',
                }} />
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={selectedAnswer || ''}
            onChange={(e) => onSelectOption(qIndex, e.target.value)}
            placeholder="Escribe tu respuesta en inglés aquí..."
            style={{
              width: '100%',
              background: 'var(--bg-base)',
              border: '1px solid var(--border-strong)',
              borderRadius: '12px',
              padding: '0.85rem 1.15rem',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {q.hint && (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '0.45rem' }}>
              💡 Pista: {q.hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
