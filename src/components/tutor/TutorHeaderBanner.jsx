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
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#047857',
            marginBottom: '0.5rem',
          }}>
            <Sparkles size={14} color="#059669" /> Práctica de Conversación en Vivo
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Tutor Nativo de <span style={{ color: '#059669' }}>Inglés por Voz</span>
          </h1>
          <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
            Habla naturalmente como con un profesor nativo. Te escucha, te responde con historias reales y te ayuda a expresarte.
          </p>
        </div>

        {/* Daily Token / Interaction Budget Box */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
              Tu Cuota Diaria Gratis
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              <Zap size={16} color="#D97706" fill="#F59E0B" />
              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.15rem' }}>
                {usageStats.interactionsRemaining}
              </span>
              <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
                de {usageStats.dailyLimit} disponibles
              </span>
            </div>
          </div>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#ECFDF5',
            border: '2px solid #059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#065F46',
          }}>
            {Math.round(((usageStats.interactionsRemaining || 0) / (usageStats.dailyLimit || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Beginner Guide Banner */}
      {showGuide && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #A7F3D0',
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
              color: '#047857',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            ✕ Entendido
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <Sparkles size={18} color="#059669" />
            <strong style={{ color: '#065F46', fontSize: '0.98rem' }}>
              ¿Cómo practicar conversaciones con tu tutor de IA?
            </strong>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            fontSize: '0.88rem',
            color: '#047857',
          }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span style={{ background: '#059669', color: '#FFFFFF', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>1</span>
              <span><strong>Elige tu Tutor</strong>: Beyli habla con paciencia y ritmo claro; David tiene acento británico moderno; Gema te reta con vocabulario avanzado.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span style={{ background: '#059669', color: '#FFFFFF', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>2</span>
              <span><strong>Presiona el Micrófono Verde</strong> y habla. No tengas pena: la IA comprende tu pronunciación y te dará tips amigables.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span style={{ background: '#059669', color: '#FFFFFF', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>3</span>
              <span><strong>Escucha con Voz Nativa</strong>. Si necesitas oírlo despacio, activa el botón <strong>Audio Lento 🐢</strong>.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
