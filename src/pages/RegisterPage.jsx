import { useState } from 'react';
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

const PERKS = [
  { icon: 'auto_awesome', color: '#FBBF24', bg: 'rgba(251,191,36,0.18)', text: 'AI ranks every PH scholarship by your personal fit' },
  { icon: 'task_alt',     color: '#34D399', bg: 'rgba(52,211,153,0.18)',  text: 'Step-by-step action plans per application' },
  { icon: 'folder_open',  color: '#38BDF8', bg: 'rgba(56,189,248,0.18)',  text: 'Track documents and deadlines in one place' },
  { icon: 'volunteer_activism', color: '#F472B6', bg: 'rgba(244,114,182,0.18)', text: 'Need-based & merit-based — always free' },
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
    <div className="h-screen overflow-hidden flex bg-paper">

      {/* ── LEFT BRANDING PANEL ───────────────────────────────────────── */}
      <div className="hidden lg:flex w-[42%] flex-shrink-0 bg-accent-violet flex-col justify-between p-10 relative overflow-hidden border-r-2 border-ink">

        {/* Decorative blobs */}
        <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-white/10 border-2 border-white/20 pointer-events-none" />
        <div className="absolute -left-8 bottom-16 w-36 h-36 rounded-full bg-accent-amber/20 border-2 border-accent-amber/30 pointer-events-none" />
        <div className="absolute right-10 bottom-10 w-20 h-20 rounded-2xl rotate-12 bg-white/10 border-2 border-white/20 pointer-events-none" />
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
          <div className="mt-5 bg-white/10 border border-white/20 rounded-2xl p-4">
            <p className="font-heading font-extrabold text-lg text-white leading-snug mb-1">
              Join 10,000+ Philippine students finding scholarships faster.
            </p>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Set up your free profile in under 2 minutes and let our AI do the matching.
            </p>
          </div>
        </div>

        {/* Perks */}
        <div className="relative z-10 flex flex-col gap-2.5">
          <p className="font-heading font-bold text-[10px] uppercase tracking-widest text-white/55 mb-0.5">What you unlock</p>
          {PERKS.map((p) => (
            <div key={p.text} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: p.bg, border: `1.5px solid ${p.color}50` }}>
                <span className="material-symbols-outlined fill" style={{ color: p.color, fontSize: '16px' }}>{p.icon}</span>
              </div>
              <p className="text-xs text-white/85 font-medium leading-snug m-0">{p.text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-4">
          <span className="font-heading font-bold text-xs text-white/60">DOST-SEI &amp; CHED Aligned</span>
          <span className="text-xs font-semibold text-white/45">v2.0.0</span>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">

        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-60" />

        {/* Decorative SVG */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <circle cx="88%" cy="8%"  r="70" fill="none" stroke="rgba(99,102,241,0.1)"  strokeWidth="1.5"/>
          <circle cx="88%" cy="8%"  r="42" fill="none" stroke="rgba(99,102,241,0.07)" strokeWidth="1"/>
          <circle cx="12%" cy="92%" r="60" fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="1.5"/>
          <circle cx="82%" cy="88%" r="30" fill="none" stroke="rgba(251,191,36,0.15)"  strokeWidth="1.5"/>
          {[0,1,2,3].map(c => [0,1,2].map(r => (
            <circle key={`d-${c}-${r}`} cx={`${80+c*2}%`} cy={`${18+r*2}%`} r="1.8" fill="rgba(99,102,241,0.18)" />
          )))}
          <line x1="14%" y1="20%" x2="14%" y2="26%" stroke="rgba(244,114,182,0.2)" strokeWidth="1.5"/>
          <line x1="11%" y1="23%" x2="17%" y2="23%" stroke="rgba(244,114,182,0.2)" strokeWidth="1.5"/>
          <line x1="87%" y1="72%" x2="87%" y2="78%" stroke="rgba(99,102,241,0.18)" strokeWidth="1.5"/>
          <line x1="84%" y1="75%" x2="90%" y2="75%" stroke="rgba(99,102,241,0.18)" strokeWidth="1.5"/>
        </svg>

        <div className="relative z-10 w-full max-w-xl">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-accent-violet rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[22px]">verified</span>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-ink leading-none">QualiFind</h2>
              <span className="badge-sticker badge-violet text-[9px] mt-0.5">PH Student Portal</span>
            </div>
          </div>

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
