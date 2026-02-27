import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar        from './components/layout/Navbar';
import PrivateRoute  from './components/layout/PrivateRoute';
import AdminRoute    from './components/layout/AdminRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { FullPageSpinner } from './components/ui/LoadingSpinner';

// Code-split every page — each is a separate JS chunk
const LandingPage     = lazy(() => import('./pages/LandingPage'));
const AboutPage       = lazy(() => import('./pages/AboutPage'));
const LoginPage       = lazy(() => import('./pages/LoginPage'));
const RegisterPage    = lazy(() => import('./pages/RegisterPage'));
const Dashboard       = lazy(() => import('./pages/Dashboard'));
const DirectiveForm   = lazy(() => import('./pages/DirectiveForm'));
const Vault           = lazy(() => import('./pages/Vault'));
const QRCardPage      = lazy(() => import('./pages/QRCardPage'));
const FeedbackPage    = lazy(() => import('./pages/FeedbackPage'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const EmergencyCardPage = lazy(() => import('./pages/EmergencyCardPage'));

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<FullPageSpinner />}>
              <Routes>
                <Route path="/"         element={<LandingPage />} />
                <Route path="/about"    element={<AboutPage />} />
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/emergency-card/:token" element={<EmergencyCardPage />} />

                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/directive" element={<PrivateRoute><DirectiveForm /></PrivateRoute>} />
                <Route path="/vault"     element={<PrivateRoute><Vault /></PrivateRoute>} />
                <Route path="/qr-card"   element={<PrivateRoute><QRCardPage /></PrivateRoute>} />
                <Route path="/feedback"  element={<PrivateRoute><FeedbackPage /></PrivateRoute>} />

                <Route path="/admin"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}
