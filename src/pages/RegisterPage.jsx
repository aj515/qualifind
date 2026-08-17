import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const COURSE_OPTIONS = [
  'B.S. Information Technology',
  'B.S. Computer Science',
  'B.S. Information Systems',
  'B.S. Engineering',
  'B.S. Nursing',
  'B.S. Accountancy',
  'B.S. Business Administration',
  'B.S. Education',
  'Other'
];

// Public registration is student-only. Admin accounts are never self-service —
// anyone could otherwise grant themselves write access to the programs database
// via RLS. Promote an account to admin manually (see README) after verifying who
// they are.
export default function RegisterPage() {
  const { session, role: currentRole, loading, signUp } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState(COURSE_OPTIONS[0]);
  const [customCourse, setCustomCourse] = useState('');
  const [yearLevel, setYearLevel] = useState('2nd Year');
  const [gwa, setGwa] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [location, setLocation] = useState('');
  const [isFinanciallyDisadvantaged, setIsFinanciallyDisadvantaged] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkEmailMsg, setCheckEmailMsg] = useState('');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('qualifind_theme', isDark ? 'dark' : 'light'); } catch (_) {}
  }, [isDark]);

  if (!loading && session) {
    return <Navigate to={currentRole === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;
  }

  function getInitials(first, last) {
    if (!first && !last) return 'QF';
    if (!last) return first.slice(0, 2).toUpperCase();
    return (first[0] + last[0]).toUpperCase();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setCheckEmailMsg('');

    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const resolvedCourse = course === 'Other' ? customCourse.trim() : course;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMsg('Please fill in your first name, last name, and email.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match. Please try again.");
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please agree to the Terms of Service to continue.');
      return;
    }

    setSubmitting(true);
    const isGraduate = yearLevel === 'Graduate';
    // All of this rides along as auth metadata — the handle_new_user DB trigger
    // (supabase/migrations/0002_signup_metadata_fields.sql) writes it into
    // profiles/students at insert time, so it lands whether or not Supabase
    // requires email confirmation before a session exists.
    const { data, error } = await signUp(email.trim(), password, {
      role: 'student',
      name,
      avatar: getInitials(firstName.trim(), lastName.trim()),
      institution: institution.trim(),
      course: resolvedCourse,
      education_level: isGraduate ? 'Graduate' : 'College',
      year_level: isGraduate ? '' : parseInt(yearLevel, 10),
      // GWA/birthdate/location are optional at signup — a new student may not have
      // grades yet, or may not want to share these immediately. Left blank, they stay
      // null and just mean "needs verification" rather than an eligibility failure
      // (see computeEligibility in src/lib/eligibility.js). Fillable later from Profile.
      gpa: gwa ? parseFloat(gwa) : '',
      birthdate,
      location: location.trim(),
      is_financially_disadvantaged: isFinanciallyDisadvantaged
    });

    if (error) {
      setSubmitting(false);
      setErrorMsg(error.message);
      return;
    }

    setSubmitting(false);

    // No session yet means Supabase is requiring email confirmation before login.
    if (!data.session) {
      setCheckEmailMsg('Account created! Check your email to confirm it, then sign in.');
      return;
    }

    navigate('/dashboard', { replace: true });
  }

  const initials = getInitials(firstName.trim(), lastName.trim());

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
        id="register-dark-toggle"
        onClick={() => setIsDark((d) => !d)}
        title="Toggle dark mode"
        className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-card border-2 border-ink shadow-pop hover:scale-105 transition-transform"
      >
        <span className="material-symbols-outlined text-[20px] text-ink">
          {isDark ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      {/* ── Logo — top left ──────────────────────────────────────────── */}
      <div className="fixed top-6 left-6 z-20 max-w-xs">
        <Link to="/" className="flex items-center gap-3 no-underline group w-fit cursor-pointer">
          <div className="w-12 h-12 bg-accent-violet rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-[26px]">verified</span>
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-ink leading-none tracking-tight group-hover:text-accent-violet transition-colors">QualiFind</h2>
            <span className="badge-sticker badge-violet mt-1 text-[9px]">PH Student Portal</span>
          </div>
        </Link>
        <p className="mt-3 text-sm text-ink-muted leading-relaxed font-medium">
          Your AI-powered gateway to scholarships, grants, and assistantships for Philippine students.
        </p>
      </div>

      {/* ── FORM PANEL ────────────────────────────────────────────────── */}
      <div className="w-full flex flex-col items-center justify-center px-8 relative z-10 overflow-hidden">

        <div className="w-full max-w-xl">

          {/* Card */}
          <div className="card-sticker bg-card shadow-pop-lg p-7">

            {checkEmailMsg ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl border-2 border-accent-mint bg-accent-mint/10 flex items-center justify-center">
                  <span className="material-symbols-outlined fill text-accent-mint text-[28px]">mark_email_read</span>
                </div>
                <h2 className="font-heading font-extrabold text-xl text-ink mb-2">Check your inbox!</h2>
                <p className="text-sm text-ink-muted leading-relaxed mb-5">{checkEmailMsg}</p>
                <Link to="/login" className="btn-candy" style={{ textDecoration: 'none' }}>
                  Go to Sign In <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Heading + avatar preview */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="badge-sticker badge-violet text-[9px] mb-2">
                      <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>rocket_launch</span>
                      Free account
                    </span>
                    <h1 className="font-heading font-extrabold text-xl text-ink tracking-tight leading-tight mt-2 mb-0.5">
                      Sign Up for QualiFind
                    </h1>
                    <p className="text-xs text-ink-muted font-medium">Create your Student Seeker account.</p>
                  </div>
                  {/* Live initials avatar */}
                  <div className="w-12 h-12 rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center flex-shrink-0 ml-4"
                    style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}>
                    <span className="font-heading font-extrabold text-sm text-white tracking-tight">{initials}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-accent-pink/10 border-2 border-accent-pink text-xs font-semibold text-ink mb-3">
                    <span className="material-symbols-outlined text-accent-pink text-[16px] flex-shrink-0 mt-0.5">error</span>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-2.5">

                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label htmlFor="reg-first-name" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">First Name</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 z-10 text-ink-muted text-[16px] pointer-events-none">person</span>
                        <input id="reg-first-name" type="text" required value={firstName}
                          onChange={(e) => setFirstName(e.target.value)} placeholder="Juan"
                          className="w-full input-playful py-2 pl-9 pr-3 text-xs font-semibold" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reg-last-name" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">Last Name</label>
                      <input id="reg-last-name" type="text" required value={lastName}
                        onChange={(e) => setLastName(e.target.value)} placeholder="Dela Cruz"
                        className="w-full input-playful py-2 px-3 text-xs font-semibold" />
                    </div>
                  </div>

                  {/* Email row — full width so the full address is visible */}
                  <div className="space-y-1">
                    <label htmlFor="reg-email" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">Email</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 z-10 text-ink-muted text-[16px] pointer-events-none">mail</span>
                      <input id="reg-email" type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)} placeholder="e.g. juan.delacruz@student.edu.ph"
                        className="w-full input-playful py-2 pl-9 pr-4 text-xs font-semibold" />
                    </div>
                  </div>

                  {/* Password row */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label htmlFor="reg-password" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">Password</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 z-10 text-ink-muted text-[16px] pointer-events-none">lock</span>
                        <input id="reg-password" type="password" required minLength={8} value={password}
                          onChange={(e) => setPassword(e.target.value)} placeholder="8+ characters"
                          className="w-full input-playful py-2 pl-9 pr-3 text-xs font-semibold" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reg-confirm-password" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">Confirm</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 z-10 text-ink-muted text-[16px] pointer-events-none">lock_clock</span>
                        <input id="reg-confirm-password" type="password" required minLength={8} value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter"
                          className="w-full input-playful py-2 pl-9 pr-3 text-xs font-semibold" />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="flex-1 h-px bg-ink/10" />
                    <span className="text-[10px] font-heading font-bold text-ink-muted uppercase tracking-wider">Academic Profile <span className="normal-case font-medium">(optional)</span></span>
                    <div className="flex-1 h-px bg-ink/10" />
                  </div>

                  {/* School + Course */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label htmlFor="reg-institution" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">School</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 z-10 text-ink-muted text-[16px] pointer-events-none">apartment</span>
                        <input id="reg-institution" type="text" value={institution}
                          onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. CTU"
                          className="w-full input-playful py-2 pl-9 pr-3 text-xs font-semibold" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reg-course" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">Course</label>
                      <select id="reg-course" value={course} onChange={(e) => setCourse(e.target.value)}
                        className="w-full input-playful py-2 px-3 text-xs font-semibold">
                        {COURSE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      {course === 'Other' && (
                        <input type="text" value={customCourse} onChange={(e) => setCustomCourse(e.target.value)}
                          placeholder="Enter your course" className="w-full input-playful py-2 px-3 text-xs font-semibold mt-1.5" />
                      )}
                    </div>
                  </div>

                  {/* Year + GWA + Birthdate + Location */}
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="space-y-1">
                      <label htmlFor="reg-year" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">Year</label>
                      <select id="reg-year" value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}
                        className="w-full input-playful py-2 px-2 text-xs font-semibold">
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>Graduate</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reg-gwa" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">GWA %</label>
                      <input id="reg-gwa" type="number" min="0" max="100" step="0.1" value={gwa}
                        onChange={(e) => setGwa(e.target.value)} placeholder="91.5"
                        className="w-full input-playful py-2 px-3 text-xs font-semibold" />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reg-birthdate" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">Birthdate</label>
                      <input id="reg-birthdate" type="date" value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="w-full input-playful py-2 px-2 text-xs font-semibold" />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reg-location" className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink block">City</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-2 z-10 text-ink-muted text-[14px] pointer-events-none">location_on</span>
                        <input id="reg-location" type="text" value={location}
                          onChange={(e) => setLocation(e.target.value)} placeholder="Cebu"
                          className="w-full input-playful py-2 pl-7 pr-2 text-xs font-semibold" />
                      </div>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center justify-between gap-4 pt-0.5">
                    <label className={`flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink p-2 rounded-xl border-2 transition-all flex-1 ${isFinanciallyDisadvantaged ? 'bg-accent-amber/10 border-accent-amber/40' : 'bg-card-subtle border-ink/10'}`}>
                      <input type="checkbox" checked={isFinanciallyDisadvantaged}
                        onChange={(e) => setIsFinanciallyDisadvantaged(e.target.checked)}
                        className="w-3.5 h-3.5 flex-shrink-0" style={{ accentColor: '#6366F1' }} />
                      <span className="leading-tight">Low-income / indigent</span>
                    </label>
                    <label className={`flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink p-2 rounded-xl border-2 transition-all flex-1 ${termsAccepted ? 'bg-accent-violet/5 border-accent-violet/30' : 'bg-card-subtle border-ink/10'}`}>
                      <input type="checkbox" checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-3.5 h-3.5 flex-shrink-0" style={{ accentColor: '#6366F1' }} />
                      <span className="leading-tight">I agree to Terms of Service</span>
                    </label>
                  </div>

                  <button type="submit" disabled={submitting}
                    className="btn-candy w-full py-2.5 text-sm disabled:opacity-60">
                    <span>{submitting ? 'Creating account…' : 'Create Account'}</span>
                    {!submitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                  </button>
                </form>

                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-ink/10" />
                  <span className="text-xs text-ink-muted font-semibold">or</span>
                  <div className="flex-1 h-px bg-ink/10" />
                </div>

                <p className="text-center text-xs font-semibold text-ink-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="font-extrabold text-accent-violet hover:underline">Sign in</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
