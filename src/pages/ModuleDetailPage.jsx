import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  Mic
} from 'lucide-react';

export default function ModuleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModule();
  }, [id]);

  const fetchModule = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/modules/${id}`);
      if (res.success && res.data) {
        setModule(res.data);
      }
    } catch (err) {
      toast.error('No se pudo cargar el módulo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#64748B' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        Cargando módulo y lecciones...
      </div>
    );
  }

  if (!module) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ color: '#0F172A' }}>Módulo no encontrado</h2>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            background: '#059669',
            color: '#FFFFFF',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Volver a Módulos
        </Link>
      </div>
    );
  }

  const lessons = module.Lessons || module.lessons || [];

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '2rem 1.5rem', color: '#0F172A' }}>
      
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'transparent',
          border: 'none',
          color: '#059669',
          cursor: 'pointer',
          fontSize: '0.92rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} /> Volver a los Módulos
      </button>

      {/* Module Header Card */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '24px',
        padding: '2.25rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#FFFFFF',
            background: '#059669',
            padding: '0.25rem 0.65rem',
            borderRadius: '6px',
          }}>
            Nivel {module.level}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 700, background: '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
            Módulo {module.order_index}
          </span>
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0F172A',
          fontFamily: 'var(--font-display)',
          margin: '0 0 0.75rem 0',
          letterSpacing: '-0.02em',
        }}>
          {module.name || module.title}
        </h1>

        <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: '1.6', margin: 0 }}>
          {module.description}
        </p>

        {/* CTA to Module Exam */}
        <div style={{
          marginTop: '1.75rem',
          padding: '1.25rem 1.5rem',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div>
            <strong style={{ color: '#92400E', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Award size={19} color="#D97706" /> Examen Evaluativo del Módulo
            </strong>
            <span style={{ fontSize: '0.85rem', color: '#78350F', display: 'block', marginTop: '0.25rem' }}>
              Supera este examen con un 70% o más para certificar este módulo y acumular XP.
            </span>
          </div>

          <button
            onClick={() => navigate(`/evaluations/${module.id}`)}
            style={{
              background: '#D97706',
              color: '#FFFFFF',
              fontWeight: 800,
              padding: '0.7rem 1.4rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.92rem',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)',
            }}
          >
            Tomar Examen Ahora
          </button>
        </div>
      </div>

      {/* Lessons List */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.1rem', fontFamily: 'var(--font-display)' }}>
          Lecciones del Módulo ({lessons.length})
        </h2>

        {lessons.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px dashed #CBD5E1',
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
            color: '#64748B',
          }}>
            No hay lecciones registradas aún en este módulo.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/lessons/${lesson.id}`)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(5, 150, 105, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.03)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#ECFDF5',
                    color: '#059669',
                    border: '1px solid #A7F3D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}>
                    {lesson.order_index || idx + 1}
                  </div>

                  <div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: '0 0 0.25rem 0',
                    }}>
                      {lesson.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.82rem', color: '#64748B' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} color="#059669" /> {lesson.duration_minutes || 10} min
                      </span>
                      <span>•</span>
                      <span style={{ color: '#047857', fontWeight: 600 }}>Práctica de Voz & Pronunciación</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669' }}>
                  <PlayCircle size={24} />
                  <ChevronRight size={18} color="#94A3B8" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
