import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import { supabase } from '../../lib/supabaseClient.js';
import { getEligibilityStyle, formatDeadline, formatVerifiedDate, withAlternativeSuggestion } from '../../lib/eligibility.js';
import Tooltip from '../../components/Tooltip.jsx';

export default function EligibilityDetailPage() {
  const { id } = useParams();
  const { programs, savedIds, toggleSaved, eligibilityByProgramId, matcherReasons } = useData();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(true);

  const opp = programs.find((p) => p.id === id);

  // Required documents are fetched per-program on demand (program_documents -> documents
  // join) rather than globally in DataContext, to keep the list/dashboard queries light.
  useEffect(() => {
    if (!id) return;
    setDocsLoading(true);
    supabase
      .from('program_documents')
      .select('is_required, documents(id, name, description)')
      .eq('program_id', id)
      .then(({ data, error }) => {
        if (error) {
          console.warn('Failed to load required documents:', error.message);
          setDocuments([]);
        } else {
          setDocuments(data.map((row) => ({ ...row.documents, is_required: row.is_required })));
        }
        setDocsLoading(false);
      });
  }, [id]);

  if (!opp) {
    return (
      <div className="card-sticker p-12 text-center flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-ink-muted mb-4">search_off</span>
        <h3 className="text-xl font-bold font-heading text-ink mb-1">This program isn't in the registry anymore</h3>
        <p className="text-sm text-ink-muted max-w-md mb-6 font-medium">It may have been removed or the link is out of date.</p>
        <button className="btn-candy" onClick={() => navigate('/opportunities')}>Back to Opportunities</button>
      </div>
    );
  }

  const eligibility = eligibilityByProgramId[opp.id];
  const result = eligibility?.result;
  const style = getEligibilityStyle(result);
  const { formatted } = formatDeadline(opp.deadline);
  const lastVerified = formatVerifiedDate(opp.last_verified_at);
  const isSaved = savedIds.includes(opp.id);

  const otherCategoryMatches = programs.filter(
    (o) => o.id !== opp.id && eligibilityByProgramId[o.id]?.result !== 'not_eligible' && o.type !== opp.type
  );
  const sameCategoryMatches = programs.filter(
    (o) => o.id !== opp.id && eligibilityByProgramId[o.id]?.result !== 'not_eligible' && o.type === opp.type
  );
  const alternatives = [...otherCategoryMatches, ...sameCategoryMatches].slice(0, 3);
  const alternativeTypes = [...new Set(otherCategoryMatches.map((o) => o.type))];

  const reasons = [];
  if (eligibility) {
    reasons.push({
      title: result === 'eligible' ? 'Eligibility Match' : result === 'potentially_eligible' ? 'Verification Needed' : 'Why This Isn\'t a Match',
      text: result === 'not_eligible' ? withAlternativeSuggestion(eligibility.explanation, alternativeTypes) : eligibility.explanation,
      ok: result === 'eligible'
    });
  }
  // why_strong_match is static, admin-authored copy written for an idealized
  // "good fit" student (e.g. "Your GPA exceeds the 80% minimum") — it's never
  // checked against the actual viewer. Only surface it once eligibility is
  // actually confirmed (result === 'eligible'); showing it for
  // potentially_eligible/not_eligible asserts things as fact (like a GPA
  // "exceeding" a minimum) that may directly contradict the real, computed
  // reason sitting right next to it — e.g. "your GPA hasn't been added yet".
  if (result === 'eligible') {
    (opp.why_strong_match || []).forEach((r) => reasons.push({ title: 'Profile Alignment', text: r, ok: true }));
  }

  return (
    <div className="flex flex-col w-full gap-6">
      <div
        onClick={() => navigate('/opportunities')}
        className="flex items-center gap-2 text-sm font-heading font-bold text-ink cursor-pointer hover:text-accent-violet transition-colors w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Opportunities
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="card-sticker p-6 lg:p-8 bg-card relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent-violet/15 rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className={`material-symbols-outlined text-2xl ${style.badgeClass === 'badge-mint' ? 'text-success' : style.badgeClass === 'badge-amber' ? 'text-warning' : 'text-error'}`}>
                  {style.icon}
                </span>
                <span className={`badge-sticker ${style.badgeClass} text-xs`}>Status: {style.label}</span>
                {opp.slots_total != null && (
                  <span className="badge-sticker badge-amber text-xs">Slots may be limited</span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold font-heading text-ink mb-2 leading-snug">{opp.title}</h1>
              <p className="text-sm font-bold font-heading text-accent-violet mb-3">{opp.providers?.name}</p>
              <p className="text-sm text-ink-muted max-w-2xl leading-relaxed font-medium">{opp.summary}</p>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t-2 border-ink flex flex-wrap gap-3">
              {result !== 'not_eligible' && (
                <button onClick={() => navigate(`/opportunities/${opp.id}/action-plan`)} className="btn-candy btn-candy-sm">
                  <span className="material-symbols-outlined text-[18px]">checklist</span> Generate Action Plan
                </button>
              )}
              <button onClick={() => toggleSaved(opp.id)} className="btn-candy btn-candy-secondary btn-candy-sm">
                <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'fill text-accent-pink' : ''}`}>bookmark</span>
                {isSaved ? 'Saved in Drafts' : 'Save for Later'}
              </button>
            </div>
          </div>

          {result === 'not_eligible' && eligibility && (
            <div className="card-sticker p-5 bg-accent-pink/5 border-accent-pink flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-pink text-white border-2 border-ink flex items-center justify-center shrink-0 shadow-pop-sm">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
              <div>
                <h3 className="text-xs font-heading font-extrabold uppercase tracking-wider text-accent-pink mb-1">Recommendation</h3>
                <p className="text-sm text-ink leading-relaxed font-medium">
                  An action plan isn't available yet — you don't currently meet this program's requirements. {withAlternativeSuggestion(eligibility.explanation, alternativeTypes)}
                </p>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-accent-amber/20 border-2 border-ink flex items-start gap-3 shadow-pop-sm">
            <span className="material-symbols-outlined text-ink text-[22px] shrink-0 mt-0.5">info</span>
            <p className="text-xs font-semibold text-ink leading-relaxed">
              <strong>Official Verification Disclaimer:</strong> AI eligibility assessments are provided for guidance purposes. Always verify
              requirements, deadlines, and submission procedures directly with the official program provider or university financial aid office.
            </p>
          </div>

          {matcherReasons[opp.id] && (
            <div className="card-sticker p-5 bg-accent-violet/5 border-accent-violet flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-violet text-white border-2 border-ink flex items-center justify-center shrink-0 shadow-pop-sm">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-xs font-heading font-extrabold uppercase tracking-wider text-accent-violet mb-1">AI Summary — Relevance &amp; Eligibility</h3>
                <p className="text-sm text-ink leading-relaxed font-medium">{matcherReasons[opp.id]}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-extrabold font-heading text-ink flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-violet">auto_awesome</span> Why You Match &amp; Gap Diagnosis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reasons.map((r, i) => (
                <div key={i} className="card-sticker p-5 bg-card flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center shrink-0 shadow-pop-sm ${
                        r.ok ? 'bg-accent-mint text-ink' : 'bg-accent-pink text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{r.ok ? 'check' : 'warning'}</span>
                    </div>
                    <h3 className="text-sm font-extrabold font-heading text-ink">{r.title}</h3>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed font-medium">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {result === 'not_eligible' && alternatives.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-extrabold font-heading text-ink flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-mint">explore</span> Alternative Assistance
              </h2>
              <div className="flex flex-col gap-3">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => navigate(`/opportunities/${alt.id}/eligibility`)}
                    className="p-4 rounded-2xl border-2 border-ink bg-paper flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-card transition-colors cursor-pointer shadow-pop-sm"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <span className="badge-sticker badge-mint text-[9px] mt-0.5 sm:mt-0">Potential Match</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold font-heading text-ink">{alt.title}</h4>
                        <p className="text-[11px] text-ink-muted font-medium">
                          {alt.type} &bull; {alt.funding}
                        </p>
                      </div>
                    </div>
                    <button className="btn-candy btn-candy-sm text-[11px] py-1 px-3 self-start sm:self-auto">View Alternative &rarr;</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: requirement checklist */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="card-sticker p-6 bg-card flex flex-col gap-4">
            <h3 className="text-base font-extrabold font-heading text-ink flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-violet">checklist</span> Required Documents
            </h3>
            <div className="space-y-3">
              {docsLoading && <p className="text-xs text-ink-muted font-medium">Loading…</p>}
              {!docsLoading &&
                documents.map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-paper text-ink-muted border-2 border-ink flex items-center justify-center shrink-0 mt-0.5 shadow-pop-sm">
                      <span className="material-symbols-outlined text-[14px] font-bold">description</span>
                    </div>
                    <div className="flex-1">
                      {doc.description ? (
                        <Tooltip text={doc.description}>
                          <h4 className="text-xs font-extrabold font-heading text-ink cursor-help border-b border-dashed border-ink-muted/50 w-fit">{doc.name}</h4>
                        </Tooltip>
                      ) : (
                        <h4 className="text-xs font-extrabold font-heading text-ink">{doc.name}</h4>
                      )}
                    </div>
                  </div>
                ))}
              {!docsLoading && documents.length === 0 && (
                <p className="text-xs text-ink-muted font-medium">No document checklist available for this program.</p>
              )}
            </div>
          </div>

          <div className="card-sticker p-6 bg-card flex flex-col gap-3">
            <h3 className="text-base font-extrabold font-heading text-ink">Program Details</h3>
            <div className="text-xs font-semibold text-ink space-y-2">
              <p><span className="text-ink-muted">Value:</span> {opp.funding}</p>
              <p><span className="text-ink-muted">Deadline:</span> {formatted}</p>
              <p><span className="text-ink-muted">Degree Required:</span> {opp.degree_required}</p>
              <p><span className="text-ink-muted">Citizenship:</span> {opp.citizenship}</p>
              {opp.lead_prof && (
                <p><span className="text-ink-muted">Contact:</span> {opp.lead_prof}</p>
              )}
              {opp.slots_total != null && (
                <p><span className="text-ink-muted">Total Slots:</span> {opp.slots_total}</p>
              )}
            </div>
            {opp.slots_total != null && (
              <p className="text-[11px] text-ink-muted font-medium pt-1">
                Slot count is provided by the program listing and may fill before the deadline — verify current availability with the official source.
              </p>
            )}

            <div className="pt-3 mt-1 border-t-2 border-ink/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-bold text-ink-muted">Verified Source:</span>
                {opp.source_url ? (
                  <a
                    href={opp.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-accent-violet hover:underline flex items-center gap-1"
                  >
                    Official Site <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                ) : (
                  <span className="text-ink-muted font-medium">Contact provider directly</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-bold text-ink-muted">Last Verified:</span>
                <span className="font-extrabold text-ink">{lastVerified || 'Not yet verified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
