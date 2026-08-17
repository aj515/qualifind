import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient.js';

// Bar-segment fill colors use the same darker tones already backing each
// badge-sticker's text color (badge-mint/amber/pink) rather than the lighter
// --color-accent-* tokens — validated with the dataviz skill's palette
// checker: the lighter accents fail contrast-vs-surface at this app's card
// background, these darker ones pass all checks (lightness band, CVD
// separation, contrast) unchanged.
const RESULT_META = {
  eligible: { label: 'Eligible', fill: '#059669', badgeClass: 'badge-mint' },
  potentially_eligible: { label: 'Potentially Eligible', fill: '#B45309', badgeClass: 'badge-amber' },
  not_eligible: { label: 'Not Eligible', fill: '#DB2777', badgeClass: 'badge-pink' }
};
const RESULT_ORDER = ['eligible', 'potentially_eligible', 'not_eligible'];

// A program with enough volume to mean something, but where essentially
// nobody is eligible, is either genuinely too strict or has a data/matching
// bug (course-requirement typos, wrong min_gpa, etc.) — flag it instead of
// letting it sit silently at the bottom of a long list.
const SUSPECT_MIN_CHECKS = 3;
const SUSPECT_MAX_ELIGIBLE_RATE = 0.05;

// Throwaway accounts created for dev/QA testing all use this domain — never a
// real student signup. Excluding them keeps these numbers reflecting genuine
// usage instead of our own verification runs.
const TEST_EMAIL_PATTERN = /@example\.com$/i;

export default function AdminAnalyticsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [programs, setPrograms] = useState([]);
  const [rows, setRows] = useState([]);
  const [testStudentIds, setTestStudentIds] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [programsRes, eligRes, profilesRes] = await Promise.all([
        supabase.from('programs').select('id, title, status'),
        supabase.from('eligibility_results').select('program_id, student_id, result'),
        supabase.from('profiles').select('user_id, email').eq('role', 'student')
      ]);
      if (cancelled) return;
      if (programsRes.error) setErrorMsg(`Failed to load programs: ${programsRes.error.message}`);
      else setPrograms(programsRes.data);
      if (eligRes.error) setErrorMsg((prev) => prev || `Failed to load eligibility results: ${eligRes.error.message}`);
      else setRows(eligRes.data);
      if (profilesRes.error) setErrorMsg((prev) => prev || `Failed to load profiles: ${profilesRes.error.message}`);
      else setTestStudentIds(new Set(profilesRes.data.filter((p) => TEST_EMAIL_PATTERN.test(p.email || '')).map((p) => p.user_id)));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="material-symbols-outlined text-4xl text-accent-violet animate-spin">progress_activity</span>
      </div>
    );
  }

  const programTitleById = Object.fromEntries(programs.map((p) => [p.id, p.title]));

  const realRows = rows.filter((row) => !testStudentIds.has(row.student_id));
  const excludedCount = rows.length - realRows.length;

  const byProgram = {};
  const uniqueStudents = new Set();
  const overall = { eligible: 0, potentially_eligible: 0, not_eligible: 0, total: 0 };

  realRows.forEach((row) => {
    uniqueStudents.add(row.student_id);
    if (!row.result || !RESULT_META[row.result]) return;
    if (!byProgram[row.program_id]) byProgram[row.program_id] = { eligible: 0, potentially_eligible: 0, not_eligible: 0, total: 0 };
    byProgram[row.program_id][row.result] += 1;
    byProgram[row.program_id].total += 1;
    overall[row.result] += 1;
    overall.total += 1;
  });

  const programBreakdown = Object.entries(byProgram)
    .map(([programId, counts]) => ({
      programId,
      title: programTitleById[programId] || 'Unknown Program',
      ...counts,
      eligibleRate: counts.total > 0 ? counts.eligible / counts.total : 0,
      suspect: counts.total >= SUSPECT_MIN_CHECKS && counts.eligible / counts.total <= SUSPECT_MAX_ELIGIBLE_RATE
    }))
    .sort((a, b) => b.total - a.total);

  const overallEligibleRate = overall.total > 0 ? Math.round((overall.eligible / overall.total) * 100) : 0;
  const suspectCount = programBreakdown.filter((p) => p.suspect).length;

  return (
    <div className="flex flex-col w-full gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">Analytics</h1>
        <p className="text-sm text-ink-muted mt-1 max-w-2xl font-medium">
          Real eligibility outcomes computed for every student who's viewed a program — useful for spotting programs
          that need attention, and for showing providers what their listing actually reached.
        </p>
      </div>

      {errorMsg && <div className="p-3 rounded-2xl bg-accent-pink/10 border-2 border-accent-pink text-xs font-semibold text-ink">{errorMsg}</div>}

      {excludedCount > 0 && (
        <p className="text-[11px] text-ink-muted font-medium -mt-2">
          {excludedCount} check{excludedCount > 1 ? 's' : ''} from internal test accounts excluded from the numbers below.
        </p>
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-sticker p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100/80 border-2 border-ink flex items-center justify-center text-indigo-800 shadow-pop-sm">
              <span className="material-symbols-outlined text-[22px]">checklist</span>
            </div>
          </div>
          <h4 className="text-xs font-heading font-bold text-ink-muted uppercase tracking-wider mb-1">Programs Listed</h4>
          <span className="text-3xl font-extrabold font-heading text-ink">{programs.length}</span>
        </div>

        <div className="card-sticker p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100/80 border-2 border-ink flex items-center justify-center text-indigo-800 shadow-pop-sm">
              <span className="material-symbols-outlined text-[22px]">fact_check</span>
            </div>
          </div>
          <h4 className="text-xs font-heading font-bold text-ink-muted uppercase tracking-wider mb-1">Eligibility Checks Recorded</h4>
          <span className="text-3xl font-extrabold font-heading text-ink">{overall.total}</span>
        </div>

        <div className="card-sticker p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100/80 border-2 border-ink flex items-center justify-center text-indigo-800 shadow-pop-sm">
              <span className="material-symbols-outlined text-[22px]">groups</span>
            </div>
          </div>
          <h4 className="text-xs font-heading font-bold text-ink-muted uppercase tracking-wider mb-1">Students Tracked</h4>
          <span className="text-3xl font-extrabold font-heading text-ink">{uniqueStudents.size}</span>
        </div>

        <div className="card-sticker p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 border-2 border-ink flex items-center justify-center text-emerald-800 shadow-pop-sm">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
          </div>
          <h4 className="text-xs font-heading font-bold text-ink-muted uppercase tracking-wider mb-1">Overall Eligible Rate</h4>
          <span className="text-3xl font-extrabold font-heading text-ink">{overall.total > 0 ? `${overallEligibleRate}%` : '—'}</span>
        </div>
      </div>

      {suspectCount > 0 && (
        <div className="p-3 rounded-2xl bg-accent-pink/10 border-2 border-accent-pink flex items-center gap-2.5 shadow-pop-sm">
          <span className="material-symbols-outlined text-accent-pink text-[18px] shrink-0">warning</span>
          <p className="text-xs font-semibold text-ink">
            {suspectCount} program{suspectCount > 1 ? 's have' : ' has'} {Math.round(SUSPECT_MAX_ELIGIBLE_RATE * 100)}% or fewer
            eligible results despite real volume — worth checking whether its requirements are set correctly.
          </p>
        </div>
      )}

      {/* Per-program breakdown */}
      <div className="card-sticker bg-card overflow-hidden">
        <div className="p-6 border-b-2 border-ink flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold font-heading text-ink">Eligibility Outcomes by Program</h2>
          <div className="flex items-center gap-2">
            {RESULT_ORDER.map((key) => (
              <span key={key} className={`badge-sticker ${RESULT_META[key].badgeClass} text-[9px]`}>{RESULT_META[key].label}</span>
            ))}
          </div>
        </div>

        <div className="divide-y-2 divide-ink/10">
          {programBreakdown.length === 0 && (
            <p className="p-6 text-sm text-ink-muted font-medium">
              No eligibility checks recorded yet — this fills in once students with a profile view active programs.
            </p>
          )}

          {programBreakdown.map((p) => (
            <div
              key={p.programId}
              onClick={() => navigate(`/admin-dashboard/programs/${p.programId}`)}
              className="p-5 flex flex-col gap-2.5 hover:bg-paper transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-extrabold font-heading text-ink truncate">{p.title}</h3>
                <div className="flex items-center gap-2 shrink-0">
                  {p.suspect && (
                    <span className="badge-sticker badge-pink text-[9px]">
                      <span className="material-symbols-outlined text-[12px]">warning</span> Check This
                    </span>
                  )}
                  <span className="text-xs font-heading font-bold text-ink-muted">{p.total} checks</span>
                </div>
              </div>

              {/* Stacked bar — 2px surface-color gaps between segments, ink border for
                  definition regardless of fill-to-background contrast. */}
              <div className="w-full h-6 rounded-full border-2 border-ink overflow-hidden flex bg-paper">
                {RESULT_ORDER.filter((key) => p[key] > 0).map((key) => (
                  <div
                    key={key}
                    style={{ width: `${(p[key] / p.total) * 100}%`, backgroundColor: RESULT_META[key].fill }}
                    className="h-full border-r-2 border-paper last:border-r-0"
                    title={`${RESULT_META[key].label}: ${p[key]}`}
                  />
                ))}
              </div>

              <p className="text-[11px] text-ink-muted font-medium">
                {RESULT_ORDER.map((key) => `${p[key]} ${RESULT_META[key].label.toLowerCase()}`).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
