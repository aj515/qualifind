import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import { getEligibilityStyle, getGapAnalysis, getRequirementStyle, formatDeadline } from '../../lib/eligibility.js';

export default function EligibilityDetailPage() {
  const { id } = useParams();
  const { programs, savedIds, toggleSaved } = useData();
  const navigate = useNavigate();

  const opp = programs.find((p) => p.id === id);

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

  const style = getEligibilityStyle(opp);
  const gap = getGapAnalysis(opp);
  const { formatted } = formatDeadline(opp.deadline);
  const isSaved = savedIds.includes(opp.id);

  const reasons = [];
  if (opp.eligibility_status !== 'Eligible') {
    if (gap) {
      reasons.push({ title: gap.type === 'blocked' ? 'Requirement Gap Identified' : 'Verification Needed', text: gap.gapSummary, ok: false });
    } else if (opp.eligibility_notes) {
      reasons.push({ title: "Why This Isn't a Match", text: opp.eligibility_notes, ok: false });
    }
  } else {
    reasons.push({
      title: 'Academic Standing Match',
      text: `Your current GPA satisfies the program requirement (minimum ${opp.min_gpa || 75}%).`,
      ok: true
    });
  }
  (opp.why_strong_match || []).forEach((r) => reasons.push({ title: 'Profile Alignment', text: r, ok: true }));

  const otherCategoryMatches = programs.filter((o) => o.id !== opp.id && o.eligibility_status !== 'Not Eligible' && o.type !== opp.type);
  const sameCategoryMatches = programs.filter((o) => o.id !== opp.id && o.eligibility_status !== 'Not Eligible' && o.type === opp.type);
  const alternatives = [...otherCategoryMatches, ...sameCategoryMatches].slice(0, 3);

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
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold font-heading text-ink mb-2 leading-snug">{opp.title}</h1>
              <p className="text-sm font-bold font-heading text-accent-violet mb-3">{opp.provider}</p>
              <p className="text-sm text-ink-muted max-w-2xl leading-relaxed font-medium">{opp.summary}</p>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t-2 border-ink flex flex-wrap gap-3">
              <button onClick={() => navigate(`/opportunities/${opp.id}/action-plan`)} className="btn-candy btn-candy-sm">
                <span className="material-symbols-outlined text-[18px]">checklist</span> Generate Action Plan
              </button>
              <button onClick={() => toggleSaved(opp.id)} className="btn-candy btn-candy-secondary btn-candy-sm">
                <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'fill text-accent-pink' : ''}`}>bookmark</span>
                {isSaved ? 'Saved in Drafts' : 'Save for Later'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-accent-amber/20 border-2 border-ink flex items-start gap-3 shadow-pop-sm">
            <span className="material-symbols-outlined text-ink text-[22px] shrink-0 mt-0.5">info</span>
            <p className="text-xs font-semibold text-ink leading-relaxed">
              <strong>Official Verification Disclaimer:</strong> AI eligibility assessments are provided for guidance purposes. Always verify
              requirements, deadlines, and submission procedures directly with the official program provider or university financial aid office.
            </p>
          </div>

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

          {opp.eligibility_status === 'Not Eligible' && alternatives.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-extrabold font-heading text-ink flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-mint">explore</span> Alternative Assistance
              </h2>
              <div className="flex flex-col gap-3">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => navigate(`/opportunities/${alt.id}/eligibility`)}
                    className="p-4 rounded-2xl border-2 border-ink bg-paper flex items-center justify-between hover:bg-card transition-colors cursor-pointer shadow-pop-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="badge-sticker badge-mint text-[9px]">Potential Match</span>
                      <div>
                        <h4 className="text-xs font-extrabold font-heading text-ink">{alt.title}</h4>
                        <p className="text-[11px] text-ink-muted font-medium">
                          {alt.type} &bull; {alt.funding}
                        </p>
                      </div>
                    </div>
                    <button className="btn-candy btn-candy-sm text-[11px] py-1 px-3">View Alternative &rarr;</button>
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
              <span className="material-symbols-outlined text-accent-violet">checklist</span> Requirement Checklist
            </h3>
            <div className="space-y-3">
              {(opp.requirements || []).map((req, i) => {
                const reqStyle = getRequirementStyle(req.status);
                return (
                  <div key={req.id || i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full ${reqStyle.iconColor} border-2 border-ink flex items-center justify-center shrink-0 mt-0.5 shadow-pop-sm`}>
                      <span className="material-symbols-outlined text-[14px] font-bold">{reqStyle.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-extrabold font-heading text-ink">{req.title}</h4>
                      <p className="text-[11px] text-ink-muted mt-0.5 font-medium">{req.desc}</p>
                      <span className={`badge-sticker ${reqStyle.badgeClass} text-[9px] mt-1`}>{req.note}</span>
                    </div>
                  </div>
                );
              })}
              {(!opp.requirements || opp.requirements.length === 0) && (
                <p className="text-xs text-ink-muted font-medium">No requirement checklist available for this program.</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
