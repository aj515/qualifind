import { useState } from 'react';
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
    <div className="h-screen overflow-hidden flex bg-paper">

      {/* ── LEFT BRANDING PANEL ───────────────────────────────────────── */}
      <div className="hidden lg:flex w-[42%] flex-shrink-0 bg-accent-violet flex-col justify-between p-10 relative overflow-hidden border-r-2 border-ink">

        {/* Decorative blobs */}
        <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-white/10 border-2 border-white/20 pointer-events-none" />
        <div className="absolute -left-8 bottom-16 w-36 h-36 rounded-full bg-accent-amber/20 border-2 border-accent-amber/30 pointer-events-none" />
        <div className="absolute right-10 bottom-10 w-20 h-20 rounded-2xl rotate-12 bg-white/10 border-2 border-white/20 pointer-events-none" />
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1.5px,transparent 1.5px)', backgroundSize: '24px 24px' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-card rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-accent-violet text-[26px]">verified</span>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-white leading-none tracking-tight">QualiFind</h2>
              <span className="badge-sticker badge-amber mt-1 text-[9px]">PH Student Portal</span>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/85 leading-relaxed font-medium max-w-xs">
            Your AI-powered gateway to scholarships, grants, and assistantships for Philippine students.
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 flex flex-col gap-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: f.bg, border: `1.5px solid ${f.color}40` }}>
                <span className="material-symbols-outlined fill" style={{ color: f.color, fontSize: '18px' }}>{f.icon}</span>
              </div>
              <div>
                <p className="text-white font-heading font-bold text-xs leading-none mb-1">{f.title}</p>
                <p className="text-white/72 text-xs leading-snug font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center py-3 ${i < 2 ? 'border-r border-white/20' : ''}`}>
              <p className="font-heading font-extrabold text-accent-amber text-xl leading-none">{s.value}</p>
              <p className="text-white/70 text-[11px] font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">

        {/* Subtle dot grid on the right too */}
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-60" />

        {/* Decorative SVG circles behind the form */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <circle cx="90%" cy="10%" r="80" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="1.5"/>
          <circle cx="90%" cy="10%" r="50" fill="none" stroke="rgba(99,102,241,0.07)" strokeWidth="1"/>
          <circle cx="10%" cy="90%" r="70" fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="1.5"/>
          <circle cx="85%" cy="85%" r="35" fill="none" stroke="rgba(251,191,36,0.15)" strokeWidth="1.5"/>
          {/* Dot cluster top-right */}
          {[0,1,2,3].map(c => [0,1,2].map(r => (
            <circle key={`d-${c}-${r}`} cx={`${82+c*2}%`} cy={`${20+r*2}%`} r="1.8" fill="rgba(99,102,241,0.18)" />
          )))}
          {/* Cross accent */}
          <line x1="15%" y1="22%" x2="15%" y2="28%" stroke="rgba(244,114,182,0.2)" strokeWidth="1.5"/>
          <line x1="12%" y1="25%" x2="18%" y2="25%" stroke="rgba(244,114,182,0.2)" strokeWidth="1.5"/>
          <line x1="88%" y1="70%" x2="88%" y2="76%" stroke="rgba(99,102,241,0.18)" strokeWidth="1.5"/>
          <line x1="85%" y1="73%" x2="91%" y2="73%" stroke="rgba(99,102,241,0.18)" strokeWidth="1.5"/>
        </svg>

        {/* Form card */}
        <div className="relative z-10 w-full max-w-md">

          {/* Mobile logo (shown only when left panel is hidden) */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent-violet rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[22px]">verified</span>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-ink leading-none">QualiFind</h2>
              <span className="badge-sticker badge-violet text-[9px] mt-0.5">PH Student Portal</span>
            </div>
          </div>

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
