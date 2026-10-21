import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAiStore } from '../stores/aiStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { BookOpen, School, ExternalLink } from 'lucide-react';

import DashboardHero from '../components/dashboard/DashboardHero';
import BloqueSelectorTabs from '../components/dashboard/BloqueSelectorTabs';
import ModuleCard from '../components/dashboard/ModuleCard';
import KidsStudyPanel from '../components/dashboard/KidsStudyPanel';
import TeensStudyPanel from '../components/dashboard/TeensStudyPanel';
import AdBanner from '../components/ads/AdBanner';

const CONTAINER_STYLE = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '1.25rem 1rem 3rem',
  color: 'var(--text-primary)',
  width: '100%',
  boxSizing: 'border-box',
};

const BLOQUES = [
  {
    id: 'B1',
    level: 'A1',
    title: 'Bloque 1: Cimientos de la Comunicación',
    subtitle: 'Nivel A1 · Estructura mínima para formular tus primeras oraciones',
    color: 'var(--primary)',
    badge: 'A1',
    orderMin: 0,
    orderMax: 7,
  },
  {
    id: 'B2',
    level: 'A2',
    title: 'Bloque 2: Entorno y Experiencias Simples',
    subtitle: 'Nivel A2 · Conecta ideas en pasado y describe planes elementales',
    color: 'var(--secondary)',
    badge: 'A2',
    orderMin: 8,
    orderMax: 15,
  },
  {
    id: 'B3',
    level: 'B1',
    title: 'Bloque 3: Fluidez Cotidiana e Ideas Complejas',
    subtitle: 'Nivel B1 · Deja de traducir mentalmente y matiza tus opiniones',
    color: '#2563EB',
    badge: 'B1',
    orderMin: 16,
    orderMax: 23,
  },
  {
    id: 'B4',
    level: 'B2',
    title: 'Bloque 4: Independencia y Argumentación',
    subtitle: 'Nivel B2 · Debates formales, entorno profesional y oraciones complejas',
    color: 'var(--accent-purple)',
    badge: 'B2',
    orderMin: 24,
    orderMax: 31,
  },
  {
    id: 'B5',
    level: 'C1/C2',
    title: 'Bloque 5: Dominio Profesional y Matices',
    subtitle: 'Nivel C1/C2 · Refinamiento idiomático, inversión y expresiones nativas',
    color: '#DB2777',
    badge: 'C1/C2',
    orderMin: 32,
    orderMax: 35,
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { usageStats } = useAiStore();
  const navigate = useNavigate();

  // Segmento pedagógico: define qué panel de estudio se muestra.
  const ageRange = user?.age_range || 'adults';

  // Estudiante de una academia (con profesor/dueño): mostramos su marca y sin publicidad,
  // porque la academia ya paga la plataforma.
  const isAcademy = Boolean(user?.tenant?.is_academy);

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('B1');
  const [blocksCollapsed, setBlocksCollapsed] = useState(false);

  // On mobile: selecting a block hides the rest so only that block stays in view.
  const handleSelectTab = (id) => {
    setActiveTab(id);
    setBlocksCollapsed(true);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await api.get('/modules');
      if (res.success && res.data) {
        setModules(res.data);
      }
    } catch (err) {
      toast.error('Error al cargar los módulos.');
    } finally {
      setLoading(false);
    }
  };

  const currentBlock = BLOQUES.find((b) => b.id === activeTab);
  const displayedModules = activeTab === 'ALL'
    ? modules
    : modules.filter((m) => {
        if (!currentBlock) return true;
        const ord = m.order_index;
        return ord >= currentBlock.orderMin && ord <= currentBlock.orderMax;
      });

  // Adaptación por edad: cada segmento ve su propio panel de estudio.
  if (ageRange === 'kids') {
    return (
      <div style={CONTAINER_STYLE}>
        {isAcademy ? <AcademyBanner user={user} /> : <AdBanner />}
        <KidsStudyPanel user={user} />
      </div>
    );
  }

  if (ageRange === 'teens') {
    return (
      <div style={CONTAINER_STYLE}>
        {isAcademy ? <AcademyBanner user={user} /> : <AdBanner />}
        <TeensStudyPanel user={user} usageStats={usageStats} modules={modules} loading={loading} />
      </div>
    );
  }

  return (
    <div style={CONTAINER_STYLE}>
      {isAcademy ? <AcademyBanner user={user} /> : <AdBanner />}

      {/* Hero Welcome Card */}
      <DashboardHero
        user={user}
        usageStats={usageStats}
      />

      {/* Bloques Selector Tabs */}
      <BloqueSelectorTabs
        bloques={BLOQUES}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        collapsed={blocksCollapsed}
        onToggleCollapse={() => setBlocksCollapsed(false)}
      />

      {/* Active Bloque Header Info */}
      {currentBlock && activeTab !== 'ALL' && (
        <div style={{
          background: 'var(--primary-bg)',
          borderLeft: '4px solid var(--primary)',
          padding: '1rem 1.25rem',
          borderRadius: '0 12px 12px 0',
          marginBottom: '1.75rem',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-text)', margin: 0 }}>
            {currentBlock.title}
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--primary-hover)' }}>
            {currentBlock.subtitle}
          </p>
        </div>
      )}

      {/* Modules Grid */}
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-subtle)', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
            Cargando módulos educativos...
          </div>
        ) : displayedModules.length === 0 ? (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-strong)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}>
            <BookOpen size={44} color="var(--primary)" style={{ opacity: 0.6, marginBottom: '0.75rem' }} />
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', margin: '0 0 0.5rem 0' }}>
              No se encontraron módulos para este bloque.
            </h4>
            <button
              onClick={fetchModules}
              style={{
                marginTop: '1rem',
                background: 'var(--primary)',
                color: 'var(--text-on-primary)',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🔄 Recargar
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: '1.25rem',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            {displayedModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onStudyLesson={(modId) => navigate(`/modules/${modId}`)}
                onTakeExam={(modId) => navigate(`/evaluations/${modId}`)}
                onPracticeTutor={() => navigate('/tutor')}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

/** Franja de marca de la academia del estudiante (reemplaza la publicidad). */
function AcademyBanner({ user }) {
  const tenant = user?.tenant || {};
  const color = tenant.primary_color || 'var(--primary)';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      flexWrap: 'wrap',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderLeft: `4px solid ${color}`,
      borderRadius: '14px',
      padding: '0.85rem 1.1rem',
      marginBottom: '1.25rem',
    }}>
      {tenant.logo_url ? (
        <img
          src={tenant.logo_url}
          alt={tenant.name || 'Academia'}
          style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
        />
      ) : (
        <div style={{
          width: '42px', height: '42px', borderRadius: '10px', background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <School size={20} color="#fff" />
        </div>
      )}

      <div style={{ flex: 1, minWidth: '150px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Tu academia
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--text-primary)' }}>
          {tenant.name || 'Academia'}
        </div>
      </div>

      {tenant.slug && (
        <button
          type="button"
          onClick={() => window.open(`/academia/${tenant.slug}`, '_blank', 'noopener')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--bg-base)', border: '1px solid var(--border-strong)',
            borderRadius: '10px', padding: '0.5rem 0.85rem',
            fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer',
          }}
        >
          <ExternalLink size={14} /> Ver página de la academia
        </button>
      )}
    </div>
  );
}
