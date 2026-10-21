import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAiStore } from '../../stores/aiStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { Zap, PlayCircle, Gift } from 'lucide-react';
import AdPlayerModal from './AdPlayerModal';

/**
 * Banner pequeño de publicidad para el panel global.
 * Muestra anuncios rotativos y premia con tokens al verlos completos.
 */
export default function AdBanner() {
  const { fetchUsage } = useAiStore();
  const { user } = useAuthStore();
  const [tokens, setTokens] = useState(null);
  const [ads, setAds] = useState([]);
  const [rotating, setRotating] = useState(0);
  const [playing, setPlaying] = useState(null);
  const [claiming, setClaiming] = useState(false);

  const load = useCallback(async () => {
    try {
      const [t, a] = await Promise.all([api.get('/ads/tokens'), api.get('/ads')]);
      if (t.success) setTokens(t.data);
      if (a.success) setAds(a.data.ads || []);
    } catch (err) {
      /* silencioso: el banner es secundario */
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (ads.length < 2) return undefined;
    const id = setInterval(() => setRotating((r) => (r + 1) % ads.length), 5000);
    return () => clearInterval(id);
  }, [ads.length]);

  const handleComplete = async (ad) => {
    setClaiming(true);
    try {
      const res = await api.post(`/ads/${ad.id}/view`);
      if (res.success) {
        toast.success(res.message || `¡Ganaste ${ad.reward_tokens} tokens! 🎉`);
        setTokens(res.data.tokens);
        await fetchUsage();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo acreditar el anuncio');
    } finally {
      setClaiming(false);
    }
  };

  // Los estudiantes de una academia no ven publicidad: la academia ya paga la plataforma.
  if (user?.tenant?.is_academy) return null;

  if (!tokens) return null;

  // Solo rotamos entre los anuncios que el estudiante todavía puede ver hoy,
  // así el banner nunca muestra un anuncio ya reclamado con el botón bloqueado.
  const watchable = ads.filter((a) =>
    a.kind === 'promo' ? tokens.can_watch_promo : tokens.can_watch_extra
  );

  if (watchable.length === 0) return null;

  const current = watchable[rotating % watchable.length];

  const canWatch = current.kind === 'promo' ? tokens.can_watch_promo : tokens.can_watch_extra;

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border-strong)',
        borderRadius: '14px',
        padding: '0.6rem 0.9rem',
        marginBottom: '1.25rem',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
          <Gift size={13} /> Publicidad
        </span>

        <div style={{
          width: '72px',
          height: '44px',
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0,
          border: '1px solid var(--border)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {current.image_url ? (
            <img
              src={current.image_url}
              alt={current.title || 'Anuncio'}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <PlayCircle size={20} color="#fff" style={{ opacity: 0.8 }} />
          )}
        </div>

        <span style={{ flex: 1, minWidth: '160px', fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {current.title}
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold-text)' }}>
          <Zap size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
          {tokens.remaining} disponibles
        </span>

        <button
          onClick={() => canWatch && setPlaying(current)}
          disabled={!canWatch}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            background: canWatch ? 'var(--primary)' : 'var(--bg-muted)',
            color: canWatch ? 'var(--text-on-primary)' : 'var(--text-muted)',
            border: 'none', borderRadius: '999px', padding: '0.4rem 0.85rem',
            fontWeight: 700, fontSize: '0.82rem',
            cursor: canWatch ? 'pointer' : 'not-allowed', flexShrink: 0,
          }}
        >
          <PlayCircle size={15} /> +{current.reward_tokens} tokens
        </button>

        <Link to="/rewards" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
          Ver más
        </Link>
      </div>

      {playing && (
        <AdPlayerModal
          ad={playing}
          claiming={claiming}
          onClose={() => { setPlaying(null); load(); }}
          onComplete={handleComplete}
        />
      )}
    </>
  );
}
