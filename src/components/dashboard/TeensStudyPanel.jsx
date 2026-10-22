import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleCard from './ModuleCard';
import { Flame, Star, Zap, Trophy, Target, Shield, Award, Sparkles, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import DailyQuestsCard from '../teens/DailyQuestsCard';
import TeensGlobalMissions from '../teens/TeensGlobalMissions';
import { TEEN_RANKS, getRankByXp, INITIAL_DAILY_QUESTS } from '../../data/teensMissions';
import { DEFAULT_TEEN_STUDY_MODULES } from '../../data/teensMissionsConstants';
import { kidAudio } from '../../utils/kidAudio';

export default function TeensStudyPanel({ user, usageStats, modules, loading }) {
  const navigate = useNavigate();

  // Local XP and Quests state
  const todayKey = new Date().toISOString().split('T')[0];
  const storageKey = `kdice_teens_data_${todayKey}`;

  const [teenData, setTeenData] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      bonusXp: 0,
      quests: INITIAL_DAILY_QUESTS.map((q) => ({ ...q, completed: false })),
      chestClaimed: false,
    };
  });

  // Calculate total XP (user base + bonus earned today)
  const totalXp = (user?.total_xp || 0) + (teenData.bonusXp || 0);
  const currentRank = getRankByXp(totalXp);
  const nextRank = TEEN_RANKS[TEEN_RANKS.indexOf(currentRank) + 1] || currentRank;
  const xpInTier = totalXp - currentRank.minXp;
  const tierRange = (currentRank.maxXp - currentRank.minXp) || 500;
  const progressPercent = Math.min(100, Math.round((xpInTier / tierRange) * 100));

  const streak = user?.streak_days || 1;
  const availableModules = (modules && modules.length > 0) ? modules : DEFAULT_TEEN_STUDY_MODULES;
  const completedModules = availableModules.filter((m) => m.evaluation_status === 'passed').length;

  const saveTeenData = (newData) => {
    setTeenData(newData);
    localStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const handleCompleteQuest = (questId, rewardXp) => {
    const updatedQuests = teenData.quests.map((q) =>
      q.id === questId ? { ...q, completed: true } : q
    );
    const updatedBonus = (teenData.bonusXp || 0) + rewardXp;
    kidAudio.playSuccess();
    saveTeenData({
      ...teenData,
      quests: updatedQuests,
      bonusXp: updatedBonus,
    });
  };

  const handleClaimChest = (bonusReward) => {
    kidAudio.playVictory();
    saveTeenData({
      ...teenData,
      chestClaimed: true,
      bonusXp: (teenData.bonusXp || 0) + bonusReward,
    });
  };

  // Filter modules
  const [filter, setFilter] = useState('all'); // 'all' | 'in_progress' | 'passed'
  const filteredModules = availableModules.filter((m) => {
    if (filter === 'passed') return m.evaluation_status === 'passed';
    if (filter === 'in_progress') return m.evaluation_status !== 'passed';
    return true;
  });

  // Pestaña principal
  const [mainTab, setMainTab] = useState('campaigns'); // 'campaigns' | 'quests' | 'global'

  return (
    <div style={{ color: 'var(--text-primary)', maxWidth: '1080px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Hero Gamificado con Rango RPG */}
      <div style={{
        background: 'var(--bg-surface)',
        border: `2px solid ${currentRank.color}44`,
        borderRadius: '28px',
        padding: '1.8rem 1.6rem',
        marginBottom: '2rem',
        boxShadow: `0 12px 30px -8px ${currentRank.color}22`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
        }}>
          <div>
            {/* Rank badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: currentRank.color,
              background: currentRank.bg,
              border: `1.5px solid ${currentRank.color}66`,
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              marginBottom: '0.75rem',
            }}>
              <span style={{ fontSize: '1.2rem' }}>{currentRank.badge}</span>
              <span>Rango: {currentRank.title}</span>
            </div>

            <h1 style={{
              fontSize: '2.1rem',
              fontWeight: 900,
              margin: 0,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
            }}>
              ¡Zona de Misiones, {user?.name?.split(' ')[0] || 'Aventurero'}! ⚔️
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.4rem 0 0', fontSize: '1rem', fontWeight: 600 }}>
              Completa misiones diarias, vence jefes de módulo y conviértete en Maestro.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <StatPill
              icon={<Award size={18} color={currentRank.color} />}
              value={currentRank.tier}
              label="Rango"
            />
            <StatPill
              icon={<Flame size={18} color="#f97316" />}
              value={`${streak} días`}
              label="Racha"
            />
            <StatPill
              icon={<Zap size={18} fill="#f59e0b" color="#f59e0b" />}
              value={`${usageStats?.interactionsRemaining ?? 20}`}
              label="Tokens IA"
            />
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div style={{ marginTop: '1.6rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={16} fill={currentRank.color} color={currentRank.color} />
              <span>{totalXp} XP Totales</span>
            </span>
            <span>
              {nextRank ? `Próximo rango: ${nextRank.title} (${currentRank.maxXp} XP)` : '¡Rango Máximo!'}
            </span>
          </div>

          <div style={{ height: '14px', background: 'var(--bg-muted)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${currentRank.color} 0%, #10b981 100%)`,
              borderRadius: '999px',
              transition: 'width 0.4s ease',
              boxShadow: `0 0 10px ${currentRank.color}88`,
            }} />
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '1.75rem',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '0.4rem', flexWrap: 'wrap',
      }}>
        {[
          { id: 'global', label: '🌍 Misiones Globales', badge: 'FREE' },
          { id: 'quests', label: '🎯 Misiones Diarias' },
          { id: 'campaigns', label: '🗺️ Campaña' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMainTab(tab.id)}
            style={{
              flex: 1, minWidth: '120px', padding: '0.6rem 1rem',
              borderRadius: '12px', border: 'none',
              background: mainTab === tab.id ? 'var(--primary)' : 'transparent',
              color: mainTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.4rem',
            }}
          >
            {tab.label}
            {tab.badge && mainTab !== tab.id && (
              <span style={{
                background: '#10b981', color: '#fff',
                fontSize: '0.65rem', fontWeight: 900, padding: '0.1rem 0.45rem',
                borderRadius: '999px', letterSpacing: '0.04em',
              }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Misiones Globales */}
      {mainTab === 'global' && <TeensGlobalMissions />}

      {/* Tab: Misiones Diarias */}
      {mainTab === 'quests' && (
        <DailyQuestsCard
          quests={teenData.quests}
          onCompleteQuest={handleCompleteQuest}
          onClaimChest={handleClaimChest}
          chestClaimed={teenData.chestClaimed}
        />
      )}

      {/* Tab: Misiones de Campaña (Módulos de Estudio) */}
      {/* Tab: Misiones de Campaña (Módulos de Estudio) */}
      {mainTab === 'campaigns' && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.2rem', fontFamily: 'var(--font-display)' }}>
                🗺️ Misiones de Campaña ({availableModules.length})
              </h2>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                {completedModules} misiones conquistadas
              </span>
            </div>

            {/* Module Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '0.3rem',
            }}>
              {[
                { id: 'all', label: 'Todas' },
                { id: 'in_progress', label: 'Por completar' },
                { id: 'passed', label: 'Conquistadas 🏆' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: filter === tab.id ? 'var(--primary)' : 'transparent',
                    color: filter === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              color: 'var(--text-subtle)',
              background: 'var(--bg-surface)',
              borderRadius: '20px',
              border: '1px solid var(--border)',
            }}>
              ⏳ Cargando mapa de misiones...
            </div>
          ) : filteredModules.length === 0 ? (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px dashed var(--border-strong)',
              borderRadius: '20px',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'var(--text-subtle)',
            }}>
              No hay misiones en esta categoría. ¡Sigue explorando! 🎮
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))',
              gap: '1.25rem',
            }}>
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onStudyLesson={(modId) => {
                    handleCompleteQuest('module_quest', 100);
                    navigate(`/modules/${modId}`);
                  }}
                  onTakeExam={(modId) => navigate(`/evaluations/${modId}`)}
                  onPracticeTutor={() => {
                    handleCompleteQuest('tutor_chat', 50);
                    navigate('/tutor');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatPill({ icon, value, label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      background: 'var(--bg-base)',
      border: '1.5px solid var(--border)',
      borderRadius: '16px',
      padding: '0.6rem 0.95rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    }}>
      {icon}
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>{value}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      </div>
    </div>
  );
}
