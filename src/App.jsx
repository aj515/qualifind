import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import StudentLayout from './components/StudentLayout.jsx';
import { isSupabaseConfigured } from './lib/supabaseClient.js';
import SetupStatusPage from './pages/SetupStatusPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboardPlaceholderPage from './pages/admin/DashboardPlaceholderPage.jsx';
import DashboardPage from './pages/student/DashboardPage.jsx';
import MatcherPage from './pages/student/MatcherPage.jsx';
import OpportunitiesPage from './pages/student/OpportunitiesPage.jsx';
import EligibilityDetailPage from './pages/student/EligibilityDetailPage.jsx';
import ActionPlanPage from './pages/student/ActionPlanPage.jsx';
import SavedApplicationsPage from './pages/student/SavedApplicationsPage.jsx';
import ProfilePage from './pages/student/ProfilePage.jsx';

export default function App() {
  // No Supabase project connected yet — show setup instructions instead of a broken auth flow.
  if (!isSupabaseConfigured) {
    return (
      <Routes>
        <Route path="*" element={<SetupStatusPage />} />
      </Routes>
    );
  }

  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/matcher" element={<MatcherPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/opportunities/:id/eligibility" element={<EligibilityDetailPage />} />
            <Route path="/opportunities/:id/action-plan" element={<ActionPlanPage />} />
            <Route path="/saved-applications" element={<SavedApplicationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin views land in Phase 4 — placeholder proves auth/role-routing works */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPlaceholderPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
}
