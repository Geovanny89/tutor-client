import React, { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { TABS } from '../components/professor/constants';
import { PublicLink } from '../components/professor/ProfessorUI';
import OverviewTab from '../components/professor/OverviewTab';
import AcademyTab from '../components/professor/AcademyTab';
import StudentsTab from '../components/professor/StudentsTab';
import LessonsTab from '../components/professor/LessonsTab';
import EvaluationsTab from '../components/professor/EvaluationsTab';

export default function ProfessorPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [academy, setAcademy] = useState(null);
  const [canCreate, setCanCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCore = useCallback(async () => {
    setLoading(true);
    try {
      const acad = await api.get('/academies/mine');
      if (acad.success) {
        setAcademy(acad.data.academy);
        setCanCreate(acad.data.can_create);
      }
      if (acad.data?.academy) {
        const ov = await api.get('/professor/overview');
        if (ov.success) setOverview(ov.data);
      }
    } catch (err) {
      /* la academia puede no existir aún */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCore();
  }, [loadCore]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-subtle)' }}>
        Cargando panel...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '1.5rem 1rem 3rem', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 800, margin: 0 }}>
            Panel del Profesor
          </h1>
          <p style={{ margin: '0.2rem 0 0', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
            {academy ? academy.name : `Hola ${user?.name?.split(' ')[0]}, crea tu academia para empezar`}
          </p>
        </div>
        {academy && (
          <PublicLink slug={academy.slug} color={academy.primary_color} />
        )}
      </div>

      {/* Tabs navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', paddingBottom: '0.4rem' }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                border: 'none',
                background: active ? 'var(--primary-bg)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: active ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              <Icon size={16} /> {label}
            </button>
          );
        })}
      </div>

      {/* Tab contents */}
      {tab === 'overview' && <OverviewTab overview={overview} academy={academy} />}
      {tab === 'academy' && (
        <AcademyTab
          academy={academy}
          canCreate={canCreate}
          onCreate={() => { loadCore(); setTab('overview'); }}
          onUpdate={loadCore}
        />
      )}
      {tab === 'students' && <StudentsTab academyExists={!!academy} />}
      {tab === 'lessons' && <LessonsTab academyExists={!!academy} />}
      {tab === 'evaluations' && <EvaluationsTab academyExists={!!academy} />}

      <style>{`
        @media (max-width: 760px) {
          .eval-grid { grid-template-columns: 1fr !important; }
          .eval-fields { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
