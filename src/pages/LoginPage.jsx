import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { session, role, loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Already signed in — bounce straight to the right dashboard.
  if (!loading && session) {
    return <Navigate to={role === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Role lives on the account, not something chosen at login — always aim for the
    // student dashboard, and ProtectedRoute redirects admins to theirs once the
    // profile (with its real role) loads.
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl card-sticker bg-card shadow-pop-lg p-0 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Panel: Branding */}
        <div className="lg:col-span-4 bg-accent-violet p-8 text-white flex flex-col justify-between relative overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-ink">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-accent-amber rounded-full opacity-30 pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-paper text-ink rounded-2xl border-2 border-ink flex items-center justify-center shadow-pop-sm font-bold">
              <span className="material-symbols-outlined text-accent-violet text-[26px]">verified</span>
            </div>
            <div>
              <h2 className="font-extrabold text-2xl tracking-tight leading-none text-white font-heading">QualiFind</h2>
              <span className="badge-sticker badge-amber text-[9px] mt-1">PH Student Portal</span>
            </div>
          </div>

          <p className="relative z-10 text-xs text-white/90 leading-relaxed font-medium pt-6">
            AI-matched scholarships, grants, assistantships, and loans for Philippine students.
          </p>
        </div>

        {/* Right Panel: Sign-In Form */}
        <div className="lg:col-span-8 p-8 lg:p-10 flex flex-col justify-center bg-card">
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold font-heading text-ink tracking-tight mb-1">Sign In to QualiFind</h2>
            <p className="text-xs text-ink-muted font-medium">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-accent-pink/10 border-2 border-accent-pink text-xs font-semibold text-ink">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="login-email" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 z-10 text-ink-muted text-[18px] pointer-events-none">mail</span>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. maria.santos@student.cebu.edu.ph"
                  className="w-full input-playful py-2.5 pl-10 pr-4 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="login-password" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 z-10 text-ink-muted text-[18px] pointer-events-none">lock</span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full input-playful py-2.5 pl-10 pr-10 text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 z-10 text-ink-muted hover:text-ink p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-candy w-full py-3 text-sm disabled:opacity-60">
              <span>{submitting ? 'Signing in…' : 'Sign In to QualiFind'}</span>
              {!submitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <p className="text-center text-xs font-semibold text-ink-muted mt-5">
            New to QualiFind?{' '}
            <Link to="/register" className="font-extrabold text-accent-violet hover:underline">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
