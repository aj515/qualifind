import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { supabase } from '../../lib/supabaseClient.js';
import { formatDeadline, formatVerifiedDate } from '../../lib/eligibility.js';
import { getPersonalizedNextAction } from '../../lib/actionPlanNarrator.js';

const STATUS_LABELS = {
  saved: 'Saved',
  in_progress: 'In Progress',
  applied: 'Submitted',
  withdrawn: 'Withdrawn'
};

export default function ActionPlanPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { programs, eligibilityByProgramId, savedStatusByProgramId, setProgramStatus } = useData();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [steps, setSteps] = useState([]);
  const [completedStepIds, setCompletedStepIds] = useState(new Set());
  const [loadingExtras, setLoadingExtras] = useState(true);
  // AI-personalized "what to prioritize" text — replaces the generic
  // eligibility-explanation fallback once it loads. Never blocks the page;
  // falls back silently to the generic text if the call fails.
  const [aiRecommendedAction, setAiRecommendedAction] = useState('');
  const [aiActionLoading, setAiActionLoading] = useState(false);

  const opp = programs.find((p) => p.id === id);

  // Required documents, application steps, and this student's completed-step
  // records are real per-program/per-student rows now (program_documents/documents,
  // application_steps, student_step_progress) instead of hardcoded client text.
  useEffect(() => {
    if (!id || !user?.id) return;
    setLoadingExtras(true);
    Promise.all([
      supabase.from('program_documents').select('documents(id, name)').eq('program_id', id),
      supabase.from('application_steps').select('*').eq('program_id', id).order('step_number', { ascending: true })
    ]).then(async ([docsRes, stepsRes]) => {
      if (docsRes.error) console.warn('Failed to load documents:', docsRes.error.message);
      else setDocuments(docsRes.data.map((row) => row.documents));

      if (stepsRes.error) {
        console.warn('Failed to load application steps:', stepsRes.error.message);
        setSteps([]);
        setCompletedStepIds(new Set());
      } else {
        setSteps(stepsRes.data);
        const stepIds = stepsRes.data.map((s) => s.id);
        if (stepIds.length > 0) {
          const { data: progress, error: progressError } = await supabase
            .from('student_step_progress')
            .select('step_id')
            .eq('student_id', user.id)
            .in('step_id', stepIds);
          if (progressError) console.warn('Failed to load step progress:', progressError.message);
          setCompletedStepIds(new Set((progress || []).map((p) => p.step_id)));
        } else {
          setCompletedStepIds(new Set());
        }
      }

      setLoadingExtras(false);
    });
  }, [id, user?.id]);

  // Personalizes the "recommended next action" callout once documents/steps have
  // loaded. Fires once per program visit, not on every checkbox click — re-running
  // it per click would add latency/cost without much benefit. Silently falls back
  // to the generic eligibility-based text on failure (see the render below).
  useEffect(() => {
    setAiRecommendedAction('');
    if (loadingExtras || !id) return;
    const programObj = programs.find((p) => p.id === id);
    if (!programObj) return;

    setAiActionLoading(true);
    getPersonalizedNextAction({
      program: programObj,
      eligibility: eligibilityByProgramId[id],
      documents,
      steps,
      completedStepNumbers: steps.filter((s) => completedStepIds.has(s.id)).map((s) => s.step_number)
    })
      .then(setAiRecommendedAction)
      .catch((err) => console.warn('Personalized action plan narration failed, using generic text:', err))
      .finally(() => setAiActionLoading(false));
    // Deliberately excludes completedStepIds/documents/steps from deps — this
    // should reflect state as of page load, not refetch on every interaction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loadingExtras]);

  async function toggleStep(stepId) {
    if (!user?.id) return;
    const isDone = completedStepIds.has(stepId);
    const next = new Set(completedStepIds);
    if (isDone) next.delete(stepId);
    else next.add(stepId);
    setCompletedStepIds(next);

    if (isDone) {
      const { error } = await supabase.from('student_step_progress').delete().eq('student_id', user.id).eq('step_id', stepId);
      if (error) console.warn('Failed to uncheck step:', error.message);
    } else {
      const { error } = await supabase.from('student_step_progress').insert({ student_id: user.id, step_id: stepId });
      if (error) console.warn('Failed to check step:', error.message);
    }

    // Status auto-derives from step completion: none checked -> saved, some ->
    // in_progress, all -> applied (submitted). Checking a step also implicitly
    // bookmarks the program if it wasn't already.
    if (steps.length > 0) {
      const allDone = steps.every((s) => next.has(s.id));
      const anyDone = steps.some((s) => next.has(s.id));
      const derivedStatus = allDone ? 'applied' : anyDone ? 'in_progress' : 'saved';
      await setProgramStatus(id, derivedStatus);
    }
  }

  if (!opp) {
    return (
      <div className="card-sticker p-12 text-center flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-ink-muted mb-4">search_off</span>
        <h3 className="text-xl font-bold font-heading text-ink mb-1">This program isn't in the registry anymore</h3>
        <button className="btn-candy mt-4" onClick={() => navigate('/opportunities')}>Back to Opportunities</button>
      </div>
    );
  }

  const { formatted } = formatDeadline(opp.deadline);
  const eligibility = eligibilityByProgramId[opp.id];
  const currentStatus = savedStatusByProgramId[opp.id];
  const completedCount = steps.filter((s) => completedStepIds.has(s.id)).length;
  const progressPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-6">
      <div
        onClick={() => navigate(`/opportunities/${opp.id}/eligibility`)}
        className="flex items-center gap-2 text-sm font-heading font-bold text-ink cursor-pointer hover:text-accent-violet transition-colors w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Program Details
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">Personalized Action Plan</h1>
          <p className="text-sm text-ink-muted mt-1 font-medium">
            Step-by-step roadmap to submit your application for <strong className="text-accent-violet">{opp.title}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-bold text-ink-muted">Status:</span>
          <select
            value={currentStatus || 'saved'}
            onChange={(e) => setProgramStatus(opp.id, e.target.value)}
            className="input-playful py-1.5 px-3 text-xs font-extrabold"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="card-sticker p-5 bg-card flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-heading font-bold text-ink-muted">
            <span>Application Progress</span>
            <span>{completedCount} of {steps.length} steps complete</span>
          </div>
          <div className="w-full h-3 rounded-full bg-paper border-2 border-ink overflow-hidden">
            <div
              className="h-full bg-accent-mint transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="card-sticker card-sticker-amber p-6 bg-card relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge-sticker badge-amber w-fit">
              <span className="material-symbols-outlined text-[15px]">flag</span> RECOMMENDED NEXT ACTION
            </span>
            {aiRecommendedAction && (
              <span className="badge-sticker badge-violet w-fit text-[9px]">
                <span className="material-symbols-outlined text-[12px]">auto_awesome</span> AI Personalized
              </span>
            )}
          </div>

          {aiActionLoading && !aiRecommendedAction ? (
            <p className="text-sm text-ink-muted leading-relaxed font-medium flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              Personalizing your next step…
            </p>
          ) : (
            <>
              <h3 className="text-lg font-extrabold font-heading text-ink mt-1">
                {aiRecommendedAction
                  ? 'Your Next Step'
                  : eligibility?.result === 'eligible'
                    ? 'Your Next Step: Submit your completed application'
                    : `Your Next Step: ${eligibility?.explanation || 'Review the requirements below'}`}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed font-medium">
                {aiRecommendedAction
                  ? aiRecommendedAction
                  : eligibility?.result === 'eligible'
                    ? `All requirements are satisfied — head to the ${opp.providers?.name || 'provider'}'s official channel to finish your submission before ${formatted}.`
                    : `Resolving this before ${formatted} keeps your application on track.`}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-sticker p-5 bg-card flex flex-col gap-3">
          <h3 className="text-base font-extrabold font-heading text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-violet">description</span> Required Documents
          </h3>
          <ul className="flex flex-col gap-2 text-xs font-semibold text-ink">
            {loadingExtras && <li className="text-ink-muted">Loading…</li>}
            {!loadingExtras && documents.length > 0 &&
              documents.map((doc) => (
                <li key={doc.id} className="flex items-center gap-2 p-2 rounded-xl bg-paper border border-ink/30">
                  <span className="material-symbols-outlined text-accent-violet text-[18px]">description</span>
                  {doc.name}
                </li>
              ))}
            {!loadingExtras && documents.length === 0 && (
              <li className="flex items-center gap-2 p-2 rounded-xl bg-paper border border-ink/30 text-ink-muted">
                No document checklist available for this program yet.
              </li>
            )}
          </ul>
        </div>

        <div className="card-sticker p-5 bg-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold font-heading text-ink flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-accent-pink">link</span> Official Application Source
            </h3>
            <p className="text-xs text-ink-muted font-medium mb-3">
              {opp.source_url ? 'Submit your forms directly to the verified provider:' : 'No verified official link on file — contact the provider directly:'}
            </p>
            {opp.source_url ? (
              <a
                href={opp.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-paper border-2 border-ink flex items-center justify-between hover:bg-card-subtle transition-colors"
              >
                <span className="text-xs font-extrabold font-heading text-ink">{opp.providers?.name}</span>
                <span className="material-symbols-outlined text-accent-violet text-[18px]">open_in_new</span>
              </a>
            ) : (
              <div className="p-3 rounded-xl bg-paper border-2 border-ink flex items-center justify-between">
                <span className="text-xs font-extrabold font-heading text-ink">{opp.providers?.name}</span>
                <span className="material-symbols-outlined text-ink-muted text-[18px]">info</span>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-ink/20 flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-heading font-bold text-ink-muted">Deadline:</span>
              <span className="badge-sticker badge-pink text-[10px]">{formatted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-heading font-bold text-ink-muted">Last Verified:</span>
              <span className="font-extrabold text-ink">{formatVerifiedDate(opp.last_verified_at) || 'Not yet verified'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-extrabold font-heading text-ink">Step-by-Step Application Flow</h3>
        <p className="text-xs text-ink-muted font-medium -mt-2">Check off each step as you complete it to track your progress.</p>
        <div className="space-y-3">
          {loadingExtras && <p className="text-sm text-ink-muted font-medium">Loading…</p>}
          {!loadingExtras && steps.length === 0 && (
            <p className="text-sm text-ink-muted font-medium">No application steps have been added for this program yet.</p>
          )}
          {!loadingExtras &&
            steps.map((step) => {
              const done = completedStepIds.has(step.id);
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className={`w-full text-left card-sticker p-5 flex gap-4 items-start transition-colors ${done ? 'bg-accent-mint/10' : 'bg-card'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl border-2 border-ink font-heading font-extrabold flex items-center justify-center shrink-0 shadow-pop-sm ${
                      done ? 'bg-accent-mint text-ink' : 'bg-paper text-ink-muted'
                    }`}
                  >
                    {done ? <span className="material-symbols-outlined text-[20px]">check</span> : String(step.step_number).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-extrabold font-heading ${done ? 'text-ink line-through decoration-2' : 'text-ink'}`}>{step.title}</h4>
                    <p className="text-xs text-ink-muted mt-1 font-medium">{step.description}</p>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button onClick={() => navigate('/opportunities')} className="btn-candy btn-candy-secondary btn-candy-sm">
          Browse More Programs
        </button>
      </div>
    </div>
  );
}
