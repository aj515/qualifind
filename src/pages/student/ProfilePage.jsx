import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Tooltip from '../../components/Tooltip.jsx';
import { SCHOOL_OPTIONS, COURSE_OPTIONS } from '../../lib/constants.js';
import { scaleToPercentage, percentageToScale } from '../../lib/gwa.js';

// Fields that make a student profile actually useful for eligibility matching.
// Completeness is derived live from these instead of a stored counter, so it
// always reflects what's really been filled in.
const COMPLETENESS_FIELDS = ['institution', 'course', 'gpa', 'birthdate', 'location'];

function computeProfileCompleteness(profile) {
  if (!profile) return 0;
  const filled = COMPLETENESS_FIELDS.filter((key) => profile[key] !== null && profile[key] !== undefined && profile[key] !== '').length;
  return Math.round((filled / COMPLETENESS_FIELDS.length) * 100);
}

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const savedMsgRef = useRef(null);

  const [gwaScale, setGwaScale] = useState('percentage'); // 'percentage' | '1.0-5.0'
  const [gwaInput, setGwaInput] = useState('');
  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [location, setLocation] = useState('');
  const [isFinanciallyDisadvantaged, setIsFinanciallyDisadvantaged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (!profile) return;
    setGwaScale('percentage');
    setGwaInput(profile.gpa != null ? String(profile.gpa) : '');
    // Keep whatever's actually saved, even if it doesn't exactly match a fixed
    // dropdown option (e.g. typed in before these became dropdowns) — the select
    // below adds it as an extra option rather than silently resetting to blank,
    // which would otherwise null the field out on the next unrelated save.
    setInstitution(profile.institution || '');
    setCourse(profile.course || '');
    setBirthdate(profile.birthdate || '');
    setLocation(profile.location || '');
    setIsFinanciallyDisadvantaged(profile.is_financially_disadvantaged || false);
  }, [profile]);

  // Switching scale converts whatever's currently typed so the number stays
  // meaningful instead of just clearing the field.
  function handleScaleChange(nextScale) {
    if (nextScale === gwaScale) return;
    const current = parseFloat(gwaInput);
    if (!Number.isNaN(current)) {
      const converted = nextScale === '1.0-5.0' ? percentageToScale(current) : scaleToPercentage(current);
      setGwaInput(converted.toFixed(2).replace(/\.?0+$/, ''));
    }
    setGwaScale(nextScale);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');

    const rawGwa = gwaInput === '' ? null : parseFloat(gwaInput);
    const gpaNum = rawGwa === null ? null : gwaScale === '1.0-5.0' ? Math.round(scaleToPercentage(rawGwa) * 10) / 10 : rawGwa;
    const { error } = await updateProfile({
      gpa: gpaNum,
      gpa_formatted:
        gpaNum === null ? null : gwaScale === '1.0-5.0' ? `${rawGwa.toFixed(2)} (~${gpaNum.toFixed(0)}%)` : `${gpaNum.toFixed(1)}% GWA`,
      institution: institution || null,
      course: course || null,
      birthdate: birthdate || null,
      location: location.trim() || null,
      is_financially_disadvantaged: isFinanciallyDisadvantaged
    });

    setSaving(false);
    setSavedMsg(error ? `Failed to save: ${error.message}` : 'Profile updated.');
  }

  // The Save button sits at the bottom of a long form, but the confirmation
  // renders at the top — without this, it appears off-screen above wherever the
  // user was scrolled to when they clicked Save. Runs after render (via effect,
  // not inline in handleSave) so the message element actually exists in the DOM
  // to scroll to. block: 'center', not 'start' — StudentLayout's header is
  // `fixed`, so scrolling the message's top edge to y=0 lands it directly
  // underneath the header bar (still technically "in the viewport" but visually
  // hidden). Centering keeps it clear of the header at any viewport height.
  useEffect(() => {
    if (savedMsg) savedMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [savedMsg]);

  return (
    <div className="flex flex-col w-full gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">Student Profile</h1>
        <p className="text-sm text-ink-muted max-w-2xl mt-1 font-medium">
          Keep your academic profile current — this is what the AI Matcher and eligibility checks compare against.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Sidebar: identity summary */}
        <div className="card-sticker p-6 bg-card flex flex-col items-center text-center gap-3 lg:sticky lg:top-28">
          <div className="w-20 h-20 rounded-full bg-accent-violet text-white border-2 border-ink flex items-center justify-center text-2xl font-heading font-extrabold shadow-pop-sm">
            {profile?.avatar || 'QF'}
          </div>
          <div>
            <p className="font-heading font-extrabold text-ink text-lg leading-tight">{profile?.name || 'Your Name'}</p>
            <p className="text-xs text-ink-muted font-medium mt-0.5 break-all">{user?.email}</p>
          </div>
          {isFinanciallyDisadvantaged && (
            <span className="badge-sticker badge-pink text-[10px] py-1 px-3">Low-Income / Indigent</span>
          )}
          <div className="w-full pt-3 mt-1 border-t-2 border-ink/10 text-left space-y-1">
            <div className="flex items-center justify-between text-xs font-heading font-extrabold text-ink">
              <Tooltip text="Based on 5 fields: Institution, Course, GWA, Birthdate, and Location. Filling all of them in gives the AI Matcher and eligibility checks the most accurate picture.">
                <span className="cursor-help border-b border-dashed border-ink-muted/50">Profile Completeness</span>
              </Tooltip>
              <span>{computeProfileCompleteness(profile)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-ink/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-mint transition-all"
                style={{ width: `${computeProfileCompleteness(profile)}%` }}
              />
            </div>
            <p className="text-[10px] text-ink-muted font-medium pt-0.5">Based on the academic fields filled in below.</p>
          </div>
        </div>

        {/* Main: editable fields */}
        <div className="flex flex-col gap-6">
          {savedMsg && (
            <div ref={savedMsgRef} className="p-3 rounded-2xl bg-accent-mint/10 border-2 border-accent-mint text-xs font-semibold text-ink">{savedMsg}</div>
          )}

          <div className="card-sticker p-6 bg-card flex flex-col gap-5">
            <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider text-ink-muted">Personal & Academic Info</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Email (read-only)</label>
                <input value={user?.email || ''} disabled className="w-full input-playful py-2.5 px-4 text-xs font-semibold opacity-60" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Institution</label>
                <select value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold">
                  <option value="">Select your school</option>
                  {institution && !SCHOOL_OPTIONS.includes(institution) && <option value={institution}>{institution}</option>}
                  {SCHOOL_OPTIONS.filter((opt) => opt !== 'Other').map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Course / Program</label>
                <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold">
                  <option value="">Select your course</option>
                  {course && !COURSE_OPTIONS.includes(course) && <option value={course}>{course}</option>}
                  {COURSE_OPTIONS.filter((opt) => opt !== 'Other').map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Date of Birth</label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Current GWA / GPA</label>
                <div className="flex gap-2">
                  <div className="flex rounded-full border-2 border-ink overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => handleScaleChange('percentage')}
                      className={`px-3 py-2 text-[11px] font-heading font-extrabold ${gwaScale === 'percentage' ? 'bg-accent-violet text-white' : 'bg-card text-ink'}`}
                    >
                      Percent (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScaleChange('1.0-5.0')}
                      className={`px-3 py-2 text-[11px] font-heading font-extrabold border-l-2 border-ink ${gwaScale === '1.0-5.0' ? 'bg-accent-violet text-white' : 'bg-card text-ink'}`}
                    >
                      1.0–5.0
                    </button>
                  </div>
                  <input
                    type="number"
                    min={gwaScale === 'percentage' ? 0 : 1}
                    max={gwaScale === 'percentage' ? 100 : 5}
                    step={gwaScale === 'percentage' ? 0.1 : 0.01}
                    value={gwaInput}
                    onChange={(e) => setGwaInput(e.target.value)}
                    placeholder={gwaScale === 'percentage' ? 'e.g. 87' : 'e.g. 1.40'}
                    className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                  />
                </div>
                {gwaScale === '1.0-5.0' && gwaInput !== '' && !Number.isNaN(parseFloat(gwaInput)) && (
                  <p className="text-[11px] text-ink-muted font-medium">
                    ≈ {scaleToPercentage(parseFloat(gwaInput)).toFixed(0)}% equivalent — approximate, exact conversion varies by school.
                  </p>
                )}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Cebu City"
                  className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
              <input
                type="checkbox"
                checked={isFinanciallyDisadvantaged}
                onChange={(e) => setIsFinanciallyDisadvantaged(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-ink text-accent-violet focus:ring-0"
              />
              <Tooltip text="Checking this makes you eligible for programs that require proof of financial need (e.g. Barangay Indigency Certificate) — leave it unchecked if you can't document low household income.">
                <span className="cursor-help border-b border-dashed border-ink-muted/50">I qualify as low-income / indigent (unlocks need-based assistance matching)</span>
              </Tooltip>
            </label>
          </div>

          <button type="submit" disabled={saving} className="btn-candy self-start px-6 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
