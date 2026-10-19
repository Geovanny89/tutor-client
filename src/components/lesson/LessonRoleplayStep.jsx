import React from 'react';
import { MessageSquare, Volume2, Mic, MicOff, ChevronRight } from 'lucide-react';

export default function LessonRoleplayStep({
  dialogue,
  roleplayTurn,
  isListening,
  evaluating = false,
  roleplayFeedback,
  onStartListening,
  onStopListening,
  onSpeakLine,
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
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={24} color="var(--primary)" /> Diálogo Interactivo con tu Tutora de IA
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0.35rem 0 0 0' }}>
          Tu tutora dirá su frase en voz alta. Cuando sea tu turno, presiona el micrófono verde y responde.
        </p>
      </div>

      {/* Dialogue Transcript */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', marginBottom: '2rem' }}>
        {dialogue.map((line, idx) => {
          const isTeacher = line.speaker !== 'Student';
          const isCurrentTurn = idx === roleplayTurn;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: isTeacher ? 'flex-start' : 'flex-end',
              }}
            >
              <div style={{
                maxWidth: '82%',
                background: isCurrentTurn ? 'var(--primary-bg)' : (isTeacher ? 'var(--bg-base)' : 'var(--bg-muted)'),
                border: isCurrentTurn ? '2px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: isTeacher ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
                padding: '1.15rem 1.4rem',
                boxShadow: isCurrentTurn ? '0 4px 14px rgba(5, 150, 105, 0.15)' : 'none',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isTeacher ? 'var(--primary-hover)' : '#2563EB' }}>
                    {isTeacher ? '👩🏼‍🏫 Beyli (Tutora)' : '👤 Tú (Estudiante)'}
                  </span>
                  {isCurrentTurn && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'var(--primary)', color: 'var(--text-on-primary)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      TURNO ACTUAL
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {line.text}
                </div>

                {line.translation && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                    {line.translation}
                  </div>
                )}

                <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onSpeakLine(line.text)}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-strong)',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                    }}
                  >
                    <Volume2 size={13} /> Escuchar frase
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Speaking Prompt for Student's Turn */}
      <div style={{
        background: 'var(--primary-bg)',
        border: '2px dashed var(--primary)',
        borderRadius: '20px',
        padding: '1.75rem',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-text)', margin: '0 0 0.5rem 0' }}>
          🎙️ Es tu turno: Di la siguiente frase en voz alta:
        </h3>

        <div style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--primary)',
          margin: '0.85rem auto',
          background: 'var(--bg-surface)',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          maxWidth: '500px',
          border: '1px solid var(--primary-soft-2)',
        }}>
          "{dialogue[roleplayTurn]?.text || dialogue[0]?.text}"
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => {
              if (isListening) onStopListening();
              else onStartListening();
            }}
            disabled={evaluating}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: isListening ? 'var(--error)' : (evaluating ? 'var(--bg-muted)' : 'var(--primary)'),
              border: 'none',
              color: 'var(--text-on-primary)',
              cursor: evaluating ? 'default' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.6)' : '0 4px 18px rgba(5, 150, 105, 0.35)',
              transform: isListening ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s',
              opacity: evaluating ? 0.7 : 1,
            }}
          >
            {isListening ? <MicOff size={28} /> : (evaluating ? <div className="spinner-small" /> : <Mic size={28} />)}
          </button>
          <div style={{ fontSize: '0.85rem', color: isListening ? 'var(--error)' : (evaluating ? 'var(--primary)' : 'var(--text-secondary)'), fontWeight: 700, marginTop: '0.5rem' }}>
            {isListening ? '🎙️ Escuchándote...' : (evaluating ? '✨ Validando pronunciación...' : 'Presiona el micrófono verde para hablar')}
          </div>
        </div>

        {roleplayFeedback && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1.25rem',
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            border: `1px solid ${roleplayFeedback.success ? 'var(--primary-soft-2)' : 'var(--error-border)'}`,
            color: roleplayFeedback.success ? 'var(--primary-hover)' : 'var(--error-strong)',
            fontSize: '0.92rem',
            fontWeight: 700,
            maxWidth: '500px',
            margin: '1.25rem auto 0 auto',
          }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Te escuchamos:</div>
            <div style={{ fontStyle: 'italic', marginBottom: '0.4rem' }}>"{roleplayFeedback.heard}"</div>
            <div style={{ 
              marginTop: '0.4rem', 
              color: roleplayFeedback.success ? 'var(--primary)' : 'var(--error)',
              borderTop: '1px solid var(--border)',
              paddingTop: '0.4rem'
            }}>
              {roleplayFeedback.message}
            </div>
            {roleplayFeedback.tip && (
              <div style={{ marginTop: '0.4rem', color: 'var(--accent-gold-text)', fontSize: '0.82rem', fontWeight: 600 }}>
                💡 Tip: {roleplayFeedback.tip}
              </div>
            )}
          </div>
        )}
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
          ← Volver a Vocabulario
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
          Continuar al Desafío Final <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
