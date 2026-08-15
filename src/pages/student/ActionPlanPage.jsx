import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import { formatDeadline, getRequirementStyle } from '../../lib/eligibility.js';

const PRIORITY = { unmet: 0, action: 1, pending: 2 };

export default function ActionPlanPage() {
  const { id } = useParams();
  const { programs } = useData();
  const navigate = useNavigate();

  const opp = programs.find((p) => p.id === id);

  if (!opp) {
    return (
      <div className="card-sticker p-12 text-center flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-ink-muted mb-4">search_off</span>
        <h3 className="text-xl font-bold font-heading text-ink mb-1">This program isn't in the registry anymore</h3>
        <button className="btn-candy mt-4" onClick={() => navigate('/opportunities')}>Back to Opportunities</button>
      </div>
    );
  }

  const requirements = opp.requirements || [];
  const outstanding = requirements.filter((r) => r.status !== 'satisfied');
  const { formatted } = formatDeadline(opp.deadline);

  const nextReq = [...outstanding].sort((a, b) => (PRIORITY[a.status] ?? 3) - (PRIORITY[b.status] ?? 3))[0];

  const steps = [
    {
      title: 'Prepare Required Documents',
      desc:
        requirements.length > 0
          ? `Gather: ${requirements.map((r) => r.title).join(', ')}.`
          : 'Gather the standard documents this provider requests (enrollment proof, grades, ID).',
      badge: outstanding.length > 0 ? `${outstanding.length} Outstanding` : 'All Ready',
      badgeClass: outstanding.length > 0 ? 'badge-amber' : 'badge-mint',
      numColor: 'bg-accent-violet text-white'
    },
    {
      title: 'Fill Out Official Application Form',
      desc: `Complete the online or in-person submission at the ${opp.provider} application desk.`,
      badge: `Due ${formatted}`,
      badgeClass: 'badge-amber',
      numColor: 'bg-accent-pink text-white'
    },
    {
      title: 'Confirmation & Document Endorsement',
      desc: 'Receive your application reference number and retain the receipt for university financial clearance.',
      badge: 'Final Step',
      badgeClass: 'badge-violet',
      numColor: 'bg-accent-mint text-ink'
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-6">
      <div
        onClick={() => navigate(`/opportunities/${opp.id}/eligibility`)}
        className="flex items-center gap-2 text-sm font-heading font-bold text-ink cursor-pointer hover:text-accent-violet transition-colors w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Program Details
      </div>

      <div>
        <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">Personalized Action Plan</h1>
        <p className="text-sm text-ink-muted mt-1 font-medium">
          Step-by-step roadmap to submit your application for <strong className="text-accent-violet">{opp.title}</strong>.
        </p>
      </div>

      <div className="card-sticker card-sticker-amber p-6 bg-card relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-2">
          <span className="badge-sticker badge-amber w-fit">
            <span className="material-symbols-outlined text-[15px]">flag</span> RECOMMENDED NEXT ACTION
          </span>
          <h3 className="text-lg font-extrabold font-heading text-ink mt-1">
            {nextReq ? `Your Next Step: ${nextReq.note || nextReq.title}` : 'Your Next Step: Submit your completed application'}
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed font-medium">
            {nextReq
              ? `${nextReq.desc} Complete this before the ${formatted} deadline to keep your application on track.`
              : `All requirements are satisfied — head to the ${opp.provider} portal to finish your submission before ${formatted}.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-sticker p-5 bg-card flex flex-col gap-3">
          <h3 className="text-base font-extrabold font-heading text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-violet">description</span> Required Documents
          </h3>
          <ul className="flex flex-col gap-2 text-xs font-semibold text-ink">
            {requirements.length > 0 ? (
              requirements.map((req, i) => {
                const style = getRequirementStyle(req.status);
                const icon = req.status === 'satisfied' ? 'check_circle' : req.status === 'unmet' ? 'cancel' : 'pending';
                return (
                  <li key={req.id || i} className="flex items-center gap-2 p-2 rounded-xl bg-paper border border-ink/30">
                    <span className={`material-symbols-outlined text-[18px] ${style.iconColor.includes('mint') ? 'text-accent-mint' : style.iconColor.includes('pink') ? 'text-accent-pink' : 'text-accent-amber'}`}>
                      {icon}
                    </span>
                    {req.title}
                  </li>
                );
              })
            ) : (
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
            <p className="text-xs text-ink-muted font-medium mb-3">Submit your forms directly to the verified provider:</p>
            <div className="p-3 rounded-xl bg-paper border-2 border-ink flex items-center justify-between">
              <span className="text-xs font-extrabold font-heading text-ink">{opp.provider} Application Desk</span>
              <span className="material-symbols-outlined text-accent-violet text-[18px]">open_in_new</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-ink/20 flex justify-between items-center text-xs">
            <span className="font-heading font-bold text-ink-muted">Deadline:</span>
            <span className="badge-sticker badge-pink text-[10px]">{formatted}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-extrabold font-heading text-ink">Step-by-Step Application Flow</h3>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="card-sticker p-5 bg-card flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-2xl ${step.numColor} border-2 border-ink font-heading font-extrabold flex items-center justify-center shrink-0 shadow-pop-sm`}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-extrabold font-heading text-ink">{step.title}</h4>
                <p className="text-xs text-ink-muted mt-1 font-medium">{step.desc}</p>
                <div className={`mt-2 inline-flex items-center gap-1 badge-sticker ${step.badgeClass} text-[9px]`}>{step.badge}</div>
              </div>
            </div>
          ))}
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
