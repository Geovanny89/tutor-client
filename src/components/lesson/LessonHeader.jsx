import React from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';

export default function LessonHeader({ lesson, introText, onBack, onPlayIntro }) {
  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'transparent',
          border: 'none',
          color: '#059669',
          cursor: 'pointer',
          fontSize: '0.92rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
        }}
      >
        <ArrowLeft size={16} /> Volver al Módulo
      </button>

      {/* Hero Lesson Header */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '24px',
        padding: '2rem 2.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#065F46',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
          }}>
            Lección {lesson.order_index ?? 1}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
            ⏱ {lesson.duration_minutes || 15} min estimados
          </span>
        </div>

        <h1 style={{
          fontSize: '2.1rem',
          fontWeight: 800,
          color: '#0F172A',
          fontFamily: 'var(--font-display)',
          margin: '0 0 0.5rem 0',
          letterSpacing: '-0.02em',
        }}>
          {lesson.title}
        </h1>

        {lesson.subtitle && (
          <p style={{ color: '#059669', fontSize: '1.05rem', margin: '0 0 1.25rem 0', fontWeight: 700 }}>
            {lesson.subtitle}
          </p>
        )}

        {/* Live Tutor Coaching Intro Box */}
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '16px',
          padding: '1.15rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
            }}>
              👩🏼‍🏫
            </div>
            <div>
              <strong style={{ color: '#065F46', fontSize: '0.95rem' }}>
                Tutora Beyli te guía en esta lección:
              </strong>
              <div style={{ color: '#047857', fontSize: '0.88rem', marginTop: '0.15rem' }}>
                "Sigue los 4 pasos guiados abajo. Leeremos la teoría, escucharemos la pronunciación nativa y practicaremos hablando juntos."
              </div>
            </div>
          </div>

          <button
            onClick={onPlayIntro}
            style={{
              background: '#059669',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
            }}
          >
            <Volume2 size={16} /> Escuchar Introducción
          </button>
        </div>
      </div>
    </div>
  );
}
