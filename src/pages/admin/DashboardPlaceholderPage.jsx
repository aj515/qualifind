import { useAuth } from '../../context/AuthContext.jsx';

// Temporary stand-in for the real Admin Dashboard/Programs CRUD (Phase 4).
// Proves the full loop end-to-end: signup/login -> trigger-created profile row ->
// RLS-scoped profile read -> role-based routing -> sign out.
export default function DashboardPlaceholderPage() {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg card-sticker bg-card p-8 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-accent-amber border-2 border-ink shadow-pop-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-ink text-[28px]">admin_panel_settings</span>
        </div>

        <h1 className="text-2xl font-extrabold font-heading text-ink tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-ink-muted font-medium">
          Placeholder — the real Programs CRUD dashboard lands in the next phase. This confirms auth + the
          <code className="mx-1">profiles</code> row are wired up end-to-end.
        </p>

        <div className="w-full text-left text-xs font-semibold text-ink bg-paper border-2 border-ink rounded-2xl p-4 space-y-1">
          <p><span className="text-ink-muted">Email:</span> {user?.email}</p>
          <p><span className="text-ink-muted">Name:</span> {profile?.name ?? '—'}</p>
          <p><span className="text-ink-muted">Role:</span> {profile?.role ?? '—'}</p>
          <p><span className="text-ink-muted">Agency:</span> {profile?.agency ?? '—'}</p>
          <p><span className="text-ink-muted">Position:</span> {profile?.position ?? '—'}</p>
        </div>

        <button onClick={signOut} className="btn-candy btn-candy-secondary w-full py-2.5 text-sm">
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign Out
        </button>
      </div>
    </div>
  );
}
