import React from 'react';
import { Star, ChevronLeft } from 'lucide-react';
import KidsGameDispatcher from './KidsGameDispatcher';

export default function KidsMissionView({ mission, stars, starBounce, kidSpeak, onBack, onEarnStar }) {
  const { lesson, module: mod, gameType, items, missionNumber } = mission;

  return (
    <div style={{ color: 'var(--text-primary)', maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header de misión */}
      <div
        style={{
          background: `linear-gradient(135deg, ${gameType.color}dd, ${gameType.color}99)`,
          borderRadius: '28px',
          padding: '1.25rem 1.75rem',
          marginBottom: '1.75rem',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: `0 12px 28px ${gameType.color}44`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '3rem', lineHeight: 1, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }}>
            {gameType.emoji}
          </span>
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                opacity: 0.9,
                letterSpacing: '0.05em',
              }}
            >
              Misión {missionNumber} · {gameType.name || gameType.label}
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, lineHeight: 1.2, marginTop: '0.15rem' }}>
              {lesson.title || mod.name}
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.85, fontWeight: 600, marginTop: '0.15rem' }}>
              {mod.name} · Clase del profesor 👨‍🏫
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(255,255,255,0.6)',
              borderRadius: '999px',
              padding: '0.5rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transform: starBounce ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <Star fill="#fde047" color="#facc15" size={22} />
            <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>{stars}</span>
          </div>

          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255,255,255,0.25)',
              border: '2px solid rgba(255,255,255,0.7)',
              color: '#fff',
              padding: '0.55rem 1.1rem',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={16} /> Volver al mapa
          </button>
        </div>
      </div>

      {/* Toby mini-banner */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '2px solid var(--border)',
          borderRadius: '20px',
          padding: '0.9rem 1.4rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}
      >
        <span style={{ fontSize: '2.5rem', animation: 'bounce 1.8s ease-in-out infinite' }}>🐶</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Toby dice: </strong>
          {gameType.desc} ¡Gana estrellas ⭐ y demuéstrale a tu profe lo bien que aprendes!
        </span>
      </div>

      {/* Juego activo despachado dinámicamente con vocabulario de la lección */}
      <KidsGameDispatcher
        gameId={gameType.id}
        items={items}
        kidSpeak={kidSpeak}
        onEarnStar={onEarnStar}
        lesson={lesson}
      />
    </div>
  );
}
