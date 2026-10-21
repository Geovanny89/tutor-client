import React, { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { useAiStore } from '../stores/aiStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { Zap, PlayCircle, Trophy, Gift, CheckCircle2 } from 'lucide-react';
import AdPlayerModal from '../components/ads/AdPlayerModal';

export default function RewardsPage() {
  const { fetchUsage } = useAiStore();
  const { user } = useAuthStore();
  const [tokens, setTokens] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);
  const [claiming, setClaiming] = useState(false);

  const load = useCallback(async () => {
    try {
      const [t, a] = await Promise.all([api.get('/ads/tokens'), api.get('/ads')]);
      if (t.success) setTokens(t.data);
      if (a.success) setAds(a.data.ads || []);
    } catch (err) {
      toast.error('No se pudieron cargar los anuncios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

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

  const promoAd = ads.find((a) => a.kind === 'promo') || ads[0];
  const extraAds = ads.filter((a) => a.kind === 'extra').slice(0, 4);
  const watchedExtra = tokens?.ads_watched_today?.extra || 0;

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-subtle)' }}>Cargando recompensas...</div>;
  }

  // Los estudiantes de una academia no ven publicidad (la academia ya paga la plataforma).
  if (user?.tenant?.is_academy) {
    return (
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-primary)' }}>
        <Gift size={42} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          Recompensas no disponibles
        </h1>
        <p style={{ color: 'var(--text-subtle)', lineHeight: 1.6, margin: 0 }}>
          Tu academia ya cubre tu acceso a la IA, así que no necesitas ver publicidad.
          Si alcanzas tu límite diario, podrás seguir practicando mañana.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem 3rem', color: 'var(--text-primary)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Trophy size={40} color="var(--accent-gold)" style={{ marginBottom: '0.5rem' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
          Gana tokens viendo publicidad
        </h1>
        <p style={{ color: 'var(--text-subtle)', margin: 0 }}>
          Cada token extra te da una interacción más con el Tutor de IA.
        </p>
      </div>

      {/* Token wallet */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2.25rem',
      }}>
        <WalletCard label="Tokens disponibles hoy" value={tokens?.remaining ?? 0} accent />
        <WalletCard label="Límite diario" value={tokens?.daily_limit ?? 0} />
        <WalletCard label="Bonus ganado hoy" value={`+${tokens?.bonus_tokens ?? 0}`} />
        <WalletCard label="Anuncios vistos hoy" value={(tokens?.ads_watched_today?.promo || 0) + watchedExtra} />
      </div>

      {/* Promo video */}
      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.85rem' }}>Video promocional</h2>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
        background: 'var(--primary-bg)', border: '1px solid var(--primary-soft-2)',
        borderRadius: '18px', padding: '1.25rem', marginBottom: '2.25rem',
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3 style={{ margin: '0 0 0.25rem', color: 'var(--primary-text)', fontSize: '1.05rem' }}>{promoAd?.title || 'Video promocional'}</h3>
          <p style={{ margin: 0, color: 'var(--primary-hover)', fontSize: '0.88rem' }}>
            Míralo completo y gana <strong>+{tokens?.rewards?.promo ?? 5} tokens</strong> (una vez al día).
          </p>
        </div>
        {tokens?.can_watch_promo ? (
          <button onClick={() => setPlaying(promoAd)} style={primaryBtn} disabled={!promoAd}>
            <PlayCircle size={18} /> Ver y ganar +{tokens?.rewards?.promo ?? 5}
          </button>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 700 }}>
            <CheckCircle2 size={18} /> Ya lo viste hoy
          </span>
        )}
      </div>

      {/* Extra ads */}
      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem' }}>Videos adicionales</h2>
      <p style={{ color: 'var(--text-subtle)', fontSize: '0.88rem', marginTop: 0, marginBottom: '1rem' }}>
        Hasta {tokens?.rewards?.max_extra_per_day ?? 4} videos al día · {watchedExtra}/{tokens?.rewards?.max_extra_per_day ?? 4} vistos hoy
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '1rem' }}>
        {extraAds.map((ad, idx) => {
          const canWatch = tokens?.can_watch_extra;
          return (
            <div key={ad.id} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Gift size={13} /> Opción {idx + 1}
              </div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>{ad.title}</strong>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-subtle)', flex: 1 }}>{ad.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold-text)' }}>
                  <Zap size={13} fill="var(--accent-gold)" color="var(--accent-gold)" /> +{ad.reward_tokens}
                </span>
                <button
                  onClick={() => canWatch && setPlaying(ad)}
                  disabled={!canWatch}
                  style={{
                    background: canWatch ? 'var(--bg-muted)' : 'transparent',
                    border: `1px solid ${canWatch ? 'var(--border-strong)' : 'var(--border)'}`,
                    borderRadius: '10px', padding: '0.4rem 0.75rem',
                    fontWeight: 700, fontSize: '0.82rem',
                    color: canWatch ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: canWatch ? 'pointer' : 'not-allowed',
                  }}
                >
                  {canWatch ? 'Ver' : 'Límite'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {playing && (
        <AdPlayerModal
          ad={playing}
          claiming={claiming}
          onClose={() => { setPlaying(null); load(); }}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}

function WalletCard({ label, value, accent = false }) {
  return (
    <div style={{
      background: accent ? 'var(--accent-gold-soft)' : 'var(--bg-surface)',
      border: `1px solid ${accent ? 'var(--accent-gold-border)' : 'var(--border)'}`,
      borderRadius: '16px',
      padding: '1.1rem',
    }}>
      <div style={{ fontSize: '0.78rem', color: accent ? 'var(--accent-gold-text)' : 'var(--text-subtle)', fontWeight: 700, marginBottom: '0.35rem' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: accent ? 'var(--accent-gold-text)' : 'var(--text-primary)' }}>
        {accent && <Zap size={22} fill="var(--accent-gold)" color="var(--accent-gold)" />}
        {value}
      </div>
    </div>
  );
}

const primaryBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'var(--primary)',
  color: 'var(--text-on-primary)',
  border: 'none',
  borderRadius: '12px',
  padding: '0.75rem 1.4rem',
  fontWeight: 800,
  fontSize: '0.95rem',
  cursor: 'pointer',
};
