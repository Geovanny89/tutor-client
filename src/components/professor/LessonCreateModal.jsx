import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Sparkles } from 'lucide-react';
import { input, primaryBtn, smallBtn, overlay, modal } from './constants';
import { Field } from './ProfessorUI';
import { KIDS_GAMES } from '../kids/kidsConstants';
import { TEEN_GAME_SELECTOR } from '../../data/teensMissionsConstants';

export default function LessonCreateModal({ mod, onClose, onSaved }) {
  const isKidsModule = mod?.age_range === 'kids';
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    situation: '',
    teacher_prompt: '',
    icon: isKidsModule ? '🐶' : '🎯',
  });
  const [aiForm, setAiForm] = useState({
    tema: '',
    edad_grupo: mod?.age_range === 'teens' ? 'Jóvenes' : mod?.age_range === 'adults' ? 'Adultos' : 'Niños',
    nivel: mod?.level || 'A1',
    kids_game: 'default',
    teens_game: 'default',
  });
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateWithAi = async () => {
    if (!aiForm.tema.trim()) {
      toast.error('Escribe un tema para generar la lección');
      return;
    }
    setGenerating(true);
    setPreview(null);
    try {
      const res = await api.post('/professor/lessons/generate', {
        tema: aiForm.tema.trim(),
        edad_grupo: aiForm.edad_grupo,
        nivel: aiForm.nivel,
        module_id: mod.id,
        kids_game: aiForm.edad_grupo === 'Niños' ? aiForm.kids_game : undefined,
        teens_game: aiForm.edad_grupo === 'Jóvenes' ? aiForm.teens_game : undefined,
        save: false,
      });
      if (res.success && res.data?.generated) {
        const g = res.data.generated;
        setPreview(g);
        setForm({
          title: g.titulo_leccion || aiForm.tema,
          subtitle: g.objetivo ? String(g.objetivo).slice(0, 200) : '',
          situation: `Lección sobre: ${aiForm.tema}`,
          teacher_prompt: g.prompt_asistente_ia || '',
          icon: aiForm.edad_grupo === 'Niños' ? '🐶' : aiForm.edad_grupo === 'Jóvenes' ? '⚔️' : '✨',
        });
        toast.success('Lección generada. Revisa y guarda.');
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo generar la lección');
    } finally {
      setGenerating(false);
    }
  };

  const saveGenerated = async () => {
    if (!aiForm.tema.trim()) return;
    setSaving(true);
    try {
      const res = await api.post('/professor/lessons/generate', {
        tema: aiForm.tema.trim(),
        edad_grupo: aiForm.edad_grupo,
        nivel: aiForm.nivel,
        module_id: mod.id,
        kids_game: aiForm.edad_grupo === 'Niños' ? aiForm.kids_game : undefined,
        teens_game: aiForm.edad_grupo === 'Jóvenes' ? aiForm.teens_game : undefined,
        save: true,
      });
      if (res.success) {
        toast.success('Lección creada con éxito');
        onSaved();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar la lección');
    } finally {
      setSaving(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    setSaving(true);
    try {
      const content = preview
        ? {
            intro: { text: preview.objetivo || '', audio_text: preview.titulo_leccion || form.title },
            vocabulary: (preview.vocabulario_clave || []).map((word) => ({
              word,
              translation: '',
              example: '',
            })),
            kids_game: aiForm.edad_grupo === 'Niños' ? aiForm.kids_game : undefined,
            teens_game: aiForm.edad_grupo === 'Jóvenes' ? aiForm.teens_game : undefined,
            practice: (preview.quiz || []).map((q, i) => ({
              type: 'multiple_choice',
              question: q.pregunta || `Pregunta ${i + 1}`,
              options: q.opciones || [],
              answer: q.respuesta_correcta || '',
            })),
            voice_challenges: preview.retos_de_voz || [],
          }
        : {
            kids_game: aiForm.edad_grupo === 'Niños' ? aiForm.kids_game : undefined,
            teens_game: aiForm.edad_grupo === 'Jóvenes' ? aiForm.teens_game : undefined,
          };

      const res = await api.post('/professor/lessons', {
        ...form,
        module_id: mod.id,
        content,
      });
      if (res.success) {
        toast.success('Lección creada');
        onSaved();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo crear la lección');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <form
        onSubmit={submit}
        style={{ ...modal, maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 0.25rem' }}>Nueva lección</h3>
        <p style={{ margin: '0 0 1rem', color: 'var(--text-subtle)', fontSize: '0.86rem' }}>
          Módulo: {mod.icon} {mod.name}
        </p>

        {/* 1-click AI generator */}
        <div
          style={{
            background: 'var(--primary-bg)',
            border: '1px solid var(--primary-soft-2)',
            borderRadius: '14px',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <strong style={{ fontSize: '0.92rem', color: 'var(--primary-text)' }}>
              Generador de Lección (1 clic)
            </strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <Field label="Tema">
              <input
                value={aiForm.tema}
                onChange={(e) => setAiForm({ ...aiForm, tema: e.target.value })}
                style={input}
                placeholder="Ej. Colores, animales de la granja, saludos..."
              />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <Field label="Edad">
                <select
                  value={aiForm.edad_grupo}
                  onChange={(e) => setAiForm({ ...aiForm, edad_grupo: e.target.value })}
                  style={input}
                >
                  <option value="Niños">Niños (3-7)</option>
                  <option value="Jóvenes">Jóvenes (8-16)</option>
                  <option value="Adultos">Adultos (17+)</option>
                </select>
              </Field>
              <Field label="Nivel">
                <select
                  value={aiForm.nivel}
                  onChange={(e) => setAiForm({ ...aiForm, nivel: e.target.value })}
                  style={input}
                >
                  {['A1', 'A2', 'B1', 'B2', 'C1'].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>
            </div>

            {aiForm.edad_grupo === 'Niños' && (
              <Field label="🎮 Juego Interactivo para Niños">
                <select
                  value={aiForm.kids_game}
                  onChange={(e) => setAiForm({ ...aiForm, kids_game: e.target.value })}
                  style={{ ...input, fontWeight: 700, borderColor: '#10b981' }}
                >
                  {KIDS_GAMES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.emoji} {g.name} — ({g.categoryName})
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {aiForm.edad_grupo === 'Jóvenes' && (
              <Field label="⚔️ Minijuego RPG / Arcade para Jóvenes">
                <select
                  value={aiForm.teens_game}
                  onChange={(e) => setAiForm({ ...aiForm, teens_game: e.target.value })}
                  style={{ ...input, fontWeight: 700, borderColor: '#6366f1' }}
                >
                  {TEEN_GAME_SELECTOR.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.emoji} {g.name} {g.category ? `— (${g.category})` : ''}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={generating}
                onClick={generateWithAi}
                style={{ ...primaryBtn, flex: 1, justifyContent: 'center' }}
              >
                <Sparkles size={16} /> {generating ? 'Generando...' : 'Generar borrador'}
              </button>
              {preview && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={saveGenerated}
                  style={{ ...smallBtn, justifyContent: 'center', flex: 1 }}
                >
                  Guardar directo
                </button>
              )}
            </div>
          </div>

          {preview && (
            <div
              style={{
                marginTop: '0.85rem',
                padding: '0.85rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {preview.objetivo && (
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>🎯 Objetivo:</strong> {preview.objetivo}
                </div>
              )}
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>🔑 Vocabulario clave:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {(preview.vocabulario_clave || []).map((w) => (
                    <span key={w} style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      background: 'var(--primary-bg)',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                    }}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              {(preview.retos_de_voz || []).length > 0 && (
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>🎙️ Retos de voz ({preview.retos_de_voz.length}):</strong>
                  <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem', lineHeight: 1.4 }}>
                    {preview.retos_de_voz.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(preview.quiz || []).length > 0 && (
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>📝 Quiz interactivo ({preview.quiz.length} preguntas):</strong>
                  <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {preview.quiz.slice(0, 2).map((q, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', background: 'var(--bg-base)', padding: '0.35rem 0.6rem', borderRadius: '6px' }}>
                        <div><strong>P{i + 1}:</strong> {q.pregunta}</div>
                        <div style={{ color: 'var(--text-subtle)', fontSize: '0.74rem' }}>Respuesta correcta: <strong>{q.respuesta_correcta}</strong></div>
                      </div>
                    ))}
                    {preview.quiz.length > 2 && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>+ {preview.quiz.length - 2} preguntas más...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.75rem' }} className="eval-fields">
            <Field label="Icono">
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                style={input}
                maxLength={4}
              />
            </Field>
            <Field label="Título">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={input}
                required
                placeholder="Ej. Saludos y presentaciones"
              />
            </Field>
          </div>
          <Field label="Subtítulo">
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              style={input}
            />
          </Field>
          <Field label="Situación (contexto para la IA)">
            <textarea
              value={form.situation}
              onChange={(e) => setForm({ ...form, situation: e.target.value })}
              rows={2}
              style={{ ...input, resize: 'vertical' }}
              placeholder="Ej. Dos personas se conocen en una cafetería"
            />
          </Field>
          <Field label="Prompt del profesor (instrucción extra para la IA)">
            <textarea
              value={form.teacher_prompt}
              onChange={(e) => setForm({ ...form, teacher_prompt: e.target.value })}
              rows={3}
              style={{ ...input, resize: 'vertical' }}
            />
          </Field>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
          <button type="submit" disabled={saving} style={{ ...primaryBtn, flex: 1, justifyContent: 'center' }}>
            <Plus size={17} /> {saving ? 'Creando...' : 'Crear lección'}
          </button>
          <button type="button" onClick={onClose} style={{ ...smallBtn, justifyContent: 'center' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
