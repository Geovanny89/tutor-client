import React, { useState } from 'react';
import { Volume2, Sparkles, Zap, Heart } from 'lucide-react';
import { tokenizeEnglishMarkers } from '../../utils/bilingualSpeech';

/**
 * TobyBubble Component
 * Visual and interactive coach for all kids games.
 * Displays Toby the Explorer Dog with animated expression,
 * colorful speech bubble with highlighted English words,
 * tap-to-listen button, and an energy mode toggle so the voice
 * is ALWAYS lively and never boring!
 */
export default function TobyBubble({
  message = '',
  onRepeat,
  isSpeaking = false,
  mood = 'happy', // 'happy' | 'celebrate' | 'thinking' | 'curious'
  extraAction,
}) {
  const [voiceStyle, setVoiceStyle] = useState(() => {
    return localStorage.getItem('kdice_toby_voice_style') || 'cartoon';
  });

  const tokens = tokenizeEnglishMarkers(message);

  const toggleStyle = () => {
    const next = voiceStyle === 'cartoon' ? 'sweet' : 'cartoon';
    setVoiceStyle(next);
    localStorage.setItem('kdice_toby_voice_style', next);
    if (onRepeat) {
      onRepeat(next);
    }
  };

  const getEmoji = () => {
    switch (mood) {
      case 'celebrate':
        return '🎉🐶';
      case 'thinking':
        return '🤔🐶';
      case 'curious':
        return '🧐🐶';
      case 'happy':
      default:
        return '🐶';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 5,
      }}
    >
      {/* Toby Avatar Badge with bounce animation */}
      <div
        onClick={() => onRepeat && onRepeat(voiceStyle)}
        role="button"
        tabIndex={0}
        title="¡Toca a Toby para escucharlo!"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: onRepeat ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: mood === 'celebrate'
              ? 'linear-gradient(135deg, #fef08a, #f59e0b)'
              : 'linear-gradient(135deg, #fed7aa, #f97316)',
            border: '4px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: isSpeaking
              ? '0 0 0 6px rgba(249, 115, 22, 0.4), 0 8px 22px rgba(249, 115, 22, 0.5)'
              : '0 8px 18px rgba(0, 0, 0, 0.12)',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isSpeaking ? 'scale(1.12) rotate(-3deg)' : 'scale(1)',
          }}
        >
          <span>{getEmoji()}</span>
        </div>
        <span
          style={{
            marginTop: '0.35rem',
            fontSize: '0.74rem',
            fontWeight: 900,
            color: '#c2410c',
            background: '#ffedd5',
            padding: '0.15rem 0.6rem',
            borderRadius: '999px',
            letterSpacing: '0.04em',
            border: '1.5px solid #fdba74',
            whiteSpace: 'nowrap',
          }}
        >
          TOBY 🐾
        </span>
      </div>

      {/* Comic Speech Bubble */}
      <div
        style={{
          background: '#ffffff',
          border: '3px solid #f97316',
          borderRadius: '24px',
          padding: '0.85rem 1.25rem',
          maxWidth: '520px',
          textAlign: 'left',
          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.16)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}
      >
        {/* Header line with sound status & energy mode */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 900,
              color: '#ea580c',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={14} color="#f59e0b" />
            Toby te dice:
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Voice Style Pill: Cartoon vs Sweet */}
            <button
              type="button"
              onClick={toggleStyle}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: voiceStyle === 'cartoon' ? '#fef3c7' : '#fce7f3',
                border: voiceStyle === 'cartoon' ? '1.5px solid #f59e0b' : '1.5px solid #ec4899',
                color: voiceStyle === 'cartoon' ? '#b45309' : '#be185d',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 900,
                cursor: 'pointer',
              }}
              title="Cambiar tono de voz de Toby"
            >
              {voiceStyle === 'cartoon' ? <Zap size={12} /> : <Heart size={12} />}
              <span>{voiceStyle === 'cartoon' ? 'Voz Súper Alegre ⚡' : 'Voz Dulce 🌸'}</span>
            </button>

            {onRepeat && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRepeat(voiceStyle);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#ffedd5',
                  border: '1.5px solid #fdba74',
                  color: '#c2410c',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title="Escuchar a Toby otra vez"
              >
                <Volume2 size={13} />
                <span>{isSpeaking ? 'Hablando...' : 'Escuchar'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Message body with highlighted English chips */}
        <div
          style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            lineHeight: 1.45,
            color: '#1e293b',
          }}
        >
          {tokens.map((tok) => {
            if (tok.type === 'en') {
              return (
                <span
                  key={tok.key}
                  style={{
                    display: 'inline-inline',
                    margin: '0 0.25rem',
                    padding: '0.15rem 0.6rem',
                    background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
                    border: '2px solid #eab308',
                    color: '#854d0e',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    boxShadow: '0 2px 6px rgba(234, 179, 8, 0.3)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {tok.value} 🔊
                </span>
              );
            }
            return <span key={tok.key}>{tok.value}</span>;
          })}
        </div>

        {extraAction && (
          <div style={{ marginTop: '0.2rem' }}>
            {extraAction}
          </div>
        )}
      </div>
    </div>
  );
}
