import React from 'react';
import { Trash2 } from 'lucide-react';
import { input, iconBtn } from './constants';

export const newQuestion = (type) => ({
  id: '',
  type,
  question: '',
  options: type === 'multiple_choice' ? ['', '', '', ''] : undefined,
  correct: type === 'multiple_choice' ? 0 : '',
  points: 10,
});

export default function QuestionEditor({ q, index, onChange, onRemove }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '0.9rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>
          Pregunta {index + 1} · {q.type === 'multiple_choice' ? 'Opción múltiple' : 'Completar'}
        </span>
        <button type="button" onClick={onRemove} style={{ ...iconBtn, color: 'var(--error)' }}>
          <Trash2 size={15} />
        </button>
      </div>

      <input
        value={q.question}
        onChange={(e) => onChange({ ...q, question: e.target.value })}
        placeholder="Texto de la pregunta"
        style={{ ...input, marginBottom: '0.6rem' }}
      />

      {q.type === 'multiple_choice' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {q.options.map((opt, oi) => (
            <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                checked={Number(q.correct) === oi}
                onChange={() => onChange({ ...q, correct: oi })}
                style={{ accentColor: 'var(--primary)' }}
                title="Respuesta correcta"
              />
              <input
                value={opt}
                onChange={(e) =>
                  onChange({
                    ...q,
                    options: q.options.map((o, x) => (x === oi ? e.target.value : o)),
                  })
                }
                placeholder={`Opción ${oi + 1}`}
                style={{ ...input, padding: '0.5rem 0.75rem' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <input
          value={q.correct}
          onChange={(e) => onChange({ ...q, correct: e.target.value })}
          placeholder="Respuesta correcta"
          style={input}
        />
      )}
    </div>
  );
}
