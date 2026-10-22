import React from 'react';

export default function KidsMissionMap({ missions = [], onStartMission }) {
  if (!missions.length) return null;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.8rem' }}>🗺️</span>
        <div>
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              margin: 0,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
            }}
          >
            Mapa de Misiones
          </h2>
          <p style={{ margin: '0.1rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            {missions.length} misiones de tu profesor · ¡Cada lección tiene su propio juego! 🎮
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
        {missions.map((mission) => {
          const { gameType, lesson, module: mod, missionNumber, key } = mission;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onStartMission(mission)}
              style={{
                background: gameType.bg,
                border: `2.5px solid ${gameType.color}55`,
                borderRadius: '24px',
                padding: '1.25rem',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
                boxShadow: `0 8px 20px ${gameType.color}22`,
                transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 18px 36px ${gameType.color}44`;
                e.currentTarget.style.borderColor = `${gameType.color}cc`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${gameType.color}22`;
                e.currentTarget.style.borderColor = `${gameType.color}55`;
              }}
            >
              {/* Badge número de misión */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.9rem',
                  background: `${gameType.color}22`,
                  border: `1.5px solid ${gameType.color}55`,
                  borderRadius: '999px',
                  padding: '0.15rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  color: gameType.color,
                  letterSpacing: '0.04em',
                }}
              >
                #{missionNumber}
              </div>

              {/* Icono del juego + título */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '18px',
                    background: `${gameType.color}22`,
                    border: `2px solid ${gameType.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    flexShrink: 0,
                  }}
                >
                  {gameType.emoji}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      color: gameType.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {gameType.name || gameType.label}
                  </div>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 900,
                      color: '#1e293b',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {lesson.title || mod.name}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600, lineHeight: 1.4 }}>
                {gameType.desc}
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.6rem',
                  borderTop: `1px solid ${gameType.color}33`,
                  marginTop: 'auto',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                  📚 {mod.name}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    color: gameType.color,
                    background: `${gameType.color}18`,
                    border: `1.5px solid ${gameType.color}44`,
                    borderRadius: '10px',
                    padding: '0.2rem 0.7rem',
                  }}
                >
                  ¡Jugar! ⭐
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
