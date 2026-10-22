import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import {
  School,
  GraduationCap,
  Mail,
  Lock,
  User,
  Globe,
  ArrowRight,
  Eye,
  EyeOff,
  Users,
  Cpu,
  BookOpen,
} from 'lucide-react';

export default function AcademyRegisterPage() {
  const [accountType, setAccountType] = useState('academy'); // 'academy' | 'independent'
  const [academyName, setAcademyName] = useState('');
  const [academySlug, setAcademySlug] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { registerAcademy, loading } = useAuthStore();
  const navigate = useNavigate();

  const generateSlug = (text) => {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
  };

  const handleNameChange = (val) => {
    setName(val);
    if (accountType === 'independent' && !academyName) {
      const autoSpace = `Clases de ${val || 'Profesor'}`;
      setAcademyName(autoSpace);
      setAcademySlug(generateSlug(autoSpace));
    }
  };

  const handleSpaceChange = (val) => {
    setAcademyName(val);
    if (!academySlug || academySlug === generateSlug(academyName)) {
      setAcademySlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalName = academyName.trim() || (accountType === 'independent' ? `Aula de ${name}` : 'Mi Academia');
    const finalSlug = academySlug.trim() || generateSlug(finalName);

    if (!name || !email || !password) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(finalSlug)) {
      toast.error('La URL solo puede contener letras minúsculas, números y guiones');
      return;
    }

    const res = await registerAcademy({
      academyName: finalName,
      academySlug: finalSlug,
      name,
      email,
      password,
      accountType,
    });

    if (res.success) {
      if (accountType === 'independent') {
        toast.success('¡Profesor registrado! Bienvenido a tu panel docente 🎉');
      } else {
        toast.success('¡Academia creada con éxito! Puedes tener hasta 5 profesores 🎉');
      }
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
      padding: '2.5rem 1rem',
      background: 'var(--bg-base)',
    }}>
      <div style={{
        maxWidth: '540px',
        width: '100%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
      }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: accountType === 'academy'
              ? 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
              : 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            marginBottom: '0.75rem',
            transition: 'all 0.3s ease',
          }}>
            {accountType === 'academy' ? (
              <School size={28} color="#fff" />
            ) : (
              <GraduationCap size={28} color="#fff" />
            )}
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 0.4rem 0',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }}>
            {accountType === 'academy' ? 'Registra tu Academia o Instituto' : 'Registro de Profesor Independiente'}
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.92rem', margin: 0 }}>
            {accountType === 'academy'
              ? 'Organización educativa con hasta 5 profesores y control total de contenido'
              : 'Enseña con tus temas propios y utiliza los superpoderes de IA pedagógica'}
          </p>
        </div>

        {/* Toggle between Academy and Independent Professor */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: 'var(--bg-base)',
          padding: '0.35rem',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          marginBottom: '1.4rem',
        }}>
          <button
            type="button"
            onClick={() => setAccountType('academy')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.65rem',
              borderRadius: '11px',
              border: 'none',
              background: accountType === 'academy' ? 'var(--bg-surface)' : 'transparent',
              color: accountType === 'academy' ? '#8B5CF6' : 'var(--text-subtle)',
              fontWeight: accountType === 'academy' ? 800 : 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: accountType === 'academy' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <School size={16} />
            <span>Academia (5 Profesores)</span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('independent')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.65rem',
              borderRadius: '11px',
              border: 'none',
              background: accountType === 'independent' ? 'var(--bg-surface)' : 'transparent',
              color: accountType === 'independent' ? '#0EA5E9' : 'var(--text-subtle)',
              fontWeight: accountType === 'independent' ? 800 : 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: accountType === 'independent' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <GraduationCap size={16} />
            <span>Profesor Independiente</span>
          </button>
        </div>

        {/* Highlight Banner */}
        {accountType === 'academy' ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(167, 139, 250, 0.14) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '14px',
            padding: '0.85rem 1rem',
            marginBottom: '1.4rem',
            fontSize: '0.84rem',
            color: 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#8B5CF6' }}>
              <Users size={17} />
              <span>Espacio para hasta 5 Profesores incluidos</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Cada profesor invitado tendrá su acceso propio con <strong>control total</strong> para subir módulos,
              crear lecciones 1-clic con IA y evaluar alumnos.
            </div>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(56, 189, 248, 0.14) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: '14px',
            padding: '0.85rem 1rem',
            marginBottom: '1.4rem',
            fontSize: '0.84rem',
            color: 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0EA5E9' }}>
              <Cpu size={17} />
              <span>Generadores Pedagógicos de IA</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Crea lecciones completas en 1 clic y obtén reportes de progreso de alumnos para enviar a los padres o para tus clases.
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {accountType === 'academy' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                  Nombre de la Academia
                </label>
                <div style={{ position: 'relative' }}>
                  <School size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={academyName}
                    onChange={(e) => handleSpaceChange(e.target.value)}
                    placeholder="Ej. English Pro"
                    required
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
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
                    onChange={(e) => setAcademySlug(generateSlug(e.target.value))}
                    placeholder="ej-english-pro"
                    required
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Nombre de tu Aula o Espacio
              </label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={academyName}
                  onChange={(e) => handleSpaceChange(e.target.value)}
                  placeholder="Ej. Clases de Inglés Prof. María"
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
              {accountType === 'academy' ? 'Nombre del Director / Profesor Principal' : 'Tu Nombre Completo'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.9rem',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              background: accountType === 'academy' ? '#8B5CF6' : '#0EA5E9',
              color: '#fff',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: accountType === 'academy'
                ? '0 4px 16px rgba(139, 92, 246, 0.35)'
                : '0 4px 16px rgba(14, 165, 233, 0.35)',
            }}
          >
            {loading ? 'Creando cuenta...' : (
              accountType === 'academy' ? 'Registrar mi Academia (5 Profesores)' : 'Crear Cuenta de Profesor'
            )} <ArrowRight size={18} />
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
