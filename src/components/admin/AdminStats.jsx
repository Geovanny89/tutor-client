import React from 'react';
import {
  Users,
  BookOpen,
  Zap,
  Trophy,
  GraduationCap,
  Layers,
  Activity,
} from 'lucide-react';

const LEVEL_COLORS = {
  A1: 'var(--primary)', A2: 'var(--secondary)', B1: '#2563EB', B2: 'var(--accent-purple)', C1: '#DB2777', C2: 'var(--accent-gold-text)',
};

function MetricCard({ icon: Icon, label, value, sub, color = 'var(--primary)', bg = 'var(--primary-bg)' }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '18px',
      padding: '1.25rem',
      boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px', background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} color={color} />
        </div>
      </div>
      <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem', fontFamily: 'var(--font-display)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{sub}</div>}
    </div>
  );
}

export default function AdminStats({ stats, loading }) {
  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Cargando métricas de la plataforma...
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No se pudieron cargar las métricas.
      </div>
    );
  }

  const maxLevel = Math.max(1, ...stats.learning.level_distribution.map((l) => l.count));

  return (
    <div>
      {/* Metric cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <MetricCard
          icon={Users}
          label="Usuarios registrados"
          value={stats.users.total}
          sub={`${stats.users.active} activos · ${stats.users.new_this_week} nuevos esta semana`}
        />
        <MetricCard
          icon={GraduationCap}
          label="Estudiantes"
          value={stats.users.students}
          sub={`${stats.users.admins} administradores`}
          color="#2563EB"
          bg="#EFF6FF"
        />
        <MetricCard
          icon={Layers}
          label="Módulos"
          value={stats.content.modules}
          sub={`${stats.content.published_modules} publicados · ${stats.content.lessons} lecciones`}
          color="var(--accent-purple)"
          bg="#F5F3FF"
        />
        <MetricCard
          icon={Zap}
          label="Interacciones IA hoy"
          value={stats.ai.interactions_today}
          sub={`Límite ${stats.ai.daily_limit_per_student}/estudiante · ${stats.ai.total_sessions} sesiones`}
          color="var(--accent-gold-strong)"
          bg="var(--warning-bg)"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Level distribution */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.5rem',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={17} color="var(--primary)" /> Distribución por nivel CEFR
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {stats.learning.level_distribution.map(({ level, count }) => (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  width: '38px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-on-primary)',
                  background: LEVEL_COLORS[level] || 'var(--primary)',
                  padding: '0.15rem 0', borderRadius: '6px', textAlign: 'center',
                }}>
                  {level}
                </span>
                <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(count / maxLevel) * 100}%`,
                    background: LEVEL_COLORS[level] || 'var(--primary)',
                    height: '100%',
                    borderRadius: '999px',
                    transition: 'width 0.4s',
                  }} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', width: '24px', textAlign: 'right' }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Ítems completados en total: <strong style={{ color: 'var(--primary)' }}>{stats.learning.completed_items}</strong>
          </div>
        </div>

        {/* Top students */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.5rem',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={17} color="var(--accent-gold-strong)" /> Top estudiantes por XP
          </h3>
          {stats.top_students.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aún no hay estudiantes registrados.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {stats.top_students.map((student, i) => (
                <div key={student.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  background: 'var(--bg-base)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '0.6rem 0.85rem',
                }}>
                  <span style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', width: '18px' }}>#{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Nivel {student.current_level} · {student.streak_days} días de racha
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.88rem' }}>
                    {student.total_xp} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent registrations */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.5rem', marginTop: '1.5rem',
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={17} color="var(--primary-light)" /> Últimos registros
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stats.recent_users.map((u) => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '1rem', padding: '0.6rem 0.85rem', background: 'var(--bg-base)',
              border: '1px solid var(--border)', borderRadius: '12px', flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{u.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-hover)', background: 'var(--primary-bg)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                  {u.role === 'student' ? `Nivel ${u.current_level}` : u.role}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(u.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
