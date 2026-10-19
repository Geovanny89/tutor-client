import React from 'react';
import { BookOpen, Volume2, Volume1, ChevronRight } from 'lucide-react';

export default function LessonVocabularyStep({
  vocabulary,
  onSpeakWord,
  onSpeakAll,
  onPrev,
  onNext,
}) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '24px',
      padding: '2.25rem',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} color="var(--primary)" /> Vocabulario con Pronunciación Nativa
          </h2>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Escucha el audio nativo, repite cada palabra en voz alta y fíjate en su fonética y significado.
          </p>
        </div>

        <button
          onClick={onSpeakAll}
          style={{
            background: 'var(--primary-bg)',
            border: '1px solid var(--primary-soft-2)',
            color: 'var(--primary-hover)',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Volume2 size={16} /> Escuchar Todo el Vocabulario
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem' }}>
        {vocabulary.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.25rem 1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '1.35rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                  {item.word}
                </strong>
                {item.pronunciation && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontStyle: 'italic', fontWeight: 700 }}>
                    /{item.pronunciation}/
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontWeight: 600 }}>
                {item.translation}
              </div>

              {item.example && (
                <div style={{ fontSize: '0.86rem', color: 'var(--text-subtle)', marginTop: '0.65rem', borderLeft: '3px solid var(--primary)', paddingLeft: '0.6rem', fontStyle: 'italic' }}>
                  "{item.example}"
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={() => onSpeakWord(item.word + '. ' + (item.example || ''), false)}
                style={{
                  flex: 1,
                  background: 'var(--primary-bg)',
                  border: '1px solid var(--primary-soft-2)',
                  color: 'var(--primary-hover)',
                  borderRadius: '8px',
                  padding: '0.45rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                <Volume2 size={15} color="var(--primary)" /> Normal
              </button>

              <button
                onClick={() => onSpeakWord(item.word, true)}
                style={{
                  background: 'var(--warning-bg)',
                  border: '1px solid var(--accent-gold-border)',
                  color: 'var(--accent-gold-text)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.65rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
                title="Reproducir lentamente"
              >
                <Volume1 size={14} color="var(--accent-gold-strong)" /> Lento
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={onPrev}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-secondary)',
            padding: '0.85rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          ← Volver a Explicación
        </button>

        <button
          onClick={onNext}
          style={{
            background: 'var(--primary)',
            color: 'var(--text-on-primary)',
            border: 'none',
            padding: '0.85rem 1.75rem',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
          }}
        >
          Continuar al Paso 3: Diálogo en Vivo <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
