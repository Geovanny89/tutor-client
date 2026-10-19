import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mic, TrendingUp, Zap } from 'lucide-react';

export default function DashboardHero({ user, usageStats }) {
  return (
    <div className="dashboard-hero-card" style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--primary-soft-2)',
      borderRadius: '24px',
      padding: '1.75rem 1.25rem',
      marginBottom: '1.75rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem',
      boxShadow: '0 8px 30px -4px rgba(5, 150, 105, 0.08), 0 2px 8px rgba(15, 23, 42, 0.03)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: '640px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.9rem',
          borderRadius: '999px',
          background: 'var(--primary-bg)',
          border: '1px solid var(--primary-soft-2)',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: 'var(--primary-hover)',
          marginBottom: '0.85rem',
        }}>
          <Sparkles size={15} color="var(--primary)" /> Plan de Aprendizaje Integral · 5 Bloques (A1 → C2)
        </div>

        <h1 style={{
          fontSize: '2.1rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          margin: '0 0 0.6rem 0',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
        }}>
          ¡Hola, {user?.name?.split(' ')[0]}! Listo para hablar inglés hoy? 👋
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
          Cada bloque contiene explicaciones gramaticales prácticas, audio fonético con personas nativas y un examen evaluativo para certificar tus conocimientos.
        </p>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link
            to="/tutor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.8rem 1.6rem',
              borderRadius: '12px',
              background: 'var(--primary)',
              color: 'var(--text-on-primary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
              transition: 'all 0.2s',
            }}
          >
            <Mic size={19} />
            Practicar Conversación por Voz (Tutor IA)
          </Link>

          <Link
            to="/progress"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.8rem 1.3rem',
              borderRadius: '12px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <TrendingUp size={18} color="var(--primary)" />
            Ver Mi Historial
          </Link>
        </div>
      </div>

      {/* Level & Token Status Widget */}
      <div style={{
        background: 'var(--bg-base)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '1.4rem',
        minWidth: 'min(100%, 260px)',
        flex: '1 1 240px',
        boxSizing: 'border-box',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-subtle)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Tu Nivel Actual
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span style={{
            fontSize: '2.6rem',
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            color: 'var(--primary)',
          }}>
            {user?.current_level || 'A1'}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
            Meta: {user?.target_level || 'C2'}
          </span>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={15} color="var(--accent-gold-strong)" fill="var(--accent-gold)" /> Práctica IA Gratis Hoy
            </span>
            <strong style={{ color: 'var(--primary-hover)' }}>
              {usageStats.interactionsRemaining} / {usageStats.dailyLimit}
            </strong>
          </div>
          <div style={{
            height: '8px',
            background: 'var(--border)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (usageStats.interactionsRemaining / (usageStats.dailyLimit || 1)) * 100)}%`,
              background: 'linear-gradient(90deg, var(--primary-light) 0%, var(--primary) 100%)',
              borderRadius: '999px',
            }} />
          </div>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-subtle)', marginTop: '0.4rem' }}>
            Se reinicia diariamente a medianoche ⏳
          </div>
        </div>
      </div>
    </div>
  );
}
