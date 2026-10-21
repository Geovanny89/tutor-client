import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { useAiStore } from './stores/aiStore';
import api from './services/api';
import toast from 'react-hot-toast';

import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdPlayerModal from './components/ads/AdPlayerModal';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AcademyRegisterPage from './pages/AcademyRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AcademyPublicPage from './pages/AcademyPublicPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import DashboardPage from './pages/DashboardPage';
import VoiceTutorPage from './pages/VoiceTutorPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import LessonPage from './pages/LessonPage';
import EvaluationPage from './pages/EvaluationPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';
import AdminPage from './pages/AdminPage';
import ProfessorPage from './pages/ProfessorPage';
import MessagesPage from './pages/MessagesPage';
import RewardsPage from './pages/RewardsPage';
import VocabularyPage from './pages/VocabularyPage';

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const { showAdModal, adToPlay, setAdModal, fetchUsage } = useAiStore();
  const [claiming, setClaiming] = useState(false);

  const handleAdComplete = async (ad) => {
    setClaiming(true);
    try {
      const res = await api.post(`/ads/${ad.id}/view`);
      if (res.success) {
        toast.success(res.message || `¡Ganaste ${ad.reward_tokens} tokens! 🎉`);
        await fetchUsage();
        setAdModal(false);
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo acreditar el anuncio');
    } finally {
      setClaiming(false);
    }
  };

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
            <Route
              path="/register-academy"
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AcademyRegisterPage />}
            />
            {/* Página pública de una academia (slug del profesor/instituto) */}
            <Route path="/academia/:slug" element={<AcademyPublicPage />} />
            {/* Verificación pública de certificados */}
            <Route path="/verify/:code" element={<VerifyCertificatePage />} />
            <Route path="/verificar/:code" element={<VerifyCertificatePage />} />
            {/* Recuperación de contraseña */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

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
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
            </Route>

            {/* Protected Staff Route (profesor / admin de academia) */}
            <Route element={<ProtectedRoute requireStaff />}>
              <Route path="/professor" element={<ProfessorPage />} />
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

        {showAdModal && adToPlay && (
          <AdPlayerModal
            ad={adToPlay}
            claiming={claiming}
            onClose={() => setAdModal(false)}
            onComplete={handleAdComplete}
          />
        )}
      </div>
    </BrowserRouter>
  );
}
