import React, { useState, useEffect, useRef } from 'react';
import { Play, Lock, Zap, CheckCircle2, X, Shield } from 'lucide-react';

/**
 * AdGate — Puerta publicitaria de 45s para misiones globales de Teens.
 * Muestra un contador regresivo simulado. Al completar, llama onUnlock().
 * Si el jugador ya desbloqueó la misión antes, pasa directo con onUnlock().
 */
export default function AdGate({ mission, isUnlocked, onUnlock, onClose, children }) {
  const [phase, setPhase] = useState('preview'); // 'preview' | 'watching' | 'done'
  const [remaining, setRemaining] = useState(45);
  const timerRef = useRef(null);

  // Si ya estaba desbloqueada, va directo al juego
  if (isUnlocked) return children;

  const startAd = () => {
    setPhase('watching');
    setRemaining(45);
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          setPhase('done');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleClaim = () => {
    onUnlock(mission.id);
  };

  // ── Vista previa (antes de ver el anuncio) ────────────────────────────────
  if (phase === 'preview') {
    return (
      <div style={overlayStyle}>
        <div style={cardStyle}>
          {/* Botón cerrar */}
          {onClose && (
            <button onClick={onClose} style={closeBtnStyle} aria-label="Cerrar">
              <X size={18} />
            </button>
          )}

          {/* Ícono y misión */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{mission?.emoji || '🔐'}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(124,58,237,0.12)', color: '#7c3aed',
              border: '1.5px solid rgba(124,58,237,0.3)',
              padding: '0.3rem 0.9rem', borderRadius: '999px',
              fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.75rem',
            }}>
              <Lock size={13} /> Misión Global Bloqueada
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.4rem', color: '#fff' }}>
              {mission?.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.92rem', margin: 0 }}>
              {mission?.subtitle}
            </p>
          </div>

          {/* Recompensas */}
          <div style={{
            display: 'flex', gap: '0.75rem', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '1.5rem',
          }}>
            <RewardPill icon="⚡" label={`+${mission?.xpReward} XP`} color="#f59e0b" />
            <RewardPill icon="🪙" label={`+${mission?.coinReward} Coins`} color="#10b981" />
            {mission?.itemReward && (
              <RewardPill icon={mission.itemReward.emoji} label={mission.itemReward.name} color="#7c3aed" />
            )}
          </div>

          {/* CTA ver anuncio */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '14px', padding: '1rem', marginBottom: '1.25rem', textAlign: 'center',
          }}>
            <Shield size={20} color="#94a3b8" style={{ marginBottom: '0.4rem' }} />
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              Esta misión es <strong style={{ color: '#fff' }}>gratuita</strong>. Para desbloquearla,{' '}
              mira un breve anuncio de <strong style={{ color: '#f59e0b' }}>45 segundos</strong>.
            </p>
          </div>

          <button onClick={startAd} style={playBtnStyle}>
            <Play size={18} fill="#fff" /> Ver Anuncio y Jugar
          </button>
        </div>
      </div>
    );
  }

  // ── Viendo el anuncio ─────────────────────────────────────────────────────
  if (phase === 'watching') {
    const progress = ((45 - remaining) / 45) * 100;
    return (
      <div style={overlayStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          {/* Simulación de anuncio */}
          <div style={{
            width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '3rem', animation: 'pulse 2s infinite' }}>📡</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              K-Dice English Platform
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: 0 }}>
              Aprende inglés de forma inteligente
            </p>
          </div>

          {/* Barra de progreso */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg, #7c3aed, #10b981)',
                borderRadius: '999px', transition: 'width 1s linear',
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: '0.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)',
            }}>
              <span>Anuncio en reproducción...</span>
              <span style={{ color: '#f59e0b', fontWeight: 800 }}>⏱ {remaining}s</span>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            No puedes omitir el anuncio. Espera a que termine.
          </p>
        </div>
      </div>
    );
  }

  // ── Anuncio completado ────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div style={overlayStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem' }}>
            ¡Anuncio completado!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', margin: '0 0 1.5rem' }}>
            Misión <strong style={{ color: '#fff' }}>{mission?.title}</strong> desbloqueada.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <RewardPill icon="⚡" label={`+${mission?.xpReward} XP al completar`} color="#f59e0b" />
            <RewardPill icon="🪙" label={`+${mission?.coinReward} Coins`} color="#10b981" />
          </div>

          <button onClick={handleClaim} style={playBtnStyle}>
            🎮 ¡Jugar Ahora!
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function RewardPill({ icon, label, color }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      background: `${color}20`, border: `1.5px solid ${color}55`,
      color, padding: '0.3rem 0.8rem', borderRadius: '999px',
      fontSize: '0.82rem', fontWeight: 800,
    }}>
      <span>{icon}</span> {label}
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const overlayStyle = {
  position: 'fixed', inset: 0, zIndex: 500,
  background: 'rgba(0,0,0,0.85)',
  backdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
};

const cardStyle = {
  width: '100%', maxWidth: '520px',
  background: 'linear-gradient(145deg, #1a1135 0%, #0f172a 100%)',
  border: '1px solid rgba(124,58,237,0.35)',
  borderRadius: '24px', padding: '2rem',
  boxShadow: '0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
  position: 'relative',
};

const closeBtnStyle = {
  position: 'absolute', top: '1rem', right: '1rem',
  background: 'rgba(255,255,255,0.08)', border: 'none',
  borderRadius: '50%', width: '32px', height: '32px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
};

const playBtnStyle = {
  width: '100%', padding: '0.95rem', borderRadius: '14px', border: 'none',
  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
  color: '#fff', fontWeight: 800, fontSize: '1.05rem',
  cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: '0.5rem',
  boxShadow: '0 8px 20px rgba(124,58,237,0.4)',
  transition: 'transform 0.15s',
};
