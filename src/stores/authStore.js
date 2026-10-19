import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('kdice_user') || 'null'),
  token: localStorage.getItem('kdice_token') || null,
  isAuthenticated: !!localStorage.getItem('kdice_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const { user, token } = res.data;
        localStorage.setItem('kdice_token', token);
        localStorage.setItem('kdice_user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, loading: false });
        return { success: true };
      }
      throw new Error(res.message || 'Error al iniciar sesión');
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  register: async ({ name, email, password, target_level, tenant_id }) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        target_level: target_level || 'B2',
        tenant_id,
      });
      if (res.success && res.data) {
        const { user, token } = res.data;
        localStorage.setItem('kdice_token', token);
        localStorage.setItem('kdice_user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, loading: false });
        return { success: true };
      }
      throw new Error(res.message || 'Error al registrarse');
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  fetchProfile: async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data) {
        localStorage.setItem('kdice_user', JSON.stringify(res.data));
        set({ user: res.data });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  },

  logout: () => {
    localStorage.removeItem('kdice_token');
    localStorage.removeItem('kdice_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
