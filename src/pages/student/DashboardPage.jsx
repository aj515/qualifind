import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { ELIGIBILITY_RANK, formatDeadline } from '../../lib/eligibility.js';
import EligibilityBadge from '../../components/EligibilityBadge.jsx';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { programs, savedIds, matcherScores, toggleSaved, eligibilityByProgramId } = useData();
  const navigate = useNavigate();

  const active = programs.filter((p) => p.status === 'Active');
  const strongCount = active.filter((p) => eligibilityByProgramId[p.id]?.result === 'eligible').length;
  const potentialCount = active.filter((p) => eligibilityByProgramId[p.id]?.result === 'potentially_eligible').length;

  const soonest = [...active]
    .map((p) => ({ ...p, ...formatDeadline(p.deadline) }))
    .filter((p) => p.daysLeft !== null && p.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  const topMatches = [...active]
    .sort((a, b) => {
      const rankA = ELIGIBILITY_RANK[eligibilityByProgramId[a.id]?.result] ?? 3;
      const rankB = ELIGIBILITY_RANK[eligibilityByProgramId[b.id]?.result] ?? 3;
      return rankA - rankB || (matcherScores[b.id] ?? 0) - (matcherScores[a.id] ?? 0);
    })
    .slice(0, 3);

  const firstName = profile?.name?.split(' ')[0] || 'there';
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Welcome Banner */}
      <div className="grid grid-cols-12 gap-6 w-full mt-2">
        <div className="col-span-12 flex flex-col justify-center bg-card rounded-3xl p-6 lg:p-8 relative overflow-hidden border-2 border-ink shadow-pop-lg">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-200/50 rounded-full opacity-60 pointer-events-none blur-sm"></div>
          <div className="absolute right-32 bottom-2 w-16 h-16 bg-pink-200/50 rounded-2xl rotate-12 opacity-60 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-sticker badge-amber">
                  <span className="material-symbols-outlined text-[15px]">waving_hand</span> Mabuhay, {firstName}!
                </span>
                <span className="text-ink-muted text-xs font-bold font-heading">{todayStr}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold font-heading text-ink tracking-tight leading-tight mb-2">
                Find student assistance that <span className="text-accent-violet underline decoration-accent-pink decoration-wavy">actually fits you</span>
              </h1>
              <p className="text-sm md:text-base text-ink-muted max-w-md font-medium leading-relaxed">
                AI evaluates your profile across scholarships, educational grants, LGU assistance, campus jobs, and student loans.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/matcher" className="btn-candy">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span> Start AI Matcher
                </Link>
                <Link to="/opportunities" className="btn-candy btn-candy-secondary">
                  Browse All Programs
                </Link>
              </div>
            </div>

            {soonest && (
              <div
                onClick={() => navigate(`/opportunities/${soonest.id}/eligibility`)}
                className="w-full md:w-56 shrink-0 flex flex-col gap-2 bg-paper rounded-2xl p-4 border-2 border-ink shadow-pop-sm hover:scale-105 transition-transform cursor-pointer"
              >
                <span className="badge-sticker badge-pink text-[9px] w-fit">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> Closing Soonest
                </span>
                <p className="text-xs font-extrabold font-heading text-ink line-clamp-2 leading-tight">{soonest.title}</p>
                <div className="flex items-center justify-between mt-1 pt-2 border-t border-ink/20">
                  <span className="text-[10px] font-heading font-bold text-ink-muted uppercase">Time Left:</span>
                  <span className="text-xs font-extrabold font-heading text-accent-pink">
                    {soonest.daysLeft === 0 ? 'Closes today' : `${soonest.daysLeft} days left`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <div className="card-sticker p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100/80 border-2 border-ink flex items-center justify-center text-indigo-800 shadow-pop-sm">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <span className="badge-sticker badge-violet text-[10px]">
              <span className="material-symbols-outlined text-[13px]">trending_up</span> Open Now
            </span>
          </div>
          <h4 className="text-xs font-heading font-bold text-ink-muted uppercase tracking-wider mb-1">Available Programs</h4>
          <span className="text-3xl font-extrabold font-heading text-ink">{active.length}</span>
        </div>

        <div className="card-sticker card-sticker-mint p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 border-2 border-ink flex items-center justify-center text-emerald-800 shadow-pop-sm">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <span className="badge-sticker badge-mint text-[10px]">
              <span className="material-symbols-outlined text-[13px]">star</span> Top Match
            </span>
          </div>
          <h4 className="text-xs font-heading font-bold text-ink-muted uppercase tracking-wider mb-1">Eligible / Strong Fits</h4>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-heading text-ink">{strongCount}</span>
            <span className="text-xs font-heading font-bold text-ink-muted">/ {active.length} Total</span>
          </div>
        </div>

        <div className="card-sticker card-sticker-amber p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100/80 border-2 border-ink flex items-center justify-center text-amber-800 shadow-pop-sm">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
            </div>
            <span className="badge-sticker badge-amber text-[10px]">Need Review</span>
          </div>
          <h4 className="text-xs font-heading font-bold text-ink-muted uppercase tracking-wider mb-1">Potentially Eligible</h4>
          <span className="text-3xl font-extrabold font-heading text-ink">{potentialCount}</span>
        </div>

        <div
          onClick={() => navigate('/saved-applications')}
          className="card-sticker p-5 flex flex-col justify-between cursor-pointer hover:border-accent-violet"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100/80 border-2 border-ink flex items-center justify-center text-indigo-800 shadow-pop-sm">
              <span className="material-symbols-outlined text-[22px]">bookmark</span>
            </div>
            <span className="badge-sticker badge-violet text-[10px]">View Saved &rarr;</span>
          </div>
          <h4 className="text-xs font-heading font-bold text-ink-muted uppercase tracking-wider mb-1">Saved Applications</h4>
          <span className="text-3xl font-extrabold font-heading text-ink">{savedIds.length}</span>
        </div>
      </div>

      {/* Top Recommended */}
      <div className="card-sticker bg-card overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b-2 border-ink">
          <div>
            <h2 className="text-xl font-extrabold font-heading text-ink flex items-center gap-2">
              Top Recommended Philippine Programs
              <span className="badge-sticker badge-violet">AI CALIBRATED</span>
            </h2>
            <p className="text-xs text-ink-muted font-medium mt-1">Ranked by eligibility and financial assistance category.</p>
          </div>
          <Link to="/opportunities" className="btn-candy btn-candy-sm">
            View All Programs <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="divide-y-2 divide-ink/10">
          {topMatches.map((opp) => (
            <div
              key={opp.id}
              onClick={() => navigate(`/opportunities/${opp.id}/eligibility`)}
              className="p-6 hover:bg-paper transition-colors group flex flex-col lg:flex-row gap-6 items-start justify-between relative cursor-pointer"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0 w-full lg:w-auto">
                <div className="w-14 h-14 rounded-2xl bg-paper border-2 border-ink shadow-pop-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px] text-ink">{opp.icon || 'school'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="badge-sticker badge-cyan text-[10px]">{opp.type}</span>
                    <span className="text-xs font-heading font-bold text-ink-muted">
                      {opp.duration} &bull; {opp.funding}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold font-heading text-ink truncate group-hover:text-accent-violet transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-ink-muted line-clamp-2 mt-1 font-medium max-w-2xl">{opp.summary}</p>
                </div>
              </div>

              <div
                className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 mt-2 lg:mt-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col items-start lg:items-end">
                  <EligibilityBadge result={eligibilityByProgramId[opp.id]?.result} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSaved(opp.id)}
                    className="w-9 h-9 rounded-full bg-card hover:bg-accent-amber border-2 border-ink flex items-center justify-center text-ink transition-colors shadow-pop-sm"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${savedIds.includes(opp.id) ? 'fill text-accent-pink' : ''}`}>
                      bookmark
                    </span>
                  </button>
                  <button onClick={() => navigate(`/opportunities/${opp.id}/eligibility`)} className="btn-candy btn-candy-sm">
                    Review Match
                  </button>
                </div>
              </div>
            </div>
          ))}
          {topMatches.length === 0 && (
            <p className="p-6 text-sm text-ink-muted font-medium">No active programs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
