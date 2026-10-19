import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft, FileJson, Wand2 } from 'lucide-react';
import { Modal, Field, inputStyle, ModalActions } from './Modal';

const EMPTY_CONTENT = {
  intro: { text: '' },
  vocabulary: [{ word: '', translation: '', example: '' }],
  dialogue: [{ speaker: 'Tutor', text: '', translation: '' }],
  grammar: { rule: '', examples: [] },
  practice: [{ type: 'fill_blank', question: '', answer: '' }],
};

const emptyForm = {
  title: '',
  subtitle: '',
  order_index: '',
  icon: '🎯',
  duration_minutes: 10,
  xp_reward: 20,
  requires_voice: true,
  is_published: true,
  contentText: JSON.stringify(EMPTY_CONTENT, null, 2),
};

export default function AdminLessons({ module, onBack }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/lessons?module_id=${module.id}`);
      if (res.success) setLessons(res.data || []);
    } catch (err) {
      toast.error('No se pudieron cargar las lecciones.');
    } finally {
      setLoading(false);
    }
  }, [module.id]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const openCreate = () => {
    setEditing({ isNew: true });
    setForm(emptyForm);
  };

  const openEdit = async (lesson) => {
    try {
      const res = await api.get(`/lessons/${lesson.id}`);
      if (res.success && res.data) {
        const l = res.data;
        setEditing(l);
        setForm({
          title: l.title || '',
          subtitle: l.subtitle || '',
          order_index: l.order_index ?? '',
          icon: l.icon || '🎯',
          duration_minutes: l.duration_minutes ?? 10,
          xp_reward: l.xp_reward ?? 20,
          requires_voice: l.requires_voice !== false,
          is_published: l.is_published !== false,
          contentText: JSON.stringify(l.content || EMPTY_CONTENT, null, 2),
        });
      }
    } catch (err) {
      toast.error('No se pudo abrir la lección.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('El título de la lección es obligatorio.');
      return;
    }

    let content;
    try {
      content = form.contentText.trim() ? JSON.parse(form.contentText) : {};
    } catch {
      toast.error('El contenido JSON tiene un error de formato. Revísalo antes de guardar.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle,
        icon: form.icon,
        duration_minutes: Number(form.duration_minutes) || 10,
        xp_reward: Number(form.xp_reward) || 0,
        requires_voice: form.requires_voice,
        is_published: form.is_published,
        content,
      };
      if (form.order_index !== '' && form.order_index !== null) payload.order_index = Number(form.order_index);

      const res = editing.isNew
        ? await api.post('/lessons', { ...payload, module_id: module.id })
        : await api.put(`/lessons/${editing.id}`, payload);

      if (res.success) {
        toast.success(editing.isNew ? 'Lección creada.' : 'Lección actualizada.');
        setEditing(null);
        fetchLessons();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar la lección.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await api.delete(`/lessons/${deleting.id}`);
      if (res.success) {
        toast.success('Lección eliminada.');
        setDeleting(null);
        fetchLessons();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar la lección.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (lesson) => {
    try {
      const res = await api.put(`/lessons/${lesson.id}`, { is_published: !lesson.is_published });
      if (res.success) {
        toast.success(lesson.is_published ? 'Lección ocultada.' : 'Lección publicada.');
        fetchLessons();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo cambiar la publicación.');
    }
  };

  const prettyPrint = () => {
    try {
      setForm({ ...form, contentText: JSON.stringify(JSON.parse(form.contentText), null, 2) });
      toast.success('JSON formateado.');
    } catch {
      toast.error('El JSON no es válido.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px' }}>
            <ArrowLeft size={14} /> Módulos
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {module.icon} {module.name || module.title}
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Nivel {module.level} · {lessons.length} lecciones
            </div>
          </div>
        </div>

        <button
          onClick={openCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'var(--primary)',
            color: 'var(--text-on-primary)', border: 'none', borderRadius: '10px', padding: '0.6rem 1.1rem',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem',
          }}
        >
          <Plus size={16} /> Nueva lección
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando lecciones...</div>
      ) : lessons.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)', border: '1px dashed var(--border)', borderRadius: '16px',
          padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)',
        }}>
          Este módulo aún no tiene lecciones. Crea la primera con el botón de arriba.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {lessons.map((lesson) => (
            <div key={lesson.id} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px',
              padding: '0.95rem 1.15rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <span style={{
                  width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-bg)',
                  border: '1px solid var(--primary-soft-2)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', flexShrink: 0,
                }}>
                  {lesson.order_index}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{lesson.title}</strong>
                    {!lesson.is_published && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-gold-text)', background: 'var(--warning-bg)', padding: '0.1rem 0.45rem', borderRadius: '999px' }}>
                        Borrador
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {lesson.duration_minutes} min · {lesson.xp_reward} XP {lesson.requires_voice ? '· 🎤 voz' : ''}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button onClick={() => togglePublish(lesson)} title={lesson.is_published ? 'Ocultar' : 'Publicar'} style={iconBtn(lesson.is_published ? 'var(--accent-gold-text)' : 'var(--primary-hover)')}>
                  {lesson.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => openEdit(lesson)} title="Editar" style={iconBtn('var(--text-secondary)')}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleting(lesson)} title="Eliminar" style={iconBtn('var(--error-strong)')}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit lesson modal */}
      <Modal
        open={!!editing}
        title={editing?.isNew ? 'Nueva lección' : 'Editar lección'}
        subtitle={`Módulo: ${module.name || module.title}`}
        onClose={() => setEditing(null)}
        maxWidth="720px"
      >
        <form onSubmit={handleSubmit}>
          <Field label="Título de la lección">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej. Presente simple: hábitos diarios"
              style={inputStyle}
              required
            />
          </Field>

          <Field label="Subtítulo">
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Ej. Describe tu rutina con precisión"
              style={inputStyle}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.85rem' }}>
            <Field label="Orden">
              <input type="number" value={form.order_index} min="1" onChange={(e) => setForm({ ...form, order_index: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Icono">
              <input type="text" value={form.icon} maxLength={4} onChange={(e) => setForm({ ...form, icon: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Minutos">
              <input type="number" value={form.duration_minutes} min="1" onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="XP">
              <input type="number" value={form.xp_reward} min="0" onChange={(e) => setForm({ ...form, xp_reward: e.target.value })} style={inputStyle} />
            </Field>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={form.requires_voice} onChange={(e) => setForm({ ...form, requires_voice: e.target.checked })} />
              Requiere micrófono
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              Publicada para estudiantes
            </label>
          </div>

          <Field label="Contenido de la lección (JSON)">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FileJson size={13} /> intro · vocabulary · dialogue · grammar · practice
              </span>
              <button type="button" onClick={prettyPrint} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Wand2 size={12} /> Formatear
              </button>
            </div>
            <textarea
              value={form.contentText}
              onChange={(e) => setForm({ ...form, contentText: e.target.value })}
              rows={14}
              spellCheck={false}
              style={{ ...inputStyle, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.78rem', lineHeight: 1.5, resize: 'vertical' }}
            />
          </Field>

          <ModalActions onCancel={() => setEditing(null)} submitLabel={editing?.isNew ? 'Crear lección' : 'Guardar cambios'} loading={saving} />
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleting} title="Eliminar lección" onClose={() => setDeleting(null)}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          ¿Eliminar la lección <strong style={{ color: 'var(--text-primary)' }}>{deleting?.title}</strong> y el progreso asociado?
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
            {saving ? 'Eliminando...' : 'Eliminar lección'}
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
