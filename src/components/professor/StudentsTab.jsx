import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Lock, Unlock } from 'lucide-react';
import { input, smallBtn, primaryBtn, overlay, modal } from './constants';
import { EmptyState } from './ProfessorUI';

export default function StudentsTab({ academyExists }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  const load = useCallback(async () => {
    if (!academyExists) return;
    setLoading(true);
    try {
      const res = await api.get('/professor/students', { params: { search, status: filter } });
      if (res.success) setStudents(res.data.students || []);
    } catch (err) {
      toast.error('No se pudieron cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  }, [academyExists, search, filter]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (s) => {
    try {
      const res = await api.put(`/professor/students/${s.id}/status`, { is_active: !s.is_active });
      if (res.success) {
        toast.success(s.is_active ? 'Estudiante bloqueado' : 'Estudiante desbloqueado');
        load();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar el estado');
    }
  };

  const openDetail = async (s) => {
    try {
      const res = await api.get(`/professor/students/${s.id}`);
      if (res.success) setDetail(res.data);
    } catch (err) {
      toast.error('No se pudo cargar el detalle');
    }
  };

  if (!academyExists) return <EmptyState text="Crea tu academia para gestionar estudiantes." />;

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          style={{ ...input, maxWidth: '320px' }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ ...input, maxWidth: '180px' }}
        >
          <option value="">Todos</option>
          <option value="active">Activos</option>
          <option value="blocked">Bloqueados</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-subtle)' }}>Cargando...</p>
      ) : students.length === 0 ? (
        <EmptyState text="Aún no hay estudiantes inscritos en tu academia." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {students.map((s) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  flexShrink: 0,
                }}
              >
                {s.name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{s.email}</div>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {s.completed_items ?? 0}
                </div>
                completados
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {s.ai_today ?? 0}
                </div>
                IA hoy
              </div>
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: s.is_active ? 'var(--success-bg)' : 'var(--error-bg)',
                  color: s.is_active ? 'var(--success)' : 'var(--error)',
                }}
              >
                {s.is_active ? 'Activo' : 'Bloqueado'}
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => openDetail(s)} style={smallBtn}>
                  Ver progreso
                </button>
                <button
                  onClick={() => toggleStatus(s)}
                  style={{ ...smallBtn, color: s.is_active ? 'var(--error)' : 'var(--success)' }}
                >
                  {s.is_active ? <><Lock size={14} /> Bloquear</> : <><Unlock size={14} /> Desbloquear</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {detail && <StudentDetailModal detail={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

export function StudentDetailModal({ detail, onClose }) {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...modal, maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 0.25rem' }}>{detail.student?.name}</h3>
        <p style={{ margin: '0 0 1rem', color: 'var(--text-subtle)', fontSize: '0.88rem' }}>
          {detail.student?.email}
        </p>

        <strong style={{ fontSize: '0.9rem' }}>Progreso reciente</strong>
        <div
          style={{
            maxHeight: '320px',
            overflowY: 'auto',
            marginTop: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}
        >
          {detail.progress?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Sin actividad registrada.</p>
          ) : (
            detail.progress.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--bg-base)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.module || '—'} · {p.type}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: p.status === 'completed' ? 'var(--success)' : 'var(--text-subtle)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.status === 'completed' ? `✓ ${p.score ?? ''}` : p.status}
                </span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          style={{ ...primaryBtn, marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
