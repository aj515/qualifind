import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Wrap a route element with this to require a session, and optionally a specific role.
// Mirrors the old vanilla app's navigateTo() role-guard, but as a real route guard.
export default function ProtectedRoute({ role, children }) {
  const { session, role: userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-accent-violet animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Session exists but the profile row (and its role) hasn't loaded yet — wait rather
  // than treating "no role yet" as a mismatch, which would bounce back to this same route.
  if (role && !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-accent-violet animate-spin">progress_activity</span>
      </div>
    );
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;
  }

  return children;
}
