import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mic,
  Award,
  Zap,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Volume2,
  PlayCircle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 1.5rem 4rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
      }}>
        
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '999px',
          background: 'rgba(108, 99, 255, 0.15)',
          border: '1px solid var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#a5b4fc',
          marginBottom: '1.5rem',
        }}>
          <Sparkles size={16} color="#FFD700" />
          Aprende Inglés Hablado con Inteligencia Artificial Nativa
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 4rem)',
          fontWeight: 900,
          lineHeight: '1.15',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          margin: '0 auto 1.5rem auto',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #8B85FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Domina el Inglés de <span style={{ color: '#3ECFCF', WebkitTextFillColor: '#3ECFCF' }}>A0 a C2</span> Conversando con IA en Tiempo Real
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '750px',
          margin: '0 auto 2.5rem auto',
          lineHeight: '1.7',
        }}>
          Una plataforma interactiva por módulos con tutor de voz nativo, evaluaciones por nivel, seguimiento de avance y consumo 100% gratuito sin agotar tus tokens.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/register"
            className="btn btn-primary"
            style={{
              padding: '0.9rem 2.2rem',
              borderRadius: '14px',
              fontSize: '1.05rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--primary) 0%, #3ECFCF 100%)',
              boxShadow: '0 8px 30px rgba(108, 99, 255, 0.45)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
            }}
          >
            Comenzar Gratis Ahora <ArrowRight size={18} />
          </Link>

          <Link
            to="/login"
            className="btn btn-ghost"
            style={{
              padding: '0.9rem 1.8rem',
              borderRadius: '14px',
              fontSize: '1.05rem',
              fontWeight: 700,
              border: '1px solid var(--border)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
            }}
          >
            Ya tengo una cuenta
          </Link>
        </div>

        {/* Micro guarantees */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '3rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#22D3A0" /> Modelos de IA 100% Gratuitos
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#22D3A0" /> Voz y Pronunciación en Vivo
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#22D3A0" /> Compatible con APK Móvil
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#22D3A0" /> Arquitectura Multi-Tenant
          </span>
        </div>
      </section>

      {/* Feature Pillars */}
      <section style={{
        maxWidth: '1200px',
        margin: '2rem auto 5rem auto',
        padding: '0 1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Pillar 1 */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '2rem',
            position: 'relative',
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'rgba(62, 207, 207, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Mic size={24} color="#3ECFCF" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              Conversación Real por Voz
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              Habla como si estuvieras en Nueva York o Londres. El sistema escucha tu pronunciación, responde con acento nativo y te da consejos en tiempo real.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '2rem',
            position: 'relative',
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'rgba(108, 99, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Award size={24} color="#8B85FF" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              Ruta Progresiva A0 a C2
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              Módulos estructurados según el Marco Común Europeo (CEFR). Aprueba la evaluación con 70%+ para avanzar y certificar tu aprendizaje.
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '2rem',
            position: 'relative',
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'rgba(255, 215, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Zap size={24} color="#FFD700" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
              Cero Gastos en Tokens
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              Diseñado con modelos gratuitos (Groq Llama 3 + Gemini Flash), caché inteligente y control de cuota diaria para que nunca te cobren nada.
            </p>
          </div>
        </div>
      </section>

      {/* Level Roadmap Preview */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto 6rem auto',
        padding: '2.5rem',
        background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(62, 207, 207, 0.08) 100%)',
        border: '1px solid rgba(108, 99, 255, 0.25)',
        borderRadius: '32px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', margin: '0 0 0.75rem 0' }}>
          De Principiante Absoluto a Fluidez Nativa
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          No importa si nunca has estudiado inglés o si buscas perfeccionar tu nivel profesional.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
        }}>
          {[
            { lvl: 'A1', title: 'Principiante', desc: 'Saludos y frases' },
            { lvl: 'A2', title: 'Básico', desc: 'Rutinas y viajes' },
            { lvl: 'B1', title: 'Intermedio', desc: 'Conversación activa' },
            { lvl: 'B2', title: 'Profesional', desc: 'Trabajo y fluidez' },
            { lvl: 'C1', title: 'Avanzado', desc: 'Debates y modismos' },
            { lvl: 'C2', title: 'Nativo', desc: 'Maestría total' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.25rem 0.5rem',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#3ECFCF', fontFamily: 'var(--font-display)' }}>
                {item.lvl}
              </div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
