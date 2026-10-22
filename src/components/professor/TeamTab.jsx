import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Users,
  UserPlus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  GraduationCap,
  Mail,
  Lock,
  User,
  AlertCircle,
} from 'lucide-react';
import { input, primaryBtn, smallBtn, overlay, modal } from './constants';
import { EmptyState } from './ProfessorUI';

export default function TeamTab({ academyExists }) {
  const [team, setTeam] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    max_professors: 5,
    spots_left: 5,
    can_add: true,
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadTeam = useCallback(async () => {
    if (!academyExists) return;
    setLoading(true);
    try {
      const res = await api.get('/professor/team');
      if (res.success && res.data) {
        setTeam(res.data.professors || []);
        if (res.data.metrics) setMetrics(res.data.metrics);
      }
    } catch (err) {
      toast.error('No se pudo cargar el equipo de profesores');
    } finally {
      setLoading(false);
    }
  }, [academyExists]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const handleRemove = async (prof) => {
    if (prof.is_owner) {
      toast.error('No puedes eliminar al director / propietario de la academia');
      return;
    }
    const confirmed = window.confirm(`¿Estás seguro de que deseas revocar el acceso al profesor ${prof.name}?`);
    if (!confirmed) return;

    try {
      const res = await api.delete(`/professor/team/${prof.id}`);
      if (res.success) {
        toast.success('Profesor removido de la academia');
        loadTeam();
      }
    } catch (err) {
      toast.error(err.message || 'Error al remover profesor');
    }
  };

  if (!academyExists) {
    return <EmptyState text="Crea tu academia para gestionar tu equipo de profesores." />;
  }

  return (
    <div>
      {/* Header and Explanation */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.12) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: '18px',
        padding: '1.25rem 1.4rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <GraduationCap size={22} color="#8B5CF6" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Equipo de Profesores de la Academia
              </h2>
              <span style={{
                background: '#8B5CF6',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
              }}>
                {metrics.total} / {metrics.max_professors} Activos
              </span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '680px', lineHeight: 1.45 }}>
              Tu academia permite hasta <strong>5 profesores</strong>. Cada profesor que formes parte de tu academia tiene <strong>total control</strong> para subir sus materias, crear lecciones con IA (1-clic) y evaluar a los estudiantes.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            disabled={metrics.spots_left <= 0}
            style={{
              ...primaryBtn,
              background: metrics.spots_left > 0 ? '#8B5CF6' : 'var(--border-strong)',
              cursor: metrics.spots_left > 0 ? 'pointer' : 'not-allowed',
              opacity: metrics.spots_left > 0 ? 1 : 0.6,
            }}
          >
            <UserPlus size={18} />
            <span>Agregar Profesor ({metrics.spots_left} cupos libres)</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Profesores en la Academia</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {metrics.total} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {metrics.max_professors}</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {metrics.spots_left > 0 ? `${metrics.spots_left} vacantes disponibles` : 'Límite alcanzado'}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Control de Contenido</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={18} /> Total e Independiente
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Subir temas, lecciones y quizzes
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '1rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Herramientas de IA</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8B5CF6', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} /> Generador 1-Clic
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Disponible para todos los profesores
          </div>
        </div>
      </div>

      {/* Professor List */}
      {loading ? (
        <p style={{ color: 'var(--text-subtle)' }}>Cargando profesores...</p>
      ) : team.length === 0 ? (
        <EmptyState text="Aún no has agregado profesores a tu academia." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {team.map((prof, idx) => (
            <div
              key={prof.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: prof.is_owner
                      ? 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
                      : 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {prof.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                      {prof.name}
                    </span>
                    {prof.is_owner ? (
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: '#8B5CF6',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}>
                        <ShieldCheck size={12} /> Director / Dueño
                      </span>
                    ) : (
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: 'rgba(14, 165, 233, 0.15)',
                        color: '#0EA5E9',
                      }}>
                        Profesor #{idx + 1}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
                    {prof.email}
                  </div>
                </div>
              </div>

              {/* Status and permissions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-base)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                }}>
                  <BookOpen size={14} color="var(--primary)" />
                  <span>Control total para subir temas y lecciones</span>
                </div>

                {!prof.is_owner && (
                  <button
                    onClick={() => handleRemove(prof)}
                    title="Remover profesor de la academia"
                    style={{
                      ...smallBtn,
                      color: 'var(--error)',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Eliminar</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal to add professor */}
      {showAddModal && (
        <AddProfessorModal
          spotsLeft={metrics.spots_left}
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            loadTeam();
          }}
        />
      )}
    </div>
  );
}

function AddProfessorModal({ spotsLeft, onClose, onAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/professor/team', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.success) {
        toast.success('¡Profesor agregado exitosamente a la academia!');
        onAdded();
      }
    } catch (err) {
      toast.error(err.message || 'Error al agregar profesor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        style={{ ...modal, maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <UserPlus size={22} color="#8B5CF6" />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
            Agregar Profesor a la Academia
          </h3>
        </div>
        <p style={{ margin: '0 0 1.25rem', color: 'var(--text-subtle)', fontSize: '0.86rem', lineHeight: 1.45 }}>
          Este profesor formará parte de tu academia con <strong>total control</strong> para subir sus temas, crear lecciones y evaluar estudiantes. Quedan <strong>{spotsLeft}</strong> cupos disponibles.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Nombre Completo del Profesor
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Prof. Andrea Salazar"
                required
                style={{ ...input, paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Correo Electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="andrea@correo.com"
                required
                style={{ ...input, paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Contraseña de Acceso Temporal
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                style={{ ...input, paddingLeft: '2.4rem' }}
              />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              El profesor usará este correo y contraseña para ingresar a la plataforma.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...smallBtn, flex: 1, padding: '0.75rem', justifyContent: 'center' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...primaryBtn,
                flex: 2,
                justifyContent: 'center',
                background: '#8B5CF6',
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? 'Agregando...' : 'Confirmar y Agregar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
