import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, ChevronRight, RefreshCw,
} from 'lucide-react';
import { Modal, Field, inputStyle, ModalActions } from './Modal';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const emptyForm = {
  title: '',
  description: '',
  level: 'A1',
  order_index: '',
  icon: '📚',
  xp_reward: 100,
  is_published: true,
};

export default function AdminModules({ modules, loading, onReload, onManageLessons }) {
  const [editing, setEditing] = useState(null); // null | {} (nuevo) | module (editar)
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing({ isNew: true });
    setForm(emptyForm);
  };

  const openEdit = (module) => {
    setEditing(module);
    setForm({
      title: module.name || module.title || '',
      description: module.description || '',
      level: module.level || 'A1',
      order_index: module.order_index ?? '',
      icon: module.icon || '📚',
      xp_reward: module.xp_reward ?? 100,
      is_published: module.is_published !== false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('El nombre del módulo es obligatorio.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description,
        level: form.level,
        icon: form.icon,
        xp_reward: Number(form.xp_reward) || 0,
        is_published: form.is_published,
      };
      if (form.order_index !== '' && form.order_index !== null) {
        payload.order_index = Number(form.order_index);
      }

      const res = editing.isNew
        ? await api.post('/modules', payload)
        : await api.put(`/modules/${editing.id}`, payload);

      if (res.success) {
        toast.success(editing.isNew ? 'Módulo creado.' : 'Módulo actualizado.');
        setEditing(null);
        onReload();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar el módulo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await api.delete(`/modules/${deleting.id}`);
      if (res.success) {
        const d = res.data?.deleted;
        toast.success(
          d ? `Módulo eliminado (${d.lessons} lecciones, ${d.progress_records} registros de progreso).` : 'Módulo eliminado.'
        );
        setDeleting(null);
        onReload();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar el módulo.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (module) => {
    try {
      const res = await api.put(`/modules/${module.id}`, { is_published: !module.is_published });
      if (res.success) {
        toast.success(module.is_published ? 'Módulo ocultado a los estudiantes.' : 'Módulo publicado.');
        onReload();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo cambiar la publicación.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} color="var(--primary)" /> Módulos y contenido ({modules.length})
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onReload} className="btn btn-soft" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '10px' }}>
            <RefreshCw size={14} /> Recargar
          </button>
          <button
            onClick={openCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'var(--primary)',
              color: 'var(--text-on-primary)', border: 'none', borderRadius: '10px', padding: '0.6rem 1.1rem',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem',
            }}
          >
            <Plus size={16} /> Nuevo módulo
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando módulos...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {modules.map((m) => (
            <div
              key={m.id}
              style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px',
                padding: '1rem 1.15rem', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '1.4rem' }}>{m.icon || '📚'}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-on-primary)', background: 'var(--primary)',
                      padding: '0.1rem 0.45rem', borderRadius: '6px',
                    }}>
                      {m.level}
                    </span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{m.name || m.title}</strong>
                    {!m.is_published && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-gold-text)', background: 'var(--warning-bg)', padding: '0.1rem 0.45rem', borderRadius: '999px' }}>
                        Borrador
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Orden {m.order_index} · {(m.lessons || []).length} lecciones · {m.xp_reward} XP
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={() => onManageLessons(m)}
                  className="btn btn-soft btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', borderRadius: '8px', fontWeight: 700 }}
                >
                  Lecciones <ChevronRight size={13} />
                </button>
                <button onClick={() => togglePublish(m)} title={m.is_published ? 'Ocultar' : 'Publicar'} style={iconBtn(m.is_published ? 'var(--accent-gold-text)' : 'var(--primary-hover)')}>
                  {m.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => openEdit(m)} title="Editar" style={iconBtn('var(--text-secondary)')}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleting(m)} title="Eliminar" style={iconBtn('var(--error-strong)')}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit modal */}
      <Modal
        open={!!editing}
        title={editing?.isNew ? 'Crear nuevo módulo' : 'Editar módulo'}
        subtitle="Los módulos agrupan lecciones y una evaluación final por nivel CEFR."
        onClose={() => setEditing(null)}
      >
        <form onSubmit={handleSubmit}>
          <Field label="Nombre del módulo">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej. A2 - Rutinas diarias y pasado simple"
              style={inputStyle}
              required
            />
          </Field>

          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="¿Qué aprenderá el estudiante en este módulo?"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
            <Field label="Nivel CEFR">
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} style={inputStyle}>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Icono">
              <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} maxLength={4} style={inputStyle} />
            </Field>
            <Field label="XP">
              <input type="number" value={form.xp_reward} min="0" onChange={(e) => setForm({ ...form, xp_reward: e.target.value })} style={inputStyle} />
            </Field>
          </div>

          <Field label="Número de orden" hint="Déjalo vacío para asignarlo automáticamente al final.">
            <input
              type="number"
              value={form.order_index}
              min="0"
              onChange={(e) => setForm({ ...form, order_index: e.target.value })}
              style={inputStyle}
            />
          </Field>

          <Field label="Publicación">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
              Visible para los estudiantes
            </label>
          </Field>

          <ModalActions onCancel={() => setEditing(null)} submitLabel={editing?.isNew ? 'Crear módulo' : 'Guardar cambios'} loading={saving} />
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleting} title="Eliminar módulo" subtitle="Se eliminará todo su contenido" onClose={() => setDeleting(null)}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          ¿Eliminar <strong style={{ color: 'var(--text-primary)' }}>{deleting?.name}</strong>? Se borrarán también
          sus lecciones, su evaluación y los registros de progreso asociados.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button onClick={() => setDeleting(null)} className="btn btn-ghost" style={{ borderRadius: '10px' }}>Cancelar</button>
          <button
            onClick={handleDelete}
            disabled={saving}
            style={{
              background: 'var(--error-solid)', color: 'var(--text-on-primary)', border: 'none', borderRadius: '10px',
              padding: '0.65rem 1.4rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Eliminando...' : 'Eliminar módulo'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

const iconBtn = (color) => ({
  background: 'var(--bg-base)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '0.35rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color,
});
