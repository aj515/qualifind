import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import EligibilityBadge from '../../components/EligibilityBadge.jsx';

export default function SavedApplicationsPage() {
  const { programs, savedIds, toggleSaved } = useData();
  const navigate = useNavigate();

  const savedList = programs.filter((p) => savedIds.includes(p.id));

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
          {savedList.map((opp) => (
            <div key={opp.id} className="card-sticker p-6 flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="badge-sticker badge-violet text-[10px]">{opp.type}</span>
                  <button
                    onClick={() => toggleSaved(opp.id)}
                    title="Remove from saved"
                    className="w-8 h-8 rounded-full bg-paper border-2 border-ink flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-colors shadow-pop-sm"
                  >
                    <span className="material-symbols-outlined text-[18px] fill">bookmark</span>
                  </button>
                </div>

                <h3 className="text-lg font-extrabold font-heading text-ink mb-1 group-hover:text-accent-violet transition-colors">
                  {opp.title}
                </h3>
                <p className="text-xs font-semibold text-ink-muted mb-4">{opp.provider}</p>

                <div className="p-3 bg-paper rounded-2xl border-2 border-ink flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-heading font-extrabold text-ink-muted uppercase block">Value</span>
                    <span className="text-xs font-extrabold font-heading text-ink">{opp.funding}</span>
                  </div>
                  <div className="text-right">
                    <EligibilityBadge program={opp} />
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
          ))}
        </div>
      )}
    </div>
  );
}
