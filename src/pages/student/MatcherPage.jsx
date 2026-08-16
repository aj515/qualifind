import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import {
  getAIMatches,
  calculateMatchForPrompt,
  extractDocument,
  extractSituation,
  mapExtractedFieldsToBuilder,
  composeBuilderSentence,
  buildProfileUpdatesFromBuilder,
  looksLikeRealDescription,
  PROFILE_UPDATE_LABELS,
  MATCHER_DEMO_PRESETS
} from '../../lib/matcher.js';

const ACCEPTED_FILE_TYPES = '.pdf,.txt,.png,.jpg,.jpeg,.webp';

const FIELD_LABELS = {
  fullName: 'Name',
  educationLevel: 'Education level',
  course: 'Course',
  yearLevel: 'Year level',
  institution: 'Institution',
  gpa: 'GWA/GPA',
  location: 'Location',
  householdIncome: 'Household income',
  otherNotes: 'Notes'
};

// Maps extracted-document fields onto the saved-profile fields that eligibility
// checks actually compare against (see AuthContext's STUDENTS_FIELDS). Only
// fields the deterministic eligibility engine reads are offered here — free-text
// extras like householdIncome/otherNotes stay in the description text only,
// since there's no matching structured profile field to hold them.
const PROFILE_FIELD_CONFIG = [
  { key: 'course', sourceField: 'course' },
  { key: 'gpa', sourceField: 'gpa', numeric: true },
  { key: 'location', sourceField: 'location' },
  { key: 'institution', sourceField: 'institution' },
  { key: 'year_level', sourceField: 'yearLevel', yearLevel: true },
  { key: 'education_level', sourceField: 'educationLevel' }
];

function parseYearLevel(value) {
  const match = String(value).match(/\d+/);
  return match ? match[0] : null;
}

function buildProfileUpdates(fields) {
  const updates = {};
  for (const cfg of PROFILE_FIELD_CONFIG) {
    const raw = fields?.[cfg.sourceField];
    if (raw === null || raw === undefined || raw === '') continue;
    if (cfg.numeric) updates[cfg.key] = parseFloat(raw);
    else if (cfg.yearLevel) {
      const year = parseYearLevel(raw);
      if (year) updates[cfg.key] = parseInt(year, 10);
    } else updates[cfg.key] = raw;
  }
  return updates;
}

export default function MatcherPage() {
  const { profile, updateProfile } = useAuth();
  const { programs, eligibilityByProgramId, applyMatcherScores, matcherQuery } = useData();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(matcherQuery || '');
  const [isMatching, setIsMatching] = useState(false);
  const [clarificationNeeded, setClarificationNeeded] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [draft, setDraft] = useState(null); // { summary, fields } pending user review
  const [addToDescription, setAddToDescription] = useState(true);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [isApplyingDraft, setIsApplyingDraft] = useState(false);
  const [draftDone, setDraftDone] = useState(false);
  const [draftMsg, setDraftMsg] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [builder, setBuilder] = useState({
    yearLevel: profile?.year_level ? `${profile.year_level}${String(profile.year_level).endsWith('1') ? 'st' : String(profile.year_level).endsWith('2') ? 'nd' : String(profile.year_level).endsWith('3') ? 'rd' : 'th'}-year` : '',
    course: profile?.course || '',
    location: profile?.location || '',
    gpa: profile?.gpa || '',
    financialNeed: !!profile?.is_financially_disadvantaged,
    interests: ''
  });
  const fileInputRef = useRef(null);

  const profileFieldsAvailable = draft ? Object.keys(buildProfileUpdates(draft.fields)).length > 0 : false;

  function updateBuilder(field, value) {
    setBuilder((prev) => ({ ...prev, [field]: value }));
  }

  function handleComposeBuilder() {
    const sentence = composeBuilderSentence(builder);
    if (!sentence) return;
    setPrompt((prev) => (prev ? `${prev}\n\n${sentence}` : sentence));
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsExtracting(true);
    setUploadError('');
    setDraft(null);
    setDraftDone(false);
    setDraftMsg('');
    setAddToDescription(true);
    setSaveToProfile(true);

    try {
      const { summary, fields } = await extractDocument(file);
      setDraft({ summary, fields });
    } catch (err) {
      console.warn('Document extraction failed:', err);
      setUploadError(err.message || 'Could not read that document. Try a different file, or describe your situation manually.');
    } finally {
      setIsExtracting(false);
    }
  }

  function removeDraftField(key) {
    setDraft((prev) => (prev ? { ...prev, fields: { ...prev.fields, [key]: null } } : prev));
  }

  async function useExtractedInfo() {
    if (!draft) return;
    setIsApplyingDraft(true);
    setDraftMsg('');

    const didAddDescription = addToDescription;
    if (addToDescription) {
      setPrompt((prev) => (prev ? `${prev}\n\n${draft.summary}` : draft.summary));
    }

    let profileError = null;
    if (saveToProfile && profileFieldsAvailable) {
      const updates = buildProfileUpdates(draft.fields);
      const { error } = await updateProfile(updates);
      profileError = error;
    }

    setIsApplyingDraft(false);
    setDraftDone(true);
    const parts = [];
    if (didAddDescription) parts.push('added to your description');
    if (saveToProfile && profileFieldsAvailable) parts.push(profileError ? `profile save failed (${profileError.message})` : 'saved to your profile');
    setDraftMsg(parts.length ? `Done — ${parts.join(' and ')}.` : 'Nothing selected — pick an option above to use this info.');
  }

  function dismissDraft() {
    setDraft(null);
    setDraftDone(false);
    setDraftMsg('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim() || isMatching) return;

    setClarificationNeeded('');

    // Cheap client-side gate — catches trivial junk (empty-ish, single "word",
    // keyboard-mash) before spending an API call on it at all.
    if (!looksLikeRealDescription(prompt)) {
      setClarificationNeeded("That doesn't look like a real description yet — try mentioning your course, year level, location, or what kind of help you need.");
      return;
    }

    setIsMatching(true);

    const [matchResult, situationResult] = await Promise.allSettled([
      getAIMatches(prompt, programs, profile, eligibilityByProgramId),
      extractSituation(prompt)
    ]);

    // Subtler junk (real-looking words strung together meaninglessly) passes the
    // cheap check above but gets caught here — the AI itself judges whether the
    // text said anything real, instead of silently faking plausible-looking
    // relevance scores for gibberish.
    if (matchResult.status === 'fulfilled' && !matchResult.value.inputUnderstood) {
      setClarificationNeeded(matchResult.value.clarificationMessage || "We couldn't quite understand that — try describing your actual situation (course, year level, location, what kind of help you need).");
      setIsMatching(false);
      return;
    }

    let scored;
    let usedFallback = false;
    if (matchResult.status === 'fulfilled') {
      scored = matchResult.value.scoredPrograms;
    } else {
      console.warn('AI matching failed, falling back to offline ranking:', matchResult.reason);
      usedFallback = true;
      scored = calculateMatchForPrompt(prompt, programs, profile?.gpa ?? 75);
    }

    // Best-effort: break the free text into structured fields so Opportunities can
    // show/edit them individually, and use those same fields to keep the saved
    // profile in sync with whatever the student just described. Never blocks
    // navigation if this extraction call fails.
    let builderFields = null;
    let updateNote = '';
    if (situationResult.status === 'fulfilled') {
      builderFields = mapExtractedFieldsToBuilder(situationResult.value.fields);
      const profileUpdates = buildProfileUpdatesFromBuilder(builderFields);
      if (Object.keys(profileUpdates).length > 0) {
        const { error } = await updateProfile(profileUpdates);
        if (!error) {
          const labels = Object.keys(profileUpdates).map((k) => PROFILE_UPDATE_LABELS[k] || k);
          updateNote = `We also updated your profile from this: ${labels.join(', ')}.`;
        }
      }
    } else {
      console.warn('Situation parsing failed, skipping profile auto-update:', situationResult.reason);
    }

    applyMatcherScores(scored, prompt, builderFields, updateNote);
    setIsMatching(false);
    navigate(usedFallback ? '/opportunities?ai=fallback' : '/opportunities');
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 items-center text-center py-6">
      <span className="badge-sticker badge-violet">
        <span className="material-symbols-outlined text-[15px]">auto_awesome</span> Natural Language AI Matcher
      </span>
      <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">
        Tell us about your situation, <span className="text-accent-violet">we'll find your fit</span>
      </h1>
      <p className="text-sm text-ink-muted max-w-xl font-medium leading-relaxed">
        Mention your education, location, financial need, and what kind of help you're looking for — the AI matches
        you across every category of Philippine student assistance.
      </p>

      <form onSubmit={handleSubmit} className="w-full card-sticker p-6 bg-card flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          placeholder="e.g. I'm a 2nd-year IT student in Cebu with an 82% GPA, looking for tuition assistance and transportation support..."
          className="w-full input-playful py-3 px-4 text-sm resize-none"
        />

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setShowBuilder((v) => !v)}
            className="badge-sticker bg-card text-ink border-2 border-ink hover:scale-105 transition-transform cursor-pointer text-xs py-1.5 px-3"
          >
            <span className="material-symbols-outlined text-[15px]">{showBuilder ? 'expand_less' : 'quiz'}</span>
            Prefer a simple form?
          </button>
          <input ref={fileInputRef} type="file" accept={ACCEPTED_FILE_TYPES} onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isExtracting}
            className="badge-sticker bg-card text-ink border-2 border-ink hover:scale-105 transition-transform cursor-pointer text-xs py-1.5 px-3 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[15px]">{isExtracting ? 'progress_activity' : 'upload_file'}</span>
            {isExtracting ? 'Reading document…' : 'Upload a document instead'}
          </button>
        </div>

        {showBuilder && (
          <div className="w-full rounded-2xl border-2 border-ink/10 bg-paper/60 p-4 text-left flex flex-col gap-2.5">
            <p className="text-[11px] text-ink-muted font-medium -mt-0.5 mb-1">Fill in what applies — we'll turn it into a description for you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input type="text" value={builder.yearLevel} onChange={(e) => updateBuilder('yearLevel', e.target.value)} placeholder="Year level (e.g. 2nd-year)" className="input-playful py-2 px-3 text-xs" />
              <input type="text" value={builder.course} onChange={(e) => updateBuilder('course', e.target.value)} placeholder="Course (e.g. BS IT)" className="input-playful py-2 px-3 text-xs" />
              <input type="text" value={builder.location} onChange={(e) => updateBuilder('location', e.target.value)} placeholder="Location (e.g. Cebu City)" className="input-playful py-2 px-3 text-xs" />
              <input type="text" value={builder.gpa} onChange={(e) => updateBuilder('gpa', e.target.value)} placeholder="GWA/GPA (e.g. 82)" className="input-playful py-2 px-3 text-xs" />
              <input type="text" value={builder.interests} onChange={(e) => updateBuilder('interests', e.target.value)} placeholder="What you need (e.g. tuition, transportation)" className="input-playful py-2 px-3 text-xs sm:col-span-2" />
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink sm:col-span-2">
                <input type="checkbox" checked={builder.financialNeed} onChange={(e) => updateBuilder('financialNeed', e.target.checked)} className="w-4 h-4 rounded border-2 border-ink text-accent-violet focus:ring-0" />
                My family has limited income
              </label>
            </div>
            <button
              type="button"
              onClick={handleComposeBuilder}
              disabled={!composeBuilderSentence(builder)}
              className="self-start badge-sticker badge-violet hover:scale-105 transition-transform cursor-pointer text-xs py-1.5 px-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[14px]">auto_fix_high</span> Add to my description
            </button>
          </div>
        )}

        {uploadError && <span className="text-xs text-red-600 font-medium max-w-md self-center">{uploadError}</span>}

        {draft && (
          <div className="w-full rounded-2xl border-2 border-accent-violet/40 bg-accent-violet/5 p-4 text-left flex flex-col gap-3">
            <div>
              <p className="text-xs font-heading font-extrabold uppercase text-ink tracking-wider mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-accent-violet">fact_check</span>
                Here's what we found — check it over
              </p>
              <p className="text-[11px] text-ink-muted font-medium mb-2">AI can misread documents. Edit anything that's wrong, or remove a detail below, before using it.</p>
              <textarea
                value={draft.summary}
                onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))}
                rows={3}
                disabled={draftDone}
                className="w-full input-playful py-2 px-3 text-xs resize-none disabled:opacity-70"
              />
            </div>

            {Object.entries(draft.fields || {}).some(([, v]) => v !== null && v !== '') && (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(draft.fields)
                  .filter(([, v]) => v !== null && v !== '')
                  .map(([key, value]) => (
                    <span key={key} className="text-[11px] font-semibold pl-2 pr-1 py-1 rounded-full bg-accent-violet/10 text-accent-violet flex items-center gap-1" title={FIELD_LABELS[key] || key}>
                      {String(value)}
                      {!draftDone && (
                        <button type="button" onClick={() => removeDraftField(key)} className="material-symbols-outlined text-[13px] hover:text-accent-pink" aria-label={`Remove ${FIELD_LABELS[key] || key}`}>
                          close
                        </button>
                      )}
                    </span>
                  ))}
              </div>
            )}

            {!draftDone ? (
              <>
                <div className="flex flex-col gap-1.5 border-t-2 border-ink/10 pt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                    <input type="checkbox" checked={addToDescription} onChange={(e) => setAddToDescription(e.target.checked)} className="w-4 h-4 rounded border-2 border-ink text-accent-violet focus:ring-0" />
                    Add to my description above (for this search)
                  </label>
                  {profileFieldsAvailable && (
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                      <input type="checkbox" checked={saveToProfile} onChange={(e) => setSaveToProfile(e.target.checked)} className="w-4 h-4 rounded border-2 border-ink text-accent-violet focus:ring-0" />
                      Save these details to my profile (used for eligibility everywhere)
                    </label>
                  )}
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={useExtractedInfo}
                    disabled={isApplyingDraft || (!addToDescription && !saveToProfile)}
                    className="badge-sticker badge-violet hover:scale-105 transition-transform cursor-pointer text-xs py-1.5 px-3 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[14px]">check</span> {isApplyingDraft ? 'Working…' : 'Use this info'}
                  </button>
                  <button type="button" onClick={dismissDraft} className="badge-sticker bg-card text-ink border-2 border-ink hover:scale-105 transition-transform cursor-pointer text-xs py-1.5 px-3">
                    <span className="material-symbols-outlined text-[14px]">delete</span> Discard
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-accent-mint">check_circle</span>
                  {draftMsg}
                </span>
                <button type="button" onClick={dismissDraft} className="badge-sticker bg-card text-ink border-2 border-ink hover:scale-105 transition-transform cursor-pointer text-xs py-1 px-2.5">
                  Close
                </button>
              </div>
            )}
          </div>
        )}

        {clarificationNeeded && (
          <div className="w-full p-3 rounded-2xl bg-accent-amber/20 border-2 border-ink flex items-start gap-2.5 shadow-pop-sm text-left">
            <span className="material-symbols-outlined text-ink text-[18px] shrink-0 mt-0.5">help</span>
            <p className="text-xs font-semibold text-ink leading-relaxed">{clarificationNeeded}</p>
          </div>
        )}

        <button type="submit" disabled={!prompt.trim() || isMatching} className="btn-candy self-center px-8 disabled:opacity-60">
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          {isMatching ? 'Analyzing your profile requirements...' : 'Find Assistance'}
        </button>
      </form>

      <div className="w-full flex flex-col items-center space-y-3 pt-2">
        <span className="text-xs font-heading font-bold uppercase text-ink-muted tracking-wider">Demo Presets &amp; Starting Stories</span>
        <div className="flex flex-wrap justify-center gap-2">
          {MATCHER_DEMO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPrompt(preset.prompt)}
              className="badge-sticker badge-violet hover:scale-105 transition-transform cursor-pointer text-xs py-1.5 px-3"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
