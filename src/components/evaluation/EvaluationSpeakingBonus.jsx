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
      background: '#F0FDF4',
      border: '1px solid #A7F3D0',
      borderRadius: '20px',
      padding: '1.75rem',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        color: '#047857',
        fontSize: '0.82rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
      }}>
        <Sparkles size={14} color="#059669" /> Sección Oral Opcional
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
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
            background: isListening ? '#EF4444' : '#059669',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
          }}
        >
          {isListening ? <MicOff size={26} color="#FFFFFF" /> : <Mic size={26} />}
        </button>
        <div style={{ fontSize: '0.82rem', color: isListening ? '#EF4444' : '#64748B', marginTop: '0.5rem', fontWeight: 600 }}>
          {isListening ? '🎙️ Escuchándote...' : 'Toca el micrófono verde para hablar'}
        </div>

        {spokenAnswer && (
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem 1.15rem',
            background: '#FFFFFF',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            color: '#047857',
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
