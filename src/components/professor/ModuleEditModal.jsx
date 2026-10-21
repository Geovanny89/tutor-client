import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { AGE_OPTIONS, input, primaryBtn, smallBtn, overlay, modal } from './constants';
import { Field } from './ProfessorUI';

export default function ModuleEditModal({ mod, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: mod.name || '',
    level: mod.level || 'A1',
    age_range: mod.age_range || 'adults',
    subject: mod.subject || 'english',
    icon: mod.icon || '📚',
    description: mod.description || '',
    is_published: mod.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/professor/modules/${mod.id}`, form);
      if (res.success) {
        toast.success('Módulo actualizado');
        onSaved();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar el módulo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <form onSubmit={submit} style={{ ...modal, maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 1rem' }}>Editar módulo</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <Field label="Nombre">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={input}
              required
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '0.75rem' }} className="eval-fields">
            <Field label="Icono">
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                style={input}
                maxLength={4}
              />
            </Field>
            <Field label="Nivel">
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                style={input}
              >
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Edad">
              <select
                value={form.age_range}
                onChange={(e) => setForm({ ...form, age_range: e.target.value })}
                style={input}
              >
                {AGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Materia">
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              style={input}
            >
              <option value="english">Inglés</option>
              <option value="math">Matemáticas</option>
              <option value="programming">Programación</option>
            </select>
          </Field>
          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              style={{ ...input, resize: 'vertical' }}
            />
          </Field>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              style={{ width: '17px', height: '17px', accentColor: 'var(--primary)' }}
            />
            Visible para los estudiantes
          </label>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
          <button type="submit" disabled={saving} style={{ ...primaryBtn, flex: 1, justifyContent: 'center' }}>
            <Save size={17} /> {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button type="button" onClick={onClose} style={{ ...smallBtn, justifyContent: 'center' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
