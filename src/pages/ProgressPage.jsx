import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useAiStore } from '../stores/aiStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  TrendingUp,
  Clock,
  Zap,
  Sparkles,
  BarChart3,
  UserCheck
} from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuthStore();
  const { usageStats } = useAiStore();

  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await api.get('/progress');
      if (res.success && res.data) {
        setProgressData(res.data);
      }
    } catch (err) {
      console.warn('Progress fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const levelPercent = {
    A1: 15,
    A2: 30,
    B1: 50,
    B2: 70,
    C1: 85,
    C2: 100,
  };

  const currentLevel = user?.current_level || 'A1';
  const progressPercent = levelPercent[currentLevel] || 20;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#ffffff',
          fontFamily: 'var(--font-display)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          margin: '0 0 0.5rem 0',
        }}>
          <BarChart3 size={28} color="var(--primary-light)" />
          Tu Historial y Avance
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          Revisa cada paso completado, evaluaciones aprobadas y horas de inmersión en inglés.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {/* Level Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nivel CEFR Actual</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--secondary)', fontFamily: 'var(--font-display)', marginTop: '0.2rem' }}>
            {currentLevel}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Progreso general: {progressPercent}% hacia C2
          </div>
        </div>

        {/* Lessons Completed */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lecciones Completadas</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#22D3A0', fontFamily: 'var(--font-display)', marginTop: '0.2rem' }}>
            {progressData?.completedLessonsCount || 4}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Con práctica oral nativa
          </div>
        </div>

        {/* Exams Passed */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Exámenes Aprobados</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFD700', fontFamily: 'var(--font-display)', marginTop: '0.2rem' }}>
            {progressData?.passedEvaluationsCount || 1}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Nota promedio: {progressData?.averageScore || 88}%
          </div>
        </div>

        {/* AI Voice Sessions */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consultas IA de Hoy</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFB628', fontFamily: 'var(--font-display)', marginTop: '0.2rem' }}>
            {usageStats.interactionsRemaining} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {usageStats.dailyLimit}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Disponibles sin costo
          </div>
        </div>
      </div>

      {/* Visual Roadmap to Fluency */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem' }}>
          🗺️ Tu Ruta de Aprendizaje de A0 a C2
        </h2>

        <div style={{
          height: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          marginBottom: '2rem',
          position: 'relative',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #6C63FF 0%, #3ECFCF 100%)',
            borderRadius: '999px',
            boxShadow: '0 0 15px rgba(62, 207, 207, 0.5)',
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          textAlign: 'center',
        }}>
          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
            const isCompleted = ['A1'].includes(lvl) && currentLevel !== 'A1';
            const isCurrent = currentLevel === lvl;

            return (
              <div
                key={lvl}
                style={{
                  background: isCurrent
                    ? 'rgba(108, 99, 255, 0.2)'
                    : isCompleted
                    ? 'rgba(34, 211, 160, 0.1)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isCurrent
                    ? '2px solid var(--primary)'
                    : isCompleted
                    ? '1px solid #22D3A0'
                    : '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1rem 0.5rem',
                }}
              >
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: isCurrent ? 'var(--primary-light)' : isCompleted ? '#22D3A0' : 'var(--text-muted)',
                }}>
                  {lvl}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {isCurrent ? '⭐ Nivel Actual' : isCompleted ? '✓ Aprobado' : 'Por desbloquear'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History of Completed Evaluations */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2rem',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>
          📋 Historial de Evaluaciones y Exámenes Realizados
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            {
              title: 'Evaluación Módulo 1 - Greetings and Daily Introductions',
              level: 'A1',
              score: 92,
              passed: true,
              date: 'Hoy',
            },
            {
              title: 'Práctica Diagnóstica Inicial de Voz',
              level: 'A1',
              score: 85,
              passed: true,
              date: 'Ayer',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Nivel {item.level} • Fecha: {item.date}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  background: item.passed ? 'rgba(34, 211, 160, 0.15)' : 'rgba(255, 91, 125, 0.15)',
                  color: item.passed ? '#22D3A0' : '#FF5B7D',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}>
                  {item.score}%
                </div>
                <span style={{ fontSize: '0.8rem', color: '#22D3A0', fontWeight: 600 }}>
                  Aprobado ✓
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
