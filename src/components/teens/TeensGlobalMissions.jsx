import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Trophy, Coins, Star, Volume2 } from 'lucide-react';
import { useTeensGame } from '../../context/TeensGameContext';
import { useThemeStore } from '../../stores/themeStore';
import { playEnglishPhrase } from '../../utils/teenSpeech';
import AdGate from './AdGate';
import TeensGameDispatcher from './TeensGameDispatcher';
import { GLOBAL_TEEN_MISSIONS } from '../../data/teensMissionsConstants';

/**
 * TeensGlobalMissions — Sección de misiones globales gratuitas para Teens.
 * Las misiones se desbloquean viendo un anuncio de 45s.
 * Si el jugador pierde, debe ver el anuncio de nuevo para reintentar.
 */
export default function TeensGlobalMissions() {
  const { isMissionUnlocked, isMissionCompleted, unlockMissionAd, resetMissionUnlock, completeMission, earnXp, earnCoins, addItem, xp, level, coins } = useTeensGame();
  const [activeMission, setActiveMission] = useState(null); // misión seleccionada
  const [gamePhase, setGamePhase] = useState('missions'); // 'missions' | 'gate' | 'playing' | 'result'
  const [lastResult, setLastResult] = useState(null); // 'win' | 'lose'
  const [showInventory, setShowInventory] = useState(false);

  const handleSelectMission = (mission) => {
    setActiveMission(mission);
    setLastResult(null);
    if (isMissionUnlocked(mission.id)) {
      setGamePhase('playing');
    } else {
      setGamePhase('gate');
    }
  };

  const handleAdUnlock = (missionId) => {
    unlockMissionAd(missionId);
    setGamePhase('playing');
  };

  const handleWin = () => {
    completeMission(activeMission.id);
    if (activeMission.itemReward) {
      addItem(activeMission.itemReward);
    }
    setLastResult('win');
    setGamePhase('result');
  };

  const handleLose = () => {
    // Al perder, resetear el unlock para que deba ver el anuncio de nuevo si era por ad
    resetMissionUnlock(activeMission.id);
    setLastResult('lose');
    setGamePhase('result');
  };

  const handleRetry = () => {
    setLastResult(null);
    if (lastResult === 'lose') {
      // Debe ver anuncio de nuevo
      setGamePhase('gate');
    } else {
      setGamePhase('playing');
    }
  };

  const handleBack = () => {
    setActiveMission(null);
    setGamePhase('missions');
    setLastResult(null);
  };

  // ── Vista: Resultado ───────────────────────────────────────────────────────
  if (gamePhase === 'result' && activeMission) {
    return (
      <ResultScreen
        mission={activeMission}
        won={lastResult === 'win'}
        onRetry={handleRetry}
        onBack={handleBack}
      />
    );
  }

  // ── Vista: Jugando ─────────────────────────────────────────────────────────
  if (gamePhase === 'playing' && activeMission) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <button onClick={handleBack} style={backBtnStyle}>← Volver a misiones</button>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>
              {activeMission.emoji} {activeMission.title}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <MiniPill value={`${activeMission.xpReward} XP`} color="#f59e0b" />
            <MiniPill value={`${activeMission.coinReward} 🪙`} color="#10b981" />
          </div>
        </div>
        <TeensGameDispatcher
          missionId={activeMission.id}
          items={[]}
          onWin={handleWin}
          onLose={handleLose}
        />
      </div>
    );
  }

  // ── Vista: Puerta de anuncio ───────────────────────────────────────────────
  if (gamePhase === 'gate' && activeMission) {
    return (
      <AdGate
        mission={activeMission}
        isUnlocked={false}
        onUnlock={handleAdUnlock}
        onClose={handleBack}
      />
    );
  }

  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  // ── Vista: Lista de misiones ───────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header con stats */}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #7c3aed 100%)',
        border: isDark ? '1px solid rgba(124,58,237,0.3)' : 'none',
        borderRadius: '26px',
        padding: '1.65rem 1.75rem',
        marginBottom: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.25rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.35)' : '0 14px 34px -8px rgba(99, 102, 241, 0.35)',
      }}>
        <div>
          <h2 style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.6rem', margin: '0 0 0.3rem', fontFamily: 'var(--font-display)' }}>
            🌍 Misiones Globales
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', margin: 0, fontWeight: 500 }}>
            Desbloquea misiones gratis viendo un anuncio de 45s. ¡Gana XP, monedas y objetos épicos!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <StatPill icon="⭐" value={`Nv. ${level}`} label="Nivel" />
          <StatPill icon="⚡" value={xp} label="XP Total" />
          <StatPill icon="🪙" value={coins} label="Monedas" color="#fef08a" />
        </div>
      </div>

      {/* Misiones grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
        {GLOBAL_TEEN_MISSIONS.map((mission) => {
          const unlocked = isMissionUnlocked(mission.id);
          const completed = isMissionCompleted(mission.id);
          return (
            <MissionCard
              key={mission.id}
              mission={mission}
              unlocked={unlocked}
              completed={completed}
              isDark={isDark}
              onSelect={() => handleSelectMission(mission)}
            />
          );
        })}
      </div>

      {/* Nota informativa */}
      <div style={{
        background: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb',
        border: isDark ? '1px solid rgba(245,158,11,0.25)' : '1.5px solid #fde68a',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        marginTop: '1.75rem',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      }}>
        <p style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#92400e', fontSize: '0.86rem', margin: 0, fontWeight: 600 }}>
          💡 Si pierdes una misión, deberás ver el anuncio nuevamente para reintentar.
          Las misiones completadas pueden volver a jugarse libremente.
        </p>
      </div>
    </div>
  );
}

// ─── Mission Card ─────────────────────────────────────────────────────────────
function MissionCard({ mission, unlocked, completed, onSelect, isDark = true }) {
  const bgStyle = isDark
    ? completed
      ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(15,23,42,0.95) 100%)'
      : unlocked
      ? 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(15,23,42,0.95) 100%)'
      : 'linear-gradient(135deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.95) 100%)'
    : completed
      ? 'linear-gradient(145deg, #f0fdf4 0%, #ffffff 100%)'
      : unlocked
      ? 'linear-gradient(145deg, #f5f3ff 0%, #ffffff 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)';

  const borderStyle = isDark
    ? completed
      ? '1.5px solid rgba(16,185,129,0.45)'
      : unlocked
      ? '1.5px solid rgba(124,58,237,0.45)'
      : '1.5px solid rgba(255,255,255,0.1)'
    : completed
      ? '1.5px solid #86efac'
      : unlocked
      ? '1.5px solid #c4b5fd'
      : '1.5px solid #e2e8f0';

  const shadowStyle = isDark
    ? '0 10px 25px -5px rgba(0,0,0,0.3)'
    : completed
      ? '0 10px 25px -5px rgba(16, 185, 129, 0.16), 0 4px 6px -2px rgba(16, 185, 129, 0.05)'
      : unlocked
      ? '0 10px 25px -5px rgba(99, 102, 241, 0.16), 0 4px 6px -2px rgba(99, 102, 241, 0.05)'
      : '0 8px 20px -4px rgba(15, 23, 42, 0.07)';

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: isDark ? '0 16px 36px rgba(124,58,237,0.35)' : '0 16px 32px rgba(99,102,241,0.2)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      style={{
        background: bgStyle,
        border: borderStyle,
        borderRadius: '22px',
        padding: '1.35rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: shadowStyle,
        transition: 'all 0.25s',
      }}
    >
      {/* Status badge */}
      {completed && (
        <div style={{
          position: 'absolute', top: '0.85rem', right: '0.85rem',
          background: isDark ? 'rgba(16,185,129,0.25)' : '#dcfce7',
          border: isDark ? '1px solid #10b981' : '1px solid #86efac',
          borderRadius: '999px', padding: '0.2rem 0.65rem',
          fontSize: '0.74rem', fontWeight: 800,
          color: isDark ? '#10b981' : '#15803d',
        }}>
          ✓ Completada
        </div>
      )}

      {!unlocked && !completed && (
        <div style={{
          position: 'absolute', top: '0.85rem', right: '0.85rem',
          background: isDark ? 'rgba(0,0,0,0.5)' : '#ede9fe',
          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #c4b5fd',
          borderRadius: '999px', padding: '0.2rem 0.65rem',
          fontSize: '0.74rem', fontWeight: 800,
          color: isDark ? 'rgba(255,255,255,0.6)' : '#6d28d9',
          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        }}>
          <Lock size={11} /> Ver anuncio
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '2.8rem', lineHeight: 1 }}>{mission.emoji}</div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playEnglishPhrase(`${mission.title}. ${mission.subtitle}`);
          }}
          title="Escuchar en inglés"
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
            border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid #cbd5e1',
            color: isDark ? '#a78bfa' : '#6366f1',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Volume2 size={16} />
        </button>
      </div>

      <h3 style={{
        color: isDark ? '#ffffff' : '#0f172a',
        fontWeight: 900,
        fontSize: '1.05rem',
        margin: '0 0 0.35rem',
        lineHeight: 1.3,
      }}>
        {mission.title}
      </h3>
      <p style={{
        color: isDark ? 'rgba(255,255,255,0.6)' : '#475569',
        fontSize: '0.84rem',
        margin: '0 0 1rem',
        lineHeight: 1.45,
      }}>
        {mission.subtitle}
      </p>

      {/* Rewards */}
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <RewardTag value={`+${mission.xpReward} XP`} color="#f59e0b" isDark={isDark} />
        <RewardTag value={`+${mission.coinReward} 🪙`} color="#10b981" isDark={isDark} />
        {mission.itemReward && (
          <RewardTag value={`${mission.itemReward.emoji} ${mission.itemReward.name}`} color="#8b5cf6" isDark={isDark} />
        )}
      </div>

      {/* Difficulty & Category */}
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '0.72rem', fontWeight: 800,
          color: isDark ? 'rgba(255,255,255,0.6)' : '#334155',
          background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
          borderRadius: '8px', padding: '0.2rem 0.55rem',
        }}>
          {mission.difficulty}
        </span>
        {mission.tags?.slice(0, 2).map((tag) => (
          <span key={tag} style={{
            fontSize: '0.7rem', fontWeight: 700,
            color: isDark ? 'rgba(167,139,250,0.9)' : '#7e22ce',
            background: isDark ? 'rgba(124,58,237,0.18)' : '#f3e8ff',
            border: isDark ? '1px solid rgba(124,58,237,0.3)' : '1px solid #e9d5ff',
            borderRadius: '8px', padding: '0.2rem 0.55rem',
          }}>
            #{tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({ mission, won, onRetry, onBack }) {
  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', paddingTop: '2rem' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: 'linear-gradient(145deg, #1a0533 0%, #0f172a 100%)',
          border: won ? '1.5px solid rgba(16,185,129,0.4)' : '1.5px solid rgba(239,68,68,0.3)',
          borderRadius: '24px', padding: '2rem', textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{won ? '🏆' : '💀'}</div>
        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', margin: '0 0 0.5rem' }}>
          {won ? '¡Misión completada!' : 'Misión fallida'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem' }}>
          {won
            ? `Has completado "${mission.title}" y ganado todas las recompensas.`
            : `No lograste completar "${mission.title}". ¡Mira el anuncio para reintentar!`}
        </p>

        {won && (
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <RewardTag value={`+${mission.xpReward} XP`} color="#f59e0b" large />
            <RewardTag value={`+${mission.coinReward} 🪙`} color="#10b981" large />
            {mission.itemReward && <RewardTag value={`${mission.itemReward.emoji} ${mission.itemReward.name}`} color="#7c3aed" large />}
          </div>
        )}

        {!won && (
          <div style={{
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: '12px', padding: '0.85rem', marginBottom: '1.25rem',
          }}>
            <p style={{ color: '#f59e0b', fontSize: '0.85rem', margin: 0, fontWeight: 700 }}>
              📺 Para reintentar debes ver un anuncio de 45s.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onRetry} style={{
            padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem',
          }}>
            {won ? '🔄 Jugar de nuevo' : '📺 Ver anuncio y reintentar'}
          </button>
          <button onClick={onBack} style={{
            padding: '0.8rem 1.5rem', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
            color: 'rgba(255,255,255,0.7)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
          }}>
            ← Volver
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function StatPill({ icon, value, label, color = '#fff' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '14px', padding: '0.5rem 0.9rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{icon} {label}</div>
      <div style={{ fontSize: '1.05rem', fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

function MiniPill({ value, color = '#fff' }) {
  return (
    <span style={{
      background: `${color}22`,
      border: `1px solid ${color}55`,
      color,
      borderRadius: '999px',
      padding: '0.25rem 0.65rem',
      fontSize: '0.8rem',
      fontWeight: 800,
      display: 'inline-flex',
      alignItems: 'center',
    }}>
      {value}
    </span>
  );
}

function RewardTag({ value, color, large = false }) {
  return (
    <span style={{
      background: `${color}18`, border: `1px solid ${color}44`,
      color, borderRadius: '8px',
      padding: large ? '0.35rem 0.8rem' : '0.15rem 0.5rem',
      fontSize: large ? '0.88rem' : '0.72rem', fontWeight: 800,
    }}>
      {value}
    </span>
  );
}

const backBtnStyle = {
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '10px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.6)',
  cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem',
  display: 'block',
};
