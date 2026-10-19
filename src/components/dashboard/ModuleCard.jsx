import React from 'react';
import { BookOpen, Award, CheckCircle, PlayCircle, Mic } from 'lucide-react';

export default function ModuleCard({ module, onStudyLesson, onTakeExam, onPracticeTutor }) {
  const lessonsCount = module.Lessons?.length || module.lessons?.length || module.total_lessons || 1;
  const hasPassedEval = module.evaluation_status === 'passed';

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 24px rgba(5, 150, 105, 0.1)';
        e.currentTarget.style.borderColor = '#A7F3D0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.04)';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      <div>
        {/* Header: Order & Level */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#065F46',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}>
            <span>{module.icon || '📖'}</span> Módulo {module.order_index}
          </span>

          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {hasPassedEval && (
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#059669',
                background: '#D1FAE5',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}>
                <CheckCircle size={13} /> Aprobado
              </span>
            )}
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#FFFFFF',
              background: '#059669',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
            }}>
              {module.level}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: '#0F172A',
          margin: '0 0 0.5rem 0',
          lineHeight: '1.35',
          fontFamily: 'var(--font-display)',
        }}>
          {module.name || module.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.88rem',
          color: '#475569',
          lineHeight: '1.5',
          margin: '0 0 1.1rem 0',
          minHeight: '2.6rem',
        }}>
          {module.description}
        </p>

        {/* Metadata */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          fontSize: '0.8rem',
          color: '#64748B',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid #F1F5F9',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <BookOpen size={14} color="#059669" /> {lessonsCount} Lección
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Award size={14} color="#D97706" /> Examen +100 XP
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onStudyLesson(module.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.7rem 1rem',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: '#059669',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <PlayCircle size={17} /> Estudiar Lección
          </button>

          <button
            onClick={() => onTakeExam(module.id)}
            title="Realizar el examen evaluativo de este módulo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.7rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid #FDE68A',
              background: '#FFFBEB',
              color: '#92400E',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Award size={16} color="#D97706" /> Examen
          </button>
        </div>

        {/* Voice Tutor Topic Shortcut */}
        <button
          onClick={() => onPracticeTutor(module)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.8rem',
            borderRadius: '8px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#059669',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Mic size={14} /> Practicar este tema por voz con la IA
        </button>
      </div>
    </div>
  );
}
