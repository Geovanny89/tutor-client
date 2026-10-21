import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Upload, Plus, Pencil, Trash2, Download } from 'lucide-react';
import { AGE_OPTIONS, input, primaryBtn, smallBtn } from './constants';
import { Field, EmptyState } from './ProfessorUI';
import ModuleEditModal from './ModuleEditModal';
import LessonCreateModal from './LessonCreateModal';

export default function LessonsTab({ academyExists }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [newModule, setNewModule] = useState({ name: '', level: 'A1', age_range: 'adults', subject: 'english' });
  const [editingModule, setEditingModule] = useState(null);
  const [lessonModule, setLessonModule] = useState(null);
  const [ageFilter, setAgeFilter] = useState('all');

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
        toast.success('Módulo importado a tu academia');
        load();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo importar el módulo');
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '0.85rem' }}>
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
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 'auto' }}>
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
        
        {loading ? <p style={{ color: 'var(--text-subtle)' }}>Cargando...</p> : filteredDefault.length === 0 ? (
          <EmptyState text={`No hay módulos por defecto disponibles para "${ageFilter}".`} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '0.85rem' }}>
            {filteredDefault.map((m) => (
              <div key={m.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div>
                  <strong style={{ fontSize: '0.94rem' }}>{m.icon} {m.name}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                    {m.level} · {m.lessons_count} lecciones · <span style={{ textTransform: 'capitalize', fontWeight: 700, color: 'var(--primary)' }}>{m.age_range}</span>
                  </div>
                </div>
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
    </div>
  );
}
