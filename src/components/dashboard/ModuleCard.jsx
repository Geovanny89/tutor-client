import React from 'react';
import { BookOpen, Award, CheckCircle, PlayCircle, Mic, Lock } from 'lucide-react';

export default function ModuleCard({ module, onStudyLesson, onTakeExam, onPracticeTutor }) {
  const lessonsCount = module.Lessons?.length || module.lessons?.length || module.total_lessons || 1;
  const hasPassedEval = module.evaluation_passed === true || module.evaluation_status === 'passed';
  const locked = module.is_locked === true;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        opacity: locked ? 0.72 : 1,
      }}
      onMouseEnter={(e) => {
        if (locked) return;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 24px rgba(5, 150, 105, 0.1)';
        e.currentTarget.style.borderColor = 'var(--primary-soft-2)';
      }}
      onMouseLeave={(e) => {
        if (locked) return;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.04)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div>
        {/* Header: Order & Level */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--primary-text)',
            background: 'var(--primary-bg)',
            border: '1px solid var(--primary-soft-2)',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}>
            <span>{module.icon || '📖'}</span> Módulo {module.order_index}
          </span>

          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {locked && (
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-subtle)',
                background: 'var(--bg-muted)',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}>
                <Lock size={12} /> Bloqueado
              </span>
            )}
            {hasPassedEval && (
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--primary)',
                background: 'var(--primary-soft)',
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
              color: 'var(--text-on-primary)',
              background: 'var(--primary)',
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
          color: 'var(--text-primary)',
          margin: '0 0 0.5rem 0',
          lineHeight: '1.35',
          fontFamily: 'var(--font-display)',
        }}>
          {module.name || module.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
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
          color: 'var(--text-subtle)',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--bg-muted)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <BookOpen size={14} color="var(--primary)" /> {lessonsCount} Lección
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Award size={14} color="var(--accent-gold-strong)" /> Examen +100 XP
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onStudyLesson(module.id)}
            disabled={locked}
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
              background: locked ? 'var(--bg-muted)' : 'var(--primary)',
              color: locked ? 'var(--text-muted)' : 'var(--text-on-primary)',
              border: 'none',
              cursor: locked ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <PlayCircle size={17} /> Estudiar Lección
          </button>

          <button
            onClick={() => onTakeExam(module.id)}
            disabled={locked}
            title="Realizar el examen evaluativo de este módulo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.7rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid var(--accent-gold-border)',
              background: 'var(--warning-bg)',
              color: 'var(--accent-gold-text)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: locked ? 'not-allowed' : 'pointer',
            }}
          >
            <Award size={16} color="var(--accent-gold-strong)" /> Examen
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
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Mic size={14} /> Practicar este tema por voz con la IA
        </button>

        {locked && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
            fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-subtle)',
          }}>
            <Lock size={12} /> Aprueba el módulo anterior para desbloquear
          </div>
        )}
      </div>
    </div>
  );
}
