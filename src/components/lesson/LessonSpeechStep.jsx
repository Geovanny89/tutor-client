import React from 'react';
import { Sparkles, Volume2, Mic, MicOff, CheckCircle2 } from 'lucide-react';

export default function LessonSpeechStep({
  targetPhrase,
  isListening,
  studentSpokenText,
  evaluationResult,
  completed,
  onStartListening,
  onStopListening,
  onSpeakTarget,
  onCompleteLesson,
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '2px solid #A7F3D0',
      borderRadius: '24px',
      padding: '2.5rem',
      textAlign: 'center',
      boxShadow: '0 8px 30px rgba(5, 150, 105, 0.08)',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: '#ECFDF5',
        border: '1px solid #A7F3D0',
        color: '#047857',
        padding: '0.35rem 0.9rem',
        borderRadius: '999px',
        fontSize: '0.82rem',
        fontWeight: 700,
        marginBottom: '0.85rem',
      }}>
        <Sparkles size={14} color="#059669" /> Desafío Oral de Certificación
      </div>

      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
        Pronuncia esta frase en voz alta para completar la lección:
      </h2>

      <div style={{
        fontSize: '1.5rem',
        fontWeight: 800,
        color: '#047857',
        fontFamily: 'var(--font-display)',
        padding: '1.25rem',
        background: '#F0FDF4',
        borderRadius: '16px',
        margin: '1.25rem auto',
        maxWidth: '580px',
        border: '1px solid #A7F3D0',
      }}>
        "{targetPhrase}"
      </div>

      <button
        onClick={onSpeakTarget}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#059669',
          fontSize: '0.9rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          marginBottom: '1.5rem',
        }}
      >
        <Volume2 size={16} /> Escuchar cómo debe sonar
      </button>

      <div>
        <button
          onClick={() => {
            if (isListening) onStopListening();
            else onStartListening();
          }}
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: isListening ? '#EF4444' : '#059669',
            border: 'none',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isListening ? '0 0 35px rgba(239, 68, 68, 0.6)' : '0 6px 24px rgba(5, 150, 105, 0.35)',
            transform: isListening ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.2s',
          }}
        >
          {isListening ? <MicOff size={34} /> : <Mic size={34} />}
        </button>
        <div style={{ marginTop: '0.85rem', fontSize: '0.95rem', color: isListening ? '#EF4444' : '#475569', fontWeight: 700 }}>
          {isListening ? '🎙️ Escuchándote... Habla ahora en inglés' : 'Presiona el micrófono verde para hablar'}
        </div>
      </div>

      {studentSpokenText && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem 1.5rem',
          background: '#F8FAFC',
          borderRadius: '16px',
          textAlign: 'left',
          maxWidth: '580px',
          margin: '1.5rem auto 0 auto',
          border: '1px solid #E2E8F0',
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Te escuchamos decir:</div>
          <div style={{ fontSize: '1.1rem', color: '#0F172A', fontWeight: 700, marginTop: '0.2rem' }}>
            "{studentSpokenText}"
          </div>

          {evaluationResult && (
            <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.92rem', color: '#059669', fontWeight: 800 }}>
                  Puntaje de Pronunciación:
                </span>
                <span style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: evaluationResult.score >= 70 ? '#059669' : '#D97706',
                }}>
                  {evaluationResult.score}%
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.35rem' }}>
                {evaluationResult.feedback}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion Button */}
      <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={onCompleteLesson}
          disabled={completed}
          style={{
            padding: '1rem 2.75rem',
            borderRadius: '14px',
            background: '#059669',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 800,
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: completed ? 'default' : 'pointer',
            boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)',
          }}
        >
          <CheckCircle2 size={22} />
          {completed ? '¡Lección Completada con Éxito! ✓' : 'Completar y Guardar Progreso'}
        </button>
      </div>
    </div>
  );
}
