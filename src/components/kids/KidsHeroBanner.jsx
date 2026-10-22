import React from 'react';
import { Star } from 'lucide-react';

export default function KidsHeroBanner({ user, missionsCount, stars, starBounce, kidSpeak }) {
  const firstName = user?.name?.split(' ')[0] || 'pequeño campeón';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        borderRadius: '32px',
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 15px 30px -5px rgba(16, 185, 129, 0.35)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div
          onClick={() =>
            kidSpeak.speakToby(
              `¡Woof woof! 🐶 ¡Hola ${firstName}! Soy Toby el perro explorador. ¡Elige una misión y aprendamos inglés juntos!`
            )
          }
          role="button"
          tabIndex={0}
          style={{
            fontSize: '4.5rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
            animation: 'bounce 1.8s ease-in-out infinite',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          title="¡Toca a Toby para escucharlo!"
        >
          🐶
        </div>
        <div>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              opacity: 0.9,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.15rem',
            }}
          >
            Toby el Perro Explorador
          </div>
          <h1
            style={{
              fontSize: '2.1rem',
              fontWeight: 900,
              margin: '0 0 0.25rem',
              fontFamily: 'var(--font-display)',
              textShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            ¡Hola, {firstName}! 🚀
          </h1>
          <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, opacity: 0.95 }}>
            {missionsCount > 0
              ? `¡Tienes ${missionsCount} misión${missionsCount !== 1 ? 'es' : ''} esperándote! 🐾✨`
              : '¡Elige un juego y aprende inglés jugando conmigo! 🐾✨'}
          </p>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(8px)',
          border: '3px solid rgba(255,255,255,0.6)',
          borderRadius: '999px',
          padding: '0.75rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          transform: starBounce ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Star fill="#fde047" color="#facc15" size={34} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tus Estrellitas
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1 }}>{stars}</div>
        </div>
      </div>
    </div>
  );
}
