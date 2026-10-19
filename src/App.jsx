import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VoiceTutorPage from './pages/VoiceTutorPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import LessonPage from './pages/LessonPage';
import EvaluationPage from './pages/EvaluationPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';
import AdminPage from './pages/AdminPage';
import VocabularyPage from './pages/VocabularyPage';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
            />

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tutor" element={<VoiceTutorPage />} />
              <Route path="/modules/:id" element={<ModuleDetailPage />} />
              <Route path="/modules/:id/practice" element={<PracticePage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/lessons/:id" element={<LessonPage />} />
              <Route path="/evaluations/:moduleId" element={<EvaluationPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
            </Route>

            {/* Protected Super Admin Route */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a35',
              color: 'var(--text-on-primary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
