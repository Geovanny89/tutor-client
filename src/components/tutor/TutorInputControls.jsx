import React from 'react';
import { Mic, MicOff, Send, CheckCircle2 } from 'lucide-react';

export default function TutorInputControls({
  messages,
  inputMessage,
  isLoading,
  isListening,
  starterPrompts,
  onSelectStarter,
  onToggleListen,
  onChangeInput,
  onSubmitText,
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderTop: 'none',
      borderRadius: '0 0 24px 24px',
      overflow: 'hidden',
    }}>
      {/* Starter Prompts */}
      {messages.length <= 2 && (
        <div style={{
          padding: '0.6rem 1.25rem',
          background: '#F0FDF4',
          borderTop: '1px solid #A7F3D0',
          display: 'flex',
          gap: '0.6rem',
          overflowX: 'auto',
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065F46', alignSelf: 'center', whiteSpace: 'nowrap' }}>
            💡 Preguntas sugeridas:
          </span>
          {starterPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSelectStarter(prompt.text)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #A7F3D0',
                color: '#047857',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      )}

      {/* Mic Button & Form */}
      <div style={{
        padding: '1.1rem 1.5rem',
        borderTop: '1px solid #E2E8F0',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <button
          onClick={onToggleListen}
          title={isListening ? 'Detener grabación' : 'Presiona para hablar'}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isListening ? '#EF4444' : '#059669',
            border: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isListening
              ? '0 0 25px rgba(239, 68, 68, 0.6)'
              : '0 4px 18px rgba(5, 150, 105, 0.35)',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            transform: isListening ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {isListening ? <MicOff size={26} /> : <Mic size={26} />}
        </button>

        <form
          onSubmit={onSubmitText}
          style={{ display: 'flex', flex: 1, gap: '0.6rem', alignItems: 'center' }}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onChangeInput(e.target.value)}
            placeholder={isListening ? 'Escuchando tu voz...' : 'Escribe en inglés o presiona el micrófono verde...'}
            disabled={isLoading || isListening}
            style={{
              flex: 1,
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '0.85rem 1.15rem',
              color: '#0F172A',
              fontSize: '0.98rem',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: inputMessage.trim() ? '#059669' : '#F1F5F9',
              border: 'none',
              color: inputMessage.trim() ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputMessage.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            <Send size={19} />
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '0.75rem 1.5rem',
        background: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#64748B',
        fontSize: '0.82rem',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} color="#059669" />
          <span>Voz 100% nativa integrada con Web Speech API.</span>
        </div>
        <div>
          <span>Límite diario: 50 interacciones gratuitas / día por estudiante.</span>
        </div>
      </div>
    </div>
  );
}
