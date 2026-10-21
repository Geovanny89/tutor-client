import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Search, Pencil, Trash2, UserCheck, UserX, RefreshCw, Shield, Zap, LogIn } from 'lucide-react';
import { Modal, Field, inputStyle, ModalActions } from './Modal';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  { value: 'student', label: 'Estudiante' },
  { value: 'tenant_admin', label: 'Admin de organización' },
  { value: 'super_admin', label: 'Super Admin' },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const roleLabel = (role) => ROLES.find((r) => r.value === role)?.label || role;

export default function AdminUsers({ users, pagination, loading, filters, onFilterChange, onReload, currentUser }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      name: user.name,
      role: user.role,
      current_level: user.current_level,
      is_active: user.is_active,
      total_xp: user.total_xp,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/admin/users/${editing.id}`, form);
      if (res.success) {
        toast.success('Usuario actualizado correctamente.');
        setEditing(null);
        onReload();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await api.delete(`/admin/users/${deleting.id}`);
      if (res.success) {
        toast.success('Usuario eliminado.');
        setDeleting(null);
        onReload();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user) => {
    try {
      const res = await api.put(`/admin/users/${user.id}`, { is_active: !user.is_active });
      if (res.success) {
        toast.success(user.is_active ? 'Cuenta suspendida.' : 'Cuenta activada.');
        onReload();
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo cambiar el estado.');
    }
  };

  const handleImpersonate = async (user) => {
    if (user.id === currentUser?.id) return;
    
    const confirm = window.confirm(`¿Seguro que quieres entrar como "${user.name}"? Tu sesión actual de administrador se cerrará.`);
    if (!confirm) return;

    try {
      const res = await api.post(`/admin/users/${user.id}/impersonate`);
      if (res.success && res.data) {
        const { user: targetUser, token } = res.data;
        
        // Update local storage and store
        localStorage.setItem('kdice_token', token);
        localStorage.setItem('kdice_user', JSON.stringify(targetUser));
        
        // Refresh the app state by redirecting to dashboard
        toast.success(`Ahora navegando como ${targetUser.name}`);
        window.location.href = targetUser.role === 'student' ? '/dashboard' : '/admin';
      }
    } catch (err) {
      toast.error(err.message || 'Error al intentar acceder como este usuario.');
    }
  };

  const totalPages = pagination?.total_pages || 1;

  return (
    <div>
      {/* Filters */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center',
        background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px',
        padding: '1rem', marginBottom: '1.25rem',
      }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            style={{ ...inputStyle, paddingLeft: '2.2rem' }}
          />
        </div>

        <select value={filters.role} onChange={(e) => onFilterChange({ role: e.target.value, page: 1 })} style={{ ...inputStyle, width: 'auto' }}>
          <option value="">Todos los roles</option>
          {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>

        <select value={filters.level} onChange={(e) => onFilterChange({ level: e.target.value, page: 1 })} style={{ ...inputStyle, width: 'auto' }}>
          <option value="">Todos los niveles</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <select value={filters.status} onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })} style={{ ...inputStyle, width: 'auto' }}>
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Suspendidos</option>
        </select>

        <button onClick={onReload} className="btn btn-soft" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '10px' }}>
          <RefreshCw size={14} /> Recargar
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}>
                {['Usuario', 'Rol', 'Nivel', 'XP', 'Avance', 'IA hoy', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem',
                    fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando usuarios...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay usuarios que coincidan con el filtro.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {u.name}
                        {u.id === currentUser?.id && (
                          <span style={{ marginLeft: '0.4rem', fontSize: '0.68rem', color: 'var(--primary-hover)', background: 'var(--primary-bg)', padding: '0.1rem 0.4rem', borderRadius: '999px' }}>tú</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px',
                        background: u.role === 'student' ? 'var(--bg-muted)' : '#EFF6FF',
                        color: u.role === 'student' ? 'var(--text-secondary)' : '#1D4ED8',
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                      }}>
                        {u.role !== 'student' && <Shield size={11} />} {roleLabel(u.role)}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>{u.current_level}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{u.total_xp}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.completed_items} ítems</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold-text)' }}>
                        <Zap size={12} fill="var(--accent-gold)" color="var(--accent-gold)" /> {u.ai_today}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px',
                        background: u.is_active ? 'var(--primary-bg)' : 'var(--error-bg)',
                        color: u.is_active ? 'var(--primary-hover)' : 'var(--error-strong)',
                      }}>
                        {u.is_active ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {currentUser?.role === 'super_admin' && u.id !== currentUser?.id && (
                          <button onClick={() => handleImpersonate(u)} title="Acceder como este usuario" style={iconBtnStyle('var(--primary)')}>
                            <LogIn size={14} />
                          </button>
                        )}
                        <button onClick={() => openEdit(u)} title="Editar" style={iconBtnStyle('var(--text-secondary)')}>
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => toggleActive(u)}
                          title={u.is_active ? 'Suspender' : 'Activar'}
                          disabled={u.id === currentUser?.id}
                          style={{ ...iconBtnStyle(u.is_active ? 'var(--accent-gold-text)' : 'var(--primary-hover)'), opacity: u.id === currentUser?.id ? 0.4 : 1 }}
                        >
                          {u.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                        <button
                          onClick={() => setDeleting(u)}
                          title="Eliminar"
                          disabled={u.id === currentUser?.id}
                          style={{ ...iconBtnStyle('var(--error-strong)'), opacity: u.id === currentUser?.id ? 0.4 : 1 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '1rem', padding: '0.85rem 1rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Página {pagination.page} de {totalPages} · {pagination.total} usuarios
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onFilterChange({ page: Math.max(1, pagination.page - 1) })}
                disabled={pagination.page <= 1}
                className="btn btn-ghost btn-sm"
                style={{ opacity: pagination.page <= 1 ? 0.5 : 1 }}
              >
                Anterior
              </button>
              <button
                onClick={() => onFilterChange({ page: Math.min(totalPages, pagination.page + 1) })}
                disabled={pagination.page >= totalPages}
                className="btn btn-ghost btn-sm"
                style={{ opacity: pagination.page >= totalPages ? 0.5 : 1 }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <Modal open={!!editing} title="Editar usuario" subtitle={editing?.email} onClose={() => setEditing(null)}>
        <form onSubmit={handleSaveEdit}>
          <Field label="Nombre">
            <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          </Field>

          <Field label="Rol" hint={editing?.id === currentUser?.id ? 'No puedes cambiar tu propio rol.' : undefined}>
            <select
              value={form.role || 'student'}
              disabled={editing?.id === currentUser?.id}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ ...inputStyle, opacity: editing?.id === currentUser?.id ? 0.6 : 1 }}
            >
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Nivel CEFR">
              <select value={form.current_level || 'A1'} onChange={(e) => setForm({ ...form, current_level: e.target.value })} style={inputStyle}>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="XP total">
              <input
                type="number"
                value={form.total_xp ?? 0}
                onChange={(e) => setForm({ ...form, total_xp: e.target.value })}
                style={inputStyle}
                min="0"
              />
            </Field>
          </div>

          <Field label="Estado de la cuenta">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={!!form.is_active}
                disabled={editing?.id === currentUser?.id}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Cuenta activa (puede iniciar sesión)
            </label>
          </Field>

          <ModalActions onCancel={() => setEditing(null)} submitLabel="Guardar cambios" loading={saving} />
        </form>
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleting} title="Eliminar usuario" subtitle="Esta acción no se puede deshacer" onClose={() => setDeleting(null)}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          ¿Seguro que quieres eliminar la cuenta de <strong style={{ color: 'var(--text-primary)' }}>{deleting?.name}</strong> ({deleting?.email})?
          Se perderá su progreso y su historial de práctica con IA.
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
            {saving ? 'Eliminando...' : 'Eliminar definitivamente'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

const iconBtnStyle = (color) => ({
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
