import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  GraduationCap,
  School,
  Globe,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Users,
  Cpu,
  BookOpen,
} from 'lucide-react';

export default function RegisterPage() {
  // Account role: 'student' | 'independent' | 'academy'
  const [accountType, setAccountType] = useState('student');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student fields
  const [targetLevel, setTargetLevel] = useState('B2');
  const [ageRange, setAgeRange] = useState('adults');

  // Independent / Academy fields
  const [academyName, setAcademyName] = useState('');
  const [academySlug, setAcademySlug] = useState('');

  const { register, registerAcademy, loading } = useAuthStore();
  const navigate = useNavigate();

  // Auto-generate slug when academy or teacher space name changes
  const handleNameOrSpaceChange = (val, isSpace = false) => {
    if (isSpace) {
      setAcademyName(val);
      if (!academySlug || academySlug === generateSlug(academyName)) {
        setAcademySlug(generateSlug(val));
      }
    } else {
      setName(val);
      if (accountType === 'independent' && !academyName) {
        const autoName = `Clases de ${val || 'Profesor'}`;
        setAcademyName(autoName);
        setAcademySlug(generateSlug(autoName));
      }
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (accountType === 'student') {
      const res = await register({
        name,
        email,
        password,
        target_level: targetLevel,
        age_range: ageRange,
      });

      if (res.success) {
        toast.success('¡Cuenta creada con éxito! Bienvenido a bordo 🎉');
        navigate('/dashboard');
      } else {
        toast.error(res.message || 'Error al registrarte');
      }
    } else {
      // Independent professor or Academy
      const spaceName = academyName.trim() || (accountType === 'independent' ? `Aula de ${name}` : 'Mi Academia');
      const spaceSlug = academySlug.trim() || generateSlug(spaceName);

      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(spaceSlug)) {
        toast.error('La URL (slug) solo puede contener letras minúsculas, números y guiones');
        return;
      }

      const res = await registerAcademy({
        academyName: spaceName,
        academySlug: spaceSlug,
        name,
        email,
        password,
        accountType, // 'independent' or 'academy'
      });

      if (res.success) {
        if (accountType === 'independent') {
          toast.success('¡Cuenta de profesor independiente creada! Bienvenido a tu panel 🎉');
        } else {
          toast.success('¡Academia creada con éxito! Tu equipo tiene hasta 5 profesores 🎉');
        }
        navigate('/professor');
      } else {
        toast.error(res.message || 'Error al crear la cuenta');
      }
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
        maxWidth: '560px',
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
              : accountType === 'independent'
              ? 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)'
              : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            marginBottom: '0.75rem',
            transition: 'all 0.3s ease',
          }}>
            {accountType === 'academy' ? (
              <School size={28} color="#fff" />
            ) : accountType === 'independent' ? (
              <GraduationCap size={28} color="#fff" />
            ) : (
              <Sparkles size={28} color="var(--text-on-primary)" />
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
            {accountType === 'student' && 'Crea tu Cuenta de Estudiante'}
            {accountType === 'independent' && 'Registro de Profesor Independiente'}
            {accountType === 'academy' && 'Registra tu Academia o Instituto'}
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.92rem', margin: 0 }}>
            {accountType === 'student' && 'Aprende inglés hablando con tutores de IA en los 5 Bloques (A1 → C2)'}
            {accountType === 'independent' && 'Sube tus temas, genera lecciones 1-clic con IA y evalúa a tus alumnos'}
            {accountType === 'academy' && 'Espacio institucional con hasta 5 profesores y control total de contenido'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.45rem',
          background: 'var(--bg-base)',
          padding: '0.35rem',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          marginBottom: '1.5rem',
        }}>
          {[
            { id: 'student', label: 'Estudiante', icon: Sparkles, color: 'var(--primary)' },
            { id: 'independent', label: 'Profesor', icon: GraduationCap, color: '#0EA5E9' },
            { id: 'academy', label: 'Academia', icon: School, color: '#8B5CF6' },
          ].map((item) => {
            const active = accountType === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAccountType(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: active ? 'var(--bg-surface)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-subtle)',
                  fontWeight: active ? 800 : 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} color={active ? item.color : 'currentColor'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feature highlight banner according to role */}
        {accountType === 'academy' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(167, 139, 250, 0.14) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '14px',
            padding: '0.9rem 1rem',
            marginBottom: '1.4rem',
            fontSize: '0.84rem',
            color: 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#8B5CF6' }}>
              <Users size={18} />
              <span>Capacidad para hasta 5 Profesores incluidos</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Cada uno de los 5 profesores que invites tendrá <strong>control total</strong> para subir sus propios módulos,
              generar lecciones con IA (1-clic) y evaluar a los estudiantes de la academia.
            </div>
          </div>
        )}

        {accountType === 'independent' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(56, 189, 248, 0.14) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: '14px',
            padding: '0.9rem 1rem',
            marginBottom: '1.4rem',
            fontSize: '0.84rem',
            color: 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0EA5E9' }}>
              <Cpu size={18} />
              <span>Superpoderes de IA para Profesores Independientes</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Genera lecciones completas en 1-clic con IA (objetivo, vocabulario, quiz y retos de voz), sube tus materias y
              obtén reportes pedagógicos automáticos para padres y alumnos.
            </div>
          </div>
        )}

        {accountType === 'student' && (
          <div style={{
            background: 'var(--primary-bg)',
            border: '1px solid var(--primary-soft-2)',
            borderRadius: '14px',
            padding: '0.8rem 1rem',
            marginBottom: '1.4rem',
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
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Academy specific: Name and Slug */}
          {accountType === 'academy' && (
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
                    onChange={(e) => handleNameOrSpaceChange(e.target.value, true)}
                    placeholder="Ej. Oxford Institute"
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
                  URL de la Academia
                </label>
                <div style={{ position: 'relative' }}>
                  <Globe size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={academySlug}
                    onChange={(e) => setAcademySlug(generateSlug(e.target.value))}
                    placeholder="oxford-institute"
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
          )}

          {/* Independent Teacher specific: Classroom / Space Name */}
          {accountType === 'independent' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Nombre de tu Aula o Espacio Docente
              </label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={academyName}
                  onChange={(e) => handleNameOrSpaceChange(e.target.value, true)}
                  placeholder="Ej. Clases de Inglés Prof. Carlos"
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
              {accountType === 'student' && 'Tu Nombre Completo'}
              {accountType === 'independent' && 'Nombre del Profesor'}
              {accountType === 'academy' && 'Nombre del Director / Profesor Principal'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameOrSpaceChange(e.target.value, false)}
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
                placeholder={accountType === 'student' ? 'juan@correo.com' : 'profesor@instituto.com'}
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

          {/* Student specific fields */}
          {accountType === 'student' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                  ¿Qué grupo de edad eres?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  {[
                    { value: 'kids', label: 'Niños', range: '3-7 años', emoji: '🧸' },
                    { value: 'teens', label: 'Adolescentes', range: '8-16 años', emoji: '🎮' },
                    { value: 'adults', label: 'Adultos', range: '17+ años', emoji: '💼' },
                  ].map((o) => {
                    const active = ageRange === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setAgeRange(o.value)}
                        style={{
                          padding: '0.7rem 0.4rem',
                          borderRadius: '12px',
                          border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border-strong)'}`,
                          background: active ? 'var(--primary-bg)' : 'var(--bg-base)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.15rem',
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{o.emoji}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: active ? 'var(--primary)' : 'var(--text-secondary)' }}>{o.label}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{o.range}</span>
                      </button>
                    );
                  })}
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
            </>
          )}

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
              background: accountType === 'academy'
                ? '#8B5CF6'
                : accountType === 'independent'
                ? '#0EA5E9'
                : 'var(--primary)',
              color: '#fff',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: accountType === 'academy'
                ? '0 4px 16px rgba(139, 92, 246, 0.35)'
                : accountType === 'independent'
                ? '0 4px 16px rgba(14, 165, 233, 0.35)'
                : '0 4px 14px rgba(5, 150, 105, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Creando cuenta...' : (
              accountType === 'student'
                ? 'Comenzar a Aprender Ahora'
                : accountType === 'independent'
                ? 'Crear Cuenta de Profesor'
                : 'Crear Academia (5 Profesores)'
            )} <ArrowRight size={18} />
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
