import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

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

export default function RegisterPage() {
  const { session, role: currentRole, loading, signUp } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Student-only fields
  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState(COURSE_OPTIONS[0]);
  const [customCourse, setCustomCourse] = useState('');
  const [yearLevel, setYearLevel] = useState('2nd Year');
  const [gwa, setGwa] = useState('');

  // Admin-only fields
  const [agency, setAgency] = useState('');
  const [position, setPosition] = useState('');

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
    const { data, error } = await signUp(email.trim(), password, {
      role: selectedRole,
      name
    });

    if (error) {
      setSubmitting(false);
      setErrorMsg(error.message);
      return;
    }

    // No session yet means Supabase is requiring email confirmation before login.
    if (!data.session) {
      setSubmitting(false);
      setCheckEmailMsg('Account created! Check your email to confirm it, then sign in.');
      return;
    }

    // Session exists immediately (email confirmation disabled) — fill in the
    // role-specific profile fields the signup trigger doesn't know about.
    const extraFields =
      selectedRole === 'student'
        ? {
            avatar: getInitials(firstName.trim(), lastName.trim()),
            institution: institution.trim() || null,
            course: resolvedCourse || null,
            education_level: `Undergraduate (${yearLevel})`,
            // GWA is optional at signup — a student may not have one yet (new enrollee,
            // hasn't received grades, etc.). Left blank, it stays null and can be filled
            // in later from the Profile page.
            gpa: gwa ? parseFloat(gwa) : null,
            gpa_formatted: gwa ? `${parseFloat(gwa).toFixed(1)}% GWA` : null,
            badge: 'Student • New Registrant'
          }
        : {
            avatar: getInitials(firstName.trim(), lastName.trim()),
            institution: agency.trim() || null,
            title: position.trim() || null,
            badge: 'Admin • Newly Registered'
          };

    await supabase.from('profiles').update(extraFields).eq('user_id', data.session.user.id);

    setSubmitting(false);
    navigate(selectedRole === 'admin' ? '/admin-dashboard' : '/dashboard', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl card-sticker bg-card shadow-pop-lg p-0 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Panel: Branding */}
        <div className="lg:col-span-5 bg-accent-violet p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-ink">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-accent-amber rounded-full opacity-30 pointer-events-none"></div>
          <div className="absolute right-8 bottom-8 w-20 h-20 bg-accent-pink rounded-2xl rotate-12 opacity-30 pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-paper text-ink rounded-2xl border-2 border-ink flex items-center justify-center shadow-pop-sm font-bold">
                <span className="material-symbols-outlined text-accent-violet text-[26px]">verified</span>
              </div>
              <div>
                <h2 className="font-extrabold text-2xl tracking-tight leading-none text-white font-heading">QualiFind</h2>
                <span className="badge-sticker badge-amber text-[9px] mt-1">PH Student Portal</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h1 className="text-2xl lg:text-3xl font-extrabold font-heading text-white tracking-tight leading-snug">
                Create Your Account
              </h1>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                Set up your Student Seeker or DOST/CHED Admin profile to start matching against Philippine assistance programs.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/20 text-xs text-white/80 flex items-center justify-between font-heading font-bold">
            <span>DOST-SEI &amp; CHED Aligned</span>
            <span>v2.0.0</span>
          </div>
        </div>

        {/* Right Panel: Registration Form */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center bg-card">
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold font-heading text-ink tracking-tight mb-1">Sign Up for QualiFind</h2>
            <p className="text-xs text-ink-muted font-medium">Select your portal role and fill in your details.</p>
          </div>

          <div className="flex p-1 bg-paper rounded-2xl mb-5 border-2 border-ink shadow-pop-sm">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-heading font-extrabold transition-all flex items-center justify-center gap-1.5 border-2 ${
                selectedRole === 'student'
                  ? 'bg-accent-violet text-white border-ink shadow-pop-sm'
                  : 'text-ink border-transparent hover:bg-card-subtle'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">school</span>
              Student Seeker
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-heading font-extrabold transition-all flex items-center justify-center gap-1.5 border-2 ${
                selectedRole === 'admin'
                  ? 'bg-accent-amber text-ink border-ink shadow-pop-sm'
                  : 'text-ink border-transparent hover:bg-card-subtle'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              DOST / CHED Admin
            </button>
          </div>

          {checkEmailMsg ? (
            <div className="p-4 rounded-2xl bg-accent-mint/10 border-2 border-accent-mint text-sm font-semibold text-ink flex items-start gap-2">
              <span className="material-symbols-outlined text-accent-mint">mark_email_read</span>
              <span>{checkEmailMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-accent-pink/10 border-2 border-accent-pink text-xs font-semibold text-ink">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="reg-first-name" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                    First Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-ink-muted text-[18px]">person</span>
                    <input
                      id="reg-first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Juan"
                      className="w-full input-playful py-2.5 pl-10 pr-4 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="reg-last-name" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                    Last Name
                  </label>
                  <input
                    id="reg-last-name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dela Cruz"
                    className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-email" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                  Institutional Email
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-ink-muted text-[18px]">mail</span>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. juan.delacruz@student.edu.ph"
                    className="w-full input-playful py-2.5 pl-10 pr-4 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="reg-password" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="reg-confirm-password" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                    Confirm Password
                  </label>
                  <input
                    id="reg-confirm-password"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                  />
                </div>
              </div>

              {selectedRole === 'student' ? (
                <div className="space-y-4 pt-1 border-t-2 border-ink/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                    <div className="space-y-1">
                      <label htmlFor="reg-institution" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                        School / Institution
                      </label>
                      <input
                        id="reg-institution"
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. Cebu Technological University"
                        className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reg-course" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                        Course / Program
                      </label>
                      <select
                        id="reg-course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                      >
                        {COURSE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {course === 'Other' && (
                        <input
                          type="text"
                          value={customCourse}
                          onChange={(e) => setCustomCourse(e.target.value)}
                          placeholder="Enter your course/program"
                          className="w-full input-playful py-2.5 px-4 text-xs font-semibold mt-2"
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="reg-year" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                        Year Level
                      </label>
                      <select
                        id="reg-year"
                        value={yearLevel}
                        onChange={(e) => setYearLevel(e.target.value)}
                        className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>Graduate</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reg-gwa" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                        Current GWA / GPA (%) <span className="text-ink-muted normal-case font-semibold">— optional</span>
                      </label>
                      <input
                        id="reg-gwa"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={gwa}
                        onChange={(e) => setGwa(e.target.value)}
                        placeholder="Don't know it yet? Leave blank"
                        className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-1 border-t-2 border-ink/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                    <div className="space-y-1">
                      <label htmlFor="reg-agency" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                        Agency / Office
                      </label>
                      <input
                        id="reg-agency"
                        type="text"
                        value={agency}
                        onChange={(e) => setAgency(e.target.value)}
                        placeholder="e.g. DOST-SEI Regional Office"
                        className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reg-position" className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">
                        Position / Title
                      </label>
                      <input
                        id="reg-position"
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="e.g. Program Evaluator"
                        className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-ink text-accent-violet focus:ring-0"
                  />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
              </div>

              <button type="submit" disabled={submitting} className="btn-candy w-full py-3 text-sm disabled:opacity-60">
                <span>{submitting ? 'Creating account…' : 'Create Account'}</span>
                {!submitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            </form>
          )}

          <p className="text-center text-xs font-semibold text-ink-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-accent-violet hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
