// Only ever rendered when VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are missing
// (see App.jsx) — a real app is impossible to run without a connected Supabase project.
export default function SetupStatusPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg card-sticker bg-card p-8 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-accent-violet border-2 border-ink shadow-pop-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[28px]">cable</span>
        </div>

        <h1 className="text-2xl font-extrabold font-heading text-ink tracking-tight">Connect Your Supabase Project</h1>

        <p className="text-sm text-ink-muted font-medium leading-relaxed">
          React + Vite + Tailwind + the Supabase client are wired up, but no Supabase project is connected yet.
        </p>
        <div className="w-full text-left text-xs font-semibold text-ink bg-paper border-2 border-ink rounded-2xl p-4 space-y-2">
          <p className="font-heading font-extrabold uppercase tracking-wide text-ink-muted text-[11px]">To connect:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Create a Supabase project at supabase.com</li>
            <li>Run <code>supabase/migrations/0001_init.sql</code> in its SQL Editor</li>
            <li>Copy <code>.env.local.example</code> to <code>.env.local</code> and fill in your Project URL + anon key</li>
            <li>Restart <code>npm run dev</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
