import React from 'react';
import { Volume2, Volume1, VolumeX, RotateCcw } from 'lucide-react';

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
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
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
        borderBottom: '1px solid #E2E8F0',
        background: '#F8FAFC',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{activePersona.avatar}</span>
          <div>
            <strong style={{ fontSize: '0.98rem', color: '#0F172A' }}>{activePersona.name}</strong>
            <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '0.5rem' }}>
              {activePersona.description}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={onToggleSlowAudio}
            style={{
              background: slowAudio ? '#FEF3C7' : '#FFFFFF',
              border: slowAudio ? '1px solid #F59E0B' : '1px solid #CBD5E1',
              color: slowAudio ? '#B45309' : '#475569',
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
              background: autoSpeak ? '#ECFDF5' : '#FFFFFF',
              border: autoSpeak ? '1px solid #10B981' : '1px solid #CBD5E1',
              color: autoSpeak ? '#047857' : '#475569',
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
            {autoSpeak ? <Volume2 size={15} color="#059669" /> : <VolumeX size={15} color="#64748B" />}
            {autoSpeak ? 'Voz Automática' : 'Silencio'}
          </button>

          <button
            onClick={onClearChat}
            title="Reiniciar conversación"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#64748B',
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
        background: '#FAFAFA',
      }}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSystem = msg.role === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
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
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
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
                background: isUser ? '#059669' : '#FFFFFF',
                border: isUser ? 'none' : '1px solid #E2E8F0',
                color: isUser ? '#FFFFFF' : '#0F172A',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
              }}>
                <div style={{ fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>

                {!isUser && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginTop: '0.75rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid #F1F5F9',
                  }}>
                    <button
                      onClick={() => onPlayVoice(msg.text, false)}
                      style={{
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#047857',
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
                      <Volume2 size={15} color="#059669" /> Escuchar
                    </button>

                    <button
                      onClick={() => onPlayVoice(msg.text, true)}
                      style={{
                        background: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        color: '#92400E',
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
                      <Volume1 size={14} color="#D97706" /> Lento
                    </button>

                    <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#94A3B8' }}>
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
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
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
              background: '#FFFFFF',
              border: '1px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)',
            }}>
              <span style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 600 }}>
                {activePersona.name} está pensando su respuesta...
              </span>
              <span style={{ color: '#059669', fontWeight: 800 }}>●●●</span>
            </div>
          </div>
        )}

        {/* Listening Radar Banner */}
        {isListening && (
          <div style={{
            padding: '0.9rem 1.4rem',
            borderRadius: '16px',
            background: '#FEF2F2',
            border: '2px solid #EF4444',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#EF4444',
              boxShadow: '0 0 12px #EF4444',
            }} />
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#991B1B', fontSize: '0.92rem' }}>
                Escuchándote en vivo... Habla ahora en inglés 🎙️
              </strong>
              {transcript && (
                <div style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 600, marginTop: '0.25rem' }}>
                  "{transcript}"
                </div>
              )}
            </div>
            <button
              onClick={onStopListening}
              style={{
                background: '#EF4444',
                border: 'none',
                color: '#FFFFFF',
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
