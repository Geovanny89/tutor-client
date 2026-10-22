import React from 'react';
import { Mic, MicOff, Send, CheckCircle2 } from 'lucide-react';

export default function TutorInputControls({
  messages,
  inputMessage,
  isLoading,
  isListening,
  recognitionLang = 'en-US',
  onToggleRecognitionLang,
  starterPrompts,
  onSelectStarter,
  onToggleListen,
  onChangeInput,
  onSubmitText,
}) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderTop: 'none',
      borderRadius: '0 0 24px 24px',
      overflow: 'hidden',
    }}>
      {/* Starter Prompts */}
      {messages.length <= 2 && (
        <div style={{
          padding: '0.6rem 1.25rem',
          background: 'var(--primary-bg)',
          borderTop: '1px solid var(--primary-soft-2)',
          display: 'flex',
          gap: '0.6rem',
          overflowX: 'auto',
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-text)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
            💡 Preguntas sugeridas:
          </span>
          {starterPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSelectStarter(prompt.text)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--primary-soft-2)',
                color: 'var(--primary-hover)',
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
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={onToggleListen}
            title={isListening ? 'Detener grabación' : 'Presiona para hablar'}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: isListening ? 'var(--error)' : 'var(--primary)',
              border: 'none',
              color: 'var(--text-on-primary)',
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
          
          {/* Language Toggle Badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleRecognitionLang();
            }}
            disabled={isListening}
            title={`Idioma del micrófono: ${recognitionLang}. Haz clic para cambiar (es-CO / en-US).`}
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              background: 'var(--bg-elevated)',
              border: '2px solid var(--primary)',
              borderRadius: '8px',
              padding: '3px 6px',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: 'var(--primary-text)',
              cursor: isListening ? 'default' : 'pointer',
              boxShadow: 'var(--shadow-sm)',
              opacity: isListening ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {recognitionLang.startsWith('en') ? '🇺🇸 EN' : '🇨🇴 ES'}
          </button>
        </div>

        <form
          onSubmit={onSubmitText}
          style={{ display: 'flex', flex: 1, gap: '0.6rem', alignItems: 'center', position: 'relative' }}
        >
          {isListening && (
            <div style={{
              position: 'absolute',
              top: '-32px',
              left: '0',
              right: '0',
              textAlign: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--primary)',
              background: 'var(--primary-bg)',
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid var(--primary-soft-2)',
              animation: 'fadeIn 0.2s ease',
              zIndex: 10,
            }}>
              {recognitionLang.startsWith('en')
                ? '🎙️ Habla en inglés (o toca 🇺🇸 para cambiar a español)'
                : '🎙️ Habla en español / spanglish (o toca 🇨🇴 para inglés)'}
            </div>
          )}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onChangeInput(e.target.value)}
            placeholder={isListening ? 'Escuchando...' : `Escribe en ${recognitionLang.startsWith('en') ? 'inglés' : 'español'}...`}
            disabled={isLoading || isListening}
            style={{
              flex: 1,
              background: 'var(--bg-base)',
              border: '1px solid var(--border-strong)',
              borderRadius: '12px',
              padding: '0.85rem 1.15rem',
              color: 'var(--text-primary)',
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
              background: inputMessage.trim() ? 'var(--primary)' : 'var(--bg-muted)',
              border: 'none',
              color: inputMessage.trim() ? 'var(--text-on-primary)' : 'var(--text-muted)',
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
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--text-subtle)',
        fontSize: '0.82rem',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} color="var(--primary)" />
          <span>Voz 100% nativa integrada con Web Speech API.</span>
        </div>
        <div>
          <span>Límite diario: 50 interacciones gratuitas / día por estudiante.</span>
        </div>
      </div>
    </div>
  );
}
