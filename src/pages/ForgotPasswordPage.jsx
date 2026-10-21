import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Ingresa tu correo electrónico');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'No se pudo procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={iconBadgeStyle}><KeyRound size={26} color="var(--text-on-primary)" /></div>
          <h1 style={titleStyle}>Recuperar contraseña</h1>
          <p style={subtitleStyle}>Te enviaremos un enlace para restablecer tu contraseña.</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle2 size={40} color="var(--success)" style={{ marginBottom: '0.6rem' }} />
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.25rem' }}>
              Si <strong>{email}</strong> está registrado, recibirás un enlace de recuperación en unos minutos.
            </p>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={loading} style={{ ...submitStyle, cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-subtle)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export const wrapStyle = {
  minHeight: 'calc(100vh - 60px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1rem',
  background: 'var(--bg-base)',
};

export const cardStyle = {
  maxWidth: '460px',
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '24px',
  padding: '2.5rem 2rem',
  boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
};

export const iconBadgeStyle = {
  width: '52px',
  height: '52px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.75rem',
};

export const titleStyle = {
  fontSize: '1.6rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  margin: '0 0 0.4rem',
  fontFamily: 'var(--font-display)',
  letterSpacing: '-0.02em',
};

export const subtitleStyle = { color: 'var(--text-subtle)', fontSize: '0.9rem', margin: 0 };

export const inputStyle = {
  width: '100%',
  background: 'var(--bg-base)',
  border: '1px solid var(--border-strong)',
  borderRadius: '12px',
  padding: '0.75rem 1rem 0.75rem 2.5rem',
  color: 'var(--text-primary)',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export const submitStyle = {
  padding: '0.85rem',
  borderRadius: '12px',
  fontWeight: 800,
  fontSize: '1rem',
  background: 'var(--primary)',
  color: 'var(--text-on-primary)',
  border: 'none',
};
