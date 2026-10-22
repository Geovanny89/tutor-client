import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import {
  Sparkles, Users, BookOpen, GraduationCap,
  ArrowRight, Lock, Mail, User, Eye, EyeOff,
} from 'lucide-react';

const AGE_OPTIONS = [
  { value: 'kids',   label: 'NiÃ±os',        range: '3 a 7 aÃ±os',    emoji: 'ðŸ§¸' },
  { value: 'teens',  label: 'Adolescentes', range: '8 a 16 aÃ±os',   emoji: 'ðŸŽ®' },
  { value: 'adults', label: 'Adultos',       range: '17 aÃ±os o mÃ¡s', emoji: 'ðŸ’¼' },
];

export default function AcademyPublicPage() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const { register, isAuthenticated, loading } = useAuthStore();

  const [academy,    setAcademy]    = useState(null);
  const [stats,      setStats]      = useState(null);
  const [professors, setProfessors] = useState([]);
  const [notFound,   setNotFound]   = useState(false);
  const [fetching,   setFetching]   = useState(true);

  const [form, setForm] = useState({ name: '', email: '', password: '', age_range: '', professor_id: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const load = async () => {
      setFetching(true);
      try {
        const res = await api.get(`/academies/${slug}`);
        if (res.success && res.data) {
          setAcademy(res.data.academy);
          setStats(res.data.stats);
          setProfessors(res.data.professors || []);
          const enabled = res.data.academy.enabled_age_ranges || ['kids', 'teens', 'adults'];
          setForm((f) => ({ ...f, age_range: enabled.length === 1 ? enabled[0] : '' }));
        }
      } catch {
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Completa todos los campos'); return; }
    if (!form.age_range) { toast.error('Selecciona tu grupo de edad'); return; }
    if (professors.length > 1 && !form.professor_id) {
      toast.error('Selecciona el profesor con quien quieres estudiar');
      return;
    }
    if (form.password.length < 6) { toast.error('La contraseÃ±a debe tener al menos 6 caracteres'); return; }

    const res = await register({ ...form, tenant_slug: slug, professor_id: form.professor_id || null });
    if (res.success) {
      toast.success('Â¡InscripciÃ³n exitosa! Bienvenido ðŸŽ‰');
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'No se pudo completar la inscripciÃ³n');
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-subtle)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>â³</div>
        Cargando academia...
      </div>
    );
  }

  if (notFound || !academy) {
    return (
      <div style={{ maxWidth: '560px', margin: '4rem auto', textAlign: 'center', padding: '2.5rem', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border)' }}>
        <h2 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Academia no encontrada</h2>
        <p style={{ color: 'var(--text-subtle)' }}>El enlace que abriste no corresponde a ninguna academia activa.</p>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Ir a KDice English</Link>
      </div>
    );
  }

  const brand   = academy.primary_color || 'var(--primary)';
  const enabled = academy.enabled_age_ranges || ['kids', 'teens', 'adults'];
  const options = AGE_OPTIONS.filter((o) => enabled.includes(o.value));
  const closed  = academy.is_public_page_active === false;
  const showProfPicker = professors.length > 1;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: 'calc(100vh - 60px)', paddingBottom: '3rem' }}>

      {/* â”€â”€ Hero â”€â”€ */}
      <div style={{ background: `linear-gradient(135deg, ${brand} 0%, rgba(0,0,0,0.35) 160%)`, color: '#fff', padding: '3rem 1.5rem 3.25rem', textAlign: 'center' }}>
        {academy.logo_url ? (
          <img src={academy.logo_url} alt={academy.name} style={{ width: '76px', height: '76px', borderRadius: '20px', objectFit: 'cover', marginBottom: '0.85rem', border: '3px solid rgba(255,255,255,0.35)' }} />
        ) : (
          <div style={{ width: '76px', height: '76px', borderRadius: '20px', background: 'rgba(255,255,255,0.18)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem', border: '1px solid rgba(255,255,255,0.3)' }}>
            <Sparkles size={36} />
          </div>
        )}
        <h1 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          {academy.name}
        </h1>
        {academy.description && (
          <p style={{ margin: '0 auto', maxWidth: '620px', opacity: 0.92, fontSize: '1rem', lineHeight: 1.6 }}>{academy.description}</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <Stat icon={Users}         label="Estudiantes"       value={stats?.students ?? 0} />
          <Stat icon={BookOpen}      label="Lecciones propias" value={stats?.custom_lessons ?? 0} />
          <Stat icon={GraduationCap} label="Profesores"        value={professors.length} />
        </div>
      </div>

      {/* â”€â”€ Card â”€â”€ */}
      <div style={{ maxWidth: '520px', margin: '-2rem auto 0', padding: '0 1rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '22px', padding: '2rem 1.75rem', boxShadow: '0 12px 32px -8px rgba(15,23,42,0.12)' }}>
          {closed ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <h3 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Inscripciones cerradas</h3>
              <p style={{ color: 'var(--text-subtle)', margin: 0 }}>Esta academia no estÃ¡ aceptando nuevos estudiantes por ahora.</p>
            </div>
          ) : (
            <>
              <h3 style={{ margin: '0 0 0.35rem', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800 }}>InscrÃ­bete gratis</h3>
              <p style={{ margin: '0 0 1.35rem', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>Crea tu cuenta y empieza a aprender con el tutor de IA.</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <Field icon={User}>
                  <input type="text" placeholder="Tu nombre completo" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                </Field>

                <Field icon={Mail}>
                  <input type="email" placeholder="tucorreo@ejemplo.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                </Field>

                <Field icon={Lock} right={
                  <button type="button" onClick={() => setShowPassword((v) => !v)} style={eyeBtnStyle} aria-label="Mostrar contraseÃ±a">
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }>
                  <input type={showPassword ? 'text' : 'password'} placeholder="ContraseÃ±a (mÃ­nimo 6 caracteres)"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '2.75rem' }} />
                </Field>

                {/* Age range */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Â¿Para quiÃ©n es la cuenta?
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: '0.6rem' }}>
                    {options.map((o) => {
                      const active = form.age_range === o.value;
                      return (
                        <button key={o.value} type="button" onClick={() => setForm({ ...form, age_range: o.value })}
                          style={{ padding: '0.7rem 0.4rem', borderRadius: '12px', border: `1.5px solid ${active ? brand : 'var(--border-strong)'}`, background: active ? `${brand}18` : 'var(--bg-base)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>{o.emoji}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: active ? brand : 'var(--text-secondary)' }}>{o.label}</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{o.range}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Professor picker â€” only when academy has multiple professors */}
                {showProfPicker && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      ðŸ‘©â€ðŸ« Elige tu profesor
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
                      {professors.map((p) => {
                        const active = form.professor_id === String(p.id);
                        return (
                          <button key={p.id} type="button" onClick={() => setForm({ ...form, professor_id: String(p.id) })}
                            style={{ padding: '0.75rem 0.5rem', borderRadius: '12px', border: `1.5px solid ${active ? brand : 'var(--border-strong)'}`, background: active ? `${brand}18` : 'var(--bg-base)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', transition: 'all 0.15s' }}>
                            {p.avatar_url ? (
                              <img src={p.avatar_url} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${active ? brand : 'var(--border)'}` }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: active ? `${brand}30` : 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: `2px solid ${active ? brand : 'var(--border)'}` }}>
                                ðŸ‘¤
                              </div>
                            )}
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: active ? brand : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{p.name}</span>
                            {p.is_owner && <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Director</span>}
                          </button>
                        );
                      })}
                    </div>
                    {!form.professor_id && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--warning, #f59e0b)', marginTop: '0.4rem' }}>
                        âš ï¸ Solo verÃ¡s las clases del profesor que elijas.
                      </p>
                    )}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{ marginTop: '0.35rem', padding: '0.85rem', borderRadius: '12px', border: 'none', background: brand, color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {loading ? 'Creando tu cuenta...' : 'Comenzar ahora'} <ArrowRight size={18} />
                </button>
              </form>
            </>
          )}

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.86rem', color: 'var(--text-subtle)' }}>
            Â¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: brand, fontWeight: 700, textDecoration: 'none' }}>Inicia sesiÃ³n</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '110px' }}>
      <Icon size={20} style={{ opacity: 0.85, marginBottom: '0.25rem' }} />
      <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{value}</span>
      <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>{label}</span>
    </div>
  );
}

function Field({ icon: Icon, right, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      {children}
      {right}
    </div>
  );
}

const inputStyle = {
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

