import React from 'react';
import { CORE_GAME_TYPES } from './kidsConstants';
import ListenAndFindGame from './ListenAndFindGame';
import BubblePopGame from './BubblePopGame';
import VisualMemoryGame from './VisualMemoryGame';
import SoundboardExplorer from './SoundboardExplorer';

export default function KidsFreePlay({ freeGame, onSelectGame, onEarnStar, kidSpeak }) {
  return (
    <div>
      {/* 4 Pestañas Globales Superiores (igual a la captura) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem',
        }}
      >
        {CORE_GAME_TYPES.map((act) => {
          const isActive = act.id === freeGame;
          return (
            <button
              key={act.id}
              onClick={() => {
                onSelectGame(act.id);
                kidSpeak?.speakSpanish?.(act.desc);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.9rem 1.15rem',
                borderRadius: '22px',
                border: isActive ? `3px solid ${act.color}` : '2px solid var(--border)',
                background: isActive ? act.bg : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isActive ? `0 8px 20px ${act.color}25` : '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: isActive ? `${act.color}22` : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  flexShrink: 0,
                }}
              >
                {act.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    color: isActive ? act.color : 'var(--text-primary)',
                  }}
                >
                  {act.label}
                </div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-subtle)',
                    fontWeight: 600,
                    marginTop: '0.1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {act.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenedor del Juego Global Seleccionado */}
      {freeGame === 'listen' && (
        <ListenAndFindGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={null} />
      )}
      {freeGame === 'bubble' && (
        <BubblePopGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} speak={kidSpeak.speakEnglish} items={null} />
      )}
      {freeGame === 'memory' && (
        <VisualMemoryGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} speak={kidSpeak.speakEnglish} items={null} />
      )}
      {freeGame === 'explorer' && (
        <SoundboardExplorer onEarnStar={onEarnStar} kidSpeak={kidSpeak} speak={kidSpeak.speakEnglish} items={null} />
      )}
    </div>
  );
}
