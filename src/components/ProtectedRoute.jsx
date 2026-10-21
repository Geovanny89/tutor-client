import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ADMIN_ROLES = ['super_admin', 'tenant_admin'];
const STAFF_ROLES = ['super_admin', 'tenant_admin', 'professor'];

export function ProtectedRoute({ requireAdmin = false, requireStaff = false }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !ADMIN_ROLES.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireStaff && !STAFF_ROLES.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
