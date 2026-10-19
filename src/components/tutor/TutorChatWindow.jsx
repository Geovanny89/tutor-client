import React from 'react';
import { Volume2, Volume1, VolumeX, RotateCcw, Languages, Loader2 } from 'lucide-react';
import { useAiStore } from '../../stores/aiStore';

export default function TutorChatWindow({
  activePersona,
  slowAudio,
  autoSpeak,
  messages,
  isLoading,
  isListening,
  transcript,
  messagesEndRef,
  onToggleSlowAudio,
  onToggleAutoSpeak,
  onClearChat,
  onPlayVoice,
  onStopListening,
}) {
  const { translateMessage, translatingId } = useAiStore();

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '24px 24px 0 0',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '440px',
      maxHeight: '520px',
    }}>
      {/* Chat Header Controls */}
      <div style={{
        padding: '0.85rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-base)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{activePersona.avatar}</span>
          <div>
            <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{activePersona.name}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginLeft: '0.5rem' }}>
              {activePersona.description}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={onToggleSlowAudio}
            style={{
              background: slowAudio ? 'var(--accent-gold-soft)' : 'var(--bg-surface)',
              border: slowAudio ? '1px solid var(--accent-gold)' : '1px solid var(--border-strong)',
              color: slowAudio ? 'var(--accent-gold-text)' : 'var(--text-secondary)',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            🐢 Audio Lento {slowAudio ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onToggleAutoSpeak}
            style={{
              background: autoSpeak ? 'var(--primary-bg)' : 'var(--bg-surface)',
              border: autoSpeak ? '1px solid var(--primary-light)' : '1px solid var(--border-strong)',
              color: autoSpeak ? 'var(--primary-hover)' : 'var(--text-secondary)',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {autoSpeak ? <Volume2 size={15} color="var(--primary)" /> : <VolumeX size={15} color="var(--text-subtle)" />}
            {autoSpeak ? 'Voz Automática' : 'Silencio'}
          </button>

          <button
            onClick={onClearChat}
            title="Reiniciar conversación"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-subtle)',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        background: 'var(--bg-base)',
      }}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSystem = msg.role === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                background: 'var(--error-bg)',
                border: '1px solid #FCA5A5',
                color: 'var(--error-strong)',
                fontSize: '0.88rem',
                textAlign: 'center',
              }}>
                {msg.text}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                gap: '0.85rem',
                alignItems: 'flex-start',
              }}
            >
              {!isUser && (
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--primary-bg)',
                  border: '1px solid var(--primary-soft-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  flexShrink: 0,
                }}>
                  {activePersona.avatar}
                </div>
              )}

              <div style={{
                maxWidth: '78%',
                borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                padding: '1rem 1.35rem',
                background: isUser ? 'var(--primary)' : 'var(--bg-surface)',
                border: isUser ? 'none' : '1px solid var(--border)',
                color: isUser ? 'var(--text-on-primary)' : 'var(--text-primary)',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
              }}>
                <div style={{ fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>

                {!isUser && msg.translation && (
                  <div style={{
                    marginTop: '0.85rem',
                    padding: '0.75rem 1rem',
                    background: 'var(--primary-bg)',
                    borderLeft: '3px solid var(--primary)',
                    borderRadius: '4px 12px 12px 4px',
                    fontSize: '0.92rem',
                    color: 'var(--primary-text)',
                    fontStyle: 'italic',
                    animation: 'fadeIn 0.3s ease',
                  }}>
                    {msg.translation}
                  </div>
                )}

                {!isUser && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid var(--bg-muted)',
                    flexWrap: 'wrap',
                  }}>
                    <button
                      onClick={() => onPlayVoice(msg.text, false)}
                      style={{
                        background: 'var(--primary-bg)',
                        border: '1px solid var(--primary-soft-2)',
                        color: 'var(--primary-hover)',
                        borderRadius: '8px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Volume2 size={15} color="var(--primary)" /> Escuchar
                    </button>

                    <button
                      onClick={() => onPlayVoice(msg.text, true)}
                      style={{
                        background: 'var(--warning-bg)',
                        border: '1px solid var(--accent-gold-border)',
                        color: 'var(--accent-gold-text)',
                        borderRadius: '8px',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Volume1 size={14} color="var(--accent-gold-strong)" /> Lento
                    </button>

                    {!msg.translation && (
                      <button
                        onClick={() => translateMessage(msg.id, msg.text)}
                        disabled={translatingId === msg.id}
                        style={{
                          background: 'var(--bg-muted)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-secondary)',
                          borderRadius: '8px',
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: translatingId === msg.id ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          opacity: translatingId === msg.id ? 0.7 : 1,
                        }}
                      >
                        {translatingId === msg.id ? (
                          <Loader2 size={14} className="spin" />
                        ) : (
                          <Languages size={14} />
                        )}
                        {translatingId === msg.id ? 'Traduciendo...' : 'Ver traducción'}
                      </button>
                    )}

                    <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                )}

                {isUser && (
                  <div style={{ textAlign: 'right', marginTop: '0.4rem', fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {msg.timestamp}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isLoading && (
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--primary-bg)',
              border: '1px solid var(--primary-soft-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.35rem',
            }}>
              {activePersona.avatar}
            </div>
            <div style={{
              padding: '0.85rem 1.4rem',
              borderRadius: '20px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--primary-soft-2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)',
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
                {activePersona.name} está pensando su respuesta...
              </span>
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>●●●</span>
            </div>
          </div>
        )}

        {/* Listening Radar Banner */}
        {isListening && (
          <div style={{
            padding: '0.9rem 1.4rem',
            borderRadius: '16px',
            background: 'var(--error-bg)',
            border: '2px solid var(--error)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'var(--error)',
              boxShadow: '0 0 12px var(--error)',
            }} />
            <div style={{ flex: 1 }}>
              <strong style={{ color: 'var(--error-strong)', fontSize: '0.92rem' }}>
                Escuchándote en vivo... Habla ahora en inglés 🎙️
              </strong>
              {transcript && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                  "{transcript}"
                </div>
              )}
            </div>
            <button
              onClick={onStopListening}
              style={{
                background: 'var(--error)',
                border: 'none',
                color: 'var(--text-on-primary)',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Enviar Voz
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
