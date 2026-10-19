import React from 'react';
import { Sparkles, Mic, MicOff } from 'lucide-react';

export default function EvaluationSpeakingBonus({
  isListening,
  spokenAnswer,
  onStartListening,
  onStopListening,
}) {
  return (
    <div style={{
      background: 'var(--primary-bg)',
      border: '1px solid var(--primary-soft-2)',
      borderRadius: '20px',
      padding: '1.75rem',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        color: 'var(--primary-hover)',
        fontSize: '0.82rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
      }}>
        <Sparkles size={14} color="var(--primary)" /> Sección Oral Opcional
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
        Graba una breve oración en inglés sobre este tema (opcional para puntos extra)
      </h3>

      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => {
            if (isListening) onStopListening();
            else onStartListening();
          }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: isListening ? 'var(--error)' : 'var(--primary)',
            border: 'none',
            color: 'var(--text-on-primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
          }}
        >
          {isListening ? <MicOff size={26} color="var(--text-on-primary)" /> : <Mic size={26} />}
        </button>
        <div style={{ fontSize: '0.82rem', color: isListening ? 'var(--error)' : 'var(--text-subtle)', marginTop: '0.5rem', fontWeight: 600 }}>
          {isListening ? '🎙️ Escuchándote...' : 'Toca el micrófono verde para hablar'}
        </div>

        {spokenAnswer && (
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem 1.15rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--primary-soft-2)',
            borderRadius: '12px',
            color: 'var(--primary-hover)',
            fontSize: '0.95rem',
            fontWeight: 600,
            textAlign: 'left',
          }}>
            <strong>Respuesta hablada:</strong> "{spokenAnswer}"
          </div>
        )}
      </div>
    </div>
  );
}
