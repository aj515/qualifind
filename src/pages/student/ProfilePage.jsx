import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [gpa, setGpa] = useState('');
  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState('');
  const [bio, setBio] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [location, setLocation] = useState('');
  const [isFinanciallyDisadvantaged, setIsFinanciallyDisadvantaged] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (!profile) return;
    setName(profile.name || '');
    setGpa(profile.gpa ?? '');
    setInstitution(profile.institution || '');
    setCourse(profile.course || '');
    setBio(profile.bio || '');
    setBirthdate(profile.birthdate || '');
    setLocation(profile.location || '');
    setIsFinanciallyDisadvantaged(profile.is_financially_disadvantaged || false);
    setSkills(profile.skills || []);
  }, [profile]);

  function addSkill(e) {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills((prev) => [...prev, trimmed]);
    setNewSkill('');
  }

  function removeSkill(skill) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');

    const gpaNum = gpa === '' ? null : parseFloat(gpa);
    const { error } = await updateProfile({
      name: name.trim(),
      gpa: gpaNum,
      gpa_formatted: gpaNum !== null ? `${gpaNum.toFixed(1)}% GWA` : null,
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
    <div className="flex flex-col w-full max-w-3xl gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">Student Profile</h1>
        <p className="text-sm text-ink-muted max-w-2xl mt-1 font-medium">
          Keep your academic profile current — this is what the AI Matcher and eligibility checks compare against.
        </p>
      </div>

      <form onSubmit={handleSave} className="card-sticker p-6 bg-card flex flex-col gap-5">
        {savedMsg && (
          <div className="p-3 rounded-2xl bg-accent-mint/10 border-2 border-accent-mint text-xs font-semibold text-ink">{savedMsg}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Email (read-only)</label>
            <input value={user?.email || ''} disabled className="w-full input-playful py-2.5 px-4 text-xs font-semibold opacity-60" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Institution</label>
            <input value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Course / Program</label>
            <input value={course} onChange={(e) => setCourse(e.target.value)} className="w-full input-playful py-2.5 px-4 text-xs font-semibold" />
          </div>
        </div>

        <div className="space-y-1 max-w-xs">
          <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Current GWA / GPA (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Date of Birth</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full input-playful py-2.5 px-4 text-xs font-semibold"
            />
          </div>
          <div className="space-y-1">
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

        <div className="space-y-1">
          <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full input-playful py-2.5 px-4 text-xs font-semibold resize-none" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink block">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill) => (
              <span key={skill} className="badge-sticker badge-violet text-xs py-1 px-3">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="ml-1">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              className="input-playful py-2 px-3 text-xs font-semibold flex-1"
            />
            <button onClick={addSkill} className="btn-candy btn-candy-secondary btn-candy-sm">Add</button>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-candy self-start px-6 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
