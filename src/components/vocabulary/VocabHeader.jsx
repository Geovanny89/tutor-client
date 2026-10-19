import React from 'react';
import { Library } from 'lucide-react';

export default function VocabHeader() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-text) 40%, var(--primary-hover) 100%)',
      padding: '2rem 1rem 1.75rem',
      marginBottom: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '180px', height: '180px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-40px', left: '10%',
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.65rem' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '14px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            flexShrink: 0,
          }}>
            <Library size={24} color="#6EE7B7" />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 4.5vw, 2.1rem)',
              fontWeight: 900,
              color: 'var(--text-on-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              margin: 0,
            }}>
              Vocabulario Esencial
            </h1>
            <p style={{ color: 'var(--primary-soft-2)', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.15rem' }}>
              Verbos · Adjetivos · Sustantivos · Frases · Números · Alfabeto
            </p>
          </div>
        </div>

        <p style={{
          color: 'var(--primary-soft)',
          fontSize: '0.92rem',
          maxWidth: '620px',
          lineHeight: 1.55,
          margin: '0.5rem 0 0 0',
        }}>
          Explora más de <strong style={{ color: 'var(--text-on-primary)' }}>100 palabras y frases</strong> organizadas por nivel CEFR.
          Haz clic en cualquier tarjeta para ver pronunciación, ejemplos y practicar con el tutor IA.
        </p>
      </div>
    </div>
  );
}
