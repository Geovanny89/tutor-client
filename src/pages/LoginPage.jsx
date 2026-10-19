import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      toast.error('Por favor ingresa tu correo y contraseña');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      toast.success('¡Bienvenido de vuelta!');
      // Admins go straight to their management panel
      const role = useAuthStore.getState().user?.role;
      navigate(role === 'super_admin' || role === 'tenant_admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(res.message || 'Credenciales incorrectas');
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
        maxWidth: '440px',
        width: '100%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
      }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
            marginBottom: '1rem',
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
            Iniciar Sesión
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.92rem', margin: 0 }}>
            Ingresa a tu cuenta de KDice English
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                placeholder="ejemplo@correo.com"
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
                placeholder="••••••••"
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
            {loading ? 'Ingresando...' : 'Iniciar Sesión'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-subtle)' }}>
          ¿No tienes una cuenta aún?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            Regístrate Gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
