import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = [
  { to: '/admin-dashboard', icon: 'checklist', label: 'Programs Registry' },
  { to: '/admin-dashboard/analytics', icon: 'monitoring', label: 'Analytics' }
];

function navLinkClass({ isActive }) {
  return `flex items-center px-4 py-3 rounded-2xl transition-all group border-2 font-heading font-bold text-sm ${
    isActive ? 'bg-accent-violet text-white border-ink shadow-pop' : 'text-ink border-transparent hover:bg-card-subtle'
  }`;
}

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('qualifind_theme', isDark ? 'dark' : 'light');
    } catch (e) {
      /* ignore */
    }
  }, [isDark]);

  return (
    <div className="bg-paper font-sans text-ink antialiased bg-dot-grid min-h-screen">
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-card z-50 flex-col border-r-2 border-ink">
        <div className="h-20 flex items-center px-6 border-b-2 border-ink">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-accent-violet rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[24px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-2xl text-ink tracking-tight leading-none">QualiFind</span>
              <span className="text-[10px] font-extrabold font-heading text-accent-violet uppercase tracking-wider mt-1">Admin Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto py-4">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end className={navLinkClass}>
              <span className="material-symbols-outlined mr-3 text-[22px]">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-ink bg-paper">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-3 bg-card-subtle rounded-2xl border-2 border-ink/10">
            <div className="w-8 h-8 rounded-full bg-accent-violet text-white border border-ink flex items-center justify-center text-[10px] font-heading font-extrabold shrink-0">
              {profile?.avatar || 'QF'}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-heading font-extrabold text-ink block truncate">{profile?.name}</span>
              <span className="text-[10px] text-ink-muted block truncate font-medium">{profile?.agency || 'Administrator'}</span>
            </div>
          </div>
          <button onClick={signOut} className="btn-candy btn-candy-secondary w-full py-2 text-xs hover:bg-accent-pink hover:text-white">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-paper/95 backdrop-blur-md z-40 border-b-2 border-ink flex items-center justify-between px-4 lg:px-8">
          <div>
            <span className="text-lg font-heading font-extrabold text-ink">Admin Console</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark((d) => !d)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-card border-2 border-ink shadow-pop-sm hover:bg-accent-amber transition-all"
              title="Toggle dark mode"
            >
              <span className="material-symbols-outlined text-[20px] text-ink">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <div className="lg:hidden">
              <button onClick={signOut} className="btn-candy btn-candy-secondary btn-candy-sm">
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="relative pt-28 flex-1 px-4 lg:px-8 py-8 pb-24 lg:pb-12 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
