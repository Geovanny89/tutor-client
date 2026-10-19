import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mic,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Volume2,
  Library,
  Star,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      
      {/* ─── Hero Section ─── */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 1.25rem 3.5rem',
        textAlign: 'center',
        position: 'relative',
      }}>
        
        {/* Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 1.1rem',
          borderRadius: '999px',
          background: 'var(--primary-bg)',
          border: '1.5px solid var(--primary-soft-2)',
          fontSize: '0.86rem',
          fontWeight: 700,
          color: 'var(--primary-hover)',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)',
        }}>
          <Sparkles size={16} color="var(--primary)" />
          Plataforma de Inglés con Tutor IA Nativo · De A1 a C2
        </div>

        {/* Main Heading (High contrast deep slate with emerald gradient accents) */}
        <h1 style={{
          fontSize: 'clamp(2.3rem, 5.5vw, 3.8rem)',
          fontWeight: 900,
          lineHeight: '1.18',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          maxWidth: '920px',
          margin: '0 auto 1.25rem auto',
          color: 'var(--text-primary)',
        }}>
          Domina el Inglés Hablado con tu{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}>
            Tutor IA Personal
          </span>{' '}
          en Tiempo Real
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)',
          maxWidth: '720px',
          margin: '0 auto 2.25rem auto',
          lineHeight: '1.65',
          fontWeight: 400,
        }}>
          Aprende hablando desde tu primer día. Practica conversaciones por voz sin miedo a equivocarte, con correcciones fonéticas en vivo, 36 módulos guiados y vocabulario interactivo.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <Link
            to="/register"
            id="hero-cta-register"
            style={{
              padding: '0.85rem 2rem',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
              color: 'var(--text-on-primary)',
              boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Comenzar Gratis Ahora <ArrowRight size={18} />
          </Link>

          <Link
            to="/login"
            id="hero-cta-login"
            style={{
              padding: '0.85rem 1.8rem',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 700,
              border: '1.5px solid var(--border-strong)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
              transition: 'all 0.2s',
            }}
          >
            Ya tengo una cuenta
          </Link>
        </div>

        {/* Micro Guarantees */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          fontSize: '0.86rem',
          color: 'var(--text-subtle)',
          fontWeight: 600,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" /> Práctica de voz con IA en tiempo real
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" /> 36 Módulos completos (A1 → C2)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" /> 100+ Palabras con audio y ejemplos
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" /> Acceso 100% gratuito
          </span>
        </div>
      </section>

      {/* ─── Interactive Mockup Showcase Card ─── */}
      <section style={{ maxWidth: '960px', margin: '0 auto 4rem', padding: '0 1.25rem' }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--primary-soft-2)',
          borderRadius: '24px',
          padding: '1.75rem',
          boxShadow: '0 20px 50px -10px rgba(5, 150, 105, 0.12), 0 2px 8px rgba(15, 23, 42, 0.04)',
        }}>
          {/* Card Top Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-muted)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-bg)', border: '1px solid var(--primary-soft-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                👩🏼‍🏫
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Beyli <span style={{ fontSize: '0.72rem', background: 'var(--primary-soft)', color: 'var(--primary-hover)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 700, marginLeft: '0.35rem' }}>Tutora Nativa</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>En línea · Lista para conversar</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, background: 'var(--primary-bg)', padding: '0.3rem 0.75rem', borderRadius: '999px' }}>
              <Mic size={14} /> Micrófono Activo
            </div>
          </div>

          {/* Simulated Dialogue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            {/* Tutor Bubble */}
            <div style={{
              alignSelf: 'flex-start',
              background: 'var(--bg-base)',
              border: '1px solid var(--border)',
              borderRadius: '16px 16px 16px 4px',
              padding: '1rem 1.25rem',
              maxWidth: '85%',
            }}>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.96rem' }}>
                "Hello! Welcome to your English lesson. Can you tell me what you did last weekend?"
              </p>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--primary)', fontStyle: 'italic', marginTop: '0.3rem' }}>
                ↳ ¡Hola! Bienvenido a tu lección. ¿Puedes contarme qué hiciste el fin de semana pasado?
              </span>
            </div>

            {/* Student Bubble with live grading */}
            <div style={{
              alignSelf: 'flex-end',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
              color: 'var(--text-on-primary)',
              borderRadius: '16px 16px 4px 16px',
              padding: '1rem 1.25rem',
              maxWidth: '85%',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
            }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.96rem' }}>
                "I visited my grandparents and we cooked a delicious dinner together."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--primary-soft)', fontWeight: 700 }}>
                <span>✨ Pronunciación: 98%</span> · <span>Gramática: Perfecta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5 Structured Learning Blocks ─── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 5rem', padding: '0 1.25rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            margin: '0 0 0.5rem 0',
          }}>
            Plan de Estudio en 5 Bloques Estructurados
          </h2>
          <p style={{ color: 'var(--text-subtle)', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
            Un camino paso a paso desde los primeros sonidos fonéticos hasta el dominio profesional y fluido del idioma.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '1rem',
          textAlign: 'left',
        }}>
          {[
            { badge: 'A1', title: 'Bloque 1: Cimientos', desc: 'Fonética, abecedario, verbo To Be, pronombres y presente simple.', icon: '🌱', color: 'var(--primary)', bg: 'var(--primary-bg)', border: 'var(--primary-soft-2)' },
            { badge: 'A2', title: 'Bloque 2: Entorno Simple', desc: 'Pasado simple, futuro (will/going to), rutinas y preguntas cotidianas.', icon: '🌿', color: 'var(--info)', bg: 'var(--info-bg)', border: '#BAE6FD' },
            { badge: 'B1', title: 'Bloque 3: Fluidez Activa', desc: 'Presente perfecto, condicionales, voz pasiva y debates de opinión.', icon: '🚀', color: 'var(--accent-purple)', bg: '#F5F3FF', border: '#DDD6FE' },
            { badge: 'B2', title: 'Bloque 4: Nivel Profesional', desc: 'Cláusulas relativas, modales deductivos y entrevistas laborales.', icon: '💼', color: 'var(--accent-gold-strong)', bg: 'var(--warning-bg)', border: 'var(--accent-gold-border)' },
            { badge: 'C1-C2', title: 'Bloque 5: Maestría Total', desc: 'Inversión gramatical, modismos idiomáticos nativos y refinamiento.', icon: '👑', color: '#BE185D', bg: '#FDF2F8', border: '#FBCFE8' },
          ].map((b, i) => (
            <div key={i} style={{
              background: 'var(--bg-surface)',
              border: `1.5px solid ${b.border}`,
              borderRadius: '18px',
              padding: '1.4rem 1.2rem',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: b.color,
                    background: b.bg,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                  }}>
                    {b.badge}
                  </span>
                  <span style={{ fontSize: '1.25rem' }}>{b.icon}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                  {b.title}
                </h3>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3 Main Pillars Section ─── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 5rem', padding: '0 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '1.5rem',
        }}>
          {/* Pillar 1 */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Mic size={24} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Conversación Real por Voz
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
              Habla por micrófono y escucha respuestas fluidas en inglés nativo. El sistema detecta tus errores y te enseña cómo corregirlos con paciencia.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Library size={24} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Vocabulario Interactivo con IA
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
              Explora verbos, adjetivos, frases, el abecedario y números. Haz clic en "Generar con IA" para obtener ejemplos personalizados con audio.
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Award size={24} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Evaluaciones y Certificación
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
              Mide tu nivel con exámenes interactivos al finalizar cada módulo. Obtén más del 70% para desbloquear el siguiente bloque y certificar tu avance.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Final CTA Banner ─── */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 5rem', padding: '0 1.25rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-text) 45%, var(--primary) 100%)',
          borderRadius: '28px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'var(--text-on-primary)',
          boxShadow: '0 20px 40px rgba(6, 78, 59, 0.25)',
        }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: 900,
            color: 'var(--text-on-primary)',
            fontFamily: 'var(--font-display)',
            margin: '0 0 0.75rem 0',
          }}>
            ¿Listo para comenzar a hablar inglés hoy?
          </h2>
          <p style={{ color: 'var(--primary-soft)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Crea tu cuenta gratuita en menos de 30 segundos y comienza tu primera conversación con Beyli.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.9rem 2.2rem',
              borderRadius: '14px',
              background: 'var(--bg-surface)',
              color: 'var(--primary-text)',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              transition: 'transform 0.15s',
            }}
          >
            Comenzar Gratis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.25rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.86rem' }}>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} <strong>KDice English</strong> · Aprende Hablando con Inteligencia Artificial. Todos los derechos reservados.
        </p>
      </footer>

    </div>
  );
}
