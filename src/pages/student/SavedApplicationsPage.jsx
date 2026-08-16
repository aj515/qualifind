import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { supabase } from '../../lib/supabaseClient.js';
import EligibilityBadge from '../../components/EligibilityBadge.jsx';

const STATUS_STYLES = {
  saved: { label: 'Saved', badgeClass: 'badge-violet' },
  in_progress: { label: 'In Progress', badgeClass: 'badge-amber' },
  applied: { label: 'Submitted', badgeClass: 'badge-mint' },
  withdrawn: { label: 'Withdrawn', badgeClass: 'badge-pink' }
};

export default function SavedApplicationsPage() {
  const { user } = useAuth();
  const { programs, savedIds, toggleSaved, eligibilityByProgramId, savedStatusByProgramId } = useData();
  const navigate = useNavigate();
  const [progressByProgramId, setProgressByProgramId] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null); // program object pending removal confirmation

  const savedList = programs.filter((p) => savedIds.includes(p.id));

  function confirmRemove() {
    if (!confirmTarget) return;
    toggleSaved(confirmTarget.id);
    setConfirmTarget(null);
  }

  // Step-completion progress per saved program (student_step_progress joined
  // against application_steps) — fetched here rather than globally, since only
  // this page needs the per-program totals.
  useEffect(() => {
    if (!user?.id || savedIds.length === 0) {
      setProgressByProgramId({});
      return;
    }

    Promise.all([
      supabase.from('application_steps').select('id, program_id').in('program_id', savedIds),
      supabase.from('student_step_progress').select('step_id').eq('student_id', user.id)
    ]).then(([stepsRes, progressRes]) => {
      if (stepsRes.error || progressRes.error) {
        console.warn('Failed to load application progress:', stepsRes.error?.message || progressRes.error?.message);
        return;
      }
      const completedStepIds = new Set(progressRes.data.map((p) => p.step_id));
      const map = {};
      stepsRes.data.forEach((step) => {
        if (!map[step.program_id]) map[step.program_id] = { total: 0, completed: 0 };
        map[step.program_id].total += 1;
        if (completedStepIds.has(step.id)) map[step.program_id].completed += 1;
      });
      setProgressByProgramId(map);
    });
  }, [user?.id, savedIds]);

  return (
    <div className="flex flex-col w-full pb-8 gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-sticker badge-pink">
              <span className="material-symbols-outlined text-[16px]">bookmark</span> Drafts &amp; Bookmarks
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">Saved Applications</h1>
          <p className="text-sm text-ink-muted max-w-2xl mt-1 font-medium">
            Your bookmarked Philippine funding opportunities, scholarships, and assistance programs.
          </p>
        </div>
        <button onClick={() => navigate('/opportunities')} className="btn-candy btn-candy-secondary btn-candy-sm w-fit">
          <span className="material-symbols-outlined text-[18px]">add</span> Browse More Programs
        </button>
      </div>

      {savedList.length === 0 ? (
        <div className="card-sticker p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-accent-amber border-2 border-ink text-ink flex items-center justify-center mb-4 shadow-pop-sm">
            <span className="material-symbols-outlined text-4xl">bookmark_border</span>
          </div>
          <h3 className="text-xl font-extrabold font-heading text-ink mb-2">No Saved Applications Yet</h3>
          <p className="text-xs text-ink-muted max-w-md mb-6 font-medium">
            Explore scholarships, LGU assistance, and campus assistantships, and bookmark them for fast access.
          </p>
          <button onClick={() => navigate('/opportunities')} className="btn-candy">
            <span className="material-symbols-outlined text-[18px]">search_insights</span> Explore Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((opp) => {
            const status = savedStatusByProgramId[opp.id] || 'saved';
            const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.saved;
            const progress = progressByProgramId[opp.id];
            const progressPct = progress && progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

            return (
              <div key={opp.id} className="card-sticker p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="badge-sticker badge-cyan text-[10px]">{opp.type}</span>
                    <button
                      onClick={() => setConfirmTarget(opp)}
                      title="Remove from saved"
                      className="w-8 h-8 rounded-full bg-paper border-2 border-ink flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-colors shadow-pop-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  <h3 className="text-lg font-extrabold font-heading text-ink mb-1 group-hover:text-accent-violet transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-xs font-semibold text-ink-muted mb-3">{opp.providers?.name}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge-sticker ${statusStyle.badgeClass} text-[9px]`}>{statusStyle.label}</span>
                    <EligibilityBadge result={eligibilityByProgramId[opp.id]?.result} />
                  </div>

                  {progress && progress.total > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] font-heading font-bold text-ink-muted mb-1">
                        <span>Progress</span>
                        <span>{progress.completed} / {progress.total} steps</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-paper border border-ink overflow-hidden">
                        <div className="h-full bg-accent-mint transition-all duration-300" style={{ width: `${progressPct}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-paper rounded-2xl border-2 border-ink flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-heading font-extrabold text-ink-muted uppercase block">Value</span>
                      <span className="text-xs font-extrabold font-heading text-ink">{opp.funding}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t-2 border-ink">
                  <button onClick={() => navigate(`/opportunities/${opp.id}/eligibility`)} className="btn-candy btn-candy-sm flex-1">
                    Review Match
                  </button>
                  <button onClick={() => navigate(`/opportunities/${opp.id}/action-plan`)} className="btn-candy btn-candy-secondary btn-candy-sm flex-1">
                    Action Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmTarget && (
        <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4" onClick={() => setConfirmTarget(null)}>
          <div className="card-sticker bg-card p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 mx-auto rounded-full bg-accent-pink/10 border-2 border-accent-pink text-accent-pink flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">delete</span>
            </div>
            <h3 className="text-lg font-extrabold font-heading text-ink mb-1">Confirm Deletion?</h3>
            <p className="text-xs text-ink-muted font-medium mb-6">
              This removes <span className="font-bold text-ink">{confirmTarget.title}</span> from your saved applications. You can always save it again later.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmTarget(null)} className="btn-candy btn-candy-secondary btn-candy-sm flex-1">
                Cancel
              </button>
              <button onClick={confirmRemove} className="btn-candy btn-candy-sm flex-1 !bg-accent-pink">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
