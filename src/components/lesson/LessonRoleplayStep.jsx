import React from 'react';
import { MessageSquare, Volume2, Mic, MicOff, ChevronRight } from 'lucide-react';

export default function LessonRoleplayStep({
  dialogue,
  roleplayTurn,
  isListening,
  roleplayFeedback,
  onStartListening,
  onStopListening,
  onSpeakLine,
  onPrev,
  onNext,
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '24px',
      padding: '2.25rem',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={24} color="#059669" /> Diálogo Interactivo con tu Tutora de IA
        </h2>
        <p style={{ color: '#475569', fontSize: '0.92rem', margin: '0.35rem 0 0 0' }}>
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
                background: isCurrentTurn ? '#ECFDF5' : (isTeacher ? '#F8FAFC' : '#F1F5F9'),
                border: isCurrentTurn ? '2px solid #059669' : '1px solid #E2E8F0',
                borderRadius: isTeacher ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
                padding: '1.15rem 1.4rem',
                boxShadow: isCurrentTurn ? '0 4px 14px rgba(5, 150, 105, 0.15)' : 'none',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isTeacher ? '#047857' : '#2563EB' }}>
                    {isTeacher ? '👩🏼‍🏫 Beyli (Tutora)' : '👤 Tú (Estudiante)'}
                  </span>
                  {isCurrentTurn && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#059669', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      TURNO ACTUAL
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '1.1rem', color: '#0F172A', fontWeight: 700 }}>
                  {line.text}
                </div>

                {line.translation && (
                  <div style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.35rem' }}>
                    {line.translation}
                  </div>
                )}

                <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onSpeakLine(line.text)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#059669',
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
        background: '#F0FDF4',
        border: '2px dashed #059669',
        borderRadius: '20px',
        padding: '1.75rem',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#065F46', margin: '0 0 0.5rem 0' }}>
          🎙️ Es tu turno: Di la siguiente frase en voz alta:
        </h3>

        <div style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: '#059669',
          margin: '0.85rem auto',
          background: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          maxWidth: '500px',
          border: '1px solid #A7F3D0',
        }}>
          "{dialogue[roleplayTurn]?.text || dialogue[0]?.text}"
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => {
              if (isListening) onStopListening();
              else onStartListening();
            }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: isListening ? '#EF4444' : '#059669',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.6)' : '0 4px 18px rgba(5, 150, 105, 0.35)',
              transform: isListening ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s',
            }}
          >
            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
          <div style={{ fontSize: '0.85rem', color: isListening ? '#EF4444' : '#475569', fontWeight: 700, marginTop: '0.5rem' }}>
            {isListening ? '🎙️ Escuchándote...' : 'Presiona el micrófono verde para hablar'}
          </div>
        </div>

        {roleplayFeedback && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1.25rem',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #A7F3D0',
            color: '#047857',
            fontSize: '0.92rem',
            fontWeight: 700,
            maxWidth: '500px',
            margin: '1.25rem auto 0 auto',
          }}>
            <div>Te escuchamos: "{roleplayFeedback.heard}"</div>
            <div style={{ marginTop: '0.25rem', color: '#059669' }}>{roleplayFeedback.message}</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={onPrev}
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            color: '#475569',
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
          Continuar al Desafío Final <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
