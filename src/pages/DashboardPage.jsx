import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAiStore } from '../stores/aiStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { BookOpen } from 'lucide-react';

import DashboardHero from '../components/dashboard/DashboardHero';
import BloqueSelectorTabs from '../components/dashboard/BloqueSelectorTabs';
import ModuleCard from '../components/dashboard/ModuleCard';

const BLOQUES = [
  {
    id: 'B1',
    level: 'A1',
    title: 'Bloque 1: Cimientos de la Comunicación',
    subtitle: 'Nivel A1 · Estructura mínima para formular tus primeras oraciones',
    color: '#059669',
    badge: 'A1',
    orderMin: 1,
    orderMax: 8,
  },
  {
    id: 'B2',
    level: 'A2',
    title: 'Bloque 2: Entorno y Experiencias Simples',
    subtitle: 'Nivel A2 · Conecta ideas en pasado y describe planes elementales',
    color: '#0D9488',
    badge: 'A2',
    orderMin: 9,
    orderMax: 16,
  },
  {
    id: 'B3',
    level: 'B1',
    title: 'Bloque 3: Fluidez Cotidiana e Ideas Complejas',
    subtitle: 'Nivel B1 · Deja de traducir mentalmente y matiza tus opiniones',
    color: '#2563EB',
    badge: 'B1',
    orderMin: 17,
    orderMax: 24,
  },
  {
    id: 'B4',
    level: 'B2',
    title: 'Bloque 4: Independencia y Argumentación',
    subtitle: 'Nivel B2 · Debates formales, entorno profesional y oraciones complejas',
    color: '#7C3AED',
    badge: 'B2',
    orderMin: 25,
    orderMax: 32,
  },
  {
    id: 'B5',
    level: 'C1/C2',
    title: 'Bloque 5: Dominio Profesional y Matices',
    subtitle: 'Nivel C1/C2 · Refinamiento idiomático, inversión y expresiones nativas',
    color: '#DB2777',
    badge: 'C1/C2',
    orderMin: 33,
    orderMax: 36,
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { usageStats } = useAiStore();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('B1');

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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1rem 3rem', color: '#0F172A', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Hero Welcome Card */}
      <DashboardHero
        user={user}
        usageStats={usageStats}
      />

      {/* Bloques Selector Tabs */}
      <BloqueSelectorTabs
        bloques={BLOQUES}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Active Bloque Header Info */}
      {currentBlock && activeTab !== 'ALL' && (
        <div style={{
          background: '#F0FDF4',
          borderLeft: '4px solid #059669',
          padding: '1rem 1.25rem',
          borderRadius: '0 12px 12px 0',
          marginBottom: '1.75rem',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065F46', margin: 0 }}>
            {currentBlock.title}
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#047857' }}>
            {currentBlock.subtitle}
          </p>
        </div>
      )}

      {/* Modules Grid */}
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748B', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
            Cargando módulos educativos...
          </div>
        ) : displayedModules.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px dashed #CBD5E1',
            borderRadius: '20px',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}>
            <BookOpen size={44} color="#059669" style={{ opacity: 0.6, marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#0F172A', fontSize: '1.15rem', margin: '0 0 0.5rem 0' }}>
              No se encontraron módulos para este bloque.
            </h4>
            <button
              onClick={fetchModules}
              style={{
                marginTop: '1rem',
                background: '#059669',
                color: '#FFFFFF',
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
