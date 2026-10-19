import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, User, Target, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [targetLevel, setTargetLevel] = useState('B2');

  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const res = await register({
      name,
      email,
      password,
      target_level: targetLevel,
    });

    if (res.success) {
      toast.success('¡Cuenta creada con éxito! Bienvenido a bordo 🎉');
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Error al registrarte');
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
        maxWidth: '480px',
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
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
            marginBottom: '0.75rem',
          }}>
            <Sparkles size={28} color="var(--text-on-primary)" />
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 0.4rem 0',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }}>
            Crea tu Cuenta Gratuita
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.92rem', margin: 0 }}>
            Aprende inglés hablando con tutores de IA en los 5 Bloques (A1 → C2)
          </p>
        </div>

        {/* Free daily guarantee */}
        <div style={{
          background: 'var(--primary-bg)',
          border: '1px solid var(--primary-soft-2)',
          borderRadius: '14px',
          padding: '0.8rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.82rem',
          color: 'var(--primary-text)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600,
        }}>
          <CheckCircle2 size={16} color="var(--primary)" />
          <span>Acceso 100% gratuito con 50 interacciones diarias al Tutor de Voz de IA.</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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
                placeholder="Ej. Juan Pérez"
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
                placeholder="juan@correo.com"
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
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              ¿Cuál es tu nivel meta que deseas alcanzar?
            </label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-base)',
                border: '1px solid var(--border-strong)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontWeight: 600,
              }}
            >
              <option value="A2">A2 - Inglés Básico Cotidiano</option>
              <option value="B1">B1 - Conversación y Viajes</option>
              <option value="B2">B2 - Fluidez Profesional (Recomendado)</option>
              <option value="C1">C1 - Nivel Avanzado y Negocios</option>
              <option value="C2">C2 - Maestría Nativa Total</option>
            </select>
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
              background: 'var(--primary)',
              color: 'var(--text-on-primary)',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
            }}
          >
            {loading ? 'Creando tu cuenta...' : 'Comenzar a Aprender Ahora'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-subtle)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            Inicia Sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
