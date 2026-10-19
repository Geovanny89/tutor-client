import React, { useState, useCallback } from 'react';
import { X, Volume2, Sparkles, Loader2, ChevronRight, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const CEFR_BADGE = {
  A1: { bg: 'var(--primary-bg)', text: 'var(--primary-text)', border: 'var(--primary-soft-2)' },
  A2: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  B1: { bg: 'var(--warning-bg)', text: 'var(--accent-gold-text)', border: 'var(--accent-gold-border)' },
  B2: { bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  C1: { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
  C2: { bg: '#FDF4FF', text: '#701A75', border: '#F0ABFC' },
};

function speak(text, rate = 0.85) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  
  // Handle slashes by adding a pause for clarity
  const processedText = text.replace(/\s*\/\s*/g, ', ... ');
  
  const utt = new SpeechSynthesisUtterance(processedText);
  utt.lang = 'en-US';
  utt.rate = rate;
  window.speechSynthesis.speak(utt);
}

export default function VocabDetailModal({ word, onClose }) {
  const [aiExamples, setAiExamples] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const badge = CEFR_BADGE[word.level] || CEFR_BADGE.A1;

  const fetchAIExamples = useCallback(async () => {
    setLoading(true);
    setError('');
    setAiExamples(null);

    try {
      // Keep prompt short & explicit to avoid any character limits
      const message = `Give 3 simple English sentences for "${word.word}" (${word.translation}, ${word.level}).
Format strictly:
1. [English] → [Spanish]
2. [English] → [Spanish]
3. [English] → [Spanish]`;

      const res = await api.post('/ai/chat', {
        message,
        context: `Vocabulary practice for: "${word.word}"`,
      });

      // Support all common response structures
      const rawText =
        res?.data?.reply ||
        res?.data?.text ||
        res?.data?.explanation ||
        res?.reply ||
        res?.text ||
        '';

      if (!rawText) {
        setError('La IA no devolvió respuesta. Intenta de nuevo.');
        return;
      }

      // Parse numbered list with → separator
      const lines = rawText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const parsedExamples = [];

      for (const line of lines) {
        const cleaned = line.replace(/^\d+[\.\)]\s*/, '').trim();
        if (!cleaned) continue;

        const parts = cleaned.split(/→|—|-\s+(?=[A-ZÁÉÍÓÚ])/);
        const sentence = parts[0]?.trim();
        const translation = parts[1]?.trim() || '';

        if (sentence && sentence.length > 3) {
          parsedExamples.push({ sentence, translation });
        }
      }

      if (parsedExamples.length > 0) {
        setAiExamples(parsedExamples.slice(0, 3));
      } else {
        // Fallback: split by sentences
        const sentences = rawText
          .replace(/\n+/g, ' ')
          .split(/(?<=[.!?])\s+/)
          .filter((s) => s.length > 5 && /[a-zA-Z]/.test(s))
          .slice(0, 3);

        if (sentences.length > 0) {
          setAiExamples(sentences.map((s) => ({ sentence: s, translation: '' })));
        } else {
          setAiExamples([{ sentence: rawText.slice(0, 200), translation: '' }]);
        }
      }
    } catch (err) {
      console.error('[VocabDetailModal] AI error:', err);
      setError('No se pudo generar ejemplos. Verifica tu conexión o intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [word]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1000,
        }}
      />

      {/* Responsive Modal Container */}
      <div
        className="vocab-modal-box"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(540px, calc(100vw - 1.5rem))',
          maxHeight: '88vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: 'var(--bg-surface)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(15,23,42,0.22)',
          zIndex: 1001,
          padding: '1.5rem 1.25rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Close button */}
        <button
          id="vocab-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--bg-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          <X size={17} color="var(--text-subtle)" />
        </button>

        {/* CEFR Badge */}
        <span style={{
          padding: '0.2rem 0.65rem',
          borderRadius: '999px',
          background: badge.bg,
          color: badge.text,
          border: `1px solid ${badge.border}`,
          fontSize: '0.74rem',
          fontWeight: 700,
          display: 'inline-block',
          marginBottom: '0.85rem',
        }}>
          Nivel {word.level}
        </span>

        {/* Word heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 6vw, 2.4rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            margin: 0,
            wordBreak: 'break-word',
          }}>
            {word.word}
          </h2>
          <button
            id="vocab-modal-speak-word"
            onClick={() => speak(word.word)}
            title="Escuchar pronunciación"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
            }}
          >
            <Volume2 size={18} color="var(--text-on-primary)" />
          </button>
        </div>

        {/* IPA + type */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            background: 'var(--bg-muted)',
            padding: '0.2rem 0.65rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            fontWeight: 600,
          }}>
            {word.pronunciation}
          </span>
          <span style={{
            background: 'var(--primary-bg)',
            padding: '0.2rem 0.65rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--primary-text)',
            fontWeight: 600,
          }}>
            {word.type}
          </span>
        </div>

        {/* Translation */}
        <div style={{
          background: 'var(--primary-bg)',
          border: '1px solid var(--primary-soft-2)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
        }}>
          <p style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Traducción
          </p>
          <p style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
            {word.translation}
          </p>
        </div>

        {/* Included example */}
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Ejemplo incluido
          </p>
          <div style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.75rem 0.85rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}>
            <ChevronRight size={15} color="var(--primary-light)" style={{ marginTop: '3px', flexShrink: 0 }} />
            <p style={{ color: 'var(--text-primary)', fontStyle: 'italic', fontSize: '0.92rem', fontWeight: 500, margin: 0 }}>
              {word.example}
            </p>
          </div>
          <button
            id="vocab-modal-speak-example"
            onClick={() => speak(word.example, 0.75)}
            style={{
              marginTop: '0.4rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.2rem 0',
            }}
          >
            <Volume2 size={13} /> Escuchar ejemplo
          </button>
        </div>

        {/* Tags */}
        {word.tags && word.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {word.tags.map((tag) => (
              <span key={tag} style={{
                padding: '0.2rem 0.55rem',
                background: 'var(--bg-muted)',
                color: 'var(--text-subtle)',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 600,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ─── AI Examples Section ─── */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <p style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              ✨ Ejemplos con IA
            </p>

            {!loading && (
              <button
                id="vocab-modal-ai-generate"
                onClick={fetchAIExamples}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                  color: 'var(--text-on-primary)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(5,150,105,0.22)',
                  flexShrink: 0,
                }}
              >
                {aiExamples ? <RefreshCw size={13} /> : <Sparkles size={14} />}
                {aiExamples ? 'Nuevos ejemplos' : 'Generar con IA'}
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-subtle)', padding: '0.85rem 0' }}>
              <Loader2 size={18} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.86rem' }}>Generando ejemplos personalizados...</span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              borderRadius: '10px',
              padding: '0.75rem 0.85rem',
              marginBottom: '0.65rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              <p style={{ color: 'var(--error-strong)', fontSize: '0.82rem', fontWeight: 500, margin: 0 }}>{error}</p>
              <button
                onClick={fetchAIExamples}
                style={{
                  alignSelf: 'flex-start',
                  background: 'var(--error-strong)',
                  color: 'var(--text-on-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Examples list */}
          {aiExamples && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {aiExamples.map((ex, i) => (
                <div key={i} style={{
                  background: 'var(--primary-bg)',
                  border: '1px solid var(--primary-soft-2)',
                  borderRadius: '10px',
                  padding: '0.75rem 0.85rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: ex.translation ? '0.2rem' : 0, wordBreak: 'break-word', margin: 0 }}>
                        {i + 1}. {ex.sentence}
                      </p>
                      {ex.translation && (
                        <p style={{ color: 'var(--primary)', fontSize: '0.82rem', fontStyle: 'italic', marginTop: '0.2rem', margin: '0.2rem 0 0 0' }}>
                          ↳ {ex.translation}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => speak(ex.sentence, 0.8)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.2rem',
                        color: 'var(--primary)',
                        flexShrink: 0,
                      }}
                      title="Escuchar"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Placeholder when not yet generated */}
          {!aiExamples && !loading && !error && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontStyle: 'italic', textAlign: 'center', padding: '0.75rem 0', margin: 0 }}>
              Toca <strong style={{ color: 'var(--primary)' }}>Generar con IA</strong> para obtener oraciones de ejemplo con pronunciación y traducción.
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .vocab-modal-box {
            padding: 1.25rem 0.9rem !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
