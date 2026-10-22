import React, { useMemo } from 'react';
import { getPersonasForAge } from '../../stores/aiStore';
import { useAuthStore } from '../../stores/authStore';

export default function TutorPersonaSelector({ activePersona, onSelectPersona }) {
  const ageRange = useAuthStore((s) => s.user?.age_range) || 'adults';
  const personas = useMemo(() => getPersonasForAge(ageRange), [ageRange]);

  return (
    <div style={{
      display: 'flex',
      gap: '0.85rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
      marginBottom: '1.25rem',
    }}>
      {personas.map((persona) => {
        const isSelected = activePersona.id === persona.id;
        return (
          <button
            key={persona.id}
            onClick={() => onSelectPersona(persona)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1.15rem',
              borderRadius: '16px',
              border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: isSelected ? 'var(--primary-bg)' : 'var(--bg-surface)',
              boxShadow: isSelected ? '0 4px 14px rgba(5, 150, 105, 0.12)' : '0 2px 6px rgba(15, 23, 42, 0.02)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '1.75rem' }}>{persona.avatar}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? 'var(--primary-text)' : 'var(--text-primary)' }}>
                {persona.name}
                {persona.bilingual ? ' 🇪🇸🇺🇸' : ''}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-subtle)' }}>
                {persona.role} ({persona.accent})
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
