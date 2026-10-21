import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Zap, Gift, Trophy, ArrowRight, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import MissionQuizModal from './MissionQuizModal';
import { kidAudio } from '../../utils/kidAudio';

export default function DailyQuestsCard({ quests, onCompleteQuest, onClaimChest, chestClaimed }) {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);

  const completedCount = quests.filter((q) => q.completed).length;
  const canClaimChest = completedCount >= 3 && !chestClaimed;

  const handleClaimChest = () => {
    if (!canClaimChest) return;
    kidAudio.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClaimChest(150);
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '2px solid var(--border)',
      borderRadius: '24px',
      padding: '1.6rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            fontSize: '1.8rem',
            background: 'var(--primary-bg)',
            padding: '0.4rem',
            borderRadius: '14px',
            lineHeight: 1,
          }}>
            🎯
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, fontFamily: 'var(--font-display)' }}>
              Misiones Diarias
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 700 }}>
              {completedCount} de {quests.length} completadas hoy
            </span>
          </div>
        </div>

        {/* Cofre de Botín Misterioso */}
        <button
          onClick={handleClaimChest}
          disabled={!canClaimChest && !chestClaimed}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 1.25rem',
            borderRadius: '999px',
            border: chestClaimed ? '2px solid var(--border)' : canClaimChest ? '2px solid #f59e0b' : '2px solid var(--border)',
            background: chestClaimed
              ? 'var(--bg-base)'
              : canClaimChest
              ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
              : 'var(--bg-base)',
            color: chestClaimed ? 'var(--text-subtle)' : canClaimChest ? '#b45309' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: canClaimChest ? 'pointer' : 'default',
            boxShadow: canClaimChest ? '0 6px 16px rgba(245, 158, 11, 0.35)' : 'none',
            transform: canClaimChest ? 'scale(1.04)' : 'scale(1)',
            transition: 'all 0.2s',
          }}
        >
          <Gift size={20} color={canClaimChest ? '#f59e0b' : 'currentColor'} />
          <span>{chestClaimed ? '✓ Cofre Reclamado' : canClaimChest ? '¡Abrir Cofre! (+150 XP)' : 'Cofre (3/3 misiones)'}</span>
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: '8px', background: 'var(--bg-muted)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div style={{
          height: '100%',
          width: `${(completedCount / quests.length) * 100}%`,
          background: 'linear-gradient(90deg, var(--primary) 0%, #10b981 100%)',
          borderRadius: '999px',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Quests List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {quests.map((q) => {
          const isDone = q.completed;

          return (
            <div
              key={q.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                background: isDone ? 'var(--bg-base)' : 'var(--bg-surface)',
                border: isDone ? '1px solid var(--border)' : '1.5px solid var(--border-strong)',
                borderRadius: '18px',
                padding: '1rem',
                opacity: isDone ? 0.75 : 1,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '2rem', lineHeight: 1 }}>{q.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <strong style={{
                    fontSize: '0.95rem',
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--text-subtle)' : 'var(--text-primary)',
                  }}>
                    {q.title}
                  </strong>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#d97706',
                    background: '#fef3c7',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                  }}>
                    +{q.rewardXp} XP
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                  {q.description}
                </div>
              </div>

              {/* Action button */}
              <div>
                {isDone ? (
                  <CheckCircle2 size={24} color="var(--success)" />
                ) : q.type === 'interactive_quiz' ? (
                  <button
                    onClick={() => setShowQuiz(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.5rem 0.9rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <Play size={13} fill="#fff" /> Jugar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (q.link) navigate(q.link);
                      onCompleteQuest(q.id, q.rewardXp);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'var(--primary)',
                      color: 'var(--text-on-primary)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Ir <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showQuiz && (
        <MissionQuizModal
          onClose={() => setShowQuiz(false)}
          onComplete={(xpEarned) => {
            onCompleteQuest('quiz_challenge', xpEarned);
            setShowQuiz(false);
          }}
        />
      )}
    </div>
  );
}
