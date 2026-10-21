import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { wrapStyle, cardStyle, iconBadgeStyle, titleStyle, subtitleStyle, inputStyle, submitStyle } from './ForgotPasswordPage';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('El enlace de recuperación no es válido');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, new_password: password });
      toast.success('Contraseña restablecida con éxito 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={iconBadgeStyle}><ShieldCheck size={26} color="var(--text-on-primary)" /></div>
          <h1 style={titleStyle}>Nueva contraseña</h1>
          <p style={subtitleStyle}>Crea una contraseña segura para tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              required
              style={{ ...inputStyle, paddingRight: '2.75rem' }}
            />
            <button type="button" onClick={() => setShow((v) => !v)} style={eyeBtnStyle} aria-label="Mostrar contraseña">
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmar contraseña"
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={{ ...submitStyle, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Guardando...' : 'Restablecer contraseña'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

const eyeBtnStyle = {
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
};
