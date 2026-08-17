import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const FEATURES = [
  {
    icon: 'auto_awesome',
    bg: 'rgba(251,191,36,0.18)',
    color: '#FBBF24',
    title: 'AI-Powered Matching',
    desc: 'Claude AI ranks every PH scholarship by your personal profile — not just keywords.',
  },
  {
    icon: 'school',
    bg: 'rgba(52,211,153,0.18)',
    color: '#34D399',
    title: '200+ PH Programs',
    desc: 'CHED, DOST-SEI, LGU grants, private foundations, and student loans in one place.',
  },
  {
    icon: 'task_alt',
    bg: 'rgba(56,189,248,0.18)',
    color: '#38BDF8',
    title: 'Step-by-Step Plans',
    desc: 'Know exactly what to do next — from document prep to application deadlines.',
  },
];

const STATS = [
  { value: '200+', label: 'Programs' },
  { value: '10k+', label: 'Students' },
  { value: '98%',  label: 'Accuracy' },
];

export default function LoginPage() {
  const { session, role, loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('qualifind_theme', isDark ? 'dark' : 'light'); } catch (_) {}
  }, [isDark]);

  if (!loading && session) {
    return <Navigate to={role === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) { setErrorMsg(error.message); return; }
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="h-screen overflow-hidden flex bg-paper bg-dot-grid relative">

      {/* ── Colorful Geometric Floating Shapes ───────────────────────── */}
      <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-accent-amber/20 border-2 border-accent-amber/40 pointer-events-none" />
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl rotate-45 bg-accent-cyan/20 border-2 border-accent-cyan/40 pointer-events-none" />
      <div className="absolute left-[30%] bottom-8 w-24 h-24 rounded-3xl rotate-12 bg-accent-pink/20 border-2 border-accent-pink/40 pointer-events-none" />
      <div className="absolute right-12 top-12 w-32 h-32 rounded-full bg-accent-violet/20 border-2 border-accent-violet/35 pointer-events-none" />
      <div className="absolute -right-8 -bottom-8 w-52 h-52 rounded-3xl -rotate-12 bg-accent-mint/20 border-2 border-accent-mint/40 pointer-events-none" />

      {/* ── Decorative SVG background across entire screen ──────────── */}
      <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {/* Ghost circles */}
        <circle cx="6%" cy="18%" r="90" fill="none" stroke="rgba(99,102,241,0.14)" strokeWidth="1.5"/>
        <circle cx="6%" cy="18%" r="55" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="1"/>
        <circle cx="92%" cy="82%" r="100" fill="none" stroke="rgba(99,102,241,0.14)" strokeWidth="1.5"/>
        <circle cx="92%" cy="82%" r="60" fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="1"/>
        <circle cx="90%" cy="12%" r="60" fill="none" stroke="rgba(251,191,36,0.22)" strokeWidth="1.5"/>
        <circle cx="10%" cy="85%" r="70" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="1.5"/>

        {/* Connecting lines */}
        <line x1="6%" y1="18%" x2="90%" y2="12%" stroke="rgba(99,102,241,0.09)" strokeWidth="1" strokeDasharray="6 5"/>
        <line x1="6%" y1="18%" x2="10%" y2="85%" stroke="rgba(99,102,241,0.08)" strokeWidth="1" strokeDasharray="4 6"/>
        <line x1="90%" y1="12%" x2="92%" y2="82%" stroke="rgba(99,102,241,0.09)" strokeWidth="1" strokeDasharray="6 5"/>
        <line x1="10%" y1="85%" x2="92%" y2="82%" stroke="rgba(52,211,153,0.1)" strokeWidth="1" strokeDasharray="5 6"/>

        {/* Accent dots */}
        <circle cx="6%" cy="18%" r="5" fill="rgba(99,102,241,0.25)"/>
        <circle cx="90%" cy="12%" r="4" fill="rgba(251,191,36,0.35)"/>
        <circle cx="92%" cy="82%" r="5" fill="rgba(99,102,241,0.22)"/>
        <circle cx="10%" cy="85%" r="4" fill="rgba(52,211,153,0.3)"/>

        {/* Dot clusters */}
        {[0,1,2,3,4].map(col => [0,1,2,3].map(row => (
          <circle key={`tr-${col}-${row}`} cx={`${86 + col * 1.8}%`} cy={`${20 + row * 1.8}%`} r="1.8" fill="rgba(99,102,241,0.22)"/>
        )))}
        {[0,1,2,3,4].map(col => [0,1,2,3].map(row => (
          <circle key={`bl-${col}-${row}`} cx={`${3 + col * 1.8}%`} cy={`${70 + row * 1.8}%`} r="1.8" fill="rgba(52,211,153,0.25)"/>
        )))}

        {/* Cross accents */}
        <line x1="93%" y1="37%" x2="93%" y2="43%" stroke="rgba(99,102,241,0.25)" strokeWidth="1.5"/>
        <line x1="90.5%" y1="40%" x2="95.5%" y2="40%" stroke="rgba(99,102,241,0.25)" strokeWidth="1.5"/>
        <line x1="5%" y1="52%" x2="5%" y2="58%" stroke="rgba(244,114,182,0.25)" strokeWidth="1.5"/>
        <line x1="2.5%" y1="55%" x2="7.5%" y2="55%" stroke="rgba(244,114,182,0.25)" strokeWidth="1.5"/>
      </svg>

      {/* ── Dark mode toggle — top right ─────────────────────────────── */}
      <button
        id="login-dark-toggle"
        onClick={() => setIsDark((d) => !d)}
        title="Toggle dark mode"
        className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-card border-2 border-ink shadow-pop hover:scale-105 transition-transform"
      >
        <span className="material-symbols-outlined text-[20px] text-ink">
          {isDark ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      {/* ── LEFT BRANDING PANEL ───────────────────────────────────────── */}
      <div className="hidden lg:flex w-[42%] flex-shrink-0 flex-col justify-between p-10 relative z-10 overflow-hidden">

        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center gap-3 no-underline group w-fit cursor-pointer">
            <div className="w-12 h-12 bg-accent-violet rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-[26px]">verified</span>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-ink leading-none tracking-tight group-hover:text-accent-violet transition-colors">QualiFind</h2>
              <span className="badge-sticker badge-amber mt-1 text-[9px]">PH Student Portal</span>
            </div>
          </Link>
          <p className="mt-5 text-sm text-ink-muted leading-relaxed font-medium max-w-xs">
            Your AI-powered gateway to scholarships, grants, and assistantships for Philippine students.
          </p>
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3 bg-card border-2 border-ink rounded-2xl p-3.5 shadow-pop-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: f.bg, border: `1.5px solid ${f.color}50` }}>
                <span className="material-symbols-outlined fill" style={{ color: f.color, fontSize: '18px' }}>{f.icon}</span>
              </div>
              <div>
                <p className="text-ink font-heading font-bold text-xs leading-none mb-1">{f.title}</p>
                <p className="text-ink-muted text-xs leading-snug font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 bg-card border-2 border-ink rounded-2xl overflow-hidden shadow-pop-sm">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center py-3 ${i < 2 ? 'border-r-2 border-ink' : ''}`}>
              <p className="font-heading font-extrabold text-accent-violet text-xl leading-none">{s.value}</p>
              <p className="text-ink-muted text-[11px] font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 overflow-hidden">

        {/* Form card */}
        <div className="w-full max-w-md">

          {/* Mobile logo (shown only when left panel is hidden) */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-6 no-underline group w-fit cursor-pointer">
            <div className="w-10 h-10 bg-accent-violet rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-[22px]">verified</span>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-ink leading-none group-hover:text-accent-violet transition-colors">QualiFind</h2>
              <span className="badge-sticker badge-violet text-[9px] mt-0.5">PH Student Portal</span>
            </div>
          </Link>

          <div className="card-sticker bg-card p-8 shadow-pop-lg">

            {/* Heading */}
            <div className="mb-6">
              <span className="badge-sticker badge-violet text-[9px] mb-3">
                <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>waving_hand</span>
                Welcome back
              </span>
              <h1 className="font-heading font-extrabold text-2xl text-ink tracking-tight leading-tight mt-2 mb-1">
                Sign In to QualiFind
              </h1>
              <p className="text-xs text-ink-muted font-medium">Enter your credentials to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-accent-pink/10 border-2 border-accent-pink text-xs font-semibold text-ink">
                  <span className="material-symbols-outlined text-accent-pink text-[18px] flex-shrink-0 mt-0.5">error</span>
                  {errorMsg}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="login-email" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Email</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 z-10 text-ink-muted text-[18px] pointer-events-none">mail</span>
                  <input
                    id="login-email" type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maria.santos@student.cebu.edu.ph"
                    className="w-full input-playful py-2.5 pl-10 pr-4 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="login-password" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Password</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 z-10 text-ink-muted text-[18px] pointer-events-none">lock</span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full input-playful py-2.5 pl-10 pr-10 text-xs font-semibold"
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 z-10 text-ink-muted hover:text-ink p-1">
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className="btn-candy w-full py-3 text-sm disabled:opacity-60">
                <span>{submitting ? 'Signing in…' : 'Sign In to QualiFind'}</span>
                {!submitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-ink/10" />
              <span className="text-xs text-ink-muted font-semibold">or</span>
              <div className="flex-1 h-px bg-ink/10" />
            </div>

            <p className="text-center text-xs font-semibold text-ink-muted">
              New to QualiFind?{' '}
              <Link to="/register" className="font-extrabold text-accent-violet hover:underline">
                Create a free account
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-5 mt-4">
            {[['shield','Secure login'],['lock','Encrypted'],['diversity_3','Free for students']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-1.5 text-ink-muted text-[11px] font-semibold">
                <span className="material-symbols-outlined text-accent-violet" style={{ fontSize: '13px' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
