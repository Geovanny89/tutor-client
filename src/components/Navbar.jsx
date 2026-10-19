import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAiStore } from '../stores/aiStore';
import { useThemeStore } from '../stores/themeStore';
import {
  Sparkles,
  BookOpen,
  Mic,
  BarChart3,
  ShieldCheck,
  LogOut,
  Zap,
  Library,
  Menu,
  X,
  User,
  Target,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { usageStats, fetchUsage } = useAiStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchUsage();
  }, [isAuthenticated, fetchUsage]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const isAdmin = user?.role === 'super_admin' || user?.role === 'tenant_admin';

  const navLinks = [
    { to: '/dashboard',  label: 'Módulos',      icon: BookOpen },
    { to: '/practice',   label: 'Práctica IA',  icon: Target },
    { to: '/vocabulary', label: 'Vocabulario',   icon: Library },
    { to: '/tutor',      label: 'Tutor IA',      icon: Mic,      highlight: true },
    { to: '/progress',   label: 'Mi Historial',  icon: BarChart3 },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
  ];

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        boxShadow: '0 2px 10px rgba(15,23,42,0.04)',
        width: '100%',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          gap: '0.5rem',
        }}>

          {/* ── Brand ── */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', minWidth: 0, flexShrink: 0 }}
          >
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg,var(--primary) 0%,var(--primary-light) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(5,150,105,0.22)',
              flexShrink: 0,
            }}>
              <Sparkles size={19} color="var(--text-on-primary)" />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)',
                display: 'block', lineHeight: 1.15,
              }}>
                KDice <span style={{ color: 'var(--primary)' }}>English</span>
              </span>
              <span className="brand-subtitle" style={{
                display: 'block', fontSize: '0.62rem', color: 'var(--primary)',
                fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                Aprende Hablando
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav (≥ 880 px) ── */}
          {isAuthenticated && (
            <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {navLinks.map(({ to, label, icon: Icon, highlight }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '10px',
                    color: highlight
                      ? 'var(--primary-hover)'
                      : isActive(to) ? 'var(--primary)' : 'var(--text-secondary)',
                    background: highlight
                      ? isActive(to) ? 'var(--primary-soft)' : 'var(--primary-bg)'
                      : isActive(to) ? 'var(--primary-bg)' : 'transparent',
                    border: highlight ? '1px solid var(--primary-soft-2)' : '1px solid transparent',
                    fontWeight: isActive(to) || highlight ? 700 : 500,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={15} color={isActive(to) || highlight ? 'var(--primary)' : 'var(--text-subtle)'} />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* ── Right Section ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Token pill - Desktop only */}
                <div
                  title="Interacciones diarias con el Tutor IA"
                  className="token-pill-desktop"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    background: 'var(--accent-gold-soft)', border: '1px solid var(--accent-gold-border)',
                    borderRadius: '999px', fontSize: '0.78rem',
                    fontWeight: 700, color: 'var(--accent-gold-text)',
                  }}
                >
                  <Zap size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
                  <span>{usageStats.interactionsRemaining}/{usageStats.dailyLimit}</span>
                </div>

                {/* Level pill - Desktop & tablet */}
                <div
                  className="level-pill-desktop"
                  style={{
                    padding: '0.28rem 0.6rem',
                    background: 'var(--primary-bg)', border: '1px solid var(--primary-soft-2)',
                    borderRadius: '999px', fontSize: '0.78rem',
                    fontWeight: 700, color: 'var(--primary-hover)',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                  }}
                >
                  <span style={{ color: 'var(--primary-text)', fontSize: '0.72rem' }}>Nivel</span>
                  <span style={{
                    color: 'var(--text-on-primary)', background: 'var(--primary)',
                    padding: '0.1rem 0.45rem', borderRadius: '5px', fontWeight: 800,
                  }}>
                    {user?.current_level || 'A1'}
                  </span>
                </div>

                {/* User name - Desktop only */}
                <span className="user-name-desktop" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {user?.name?.split(' ')[0]}
                </span>

                {/* Logout - Desktop only */}
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="logout-btn-desktop"
                  style={{
                    background: 'var(--bg-base)', border: '1px solid var(--border)',
                    color: 'var(--text-subtle)', padding: '0.42rem', borderRadius: '8px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transition: 'all 0.2s',
                  }}
                >
                  <LogOut size={15} />
                </button>

                {/* Hamburger (mobile/tablet only) */}
                <button
                  id="nav-hamburger"
                  className="nav-hamburger-btn"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                  style={{
                    background: menuOpen ? 'var(--primary-bg)' : 'var(--bg-muted)',
                    border: `1px solid ${menuOpen ? 'var(--primary-soft-2)' : 'var(--border)'}`,
                    borderRadius: '10px',
                    padding: '0.45rem',
                    cursor: 'pointer',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.18s',
                  }}
                >
                  {menuOpen ? <X size={20} color="var(--primary)" /> : <Menu size={20} color="var(--text-secondary)" />}
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" style={{
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  fontWeight: 600, padding: '0.45rem 0.75rem', fontSize: '0.88rem',
                }}>
                  Ingresar
                </Link>
                <Link to="/register" style={{
                  background: 'var(--primary)', color: 'var(--text-on-primary)', textDecoration: 'none',
                  fontWeight: 700, padding: '0.45rem 0.95rem', borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(5,150,105,0.25)', fontSize: '0.88rem',
                  whiteSpace: 'nowrap',
                }}>
                  Comenzar
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay + Drawer ── */}
      {isAuthenticated && menuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          top: '57px',
          zIndex: 99,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={() => setMenuOpen(false)}
        >
          {/* Drawer content box */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border)',
              padding: '1.25rem 1rem 1.5rem',
              boxShadow: '0 20px 30px rgba(15, 23, 42, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxHeight: 'calc(100vh - 70px)',
              overflowY: 'auto',
            }}
          >
            {/* User Profile Info Card in Mobile Menu */}
            <div style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--primary-bg)', border: '1px solid var(--primary-soft-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={18} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {user?.name || 'Estudiante'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    Nivel Actual: <strong style={{ color: 'var(--primary)' }}>{user?.current_level || 'A1'}</strong>
                  </div>
                </div>
              </div>

              {/* Token counter badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.3rem 0.65rem',
                background: 'var(--accent-gold-soft)', border: '1px solid var(--accent-gold-border)',
                borderRadius: '999px', fontSize: '0.75rem',
                fontWeight: 700, color: 'var(--accent-gold-text)',
              }}>
                <Zap size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
                <span>{usageStats.interactionsRemaining}/{usageStats.dailyLimit}</span>
              </div>
            </div>

            {/* Nav Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {navLinks.map(({ to, label, icon: Icon, highlight }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      color: active ? 'var(--primary)' : 'var(--text-secondary)',
                      background: active ? 'var(--primary-bg)' : highlight ? 'var(--primary-bg)' : 'transparent',
                      border: `1.5px solid ${active ? 'var(--primary-soft-2)' : highlight ? 'var(--primary-soft-2)' : 'transparent'}`,
                      fontWeight: active || highlight ? 700 : 600,
                      textDecoration: 'none',
                      fontSize: '0.98rem',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: active || highlight ? 'var(--primary-soft)' : 'var(--bg-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={18} color={active || highlight ? 'var(--primary)' : 'var(--text-subtle)'} />
                    </div>
                    <span>{label}</span>
                    {highlight && (
                      <span style={{
                        marginLeft: 'auto',
                        background: 'var(--primary)',
                        color: 'var(--text-on-primary)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                      }}>
                        EN VIVO
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Theme toggle in Mobile menu */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <button
                onClick={toggleTheme}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem',
                  borderRadius: '12px',
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              </button>
            </div>

            {/* Logout button in Mobile menu */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  background: 'var(--error-bg)',
                  border: '1px solid var(--error-border)',
                  color: 'var(--error-strong)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Responsive CSS Rules ── */}
      <style>{`
        @media (max-width: 880px) {
          .nav-desktop         { display: none !important; }
          .nav-hamburger-btn   { display: flex !important; }
          .token-pill-desktop  { display: none !important; }
          .user-name-desktop   { display: none !important; }
          .logout-btn-desktop  { display: none !important; }
        }
        @media (max-width: 480px) {
          .brand-subtitle      { display: none !important; }
          .level-pill-desktop  { display: none !important; }
        }
      `}</style>
    </>
  );
}
