import React from 'react';
import { Lightbulb, Sparkles, GraduationCap, Volume2, AlertTriangle, ChevronRight } from 'lucide-react';

export default function LessonExplanationStep({
  introText,
  grammar,
  aiExplanation,
  loadingExplanation,
  onRequestAiExplanation,
  onSpeak,
  onNext,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2.25rem',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={24} color="var(--primary)" /> ¿Cómo funciona este concepto?
          </h2>

          <button
            onClick={onRequestAiExplanation}
            disabled={loadingExplanation}
            style={{
              background: 'var(--primary-bg)',
              border: '1px solid var(--primary-soft-2)',
              color: 'var(--primary-hover)',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: loadingExplanation ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Sparkles size={15} color="var(--primary)" />
            {loadingExplanation ? 'La tutora está redactando...' : '✨ Explicación Detallada de la Tutora'}
          </button>
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0' }}>
          {introText}
        </p>

        {/* Dynamic AI Detailed Explanation */}
        {aiExplanation && (
          <div style={{
            background: 'var(--primary-bg)',
            border: '1px solid var(--primary-soft-2)',
            borderLeft: '5px solid var(--primary)',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <GraduationCap size={20} color="var(--primary)" />
              <strong style={{ color: 'var(--primary-text)', fontSize: '1.05rem' }}>Clase Magistral de tu Tutora Beyli:</strong>
            </div>
            <div style={{ fontSize: '0.98rem', lineHeight: '1.75', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
              {aiExplanation}
            </div>
          </div>
        )}

        {/* Grammar Formula & Rules */}
        {grammar && (
          <div style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            marginTop: '1rem',
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-text)', margin: '0 0 0.5rem 0' }}>
              📌 Regla Gramatical Clave: {grammar.rule}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.25rem 0' }}>
              {grammar.explanation}
            </p>

            {/* Grammar Examples with Audio */}
            {grammar.examples && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                  Ejemplos en uso cotidiano:
                </div>
                {grammar.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-strong)',
                      padding: '0.9rem 1.2rem',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{ex.sentence}</strong>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>{ex.translation}</div>
                    </div>
                    <button
                      onClick={() => onSpeak(ex.sentence)}
                      style={{
                        background: 'var(--primary-bg)',
                        border: '1px solid var(--primary-soft-2)',
                        color: 'var(--primary)',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      <Volume2 size={15} /> Escuchar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Warning: Common Mistake by Spanish Speakers */}
        <div style={{
          marginTop: '1.5rem',
          background: 'var(--warning-bg)',
          border: '1px solid var(--accent-gold-border)',
          borderLeft: '5px solid var(--accent-gold-strong)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold-text)', fontWeight: 800, fontSize: '0.98rem' }}>
            <AlertTriangle size={18} color="var(--accent-gold-strong)" /> El error más común de los hispanohablantes:
          </div>
          <p style={{ color: 'var(--accent-gold-text)', fontSize: '0.92rem', lineHeight: '1.6', margin: '0.4rem 0 0 0' }}>
            En español tendemos a traducir palabra por palabra o a omitir pronombres. Recuerda que en inglés la estructura exige siempre el sujeto y la concordancia correcta. ¡Practicarlo en voz alta es la clave para fijarlo naturalmente!
          </p>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
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
            Continuar al Paso 2: Vocabulario <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
