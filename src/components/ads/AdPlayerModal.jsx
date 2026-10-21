import React, { useEffect, useRef, useState } from 'react';
import { X, Zap, PlayCircle, CheckCircle2 } from 'lucide-react';

/**
 * Reproduce un anuncio recompensado durante `ad.duration_seconds` (≈45 s).
 * Al terminar, llama a `onComplete(ad)` para que el llamador acredite los tokens.
 */
export default function AdPlayerModal({ ad, onClose, onComplete, claiming }) {
  const total = ad?.duration_seconds || 45;
  const [remaining, setRemaining] = useState(total);
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!ad) return undefined;
    setRemaining(ad.duration_seconds || 45);
    setDone(false);
    completedRef.current = false;

    const timer = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timer);
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ad]);

  // Auto-acreditar al terminar el anuncio (una sola vez)
  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      onComplete(ad);
    }
  }, [done, ad, onComplete]);

  if (!ad) return null;

  const progress = ((total - remaining) / total) * 100;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Anuncio {ad.kind === 'promo' ? 'promocional' : ''}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex' }} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Media area */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          padding: '1.5rem',
        }}>
          {ad.video_url ? (
            <video src={ad.video_url} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : ad.image_url ? (
            <img src={ad.image_url} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div>
              <PlayCircle size={54} style={{ opacity: 0.75, marginBottom: '0.6rem' }} />
              <h3 style={{ margin: '0 0 0.4rem', fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{ad.title}</h3>
              {ad.description && <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem', maxWidth: '340px' }}>{ad.description}</p>}
            </div>
          )}

          {done && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,44,34,0.86)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={44} color="#34D399" />
              <strong style={{ fontSize: '1.05rem' }}>{claiming ? 'Acreditando tokens...' : '¡Anuncio completado!'}</strong>
            </div>
          )}
        </div>

        {/* Progress */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ height: '7px', background: 'var(--bg-muted)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', transition: 'width 1s linear' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
            <span>{done ? '¡Listo!' : `Quedan ${remaining} s`}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: 'var(--accent-gold-text)' }}>
              <Zap size={13} fill="var(--accent-gold)" color="var(--accent-gold)" /> +{ad.reward_tokens} tokens
            </span>
          </div>
        </div>

        {done && (
          <button
            onClick={onClose}
            style={{
              marginTop: '1rem', width: '100%', padding: '0.8rem', borderRadius: '12px',
              border: 'none', background: 'var(--primary)', color: 'var(--text-on-primary)',
              fontWeight: 800, cursor: 'pointer',
            }}
          >
            Continuar
          </button>
        )}
        {!done && (
          <p style={{ textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.75rem', marginBottom: 0 }}>
            Debes ver el anuncio completo para ganar los tokens.
          </p>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 300,
  background: 'rgba(2, 6, 23, 0.72)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
};

const modalStyle = {
  width: '100%',
  maxWidth: '560px',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '22px',
  padding: '1.25rem',
  boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
};
