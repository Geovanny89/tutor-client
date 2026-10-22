import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Upload, Plus, Pencil, Trash2, Download, Sparkles, Copy, Check, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import { AGE_OPTIONS, input, primaryBtn, smallBtn } from './constants';
import { Field, EmptyState } from './ProfessorUI';
import ModuleEditModal from './ModuleEditModal';
import LessonCreateModal from './LessonCreateModal';
import LessonEditModal from './LessonEditModal';
import { KIDS_GAMES } from '../kids/kidsConstants';
import { TEEN_GAME_SELECTOR } from '../../data/teensMissionsConstants';

export default function LessonsTab({ academyExists }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [newModule, setNewModule] = useState({ name: '', level: 'A1', age_range: 'adults', subject: 'english' });
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonModule, setLessonModule] = useState(null);
  const [ageFilter, setAgeFilter] = useState('all');
  const [expandedModules, setExpandedModules] = useState({});
  const [viewingPrompt, setViewingPrompt] = useState(null);

  const toggleExpand = (id) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm('¿Eliminar esta lección?')) return;
    try {
      const res = await api.delete(`/professor/lessons/${lessonId}`);
      if (res.success) {
        toast.success('Lección eliminada');
        load();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar la lección');
    }
  };

  const load = useCallback(async () => {
    if (!academyExists) return;
    setLoading(true);
    try {
      const res = await api.get('/professor/modules');
      if (res.success) setModules(res.data.modules || []);
    } catch (err) {
      toast.error('No se pudieron cargar los módulos');
    } finally {
      setLoading(false);
    }
  }, [academyExists]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCsv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setImporting(true);
    setImportResult(null);
    try {
      const res = await api.post('/professor/lessons/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.success) {
        setImportResult(res.data);
        toast.success(res.message || 'CSV procesado');
        load();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo importar el CSV');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const createModule = async (e) => {
    e.preventDefault();
    if (!newModule.name.trim()) return;
    try {
      const res = await api.post('/professor/modules', newModule);
      if (res.success) {
        toast.success('Módulo creado');
        setNewModule({ name: '', level: 'A1', age_range: 'adults', subject: 'english' });
        load();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo crear el módulo');
    }
  };

  const importModule = async (m) => {
    try {
      const res = await api.post(`/professor/modules/${m.id}/clone`);
      if (res.success) {
        toast.success(`Módulo "${m.name}" importado a tu academia`);
        load();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo importar el módulo');
    }
  };

  const importAllFiltered = async () => {
    if (filteredDefault.length === 0) return;
    if (!window.confirm(`¿Importar ${filteredDefault.length} módulos a tu academia de una vez?`)) return;
    setImporting(true);
    let count = 0;
    try {
      for (const m of filteredDefault) {
        await api.post(`/professor/modules/${m.id}/clone`);
        count++;
      }
      toast.success(`¡${count} módulos importados con éxito a tu academia!`);
      load();
    } catch (err) {
      toast.error(err.message || 'Error al importar los módulos');
    } finally {
      setImporting(false);
    }
  };

  const deleteModule = async (m) => {
    if (!window.confirm(`¿Eliminar el módulo "${m.name}" junto con sus lecciones y evaluación?`)) return;
    try {
      const res = await api.delete(`/professor/modules/${m.id}`);
      if (res.success) {
        toast.success('Módulo eliminado');
        load();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar el módulo');
    }
  };

  if (!academyExists) return <EmptyState text="Crea tu academia para cargar lecciones." />;

  const ownModules = modules.filter((m) => m.is_own);
  const defaultModules = modules.filter((m) => !m.is_own);
  const filteredDefault = defaultModules.filter(m => ageFilter === 'all' || m.age_range === ageFilter);

  return (
    <div style={{ display: 'grid', gap: '1.75rem' }}>

      {/* ── AI Prompt Generator ── */}
      <AiPromptGenerator onSaved={load} />

      {/* CSV Import */}
      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.35rem' }}>
        <h3 style={{ margin: '0 0 0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={18} color="var(--primary)" /> Importar lecciones por CSV
        </h3>
        <p style={{ color: 'var(--text-subtle)', fontSize: '0.86rem', marginTop: 0 }}>
          Columnas: <code>materia, rango_edad, nivel, modulo, titulo, subtitulo, situacion, vocabulario, prompt_profesor</code>
        </p>
        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: importing ? 'wait' : 'pointer',
          background: 'var(--primary)', color: 'var(--text-on-primary)', padding: '0.65rem 1.2rem',
          borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem',
        }}>
          <Upload size={16} /> {importing ? 'Importando...' : 'Seleccionar archivo CSV'}
          <input type="file" accept=".csv" onChange={handleCsv} disabled={importing} style={{ display: 'none' }} />
        </label>

        {importResult && (
          <div style={{ marginTop: '1rem', fontSize: '0.86rem' }}>
            <div style={{ color: 'var(--success)', fontWeight: 700 }}>✓ {importResult.imported} lecciones importadas</div>
            {importResult.errors?.length > 0 && (
              <ul style={{ color: 'var(--error)', margin: '0.4rem 0 0', paddingLeft: '1.1rem' }}>
                {importResult.errors.map((er, i) => <li key={i}>Fila {er.row}: {er.error}</li>)}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Create module */}
      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.35rem' }}>
        <h3 style={{ margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} color="var(--primary)" /> Crear módulo propio
        </h3>
        <form onSubmit={createModule} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
          <Field label="Nombre">
            <input value={newModule.name} onChange={(e) => setNewModule({ ...newModule, name: e.target.value })} style={input} placeholder="Ej. Presentaciones" />
          </Field>
          <Field label="Nivel">
            <select value={newModule.level} onChange={(e) => setNewModule({ ...newModule, level: e.target.value })} style={input}>
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Edad">
            <select value={newModule.age_range} onChange={(e) => setNewModule({ ...newModule, age_range: e.target.value })} style={input}>
              {AGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Materia">
            <select value={newModule.subject} onChange={(e) => setNewModule({ ...newModule, subject: e.target.value })} style={input}>
              <option value="english">Inglés</option>
              <option value="math">Matemáticas</option>
              <option value="programming">Programación</option>
            </select>
          </Field>
          <button type="submit" style={{ ...primaryBtn, justifyContent: 'center' }}><Plus size={16} /> Crear</button>
        </form>
      </section>

      {/* Mis módulos */}
      <section>
        <h3 style={{ margin: '0 0 0.85rem' }}>Mis módulos ({ownModules.length})</h3>
        {loading ? <p style={{ color: 'var(--text-subtle)' }}>Cargando...</p> : ownModules.length === 0 ? (
          <EmptyState text="Aún no tienes módulos propios. Importa uno por defecto o crea uno nuevo abajo." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '0.85rem' }}>
            {ownModules.map((m) => (
              <div key={m.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <strong style={{ fontSize: '0.94rem' }}>{m.icon} {m.name}</strong>
                    {!m.is_published && <span style={{ fontSize: '0.68rem', background: 'var(--error-bg)', color: 'var(--error)', padding: '0.15rem 0.45rem', borderRadius: '999px', fontWeight: 700 }}>Oculto</span>}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                    {m.level} · {m.lessons_count} lecciones{m.age_range ? ` · ${m.age_range}` : ''}
                  </div>
                </div>

                {/* Lessons inside module */}
                {m.lessons && m.lessons.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        Lecciones ({m.lessons.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleExpand(m.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.74rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
                      >
                        {expandedModules[m.id] === false ? 'Mostrar' : 'Ocultar'}
                        {expandedModules[m.id] === false ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                      </button>
                    </div>

                    {expandedModules[m.id] !== false && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '220px', overflowY: 'auto' }}>
                        {m.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            style={{
                              background: 'var(--bg-main, #f8fafc)',
                              border: '1px solid var(--border)',
                              borderRadius: '8px',
                              padding: '0.45rem 0.65rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.5rem',
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {lesson.icon || '📖'} {lesson.title}
                              </div>
                              {lesson.subtitle && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {lesson.subtitle}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                              {lesson.teacher_prompt && (
                                <button
                                  type="button"
                                  onClick={() => setViewingPrompt({ title: lesson.title, prompt: lesson.teacher_prompt })}
                                  title="Ver Prompt de IA"
                                  style={{
                                    ...smallBtn,
                                    padding: '0.2rem 0.45rem',
                                    fontSize: '0.7rem',
                                    background: 'var(--primary-bg, #ede9fe)',
                                    color: 'var(--primary, #6366f1)',
                                    border: 'none',
                                  }}
                                >
                                  <Bot size={12} /> Prompt
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setEditingLesson({ lesson, moduleAgeRange: m.age_range })}
                                title="Editar lección"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--primary, #6366f1)',
                                  cursor: 'pointer',
                                  padding: '0.2rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteLesson(lesson.id)}
                                title="Eliminar lección"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--error, #ef4444)',
                                  cursor: 'pointer',
                                  padding: '0.2rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.4rem' }}>
                  <button onClick={() => setLessonModule(m)} style={smallBtn}><Plus size={14} /> Lección</button>
                  <button onClick={() => setEditingModule({
                    id: m.id, name: m.name, level: m.level, age_range: m.age_range,
                    subject: m.subject, icon: m.icon, description: m.description || '',
                    is_published: m.is_published,
                  })} style={smallBtn}><Pencil size={14} /> Editar</button>
                  <button onClick={() => deleteModule(m)} style={{ ...smallBtn, color: 'var(--error)' }}><Trash2 size={14} /> Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Módulos por defecto */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.35rem' }}>Módulos por defecto ({filteredDefault.length})</h3>
            <p style={{ margin: 0, color: 'var(--text-subtle)', fontSize: '0.86rem' }}>
              Impórtalos a tu academia para poder editarlos y añadir tus propias lecciones.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {filteredDefault.length > 0 && (
              <button
                type="button"
                onClick={importAllFiltered}
                disabled={importing}
                style={{
                  ...primaryBtn,
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.8rem',
                  gap: '0.4rem',
                  borderRadius: '10px',
                }}
              >
                <Download size={14} /> {importing ? 'Importando...' : `Importar todos (${filteredDefault.length}) de una vez`}
              </button>
            )}
            <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-surface)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              {[
                { id: 'all', label: 'Todos' },
                { id: 'kids', label: 'Niños' },
                { id: 'teens', label: 'Jóvenes' },
                { id: 'adults', label: 'Adultos' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setAgeFilter(f.id)}
                  style={{
                    padding: '0.4rem 0.8rem', borderRadius: '8px', border: 'none',
                    background: ageFilter === f.id ? 'var(--primary)' : 'transparent',
                    color: ageFilter === f.id ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {loading ? <p style={{ color: 'var(--text-subtle)' }}>Cargando...</p> : filteredDefault.length === 0 ? (
          <EmptyState text={`No hay módulos por defecto disponibles para "${ageFilter}".`} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '0.85rem' }}>
            {filteredDefault.map((m) => (
              <div key={m.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <strong style={{ fontSize: '0.94rem' }}>{m.icon} {m.name}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                    {m.level} · {m.lessons_count} lecciones · <span style={{ textTransform: 'capitalize', fontWeight: 700, color: 'var(--primary)' }}>{m.age_range}</span>
                  </div>
                </div>

                {/* Preview of lessons inside default module */}
                {m.lessons && m.lessons.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        Lecciones ({m.lessons.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleExpand(m.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
                      >
                        {expandedModules[m.id] === true ? 'Ocultar' : 'Ver lecciones'}
                        {expandedModules[m.id] === true ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>

                    {expandedModules[m.id] === true && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '180px', overflowY: 'auto', marginBottom: '0.5rem' }}>
                        {m.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            style={{
                              background: 'var(--bg-main, #f8fafc)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              padding: '0.35rem 0.55rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.4rem',
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '0.78rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {lesson.icon || '📖'} {lesson.title}
                              </div>
                              {lesson.subtitle && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {lesson.subtitle}
                                </div>
                              )}
                            </div>
                            {lesson.teacher_prompt && (
                              <button
                                type="button"
                                onClick={() => setViewingPrompt({ title: lesson.title, prompt: lesson.teacher_prompt })}
                                title="Ver Prompt de IA"
                                style={{
                                  ...smallBtn,
                                  padding: '0.15rem 0.4rem',
                                  fontSize: '0.68rem',
                                  background: 'var(--primary-bg, #ede9fe)',
                                  color: 'var(--primary, #6366f1)',
                                  border: 'none',
                                  flexShrink: 0,
                                }}
                              >
                                <Bot size={11} /> Prompt
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button onClick={() => importModule(m)} style={{ ...smallBtn, marginTop: 'auto', justifyContent: 'center' }}>
                  <Download size={14} /> Importar a mi academia
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {editingModule && (
        <ModuleEditModal
          mod={editingModule}
          onClose={() => setEditingModule(null)}
          onSaved={() => { setEditingModule(null); load(); }}
        />
      )}
      {lessonModule && (
        <LessonCreateModal
          mod={lessonModule}
          onClose={() => setLessonModule(null)}
          onSaved={() => { setLessonModule(null); load(); }}
        />
      )}
      {editingLesson && (
        <LessonEditModal
          lesson={editingLesson.lesson}
          moduleAgeRange={editingLesson.moduleAgeRange}
          onClose={() => setEditingLesson(null)}
          onSaved={() => { setEditingLesson(null); load(); }}
        />
      )}

      {/* Modal to view teacher prompt */}
      {viewingPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000,
          }}
          onClick={() => setViewingPrompt(null)}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={20} color="var(--primary)" />
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Prompt de IA: {viewingPrompt.title}</h4>
              </div>
              <button
                onClick={() => setViewingPrompt(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-subtle)' }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                Este es el prompt del sistema configurado para el asistente inteligente durante esta lección:
              </p>
              <pre
                style={{
                  background: 'var(--bg-main, #f8fafc)',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  lineHeight: 1.5,
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                }}
              >
                {viewingPrompt.prompt}
              </pre>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(viewingPrompt.prompt);
                  toast.success('Prompt copiado al portapapeles');
                }}
                style={{ ...primaryBtn, fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                <Copy size={15} /> Copiar Prompt
              </button>
              <button
                onClick={() => setViewingPrompt(null)}
                style={{ ...smallBtn, fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Standalone AI Prompt Generator ───────────────────────────────────────────
function AiPromptGenerator({ onSaved }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ tema: '', edad_grupo: 'Niños', nivel: 'A1', kids_game: 'default', teens_game: 'default' });
  const [preview, setPreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!form.tema.trim()) { toast.error('Escribe un tema'); return; }
    setGenerating(true);
    setPreview(null);
    try {
      const res = await api.post('/professor/lessons/generate', {
        tema: form.tema.trim(),
        edad_grupo: form.edad_grupo,
        nivel: form.nivel,
        kids_game: form.edad_grupo === 'Niños' ? form.kids_game : undefined,
        teens_game: form.edad_grupo === 'Jóvenes' ? form.teens_game : undefined,
        save: false,
      });
      if (res.success && res.data?.generated) {
        setPreview(res.data.generated);
        toast.success('Lección generada ✓');
      }
    } catch (err) {
      toast.error(err.message || 'Error al generar la lección');
    } finally {
      setGenerating(false);
    }
  };

  const copyPrompt = () => {
    if (!preview) return;
    const text = JSON.stringify(preview, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const saveLesson = async () => {
    if (!preview || !form.tema.trim()) return;
    setSaving(true);
    try {
      const res = await api.post('/professor/lessons/generate', {
        tema: form.tema.trim(),
        edad_grupo: form.edad_grupo,
        nivel: form.nivel,
        kids_game: form.edad_grupo === 'Niños' ? form.kids_game : undefined,
        teens_game: form.edad_grupo === 'Jóvenes' ? form.teens_game : undefined,
        save: true,
      });
      if (res.success) {
        toast.success('Lección guardada en tu academia ✓');
        setPreview(null);
        setForm({ tema: '', edad_grupo: 'Niños', nivel: 'A1', kids_game: 'default', teens_game: 'default' });
        if (onSaved) onSaved();
      }
    } catch (err) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--primary-bg, #ede9fe) 0%, var(--bg-surface) 100%)',
      border: '1px solid var(--primary-soft-2, #c4b5fd)',
      borderRadius: '18px',
      overflow: 'hidden',
    }}>
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
          padding: '1.1rem 1.35rem', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <Sparkles size={20} color="var(--primary)" />
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '0.97rem', color: 'var(--primary-text, var(--primary))' }}>
            Generador de Lecciones (1 clic)
          </strong>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Genera un plan de clase completo — vocabulario, quiz, retos de voz y minijuegos interactivos.
          </p>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {open ? '▲ Cerrar' : '▼ Abrir'}
        </span>
      </button>

      {open && (
        <div style={{ padding: '0 1.35rem 1.35rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem', alignItems: 'end' }}>
            <Field label="Tema de la clase">
              <input
                value={form.tema}
                onChange={(e) => setForm({ ...form, tema: e.target.value })}
                style={input}
                placeholder="Ej. Los colores, saludos, el alfabeto..."
              />
            </Field>
            <Field label="Edad">
              <select value={form.edad_grupo} onChange={(e) => setForm({ ...form, edad_grupo: e.target.value })} style={input}>
                <option value="Niños">Niños (3-7)</option>
                <option value="Jóvenes">Jóvenes (8-16)</option>
                <option value="Adultos">Adultos (17+)</option>
              </select>
            </Field>
            <Field label="Nivel">
              <select value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} style={input}>
                {['A1', 'A2', 'B1', 'B2', 'C1'].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
          </div>

          {form.edad_grupo === 'Niños' && (
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

          {form.edad_grupo === 'Jóvenes' && (
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

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={generating}
              onClick={generate}
              style={{ ...primaryBtn, flex: 1, justifyContent: 'center' }}
            >
              <Sparkles size={16} /> {generating ? 'Generando...' : 'Generar lección'}
            </button>
            {preview && (
              <>
                <button type="button" onClick={copyPrompt} style={{ ...smallBtn, gap: '0.4rem' }}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copiado' : 'Copiar JSON'}
                </button>
                <button type="button" disabled={saving} onClick={saveLesson} style={{ ...smallBtn, gap: '0.4rem' }}>
                  <Plus size={15} /> {saving ? 'Guardando...' : 'Guardar en academia'}
                </button>
              </>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.84rem',
            }}>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
                  📚 {preview.titulo_leccion}
                </div>
                {preview.objetivo && (
                  <div style={{ color: 'var(--text-secondary)' }}>🎯 {preview.objetivo}</div>
                )}
              </div>

              {(preview.vocabulario_clave || []).length > 0 && (
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🔑 Vocabulario clave
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.35rem' }}>
                    {preview.vocabulario_clave.map((w) => (
                      <span key={w} style={{ padding: '0.15rem 0.55rem', borderRadius: '999px', background: 'var(--primary-bg)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.78rem' }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(preview.quiz || []).length > 0 && (
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📝 Quiz ({preview.quiz.length} preguntas)
                  </strong>
                  <div style={{ marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {preview.quiz.slice(0, 3).map((q, i) => (
                      <div key={i} style={{ background: 'var(--bg-surface)', padding: '0.4rem 0.7rem', borderRadius: '8px', fontSize: '0.78rem' }}>
                        <div><strong>P{i + 1}:</strong> {q.pregunta}</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          ✓ <strong>{q.respuesta_correcta}</strong>
                        </div>
                      </div>
                    ))}
                    {preview.quiz.length > 3 && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>+ {preview.quiz.length - 3} más...</div>
                    )}
                  </div>
                </div>
              )}

              {(preview.retos_de_voz || []).length > 0 && (
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🎙️ Retos de voz
                  </strong>
                  <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.2rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                    {preview.retos_de_voz.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {preview.prompt_asistente_ia && (
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🤖 Prompt para el asistente IA
                  </strong>
                  <div style={{ marginTop: '0.35rem', background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.6rem 0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.76rem', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: '120px', overflowY: 'auto' }}>
                    {preview.prompt_asistente_ia}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
