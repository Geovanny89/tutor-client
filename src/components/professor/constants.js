import { LayoutDashboard, School, Users, BookOpen, ClipboardList } from 'lucide-react';

export const AGE_OPTIONS = [
  { value: 'kids', label: 'Niños (3-7)' },
  { value: 'teens', label: 'Adolescentes (8-16)' },
  { value: 'adults', label: 'Adultos (17+)' },
];

export const TABS = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'academy', label: 'Mi Academia', icon: School },
  { id: 'students', label: 'Estudiantes', icon: Users },
  { id: 'lessons', label: 'Lecciones', icon: BookOpen },
  { id: 'evaluations', label: 'Evaluaciones', icon: ClipboardList },
];

export const input = {
  width: '100%',
  background: 'var(--bg-base)',
  border: '1px solid var(--border-strong)',
  borderRadius: '11px',
  padding: '0.65rem 0.85rem',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export const primaryBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'var(--primary)',
  color: 'var(--text-on-primary)',
  border: 'none',
  borderRadius: '12px',
  padding: '0.7rem 1.3rem',
  fontWeight: 800,
  fontSize: '0.9rem',
  cursor: 'pointer',
};

export const smallBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  background: 'var(--bg-base)',
  border: '1px solid var(--border-strong)',
  borderRadius: '9px',
  padding: '0.4rem 0.7rem',
  fontWeight: 700,
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
};

export const iconBtn = {
  background: 'none',
  border: 'none',
  padding: '4px',
  cursor: 'pointer',
  color: 'var(--text-subtle)',
  display: 'flex',
};

export const overlay = {
  position: 'fixed',
  inset: 0,
  zIndex: 300,
  background: 'rgba(2,6,23,0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
};

export const modal = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '20px',
  padding: '1.5rem',
  boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
};
