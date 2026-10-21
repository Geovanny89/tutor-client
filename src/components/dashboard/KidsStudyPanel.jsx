import React, { useState, useEffect } from 'react';
import { useVoice } from '../../hooks/useVoice';
import { Star, Sparkles, Volume2 } from 'lucide-react';
import ListenAndFindGame from '../kids/ListenAndFindGame';
import BubblePopGame from '../kids/BubblePopGame';
import VisualMemoryGame from '../kids/VisualMemoryGame';
import SoundboardExplorer from '../kids/SoundboardExplorer';

const ACTIVITIES = [
  { id: 'listen', label: 'Escucha y Toca', emoji: '🎯', desc: '¡Escucha y toca el dibujo!', color: '#06b6d4', bg: '#ecfeff' },
  { id: 'bubble', label: 'Revienta Burbujas', emoji: '🎈', desc: '¡Explota la burbuja correcta!', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'memory', label: 'Parejas Mágicas', emoji: '🃏', desc: '¡Encuentra los dibujos iguales!', color: '#ec4899', bg: '#fdf2f8' },
  { id: 'explorer', label: 'Pizarra de Dibujos', emoji: '🌈', desc: '¡Toca para escuchar cómo se dice!', color: '#10b981', bg: '#ecfdf5' },
];

export default function KidsStudyPanel({ user }) {
  const [activeActivity, setActiveActivity] = useState('listen');
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem('kdice_kids_stars');
    return saved ? parseInt(saved, 10) : 50;
  });
  const [starBounce, setStarBounce] = useState(false);

  const { speak } = useVoice({ lang: 'en-US', rate: 0.85, pitch: 1.05 });

  const handleEarnStar = (amount = 10) => {
    setStars((prev) => {
      const next = prev + amount;
      localStorage.setItem('kdice_kids_stars', next.toString());
      return next;
    });
    setStarBounce(true);
    setTimeout(() => setStarBounce(false), 600);
  };

  const currentAct = ACTIVITIES.find((a) => a.id === activeActivity);

  return (
    <div style={{ color: 'var(--text-primary)', maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Hero Banner Infantil */}
      <div style={{
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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            fontSize: '4.5rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
          }}>
            🦁
          </div>
          <div>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              margin: '0 0 0.25rem',
              fontFamily: 'var(--font-display)',
              textShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}>
              ¡Hola, {user?.name?.split(' ')[0] || 'pequeño campeón'}! 🚀
            </h1>
            <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, opacity: 0.95 }}>
              ¡Aprende inglés tocando y jugando con dibujos! 🎨✨
            </p>
          </div>
        </div>

        {/* Contador Gigante de Estrellas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          border: '3px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '999px',
          padding: '0.75rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          transform: starBounce ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <Star fill="#fde047" color="#facc15" size={34} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tus Estrellitas
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1 }}>
              {stars}
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Juegos / Actividades */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {ACTIVITIES.map((act) => {
          const isSelected = act.id === activeActivity;

          return (
            <button
              key={act.id}
              onClick={() => {
                setActiveActivity(act.id);
                speak(act.label, 0.9);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '1.1rem 1.25rem',
                borderRadius: '24px',
                border: isSelected ? `3.5px solid ${act.color}` : '2px solid var(--border)',
                background: isSelected ? act.bg : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isSelected ? 'scale(1.04) translateY(-3px)' : 'scale(1)',
                boxShadow: isSelected ? `0 12px 24px ${act.color}33` : '0 4px 8px rgba(0,0,0,0.04)',
              }}
            >
              <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{act.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  color: isSelected ? act.color : 'var(--text-primary)',
                }}>
                  {act.label}
                </div>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-subtle)',
                  fontWeight: 600,
                  marginTop: '0.15rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {act.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Área de Juego Activo */}
      <div>
        {activeActivity === 'listen' && (
          <ListenAndFindGame onEarnStar={handleEarnStar} speak={speak} />
        )}

        {activeActivity === 'bubble' && (
          <BubblePopGame onEarnStar={handleEarnStar} speak={speak} />
        )}

        {activeActivity === 'memory' && (
          <VisualMemoryGame onEarnStar={handleEarnStar} speak={speak} />
        )}

        {activeActivity === 'explorer' && (
          <SoundboardExplorer onEarnStar={handleEarnStar} speak={speak} />
        )}
      </div>
    </div>
  );
}
