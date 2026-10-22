import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { AGE_OPTIONS, input, primaryBtn } from './constants';
import { Field } from './ProfessorUI';

export default function AcademyTab({ academy, canCreate, onCreate, onUpdate }) {
  const [form, setForm] = useState({
    name: academy?.name || '',
    description: academy?.description || '',
    primary_color: academy?.primary_color || '#6C63FF',
    contact_email: academy?.contact_email || '',
    contact_phone: academy?.contact_phone || '',
    logo_url: academy?.logo_url || '',
    enabled_age_ranges: academy?.enabled_age_ranges || ['kids', 'teens', 'adults'],

    is_public_page_active: academy?.is_public_page_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('logo', file);
    setUploading(true);

    try {
      const res = await api.post('/academies/mine/logo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.success) {
        setForm((f) => ({ ...f, logo_url: res.data.logo_url }));
        toast.success('Logo subido correctamente');
        onUpdate();
      }
    } catch (err) {
      toast.error(err.message || 'Error al subir el logo');
    } finally {
      setUploading(false);
    }
  };

  const toggleAge = (v) =>
    setForm((f) => ({
      ...f,
      enabled_age_ranges: f.enabled_age_ranges.includes(v)
        ? f.enabled_age_ranges.filter((x) => x !== v)
        : [...f.enabled_age_ranges, v],
    }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.enabled_age_ranges.length === 0) {
      toast.error('Selecciona al menos un grupo de edad');
      return;
    }
    setSaving(true);
    try {
      const res = academy
        ? await api.put('/academies/mine', form)
        : await api.post('/academies', form);
      if (res.success) {
        toast.success(academy ? 'Academia actualizada' : '¡Academia creada! 🎉');
        academy ? onUpdate() : onCreate();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar la academia');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: '620px', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      <Field label="Nombre de la academia">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={input}
          placeholder="Ej. English Pro Institute"
        />
      </Field>

      <Field label="Descripción (aparece en tu página pública)">
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          style={{ ...input, resize: 'vertical' }}
          placeholder="Describe tu academia..."
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Color de marca">
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <input
              type="color"
              value={form.primary_color}
              onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
              style={{
                width: '46px',
                height: '42px',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                background: 'var(--bg-base)',
                cursor: 'pointer',
              }}
            />
            <input
              value={form.primary_color}
              onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
              style={input}
            />
          </div>
        </Field>
        <Field label="Logo (URL)">
          <input
            value={form.logo_url}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            style={input}
            placeholder="https://..."
          />
        </Field>
        <Field label="Correo de contacto">
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
            style={input}
          />
        </Field>
        <Field label="Teléfono de contacto">
          <input
            value={form.contact_phone}
            onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
            style={input}
          />
        </Field>

      </div>

      <Field label="Grupos de edad que ofreces">
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {AGE_OPTIONS.map((o) => {
            const on = form.enabled_age_ranges.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => toggleAge(o.value)}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '999px',
                  border: `1.5px solid ${on ? 'var(--primary)' : 'var(--border-strong)'}`,
                  background: on ? 'var(--primary-bg)' : 'var(--bg-base)',
                  color: on ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </Field>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
        }}
      >
        <input
          type="checkbox"
          checked={form.is_public_page_active}
          onChange={(e) => setForm({ ...form, is_public_page_active: e.target.checked })}
          style={{ width: '17px', height: '17px', accentColor: 'var(--primary)' }}
        />
        Aceptar nuevas inscripciones en mi página pública
      </label>

      <button type="submit" disabled={saving} style={{ ...primaryBtn, alignSelf: 'flex-start' }}>
        <Save size={17} /> {saving ? 'Guardando...' : academy ? 'Guardar cambios' : 'Crear academia'}
      </button>
    </form>
  );
}
