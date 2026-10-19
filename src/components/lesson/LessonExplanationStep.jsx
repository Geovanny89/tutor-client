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
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '24px',
        padding: '2.25rem',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={24} color="#059669" /> ¿Cómo funciona este concepto?
          </h2>

          <button
            onClick={onRequestAiExplanation}
            disabled={loadingExplanation}
            style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#047857',
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
            <Sparkles size={15} color="#059669" />
            {loadingExplanation ? 'La tutora está redactando...' : '✨ Explicación Detallada de la Tutora'}
          </button>
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#334155', margin: '0 0 1.5rem 0' }}>
          {introText}
        </p>

        {/* Dynamic AI Detailed Explanation */}
        {aiExplanation && (
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #A7F3D0',
            borderLeft: '5px solid #059669',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <GraduationCap size={20} color="#059669" />
              <strong style={{ color: '#065F46', fontSize: '1.05rem' }}>Clase Magistral de tu Tutora Beyli:</strong>
            </div>
            <div style={{ fontSize: '0.98rem', lineHeight: '1.75', color: '#0F172A', whiteSpace: 'pre-wrap' }}>
              {aiExplanation}
            </div>
          </div>
        )}

        {/* Grammar Formula & Rules */}
        {grammar && (
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            marginTop: '1rem',
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#065F46', margin: '0 0 0.5rem 0' }}>
              📌 Regla Gramatical Clave: {grammar.rule}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.25rem 0' }}>
              {grammar.explanation}
            </p>

            {/* Grammar Examples with Audio */}
            {grammar.examples && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Ejemplos en uso cotidiano:
                </div>
                {grammar.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      padding: '0.9rem 1.2rem',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>{ex.sentence}</strong>
                      <div style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.15rem' }}>{ex.translation}</div>
                    </div>
                    <button
                      onClick={() => onSpeak(ex.sentence)}
                      style={{
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#059669',
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
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderLeft: '5px solid #D97706',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400E', fontWeight: 800, fontSize: '0.98rem' }}>
            <AlertTriangle size={18} color="#D97706" /> El error más común de los hispanohablantes:
          </div>
          <p style={{ color: '#78350F', fontSize: '0.92rem', lineHeight: '1.6', margin: '0.4rem 0 0 0' }}>
            En español tendemos a traducir palabra por palabra o a omitir pronombres. Recuerda que en inglés la estructura exige siempre el sujeto y la concordancia correcta. ¡Practicarlo en voz alta es la clave para fijarlo naturalmente!
          </p>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onNext}
            style={{
              background: '#059669',
              color: '#FFFFFF',
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
