import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

export default function TutorHeaderBanner({ usageStats, showGuide, onCloseGuide }) {
  return (
    <>
      {/* Header & Token Limit Widget */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.25rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            background: 'var(--primary-bg)',
            border: '1px solid var(--primary-soft-2)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--primary-hover)',
            marginBottom: '0.5rem',
          }}>
            <Sparkles size={14} color="var(--primary)" /> Práctica de Conversación en Vivo
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Tutor Nativo de <span style={{ color: 'var(--primary)' }}>Inglés por Voz</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
            Habla naturalmente como con un profesor nativo. Te escucha, te responde con historias reales y te ayuda a expresarte.
          </p>
        </div>

        {/* Daily Token / Interaction Budget Box */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Tu Cuota Diaria Gratis
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              <Zap size={16} color="var(--accent-gold-strong)" fill="var(--accent-gold)" />
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.15rem' }}>
                {usageStats.interactionsRemaining}
              </span>
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                de {usageStats.dailyLimit} disponibles
              </span>
            </div>
          </div>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--primary-bg)',
            border: '2px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--primary-text)',
          }}>
            {Math.round(((usageStats.interactionsRemaining || 0) / (usageStats.dailyLimit || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Beginner Guide Banner */}
      {showGuide && (
        <div style={{
          background: 'var(--primary-bg)',
          border: '1px solid var(--primary-soft-2)',
          borderRadius: '16px',
          padding: '1.1rem 1.4rem',
          marginBottom: '1.5rem',
          position: 'relative',
        }}>
          <button
            onClick={onCloseGuide}
            style={{
              position: 'absolute',
              top: '0.85rem',
              right: '0.85rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--primary-hover)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            ✕ Entendido
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <strong style={{ color: 'var(--primary-text)', fontSize: '0.98rem' }}>
              ¿Cómo practicar conversaciones con tu tutor de IA?
            </strong>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            fontSize: '0.88rem',
            color: 'var(--primary-hover)',
          }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span style={{ background: 'var(--primary)', color: 'var(--text-on-primary)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>1</span>
              <span><strong>Elige tu Tutor</strong>: Beyli habla con paciencia y ritmo claro; David tiene acento británico moderno; Gema te reta con vocabulario avanzado.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span style={{ background: 'var(--primary)', color: 'var(--text-on-primary)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>2</span>
              <span><strong>Presiona el Micrófono Verde</strong> y habla. No tengas pena: la IA comprende tu pronunciación y te dará tips amigables.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span style={{ background: 'var(--primary)', color: 'var(--text-on-primary)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>3</span>
              <span><strong>Escucha con Voz Nativa</strong>. Si necesitas oírlo despacio, activa el botón <strong>Audio Lento 🐢</strong>.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
