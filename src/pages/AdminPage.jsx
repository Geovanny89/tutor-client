import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, Users, BookOpen, ShieldCheck } from 'lucide-react';

import AdminStats from '../components/admin/AdminStats';
import AdminUsers from '../components/admin/AdminUsers';
import AdminModules from '../components/admin/AdminModules';
import AdminLessons from '../components/admin/AdminLessons';

const TABS = [
  { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'content', label: 'Módulos y lecciones', icon: BookOpen },
];

export default function AdminPage() {
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userFilters, setUserFilters] = useState({ search: '', role: '', level: '', status: '', page: 1 });

  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  // ── Data loaders ──────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.success) setStats(res.data);
    } catch (err) {
      toast.error('No se pudieron cargar las métricas.');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async (filters) => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) params.append(key, value);
      });
      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.success) {
        setUsers(res.data || []);
        setUserPagination(res.pagination || null);
      }
    } catch (err) {
      toast.error('No se pudo cargar el listado de usuarios.');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const fetchModules = useCallback(async () => {
    setModulesLoading(true);
    try {
      const res = await api.get('/modules?include_unpublished=true');
      if (res.success) setModules(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('No se pudieron cargar los módulos.');
    } finally {
      setModulesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers(userFilters);
    if (activeTab === 'content' && modules.length === 0) fetchModules();
  }, [activeTab, userFilters, fetchUsers, fetchModules, modules.length]);

  const handleFilterChange = (patch) => setUserFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1.75rem 1.25rem 3rem', color: 'var(--text-primary)' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.3rem 0.75rem', borderRadius: '999px',
          background: 'var(--primary-bg)', border: '1px solid var(--primary-soft-2)',
          color: 'var(--primary-hover)', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.6rem',
        }}>
          <ShieldCheck size={14} /> Panel Super Admin
        </div>
        <h1 style={{
          fontSize: '1.9rem', fontWeight: 800, margin: 0,
          color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
        }}>
          Control total de la plataforma
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.35rem 0 0 0' }}>
          Gestiona estudiantes, currículo, contenido y supervisa el uso de la IA en {user?.tenant?.name || 'KDice English'}.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '0.4rem', background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: '14px', padding: '0.35rem', marginBottom: '1.5rem', overflowX: 'auto',
      }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSelectedModule(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                padding: '0.6rem 1rem', borderRadius: '10px', border: 'none',
                background: active ? 'var(--primary-bg)' : 'transparent',
                color: active ? 'var(--primary-hover)' : 'var(--text-subtle)',
                fontWeight: active ? 800 : 600, fontSize: '0.88rem',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.18s',
              }}
            >
              <Icon size={15} color={active ? 'var(--primary)' : 'var(--text-muted)'} /> {label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      {activeTab === 'overview' && <AdminStats stats={stats} loading={statsLoading} />}

      {activeTab === 'users' && (
        <AdminUsers
          users={users}
          pagination={userPagination}
          loading={usersLoading}
          filters={userFilters}
          currentUser={user}
          onFilterChange={handleFilterChange}
          onReload={() => fetchUsers(userFilters)}
        />
      )}

      {activeTab === 'content' && (
        selectedModule ? (
          <AdminLessons module={selectedModule} onBack={() => setSelectedModule(null)} />
        ) : (
          <AdminModules
            modules={modules}
            loading={modulesLoading}
            onReload={fetchModules}
            onManageLessons={(module) => setSelectedModule(module)}
          />
        )
      )}
    </div>
  );
}
