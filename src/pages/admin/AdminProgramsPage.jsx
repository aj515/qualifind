import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import { supabase } from '../../lib/supabaseClient.js';
import { formatVerifiedDate } from '../../lib/eligibility.js';
import Tooltip from '../../components/Tooltip.jsx';

const STATUS_BADGE = {
  Active: 'badge-mint',
  'In Review': 'badge-amber',
  Draft: 'badge-violet',
  Expired: 'badge-pink'
};

// A program is "stale" once it hasn't been re-verified in 90+ days — the list
// flags this so an admin knows what actually needs attention, rather than
// treating "verified" as a one-time fact.
const STALE_DAYS = 90;

function daysSince(dateStr) {
  if (!dateStr) return Infinity;
  return Math.floor((Date.now() - new Date(`${dateStr}T00:00:00`).getTime()) / 86400000);
}

export default function AdminProgramsPage() {
  const { programs, refreshPrograms, loading } = useData();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleVerifyNow(programId) {
    setBusyId(programId);
    setErrorMsg('');
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from('programs').update({ last_verified_at: today }).eq('id', programId);
    if (error) setErrorMsg(`Failed to mark verified: ${error.message}`);
    else await refreshPrograms();
    setBusyId(null);
  }

  async function handleDelete(programId, title) {
    if (!window.confirm(`Delete "${title}"? This also removes its document checklist and application steps.`)) return;
    setBusyId(programId);
    setErrorMsg('');
    const { error } = await supabase.from('programs').delete().eq('id', programId);
    if (error) setErrorMsg(`Failed to delete: ${error.message}`);
    else await refreshPrograms();
    setBusyId(null);
  }

  const staleCount = programs.filter((p) => p.status === 'Active' && daysSince(p.last_verified_at) > STALE_DAYS).length;

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-ink tracking-tight">Programs Registry</h1>
          <p className="text-sm text-ink-muted mt-1 font-medium">
            Add, verify, and retire assistance programs. Students only see what's listed here.
          </p>
        </div>
        <button onClick={() => navigate('/admin-dashboard/programs/new')} className="btn-candy px-5 self-start">
          <span className="material-symbols-outlined text-[18px]">add</span> Add Program
        </button>
      </div>

      {staleCount > 0 && (
        <div className="p-3 rounded-2xl bg-accent-amber/20 border-2 border-ink flex items-center gap-2.5 shadow-pop-sm">
          <span className="material-symbols-outlined text-ink text-[18px] shrink-0">warning</span>
          <p className="text-xs font-semibold text-ink">
            {staleCount} active program{staleCount > 1 ? 's haven\'t' : ' hasn\'t'} been re-verified in {STALE_DAYS}+ days.
          </p>
        </div>
      )}

      {errorMsg && <div className="p-3 rounded-2xl bg-accent-pink/10 border-2 border-accent-pink text-xs font-semibold text-ink">{errorMsg}</div>}

      <div className="card-sticker bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-ink bg-card-subtle">
                <th className="p-4 text-xs font-heading font-extrabold uppercase tracking-wider text-ink-muted">Program</th>
                <th className="p-4 text-xs font-heading font-extrabold uppercase tracking-wider text-ink-muted">Status</th>
                <th className="p-4 text-xs font-heading font-extrabold uppercase tracking-wider text-ink-muted">Deadline</th>
                <th className="p-4 text-xs font-heading font-extrabold uppercase tracking-wider text-ink-muted">Last Verified</th>
                <th className="p-4 text-xs font-heading font-extrabold uppercase tracking-wider text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="p-6 text-center text-xs text-ink-muted font-medium">Loading…</td></tr>
              )}
              {!loading && programs.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-xs text-ink-muted font-medium">No programs yet — add the first one.</td></tr>
              )}
              {!loading &&
                programs.map((p) => {
                  const stale = p.status === 'Active' && daysSince(p.last_verified_at) > STALE_DAYS;
                  return (
                    <tr key={p.id} className="border-b border-ink/10 last:border-0 hover:bg-card-subtle/60">
                      <td className="p-4">
                        <div className="text-sm font-extrabold font-heading text-ink">{p.title}</div>
                        <div className="text-[11px] text-ink-muted font-medium">{p.providers?.name} &bull; {p.type}</div>
                      </td>
                      <td className="p-4">
                        <span className={`badge-sticker ${STATUS_BADGE[p.status] || 'badge-violet'} text-[10px]`}>{p.status}</span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-ink">{p.deadline || '—'}</td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold ${stale ? 'text-accent-pink' : 'text-ink'}`}>
                          {formatVerifiedDate(p.last_verified_at) || 'Never'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Tooltip text="Marks this listing as manually re-checked today. Confirm the details are still accurate first — it doesn't verify anything automatically.">
                            <button
                              disabled={busyId === p.id}
                              onClick={() => handleVerifyNow(p.id)}
                              className="btn-candy btn-candy-secondary btn-candy-sm text-[11px] py-1 px-2.5 disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[14px]">verified</span> Verify
                            </button>
                          </Tooltip>
                          <button
                            onClick={() => navigate(`/admin-dashboard/programs/${p.id}`)}
                            className="btn-candy btn-candy-secondary btn-candy-sm text-[11px] py-1 px-2.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                          </button>
                          <button
                            disabled={busyId === p.id}
                            onClick={() => handleDelete(p.id, p.title)}
                            className="btn-candy btn-candy-sm text-[11px] py-1 px-2.5 bg-accent-pink text-white disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
