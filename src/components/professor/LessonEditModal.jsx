import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';
import { input, primaryBtn, smallBtn, overlay, modal } from './constants';
import { Field } from './ProfessorUI';
import { KIDS_GAMES } from '../kids/kidsConstants';
import { TEEN_GAME_SELECTOR } from '../../data/teensMissionsConstants';

export default function LessonEditModal({ lesson, moduleAgeRange, onClose, onSaved }) {
  const isKids = moduleAgeRange === 'kids' || lesson.age_range === 'kids';
  const isTeens = moduleAgeRange === 'teens' || lesson.age_range === 'teens';

  const content = typeof lesson.content === 'object' && lesson.content !== null ? lesson.content : {};

  const [form, setForm] = useState({
    title: lesson.title || '',
    subtitle: lesson.subtitle || '',
    situation: lesson.situation || '',
    teacher_prompt: lesson.teacher_prompt || '',
    icon: lesson.icon || (isKids ? '🐶' : isTeens ? '⚔️' : '📖'),
    kids_game: content.kids_game || 'default',
    teens_game: content.teens_game || 'default',
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    setSaving(true);
    try {
      const updatedContent = {
        ...content,
        kids_game: isKids ? form.kids_game : undefined,
        teens_game: isTeens ? form.teens_game : undefined,
      };

      const res = await api.put(`/professor/lessons/${lesson.id}`, {
        title: form.title.trim(),
        subtitle: form.subtitle ? form.subtitle.trim() : null,
        situation: form.situation ? form.situation.trim() : null,
        teacher_prompt: form.teacher_prompt ? form.teacher_prompt.trim() : null,
        icon: form.icon,
        content: updatedContent,
      });

      if (res.success) {
        toast.success('Lección actualizada con éxito');
        onSaved();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar la lección');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <form
        onSubmit={submit}
        style={{ ...modal, maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Editar lección</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.75rem' }}>
            <Field label="Icono">
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                style={{ ...input, textAlign: 'center', fontSize: '1.2rem' }}
                maxLength={4}
              />
            </Field>
            <Field label="Título">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={input}
                required
              />
            </Field>
          </div>

          <Field label="Subtítulo / Objetivo pedagógico">
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              style={input}
              placeholder="Ej. Past Simple vs Continuous en contexto"
            />
          </Field>

          <Field label="Situación o contexto de aprendizaje">
            <input
              value={form.situation}
              onChange={(e) => setForm({ ...form, situation: e.target.value })}
              style={input}
              placeholder="Ej. En el aeropuerto, debatiendo sobre tecnología..."
            />
          </Field>

          {isKids && (
            <Field label="🎮 Juego Interactivo para Niños">
              <select
                value={form.kids_game}
                onChange={(e) => setForm({ ...form, kids_game: e.target.value })}
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

          {isTeens && (
            <Field label="⚔️ Minijuego RPG / Arcade para Jóvenes">
              <select
                value={form.teens_game}
                onChange={(e) => setForm({ ...form, teens_game: e.target.value })}
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

          <Field label="Prompt de la tutora de IA (personalizado)">
            <textarea
              value={form.teacher_prompt}
              onChange={(e) => setForm({ ...form, teacher_prompt: e.target.value })}
              style={{ ...input, minHeight: '80px', resize: 'vertical' }}
              placeholder="Instrucciones para la IA durante la lección..."
            />
          </Field>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={smallBtn}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} style={primaryBtn}>
              <Save size={16} /> {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
