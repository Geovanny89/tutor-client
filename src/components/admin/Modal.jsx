import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable modal + form primitives for the admin panel.
 */
export function Modal({ open, title, subtitle, onClose, children, maxWidth = '520px' }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 200,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.75rem',
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: '10px',
              padding: '0.4rem', cursor: 'pointer', display: 'flex', color: 'var(--text-subtle)',
            }}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const inputStyle = {
  width: '100%',
  background: 'var(--bg-base)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '0.65rem 0.85rem',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-body)',
};

export function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{hint}</div>}
    </div>
  );
}

export function ModalActions({ onCancel, submitLabel, danger = false, loading = false }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
      <button type="button" onClick={onCancel} className="btn btn-ghost" style={{ borderRadius: '10px' }}>
        Cancelar
      </button>
      <button
        type="submit"
        disabled={loading}
        style={{
          borderRadius: '10px',
          padding: '0.65rem 1.4rem',
          border: 'none',
          cursor: loading ? 'wait' : 'pointer',
          fontWeight: 700,
          color: 'var(--text-on-primary)',
          background: danger ? 'var(--error-strong)' : 'var(--primary)',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Guardando...' : submitLabel}
      </button>
    </div>
  );
}
