import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { input, primaryBtn, smallBtn } from './constants';
import { Field, EmptyState } from './ProfessorUI';
import QuestionEditor, { newQuestion } from './QuestionEditor';

export default function EvaluationsTab({ academyExists }) {
  const [modules, setModules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    title: '',
    instructions: '',
    time_limit_minutes: 20,
    min_pass_score: 70,
    questions: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!academyExists) return;
      try {
        const res = await api.get('/professor/modules');
        if (res.success) {
          const own = (res.data.modules || []).filter((m) => m.is_own);
          setModules(own);
          if (own[0]) selectModule(own[0]);
        }
      } catch (err) {
        toast.error('No se pudieron cargar los módulos');
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academyExists]);

  const selectModule = (m) => {
    setSelected(m);
    setForm({
      title: `Evaluación: ${m.name}`,
      instructions: 'Responde todas las preguntas en el tiempo indicado.',
      time_limit_minutes: 20,
      min_pass_score: 70,
      questions: [newQuestion('multiple_choice')],
    });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!selected) return;
    if (form.questions.some((q) => !q.question.trim())) {
      toast.error('Completa el texto de todas las preguntas');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        questions: form.questions.map((q, i) => ({
          id: q.id || `q${i + 1}`,
          type: q.type,
          question: q.question,
          ...(q.type === 'multiple_choice'
            ? { options: q.options, correct: Number(q.correct) }
            : { correct: q.correct }),
          points: Number(q.points) || 10,
          explanation: q.explanation || '',
        })),
      };
      const res = await api.put(`/professor/modules/${selected.id}/evaluation`, payload);
      if (res.success) toast.success('Evaluación guardada');
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar la evaluación');
    } finally {
      setSaving(false);
    }
  };

  if (!academyExists) return <EmptyState text="Crea tu academia para configurar evaluaciones." />;
  if (modules.length === 0) return <EmptyState text="Primero crea un módulo propio en la pestaña «Lecciones»." />;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.25rem' }} className="eval-grid">
      <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '0.75rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', padding: '0.35rem 0.5rem', textTransform: 'uppercase' }}>
          Módulos propios
        </div>
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => selectModule(m)}
            style={{
              width: '100%',
              textAlign: 'left',
              border: 'none',
              cursor: 'pointer',
              padding: '0.6rem 0.7rem',
              borderRadius: '10px',
              background: selected?.id === m.id ? 'var(--primary-bg)' : 'transparent',
              color: selected?.id === m.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.86rem',
            }}
          >
            {m.name}
          </button>
        ))}
      </aside>

      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px', gap: '0.75rem' }} className="eval-fields">
          <Field label="Título">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={input} required />
          </Field>
          <Field label="Minutos">
            <input
              type="number"
              min={1}
              max={240}
              value={form.time_limit_minutes}
              onChange={(e) => setForm({ ...form, time_limit_minutes: Number(e.target.value) })}
              style={input}
            />
          </Field>
          <Field label="% para aprobar">
            <input
              type="number"
              min={1}
              max={100}
              value={form.min_pass_score}
              onChange={(e) => setForm({ ...form, min_pass_score: Number(e.target.value) })}
              style={input}
            />
          </Field>
        </div>

        <Field label="Instrucciones">
          <input
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            style={input}
          />
        </Field>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <strong style={{ fontSize: '0.9rem' }}>Preguntas ({form.questions.length})</strong>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setForm({ ...form, questions: [...form.questions, newQuestion('multiple_choice')] })}
                style={smallBtn}
              >
                + Opción múltiple
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, questions: [...form.questions, newQuestion('fill_blank')] })}
                style={smallBtn}
              >
                + Completar
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {form.questions.map((q, i) => (
              <QuestionEditor
                key={i}
                q={q}
                index={i}
                onChange={(nq) =>
                  setForm({
                    ...form,
                    questions: form.questions.map((x, xi) => (xi === i ? nq : x)),
                  })
                }
                onRemove={() =>
                  setForm({
                    ...form,
                    questions: form.questions.filter((_, xi) => xi !== i),
                  })
                }
              />
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} style={{ ...primaryBtn, alignSelf: 'flex-start' }}>
          <Save size={17} /> {saving ? 'Guardando...' : 'Guardar evaluación'}
        </button>
      </form>
    </div>
  );
}
