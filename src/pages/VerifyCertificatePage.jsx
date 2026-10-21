import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ShieldCheck, ShieldAlert, Download, Search } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function VerifyCertificatePage() {
  const { code } = useParams();
  const [state, setState] = useState({ loading: true, valid: false, certificate: null });
  const [query, setQuery] = useState(code || '');

  useEffect(() => {
    const verify = async () => {
      setState({ loading: true, valid: false, certificate: null });
      try {
        const res = await api.get(`/certificates/verify/${code}`);
        if (res.success && res.data) {
          setState({ loading: false, valid: !!res.data.valid, certificate: res.data.certificate || null });
        }
      } catch (err) {
        setState({ loading: false, valid: false, certificate: null });
      }
    };
    if (code) verify();
  }, [code]);

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (clean) window.location.href = `/verify/${clean}`;
  };

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '3rem 1rem', color: 'var(--text-primary)' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <ShieldCheck size={42} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
          Verificación de Certificados
        </h1>
        <p style={{ color: 'var(--text-subtle)', margin: 0 }}>
          Comprueba la autenticidad de un certificado emitido por KDice English.
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Código (ej. CERT-A1B2-2026)"
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
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
        <button type="submit" style={{
          background: 'var(--primary)', color: 'var(--text-on-primary)', border: 'none',
          borderRadius: '12px', padding: '0 1.25rem', fontWeight: 700, cursor: 'pointer',
        }}>
          Verificar
        </button>
      </form>

      {state.loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-subtle)' }}>Verificando...</div>
      ) : state.valid && state.certificate ? (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--success)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 12px 32px -12px rgba(16,185,129,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--success)', fontWeight: 800, marginBottom: '1.25rem' }}>
            <ShieldCheck size={24} /> Certificado válido y auténtico
          </div>

          <Row label="Estudiante" value={state.certificate.student_name} />
          <Row label="Academia" value={state.certificate.academy_name} />
          <Row label="Materia" value={state.certificate.subject} />
          {state.certificate.level && <Row label="Nivel" value={state.certificate.level} />}
          <Row label="Horas certificadas" value={`${state.certificate.hours} h`} />
          <Row label="Código" value={state.certificate.code} />
          <Row
            label="Emitido el"
            value={new Date(state.certificate.issued_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          />

          <a
            href={`${API_BASE}/certificates/${state.certificate.code}/pdf`}
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--primary)',
              color: 'var(--text-on-primary)',
              padding: '0.75rem 1.4rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            <Download size={18} /> Descargar PDF
          </a>
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--error-border)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <ShieldAlert size={40} color="var(--error)" style={{ marginBottom: '0.6rem' }} />
          <h3 style={{ margin: '0 0 0.35rem', color: 'var(--text-primary)' }}>Certificado no encontrado</h3>
          <p style={{ margin: 0, color: 'var(--text-subtle)' }}>
            No existe ningún certificado con el código <strong>{code}</strong>. Verifica el código e inténtalo de nuevo.
          </p>
        </div>
      )}

      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.86rem', color: 'var(--text-subtle)' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Volver al inicio</Link>
      </p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ color: 'var(--text-subtle)', fontSize: '0.88rem' }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 700, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
