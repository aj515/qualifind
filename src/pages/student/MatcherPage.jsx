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
  assistanceNeeds: 'Assistance needed',
  otherNotes: 'Notes'
};

const FIELD_META = {
  fullName: { label: 'Full Name', icon: 'person', color: '#6366F1' },
  educationLevel: { label: 'Education Level', icon: 'school', color: '#0284C7' },
  course: { label: 'Course', icon: 'menu_book', color: '#7C3AED' },
  yearLevel: { label: 'Year Level', icon: 'calendar_month', color: '#D97706' },
  institution: { label: 'Institution', icon: 'account_balance', color: '#059669' },
  gpa: { label: 'GWA / GPA', icon: 'grade', color: '#DB2777' },
  location: { label: 'Location', icon: 'location_on', color: '#DC2626' },
  householdIncome: { label: 'Income Status', icon: 'payments', color: '#0D9488' },
  assistanceNeeds: { label: 'Needs', icon: 'volunteer_activism', color: '#E11D48' }
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

function ordinalYear(level) {
  const s = String(level);
  return s.endsWith('1') ? 'st' : s.endsWith('2') ? 'nd' : s.endsWith('3') ? 'rd' : 'th';
}

// One-line reminder that the Matcher already reads the saved profile — so the
// prompt only needs to cover what's different or missing, not everything again.
function summarizeProfile(profile) {
  if (!profile) return '';
  const who = [profile.year_level ? `${profile.year_level}${ordinalYear(profile.year_level)}-year` : '', profile.course].filter(Boolean).join(' ');
  const parts = [];
  if (who) parts.push(who);
  if (profile.location) parts.push(profile.location);
  if (profile.gpa != null && profile.gpa !== '') parts.push(`${profile.gpa} GWA`);
  if (profile.is_financially_disadvantaged) parts.push('low-income');
  return parts.join(' · ');
}

// Only the fields that would actually change — so a prompt that just restates
// what's already on file doesn't trigger a review prompt for nothing.
function diffProfileUpdates(profile, updates) {
  const diff = {};
  for (const [key, value] of Object.entries(updates)) {
    const current = profile?.[key];
    if (typeof value === 'number' ? current !== value : String(current ?? '') !== String(value)) {
      diff[key] = value;
    }
  }
  return diff;
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

// Checks if the uploaded document was flagged as unrelated or missing financial/scholarship details
function getRelevanceWarning(draft) {
  if (!draft) return null;
  if (draft.warning) return draft.warning;
  if (draft.isRelevant === false) {
    return "This document appears to be coursework or general academic material rather than an official financial aid record, Certificate of Registration (COR), or Transcript (TOR).";
  }
  const text = `${draft.summary || ''} ${draft.fields?.otherNotes || ''}`.toLowerCase();
  if (
    text.includes('does not contain information about') ||
    text.includes('not contain information about my financial') ||
    text.includes('not relevant to scholarship') ||
    text.includes('not contain information relevant to scholarship') ||
    text.includes('coursework assignment') ||
    text.includes('literature assignment') ||
    text.includes('academic assignment') ||
    text.includes('homework assignment') ||
    text.includes('syllabus') ||
    text.includes('definitions and concepts rather than')
  ) {
    return "This document appears to be a class assignment or coursework rather than an official document for scholarship matching (such as a Certificate of Registration, Transcript, or Certificate of Indigency). You can still edit the extracted description below or upload an official record for more accurate matching.";
  }
  return null;
}

export default function MatcherPage() {
  const { profile, updateProfile } = useAuth();
  const { programs, eligibilityByProgramId, applyMatcherScores, matcherQuery } = useData();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(matcherQuery || '');
  const [isMatching, setIsMatching] = useState(false);
  const [clarificationNeeded, setClarificationNeeded] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [unrelatedWarning, setUnrelatedWarning] = useState(null); // { fileName, size, type, message } for non-scholarship files
  const [draft, setDraft] = useState(null); // { summary, fields, isRelevant, warning } pending user review
  const [addToDescription, setAddToDescription] = useState(true);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [isApplyingDraft, setIsApplyingDraft] = useState(false);
  const [draftDone, setDraftDone] = useState(false);
  const [draftMsg, setDraftMsg] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null); // { updates, labels, scored, prompt, builderFields, usedFallback } awaiting review
  const [isResolvingPending, setIsResolvingPending] = useState(false);
  const [builder, setBuilder] = useState({
    yearLevel: profile?.year_level ? `${profile.year_level}${ordinalYear(profile.year_level)}-year` : '',
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
    setUploadedFile({ name: file.name, size: file.size, type: file.type });
    setUploadError('');
    setUnrelatedWarning(null);
    setDraft(null);
    setDraftDone(false);
    setDraftMsg('');
    setAddToDescription(true);
    setSaveToProfile(true);

    try {
      const { hasContent, isRelevant, warning, summary, fields } = await extractDocument(file);
      if (!hasContent) {
        setUploadError(summary || "That document doesn't seem to contain any relevant information. Try a different file, or describe your situation manually.");
        setUploadedFile(null);
        return;
      }

      const checkWarning = getRelevanceWarning({ summary, fields, isRelevant, warning });
      if (isRelevant === false || checkWarning) {
        setUnrelatedWarning({
          fileName: file.name,
          size: file.size,
          type: file.type,
          message: checkWarning || warning || "This file appears to be coursework or unrelated material and does not contain scholarship or financial aid information."
        });
        setDraft(null);
        return;
      }

      setDraft({ hasContent, isRelevant, warning, summary, fields });
    } catch (err) {
      console.warn('Document extraction failed:', err);
      setUploadError(err.message || 'Could not read that document. Try a different file, or describe your situation manually.');
      setUploadedFile(null);
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
    setUploadedFile(null);
    setUnrelatedWarning(null);
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
      setClarificationNeeded("That doesn't look like a real description yet — try describing your situation and what kind of help you need.");
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
      setClarificationNeeded(matchResult.value.clarificationMessage || "We couldn't quite understand that — try describing your actual situation and what kind of help you need.");
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
    // show/edit them individually. Never blocks navigation if this extraction call fails.
    let builderFields = null;
    let profileUpdates = {};
    if (situationResult.status === 'fulfilled') {
      builderFields = mapExtractedFieldsToBuilder(situationResult.value.fields);
      profileUpdates = diffProfileUpdates(profile, buildProfileUpdatesFromBuilder(builderFields));
    } else {
      console.warn('Situation parsing failed, skipping profile field extraction:', situationResult.reason);
    }

    const destination = usedFallback ? '/opportunities?ai=fallback' : '/opportunities';

    // Only actual changes to the saved profile need a look before they're written —
    // never save silently. If nothing would change, go straight to results.
    if (Object.keys(profileUpdates).length > 0) {
      const labels = Object.keys(profileUpdates).map((k) => PROFILE_UPDATE_LABELS[k] || k);
      setPendingUpdate({ updates: profileUpdates, labels, scored, prompt, builderFields, destination });
      setIsMatching(false);
      return;
    }

    applyMatcherScores(scored, prompt, builderFields, '');
    setIsMatching(false);
    navigate(destination);
  }

  async function resolvePendingUpdate(apply) {
    if (!pendingUpdate) return;
    setIsResolvingPending(true);

    let updateNote = '';
    if (apply) {
      const { error } = await updateProfile(pendingUpdate.updates);
      updateNote = error
        ? `Couldn't update your profile (${error.message}).`
        : `Updated your profile: ${pendingUpdate.labels.join(', ')}.`;
    }

    applyMatcherScores(pendingUpdate.scored, pendingUpdate.prompt, pendingUpdate.builderFields, updateNote);
    const destination = pendingUpdate.destination;
    setIsResolvingPending(false);
    setPendingUpdate(null);
    navigate(destination);
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

      {summarizeProfile(profile) && (
        <p className="text-xs text-ink-muted font-medium -mt-2">
          Matching as: <span className="font-semibold text-ink">{summarizeProfile(profile)}</span> — just describe what's different or what help you need.
        </p>
      )}

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

        {uploadError && (
          <div className="w-full p-3.5 rounded-2xl bg-accent-pink/15 border-2 border-accent-pink flex items-start gap-2.5 shadow-pop-sm text-left">
            <span className="material-symbols-outlined text-accent-pink text-[20px] shrink-0 mt-0.5">error</span>
            <div className="flex-1">
              <p className="text-xs font-heading font-bold text-ink leading-snug">{uploadError}</p>
              <p className="text-[11px] text-ink-muted font-medium mt-0.5">Try a clearer PDF, photo, or describe your situation manually above.</p>
            </div>
            <button
              type="button"
              onClick={() => setUploadError('')}
              className="text-ink-muted hover:text-ink transition-colors"
              aria-label="Dismiss error"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {isExtracting && (
          <div className="w-full rounded-2xl border-2 border-accent-violet/40 bg-accent-violet/5 p-4 text-left flex flex-col gap-3 shadow-pop-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-violet text-white border-2 border-ink shadow-pop-sm flex items-center justify-center shrink-0 animate-spin">
                <span className="material-symbols-outlined text-[20px]">progress_activity</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-extrabold text-sm text-ink truncate">Reading {uploadedFile?.name || 'Document'}…</h4>
                  <span className="badge-sticker badge-violet text-[9px] py-0 px-1.5 shrink-0">Claude AI</span>
                </div>
                <p className="text-xs text-ink-muted font-medium mt-0.5">Extracting academic background, course, year level, and assistance needs.</p>
              </div>
            </div>
            <div className="w-full bg-card rounded-full h-2 overflow-hidden border border-ink/15">
              <div className="bg-accent-violet h-full w-3/4 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {unrelatedWarning && (
          <div className="w-full rounded-2xl border-2 border-amber-500 bg-card p-5 text-left flex flex-col gap-4 shadow-pop-md">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b-2 border-ink/10 pb-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border-2 border-ink shadow-pop-sm flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-ink text-[22px]">warning</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-ink truncate">
                      {unrelatedWarning.fileName}
                    </h3>
                    <span className="badge-sticker badge-amber text-[9px] py-0.5 px-2">
                      <span className="material-symbols-outlined text-[12px] mr-1">block</span>
                      Unrelated Document
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted font-medium mt-0.5">
                    {unrelatedWarning.size ? `${(unrelatedWarning.size / 1024).toFixed(0)} KB • ` : ''}
                    Not suitable for scholarship matching
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUnrelatedWarning(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-card-subtle transition-colors shrink-0"
                title="Dismiss"
                aria-label="Dismiss warning"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Warning Message */}
            <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-4 flex items-start gap-3 shadow-pop-sm">
              <div className="flex-1 text-xs">
                <span className="font-heading font-extrabold text-ink block mb-1 text-sm">
                  Please upload a document relevant to scholarships or student aid
                </span>
                <p className="text-ink-muted leading-relaxed font-medium m-0">
                  {unrelatedWarning.message}
                </p>
              </div>
            </div>

            {/* Accepted & Recommended Documents */}
            <div className="flex flex-col gap-2.5 bg-card-subtle border-2 border-ink/10 rounded-2xl p-4">
              <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-ink">
                Accepted &amp; Recommended Documents:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-ink font-semibold">
                  <span className="material-symbols-outlined text-accent-violet text-[18px]">description</span>
                  Certificate of Registration (COR)
                </div>
                <div className="flex items-center gap-2 text-ink font-semibold">
                  <span className="material-symbols-outlined text-accent-mint text-[18px]">grade</span>
                  Transcript of Records (TOR) / Grades
                </div>
                <div className="flex items-center gap-2 text-ink font-semibold">
                  <span className="material-symbols-outlined text-accent-amber text-[18px]">account_balance</span>
                  Certificate of Indigency
                </div>
                <div className="flex items-center gap-2 text-ink font-semibold">
                  <span className="material-symbols-outlined text-accent-pink text-[18px]">badge</span>
                  Student ID / Scholarship Form
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5 justify-end border-t-2 border-ink/10 pt-3">
              <button
                type="button"
                onClick={() => setUnrelatedWarning(null)}
                className="btn-candy btn-candy-secondary btn-candy-sm py-2 px-4 text-xs cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnrelatedWarning(null);
                  fileInputRef.current?.click();
                }}
                className="btn-candy btn-candy-sm py-2 px-5 text-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                Upload a Different Document
              </button>
            </div>
          </div>
        )}

        {draft && (
          <div className="w-full rounded-2xl border-2 border-ink bg-card p-5 text-left flex flex-col gap-4 shadow-pop-md">
            
            {/* Header: Document info & badge */}
            <div className="flex items-center justify-between gap-3 border-b-2 border-ink/10 pb-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-accent-violet/15 border-2 border-ink shadow-pop-sm flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-accent-violet text-[22px]">
                    {uploadedFile?.name?.endsWith('.pdf') ? 'picture_as_pdf' : uploadedFile?.type?.startsWith('image/') ? 'image' : 'description'}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-ink truncate">
                      {uploadedFile?.name || "Here's what we found"}
                    </h3>
                    <span className="badge-sticker badge-mint text-[9px] py-0.5 px-2">
                      <span className="material-symbols-outlined text-[12px] mr-1">check_circle</span>
                      AI Extracted
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted font-medium mt-0.5">
                    {uploadedFile?.size ? `${(uploadedFile.size / 1024).toFixed(0)} KB • ` : ''}
                    Review extracted facts below and edit before using.
                  </p>
                </div>
              </div>

              {!draftDone && (
                <button
                  type="button"
                  onClick={dismissDraft}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-card-subtle transition-colors shrink-0"
                  title="Discard"
                  aria-label="Discard document extraction"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Extracted Structured Field Chips */}
            {Object.entries(draft.fields || {}).some(([k, v]) => k !== 'otherNotes' && k !== 'financialNeedMentioned' && v !== null && v !== '') && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-ink-muted">
                    Detected Profile Information
                  </span>
                  {!draftDone && (
                    <span className="text-[10px] text-ink-muted font-medium">Click × to remove any detail</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(draft.fields)
                    .filter(([k, v]) => k !== 'otherNotes' && k !== 'financialNeedMentioned' && v !== null && v !== '')
                    .map(([key, value]) => {
                      const meta = FIELD_META[key] || { label: FIELD_LABELS[key] || key, icon: 'label', color: '#6366F1' };
                      return (
                        <div
                          key={key}
                          className="inline-flex items-center gap-1.5 bg-card-subtle border-2 border-ink shadow-pop-sm rounded-xl px-2.5 py-1 text-xs text-ink transition-transform hover:scale-[1.02]"
                          title={meta.label}
                        >
                          <span className="material-symbols-outlined text-[15px]" style={{ color: meta.color }}>
                            {meta.icon}
                          </span>
                          <span className="text-ink-muted font-bold text-[11px]">{meta.label}:</span>
                          <span className="font-extrabold text-ink">{String(value)}</span>
                          {!draftDone && (
                            <button
                              type="button"
                              onClick={() => removeDraftField(key)}
                              className="w-4 h-4 ml-0.5 rounded-full flex items-center justify-center text-ink-muted hover:text-accent-pink hover:bg-paper transition-colors"
                              aria-label={`Remove ${meta.label}`}
                            >
                              <span className="material-symbols-outlined text-[13px]">close</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Generated Matcher Summary Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-accent-violet">edit_note</span>
                  AI-Generated Matcher Description
                </label>
                <span className="text-[10px] text-ink-muted font-medium">Editable summary</span>
              </div>
              <textarea
                value={draft.summary}
                onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))}
                rows={5}
                disabled={draftDone}
                placeholder="Extracted summary description..."
                className="w-full input-playful py-3 px-4 text-xs sm:text-sm leading-relaxed resize-y min-h-[130px] disabled:opacity-70"
              />
            </div>

            {/* Options and Action Buttons */}
            {!draftDone ? (
              <div className="flex flex-col gap-3 border-t-2 border-ink/10 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      addToDescription
                        ? 'bg-accent-violet/10 border-accent-violet shadow-pop-sm'
                        : 'bg-card border-ink/20 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={addToDescription}
                      onChange={(e) => setAddToDescription(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-2 border-ink text-accent-violet focus:ring-0 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-heading font-bold text-ink leading-snug">
                        Add to Matcher Description
                      </span>
                      <span className="text-[10px] text-ink-muted font-medium leading-tight mt-0.5">
                        Pastes summary into search prompt above
                      </span>
                    </div>
                  </label>

                  {profileFieldsAvailable && (
                    <label
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                        saveToProfile
                          ? 'bg-accent-mint/15 border-accent-mint shadow-pop-sm'
                          : 'bg-card border-ink/20 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={saveToProfile}
                        onChange={(e) => setSaveToProfile(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-2 border-ink text-accent-mint focus:ring-0 cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-heading font-bold text-ink leading-snug">
                          Save to Student Profile
                        </span>
                        <span className="text-[10px] text-ink-muted font-medium leading-tight mt-0.5">
                          Updates your course, year, GPA &amp; location for eligibility
                        </span>
                      </div>
                    </label>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5 justify-end pt-1">
                  <button
                    type="button"
                    onClick={dismissDraft}
                    className="btn-candy btn-candy-secondary btn-candy-sm py-2 px-4 text-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span> Discard
                  </button>
                  <button
                    type="button"
                    onClick={useExtractedInfo}
                    disabled={isApplyingDraft || (!addToDescription && !saveToProfile)}
                    className="btn-candy btn-candy-sm py-2 px-5 text-xs cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isApplyingDraft ? 'progress_activity' : 'auto_fix_high'}
                    </span>
                    {isApplyingDraft ? 'Applying…' : 'Use Extracted Details'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-accent-mint/15 border-2 border-accent-mint p-3.5 flex items-center justify-between gap-3 shadow-pop-sm">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-accent-mint text-[22px]">check_circle</span>
                  <span className="text-xs font-heading font-bold text-ink">{draftMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={dismissDraft}
                  className="btn-candy btn-candy-secondary btn-candy-sm py-1 px-3 text-xs cursor-pointer"
                >
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

        {pendingUpdate && (
          <div className="w-full rounded-2xl border-2 border-accent-violet/40 bg-accent-violet/5 p-4 text-left flex flex-col gap-3">
            <div>
              <p className="text-xs font-heading font-extrabold uppercase text-ink tracking-wider mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-accent-violet">sync_alt</span>
                Update your saved profile too?
              </p>
              <p className="text-[11px] text-ink-muted font-medium">
                What you described changes: <span className="font-semibold text-ink">{pendingUpdate.labels.join(', ')}</span>. This is saved to your
                profile and used for eligibility everywhere, not just this search.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => resolvePendingUpdate(true)}
                disabled={isResolvingPending}
                className="badge-sticker badge-violet hover:scale-105 transition-transform cursor-pointer text-xs py-1.5 px-3 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">check</span> {isResolvingPending ? 'Working…' : 'Update profile & continue'}
              </button>
              <button
                type="button"
                onClick={() => resolvePendingUpdate(false)}
                disabled={isResolvingPending}
                className="badge-sticker bg-card text-ink border-2 border-ink hover:scale-105 transition-transform cursor-pointer text-xs py-1.5 px-3 disabled:opacity-50"
              >
                Just this search, don't save
              </button>
            </div>
          </div>
        )}

        <button type="submit" disabled={!prompt.trim() || isMatching || !!pendingUpdate} className="btn-candy self-center px-8 disabled:opacity-60">
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
