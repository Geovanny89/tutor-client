import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { input, primaryBtn, smallBtn, overlay, modal } from './constants';
import { Field } from './ProfessorUI';

export default function LessonCreateModal({ mod, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    situation: '',
    teacher_prompt: '',
    icon: '🎯',
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
      const res = await api.post('/professor/lessons', { ...form, module_id: mod.id });
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
      <form onSubmit={submit} style={{ ...modal, maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 0.25rem' }}>Nueva lección</h3>
        <p style={{ margin: '0 0 1rem', color: 'var(--text-subtle)', fontSize: '0.86rem' }}>
          Módulo: {mod.icon} {mod.name}
        </p>
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
