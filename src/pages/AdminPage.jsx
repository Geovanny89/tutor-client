import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  Building2,
  Users,
  BookOpen,
  Cpu,
  Plus,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [tenants, setTenants] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // New module modal state
  const [showNewModuleModal, setShowNewModuleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLevel, setNewLevel] = useState('A1');
  const [newOrder, setNewOrder] = useState(1);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [modRes] = await Promise.all([
        api.get('/modules'),
      ]);
      if (modRes.success && modRes.data) {
        setModules(modRes.data);
      }
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Ingresa un título para el módulo');
      return;
    }

    try {
      const res = await api.post('/modules', {
        title: newTitle,
        description: newDescription,
        level: newLevel,
        order_index: Number(newOrder),
      });

      if (res.success) {
        toast.success('¡Módulo creado exitosamente!');
        setShowNewModuleModal(false);
        setNewTitle('');
        setNewDescription('');
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Error al crear el módulo');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            background: 'rgba(255, 107, 157, 0.15)',
            color: '#FF6B9D',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            <ShieldCheck size={14} /> Panel Super Admin
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: 0,
            fontFamily: 'var(--font-display)',
          }}>
            Gestión Multi-Tenant y Contenido
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>
            Control global de inquilinos (tenants), alumnos, currículo CEFR y consumo de modelos de IA.
          </p>
        </div>

        <button
          onClick={() => setShowNewModuleModal(true)}
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            fontWeight: 700,
          }}
        >
          <Plus size={18} /> Crear Nuevo Módulo
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem' }}>Inquilinos (Tenants)</span>
            <Building2 size={20} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.5rem' }}>
            1
          </div>
          <div style={{ fontSize: '0.75rem', color: '#22D3A0', marginTop: '0.2rem' }}>
            Tenant Principal: KDice General
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem' }}>Módulos Activos</span>
            <BookOpen size={20} color="var(--primary-light)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.5rem' }}>
            {modules.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Niveles A1 a C2
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem' }}>Protección de Tokens IA</span>
            <Zap size={20} color="#FFD700" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFD700', marginTop: '0.5rem' }}>
            100% GRATIS
          </div>
          <div style={{ fontSize: '0.75rem', color: '#22D3A0', marginTop: '0.2rem' }}>
            Límite diario: 20 req/alumno
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem' }}>Proveedor de IA</span>
            <Cpu size={20} color="#FF5B7D" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '0.5rem' }}>
            Groq + Gemini
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Fallback inteligente + Caché
          </div>
        </div>
      </div>

      {/* Multi-Tenant System Information */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={20} color="var(--secondary)" /> Arquitectura Multi-Tenant
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1.25rem 0' }}>
          La plataforma está configurada de manera nativa para soportar múltiples instituciones o empresas independientes bajo la misma infraestructura. Cada inquilino cuenta con sus propios alumnos, reportes de uso y módulos personalizados si lo requiere.
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
              Tenant #1: KDice General Academy
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Subdominio: academy.kdice.com • Alumnos activos: 1
            </div>
          </div>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
            background: 'rgba(34, 211, 160, 0.15)',
            color: '#22D3A0',
            fontWeight: 700,
          }}>
            Activo
          </span>
        </div>
      </div>

      {/* Modules List Management */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2rem',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} color="var(--primary-light)" /> Módulos Registrados en el Sistema
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {modules.map((m) => (
            <div
              key={m.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: 'var(--primary)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                  }}>
                    {m.level}
                  </span>
                  <strong style={{ color: '#ffffff', fontSize: '1rem' }}>
                    {m.title}
                  </strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {m.description}
                </div>
              </div>

              <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>
                Orden: {m.order_index}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New Module Modal */}
      {showNewModuleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 100,
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem 0' }}>
              Crear Nuevo Módulo de Aprendizaje
            </h3>

            <form onSubmit={handleCreateModule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Título del Módulo
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. B2 - Professional Meetings & Business Pitch"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Descripción
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explica qué aprenderán en este módulo..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Nivel CEFR
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      color: '#ffffff',
                      outline: 'none',
                    }}
                  >
                    <option value="A1" style={{ background: '#12122a' }}>A1 - Principiante</option>
                    <option value="A2" style={{ background: '#12122a' }}>A2 - Básico</option>
                    <option value="B1" style={{ background: '#12122a' }}>B1 - Intermedio</option>
                    <option value="B2" style={{ background: '#12122a' }}>B2 - Intermedio Alto</option>
                    <option value="C1" style={{ background: '#12122a' }}>C1 - Avanzado</option>
                    <option value="C2" style={{ background: '#12122a' }}>C2 - Maestría</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Número de Orden
                  </label>
                  <input
                    type="number"
                    value={newOrder}
                    onChange={(e) => setNewOrder(e.target.value)}
                    min="1"
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      color: '#ffffff',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModuleModal(false)}
                  className="btn btn-ghost"
                  style={{ borderRadius: '12px', padding: '0.65rem 1.25rem' }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    borderRadius: '12px',
                    padding: '0.65rem 1.5rem',
                    background: 'var(--primary)',
                    fontWeight: 700,
                  }}
                >
                  Guardar Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
