import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { iconBtn } from './constants';

export function Field({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
        {label}
      </span>
      {children}
    </label>
  );
}

export function EmptyState({ text }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px dashed var(--border-strong)',
      borderRadius: '18px',
      padding: '2.5rem',
      textAlign: 'center',
      color: 'var(--text-subtle)'
    }}>
      {text}
    </div>
  );
}

export function PublicLink({ slug, color }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/academia/${slug}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Enlace copiado');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '0.4rem 0.5rem 0.4rem 0.85rem'
    }}>
      <span style={{
        fontSize: '0.82rem',
        color: 'var(--text-subtle)',
        maxWidth: '230px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        /academia/<strong style={{ color }}>{slug}</strong>
      </span>
      <button onClick={copy} title="Copiar enlace" style={iconBtn}>
        {copied ? <Check size={15} color="var(--success)" /> : <Copy size={15} />}
      </button>
      <a href={url} target="_blank" rel="noreferrer" title="Abrir página pública" style={iconBtn}>
        <ExternalLink size={15} />
      </a>
    </div>
  );
}
