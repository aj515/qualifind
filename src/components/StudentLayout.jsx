import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

const NAV_LINKS = [
  { to: '/dashboard', icon: 'dashboard', label: 'Student Dashboard' },
  { to: '/matcher', icon: 'auto_awesome', label: 'AI Profile Matcher' },
  { to: '/opportunities', icon: 'search', label: 'Assistance Programs' },
  { to: '/saved-applications', icon: 'bookmark', label: 'Applications' },
  { to: '/profile', icon: 'person', label: 'Student Profile' }
];

function navLinkClass({ isActive }) {
  return `flex items-center px-4 py-3 rounded-2xl transition-all group border-2 font-heading font-bold text-sm ${
    isActive
      ? 'bg-accent-violet text-white border-ink shadow-pop'
      : 'text-ink border-transparent hover:bg-card-subtle'
  }`;
}

export default function StudentLayout() {
  const { profile, signOut } = useAuth();
  const { savedIds } = useData();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('qualifind_theme', isDark ? 'dark' : 'light');
    } catch (e) {
      /* ignore */
    }
  }, [isDark]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate(`/opportunities?q=${encodeURIComponent(search)}`);
  }

  return (
    <div className="bg-paper font-sans text-ink antialiased bg-dot-grid min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-card z-50 flex-col border-r-2 border-ink">
        <div className="h-20 flex items-center px-6 border-b-2 border-ink">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-accent-violet rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[24px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-2xl text-ink tracking-tight leading-none">QualiFind</span>
              <span className="text-[10px] font-extrabold font-heading text-accent-violet uppercase tracking-wider mt-1">Student Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto py-4">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              <span className="material-symbols-outlined mr-3 text-[22px]">{link.icon}</span>
              <span>{link.label}</span>
              {link.to === '/saved-applications' && savedIds.length > 0 && (
                <span className="ml-auto badge-sticker badge-pink text-[9px] py-0.5 px-2">{savedIds.length}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-ink bg-paper">
          <button onClick={signOut} className="btn-candy btn-candy-secondary w-full py-2 text-xs hover:bg-accent-pink hover:text-white">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-paper/95 backdrop-blur-md z-40 border-b-2 border-ink flex items-center justify-between px-4 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-ink-muted text-[20px]">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full input-playful pl-11 pr-4 py-2.5 shadow-pop-sm"
                placeholder="Search scholarships, grants, loans, assistantships... (Press Enter)"
                type="text"
              />
            </div>
          </form>

          <div className="flex items-center gap-3 ml-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-card rounded-full border-2 border-ink shadow-pop-sm">
              <div className="w-7 h-7 rounded-full bg-accent-violet text-white border border-ink flex items-center justify-center text-[10px] font-heading font-extrabold">
                {profile?.avatar || 'QF'}
              </div>
              <div>
                <span className="text-xs font-heading font-extrabold text-ink block leading-tight">{profile?.name}</span>
                <span className="text-[10px] text-ink-muted block leading-tight font-medium">
                  Student{profile?.location ? ` • ${profile.location}` : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDark((d) => !d)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-card border-2 border-ink shadow-pop-sm hover:bg-accent-amber transition-all"
              title="Toggle dark mode"
            >
              <span className="material-symbols-outlined text-[20px] text-ink">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </header>

        <main className="relative pt-28 flex-1 px-4 lg:px-8 py-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-md border-t-2 border-ink flex items-center justify-around px-2 py-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-heading font-bold ${
                isActive ? 'text-accent-violet' : 'text-ink-muted'
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
