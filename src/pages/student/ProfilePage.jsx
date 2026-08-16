import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

// Curated so Skills stays a pick-list instead of free text (keeps the data
// clean/consistent for matching, rather than a pile of one-off spellings).
const SKILL_OPTIONS = [
  { id: 'programming', label: 'Programming / Coding', icon: 'code' },
  { id: 'web-dev', label: 'Web Development', icon: 'web' },
  { id: 'graphic-design', label: 'Graphic Design', icon: 'palette' },
  { id: 'video-editing', label: 'Video Editing', icon: 'movie' },
  { id: 'data-analysis', label: 'Data Analysis', icon: 'analytics' },
  { id: 'public-speaking', label: 'Public Speaking', icon: 'campaign' },
  { id: 'research-writing', label: 'Research & Writing', icon: 'edit_note' },
  { id: 'leadership', label: 'Leadership', icon: 'groups' },
  { id: 'customer-service', label: 'Customer Service', icon: 'support_agent' },
  { id: 'tutoring', label: 'Teaching / Tutoring', icon: 'school' },
  { id: 'accounting', label: 'Accounting / Bookkeeping', icon: 'calculate' },
  { id: 'social-media', label: 'Social Media Management', icon: 'share' },
  { id: 'photography', label: 'Photography', icon: 'photo_camera' },
  { id: 'event-planning', label: 'Event Planning', icon: 'event' },
  { id: 'foreign-language', label: 'Foreign Language', icon: 'translate' },
  { id: 'project-management', label: 'Project Management', icon: 'assignment_turned_in' }
];

// Approximate scale <-> percentage table (Philippine 1.0-5.0 GWA scale isn't
// standardized across schools, so this is illustrative, not authoritative —
// the UI says so). Interpolated linearly between points.
const GWA_SCALE_TABLE = [
  [1.0, 99], [1.25, 96], [1.5, 93], [1.75, 90], [2.0, 87], [2.25, 84],
  [2.5, 81], [2.75, 78], [3.0, 75], [3.5, 69], [4.0, 63], [5.0, 50]
];

function interpolate(table, x) {
  if (x <= table[0][0]) return table[0][1];
  if (x >= table[table.length - 1][0]) return table[table.length - 1][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [x1, y1] = table[i];
    const [x2, y2] = table[i + 1];
    if (x >= x1 && x <= x2) return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
  }
  return table[table.length - 1][1];
}

function scaleToPercentage(scale) {
  return interpolate(GWA_SCALE_TABLE, scale);
}

function percentageToScale(pct) {
  const reversed = [...GWA_SCALE_TABLE].map(([s, p]) => [p, s]).sort((a, b) => a[0] - b[0]);
  return interpolate(reversed, pct);
}

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();

  const [gwaScale, setGwaScale] = useState('percentage'); // 'percentage' | '1.0-5.0'
  const [gwaInput, setGwaInput] = useState('');
  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState('');
  const [bio, setBio] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [location, setLocation] = useState('');
  const [isFinanciallyDisadvantaged, setIsFinanciallyDisadvantaged] = useState(false);
  const [skills, setSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (!profile) return;
    setGwaScale('percentage');
    setGwaInput(profile.gpa != null ? String(profile.gpa) : '');
    setInstitution(profile.institution || '');
    setCourse(profile.course || '');
    setBio(profile.bio || '');
    setBirthdate(profile.birthdate || '');
    setLocation(profile.location || '');
    setIsFinanciallyDisadvantaged(profile.is_financially_disadvantaged || false);
    setSkills(profile.skills || []);
  }, [profile]);

  function toggleSkill(id) {
    setSkills((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

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
      institution: institution.trim() || null,
      course: course.trim() || null,
      bio: bio.trim() || null,
      birthdate: birthdate || null,
      location: location.trim() || null,
      is_financially_disadvantaged: isFinanciallyDisadvantaged,
      skills
    });

    setSaving(false);
    setSavedMsg(error ? `Failed to save: ${error.message}` : 'Profile updated.');
  }

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
              <span>Profile Strength</span>
              <span>{profile?.profile_strength ?? 0}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-ink/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-mint transition-all"
                style={{ width: `${profile?.profile_strength ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main: editable fields */}
        <div className="flex flex-col gap-6">
          {savedMsg && (
            <div className="p-3 rounded-2xl bg-accent-mint/10 border-2 border-accent-mint text-xs font-semibold text-ink">{savedMsg}</div>
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
                <input value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Course / Program</label>
                <input value={course} onChange={(e) => setCourse(e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
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
              <span>I qualify as low-income / indigent (unlocks need-based assistance matching)</span>
            </label>
          </div>

          <div className="card-sticker p-6 bg-card flex flex-col gap-5">
            <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider text-ink-muted">Bio & Skills</h2>

            <div className="space-y-1">
              <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full input-playful py-2.5 px-4 text-xs font-semibold resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Skills</label>
              <p className="text-[11px] text-ink-muted font-medium -mt-0.5">Select what applies — keeps matching consistent instead of free-typed spellings.</p>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`badge-sticker text-xs py-1.5 px-3 transition-transform hover:scale-105 ${
                      skills.includes(skill.id) ? 'badge-violet shadow-pop-sm scale-105' : 'bg-card text-ink border-2 border-ink'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{skill.icon}</span> {skill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-candy self-start px-6 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
