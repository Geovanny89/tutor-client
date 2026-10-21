import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, User, GraduationCap, Globe, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AcademyRegisterPage() {
  const [academyName, setAcademyName] = useState('');
  const [academySlug, setAcademySlug] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { registerAcademy, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!academyName || !academySlug || !name || !email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Basic slug validation
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(academySlug)) {
      toast.error('La URL de la academia solo puede contener letras minúsculas, números y guiones');
      return;
    }

    const res = await registerAcademy({
      academyName,
      academySlug,
      name,
      email,
      password,
    });

    if (res.success) {
      toast.success('¡Academia registrada con éxito! Bienvenido al panel de control 🎉');
      navigate('/professor');
    } else {
      toast.error(res.message || 'Error al registrar la academia');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'var(--bg-base)',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
      }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-purple-light) 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.25)',
            marginBottom: '0.75rem',
          }}>
            <GraduationCap size={28} color="#fff" />
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 0.4rem 0',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }}>
            Registra tu Academia
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.92rem', margin: 0 }}>
            Crea tu propio espacio educativo con IA para tus estudiantes
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Nombre de la Academia
              </label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={academyName}
                  onChange={(e) => setAcademyName(e.target.value)}
                  placeholder="Ej. English Pro"
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                URL / Slug
              </label>
              <div style={{ position: 'relative' }}>
                <Globe size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={academySlug}
                  onChange={(e) => setAcademySlug(e.target.value.toLowerCase())}
                  placeholder="ej-english-pro"
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Datos del Profesor / Administrador
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                  Tu Nombre Completo
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Prof. Juan Pérez"
                    required
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                  Correo Electrónico
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="profesor@correo.com"
                    required
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '12px',
                      padding: '0.75rem 2.75rem 0.75rem 2.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              background: 'var(--accent-purple)',
              color: '#fff',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.25)',
            }}
          >
            {loading ? 'Creando Academia...' : 'Registrar mi Academia'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-subtle)' }}>
          ¿Quieres una cuenta de estudiante?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
