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
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '1.75rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 800,
          color: '#065F46',
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
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
            color: '#059669',
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
        color: '#0F172A',
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
                  background: isSelected ? '#ECFDF5' : '#F8FAFC',
                  border: isSelected ? '2px solid #059669' : '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1rem 1.35rem',
                  textAlign: 'left',
                  color: isSelected ? '#065F46' : '#334155',
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
                  border: isSelected ? '6px solid #059669' : '2px solid #CBD5E1',
                  background: isSelected ? '#FFFFFF' : 'transparent',
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
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '0.85rem 1.15rem',
              color: '#0F172A',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {q.hint && (
            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.45rem' }}>
              💡 Pista: {q.hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
