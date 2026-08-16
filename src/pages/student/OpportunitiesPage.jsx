import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { formatDeadline } from '../../lib/eligibility.js';
import { getAIMatches, calculateMatchForPrompt, looksLikeRealDescription } from '../../lib/matcher.js';
import EligibilityBadge from '../../components/EligibilityBadge.jsx';

const ALL_TYPES = ['Scholarship', 'Educational Assistance', 'Student Employment', 'Student Loan', 'Training & Certification'];
const ELIGIBILITY_OPTIONS = [
  { value: 'eligible', label: 'Eligible', dot: 'bg-accent-mint' },
  { value: 'potentially_eligible', label: 'Potentially Eligible', dot: 'bg-accent-amber' },
  { value: 'not_eligible', label: 'Not Eligible', dot: 'bg-accent-pink' }
];
const ALL_ELIGIBILITY = ELIGIBILITY_OPTIONS.map((o) => o.value);

export default function OpportunitiesPage() {
  const { profile } = useAuth();
  const { programs, savedIds, toggleSaved, matcherScores, matcherReasons, matcherQuery, profileUpdateNote, eligibilityByProgramId, applyMatcherScores } = useData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const usedFallbackMatcher = searchParams.get('ai') === 'fallback';

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTypes, setActiveTypes] = useState(ALL_TYPES);
  const [activeEligibility, setActiveEligibility] = useState(ALL_ELIGIBILITY);
  const [savedOnly, setSavedOnly] = useState(false);
  const [matcherInput, setMatcherInput] = useState(matcherQuery || '');
  const [isReSearching, setIsReSearching] = useState(false);
  const [reSearchClarification, setReSearchClarification] = useState('');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    setMatcherInput(matcherQuery || '');
  }, [matcherQuery]);

  const hasMatcherScores = Object.keys(matcherScores).length > 0;

  async function handleReSearch(e) {
    e.preventDefault();
    if (!matcherInput.trim() || isReSearching) return;

    setReSearchClarification('');

    // Same cheap client-side gate as the Matcher page — catches trivial junk
    // (empty-ish, single "word", keyboard-mash) before spending an API call on it.
    if (!looksLikeRealDescription(matcherInput)) {
      setReSearchClarification("That doesn't look like a real description yet — try describing your situation and what kind of help you need.");
      return;
    }

    setIsReSearching(true);
    let scored;
    let usedFallback = false;
    try {
      const result = await getAIMatches(matcherInput, programs, profile, eligibilityByProgramId);
      // Subtler junk (real-looking words strung together meaninglessly) passes the
      // cheap check above but gets caught here by the AI's own judgment call.
      if (!result.inputUnderstood) {
        setReSearchClarification(result.clarificationMessage || "We couldn't quite understand that — try describing your actual situation and what kind of help you need.");
        setIsReSearching(false);
        return;
      }
      scored = result.scoredPrograms;
    } catch (err) {
      console.warn('AI matching failed, falling back to offline ranking:', err);
      usedFallback = true;
      scored = calculateMatchForPrompt(matcherInput, programs, profile?.gpa ?? 75);
    }

    applyMatcherScores(scored, matcherInput, null, '');
    setSearchParams(usedFallback ? { ai: 'fallback' } : {});
    setIsReSearching(false);
  }

  const filtered = useMemo(() => {
    const results = programs.filter((p) => {
      if (savedOnly && !savedIds.includes(p.id)) return false;
      // No "empty means show all" special-casing — a checkbox list should mean
      // what it visually shows, so zero boxes checked correctly means zero
      // results (the empty state below points the student at Reset Filters).
      if (!activeTypes.includes(p.type)) return false;
      if (!activeEligibility.includes(eligibilityByProgramId[p.id]?.result)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hit =
          p.title.toLowerCase().includes(q) ||
          (p.providers?.name || '').toLowerCase().includes(q) ||
          (p.dept || '').toLowerCase().includes(q) ||
          (p.keywords || []).some((k) => k.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });

    if (hasMatcherScores) {
      // Only demote programs you genuinely can't apply to (not_eligible) below
      // everything else — a program that's merely "potentially eligible" (some
      // profile field just hasn't been filled in yet) isn't actually worse than
      // a fully "eligible" one, so it shouldn't be artificially outranked by it.
      // Within that not-excluded set, sort purely by relevance to what was
      // actually asked for, so a highly relevant program isn't buried under an
      // unrelated one that just happens to sit in a "higher" eligibility tier.
      results.sort((a, b) => {
        const aExcluded = eligibilityByProgramId[a.id]?.result === 'not_eligible';
        const bExcluded = eligibilityByProgramId[b.id]?.result === 'not_eligible';
        if (aExcluded !== bExcluded) return aExcluded ? 1 : -1;
        return (matcherScores[b.id] ?? 0) - (matcherScores[a.id] ?? 0);
      });
    }
    return results;
  }, [programs, savedOnly, activeTypes, activeEligibility, query, savedIds, matcherScores, hasMatcherScores, eligibilityByProgramId]);

  function toggleType(type) {
    setActiveTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  }

  function toggleEligibility(status) {
    setActiveEligibility((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  }

  function resetFilters() {
    setActiveTypes(ALL_TYPES);
    setActiveEligibility(ALL_ELIGIBILITY);
    setSavedOnly(false);
    setQuery('');
    setSearchParams({});
  }

  return (
    <div className="flex flex-col w-full gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">Assistance Programs</h1>
        <p className="text-sm text-ink-muted max-w-2xl mt-1 font-medium">
          Browse Philippine scholarships, grants, assistantships, and loans, filtered to your profile.
        </p>
      </div>

      {hasMatcherScores && matcherQuery && (
        <div className="card-sticker p-4 bg-accent-violet/5 border-accent-violet/40 flex flex-col gap-2">
          <form onSubmit={handleReSearch} className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 z-10 text-accent-violet text-[20px] pointer-events-none">auto_awesome</span>
            <input
              value={matcherInput}
              onChange={(e) => setMatcherInput(e.target.value)}
              placeholder="Describe your situation..."
              className="w-full input-playful pl-11 pr-24 py-2.5 text-xs font-medium shadow-pop-sm"
            />
            <button
              type="submit"
              disabled={isReSearching || !matcherInput.trim()}
              className="absolute right-1.5 btn-candy btn-candy-sm text-[11px] py-1.5 px-3 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[14px]">{isReSearching ? 'progress_activity' : 'search'}</span>
              {isReSearching ? 'Searching…' : 'Search'}
            </button>
          </form>

          {reSearchClarification && (
            <p className="text-[11px] text-ink font-semibold flex items-start gap-1.5 bg-accent-amber/20 border-2 border-ink rounded-2xl p-2.5">
              <span className="material-symbols-outlined text-[15px] shrink-0 mt-0.5">help</span>
              {reSearchClarification}
            </p>
          )}

          {profileUpdateNote && (
            <p className="text-[11px] text-ink-muted font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-accent-mint">check_circle</span>
              {profileUpdateNote}
            </p>
          )}
        </div>
      )}

      {usedFallbackMatcher && (
        <div className="p-3 rounded-2xl bg-accent-amber/20 border-2 border-ink flex items-center gap-2.5 shadow-pop-sm">
          <span className="material-symbols-outlined text-ink text-[18px] shrink-0">warning</span>
          <p className="text-xs font-semibold text-ink">AI matching was unavailable, so these results use the offline keyword ranking instead.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filters */}
        <div className="card-sticker p-5 bg-card flex flex-col gap-6 lg:sticky lg:top-28">
          <div>
            <h4 className="text-xs font-heading font-extrabold text-ink uppercase tracking-wider mb-2.5">Category</h4>
            <div className="flex flex-col gap-2">
              {ALL_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={activeTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="w-4 h-4 rounded border-2 border-ink text-accent-violet"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-heading font-extrabold text-ink uppercase tracking-wider mb-2.5">Eligibility</h4>
            <div className="flex flex-col gap-2">
              {ELIGIBILITY_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={activeEligibility.includes(option.value)}
                    onChange={() => toggleEligibility(option.value)}
                    className="w-4 h-4 rounded border-2 border-ink text-accent-violet"
                  />
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full border border-ink ${option.dot}`}></span> {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-ink">
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(e) => setSavedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-ink text-accent-violet"
            />
            <span>Saved Applications Only</span>
          </label>

          <button onClick={resetFilters} className="btn-candy btn-candy-secondary btn-candy-sm">
            Reset Filters
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="card-sticker p-4 flex items-center justify-between bg-card">
            <span className="text-sm font-heading font-bold text-ink">
              <span className="text-accent-violet font-extrabold">{filtered.length}</span> opportunities in the Philippines
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="input-playful py-1.5 px-3 text-xs w-48"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="card-sticker p-12 text-center flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-ink-muted mb-4">search_off</span>
              <h3 className="text-xl font-bold font-heading text-ink mb-1">No programs match your filters</h3>
              <p className="text-sm text-ink-muted max-w-md mb-6 font-medium">Try broadening your search or resetting category filters.</p>
              <button className="btn-candy" onClick={resetFilters}>Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((opp) => {
                const { formatted } = formatDeadline(opp.deadline);
                const isSaved = savedIds.includes(opp.id);
                return (
                  <div
                    key={opp.id}
                    onClick={() => navigate(`/opportunities/${opp.id}/eligibility`)}
                    className="card-sticker p-6 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="badge-sticker badge-cyan text-[10px]">{opp.type}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaved(opp.id);
                          }}
                          className="w-8 h-8 rounded-full bg-paper border-2 border-ink flex items-center justify-center text-ink hover:bg-accent-amber transition-colors shadow-pop-sm"
                        >
                          <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'fill text-accent-pink' : ''}`}>bookmark</span>
                        </button>
                      </div>

                      <h3 className="text-lg font-extrabold font-heading text-ink mb-1 group-hover:text-accent-violet transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-xs font-semibold text-ink-muted mb-2">{opp.providers?.name}</p>
                      {matcherReasons[opp.id] && (
                        <p className="text-[11px] text-accent-violet font-medium leading-snug mb-2 flex items-start gap-1">
                          <span className="material-symbols-outlined text-[13px] mt-0.5 shrink-0">auto_awesome</span>
                          {matcherReasons[opp.id]}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-3 p-3 bg-paper rounded-2xl border-2 border-ink mb-4">
                        <div>
                          <span className="text-[10px] font-heading font-extrabold text-ink-muted uppercase">Stipend / Value</span>
                          <p className="text-xs font-extrabold font-heading text-ink">{opp.funding}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-heading font-extrabold text-ink-muted uppercase">Deadline</span>
                          <p className="text-xs font-extrabold font-heading text-ink">{formatted}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t-2 border-ink flex items-center justify-between">
                      <EligibilityBadge result={eligibilityByProgramId[opp.id]?.result} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
