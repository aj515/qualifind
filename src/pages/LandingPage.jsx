import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Tailwind's build-time scanner only picks up class names that appear as
// literal strings somewhere in the source — bg-${accent}/15 template
// interpolation wouldn't be detected, so each icon-box gets its full class
// string spelled out here instead of being assembled at render time.
const FEATURES = [
  {
    icon: 'auto_awesome',
    iconBoxClass: 'bg-accent-violet/15',
    title: 'AI Profile Matcher',
    text: 'Describe your situation in your own words, or upload a document — Claude reads it and ranks every program by how well it actually fits what you need, not just your course.'
  },
  {
    icon: 'verified',
    iconBoxClass: 'bg-accent-mint/15',
    title: 'Real Eligibility Checks',
    text: 'A transparent rules engine compares your GPA, year level, location, and financial need against each program’s real requirements — with the specific reason behind every result.'
  },
  {
    icon: 'checklist',
    iconBoxClass: 'bg-accent-amber/15',
    title: 'Personalized Action Plans',
    text: 'Every program comes with its actual required documents, application steps, and an AI-written next action tailored to your specific gap — not a generic checklist.'
  },
  {
    icon: 'link',
    iconBoxClass: 'bg-accent-pink/15',
    title: 'Verified Sources',
    text: 'Every listing links to its official provider and shows the date it was last verified, so you’re never applying off stale or unofficial information.'
  }
];

const STEPS = [
  {
    number: '01',
    icon: 'edit_note',
    title: 'Tell us your situation',
    text: 'In plain language, a quick form, or by uploading a transcript or certificate — whatever’s easiest.'
  },
  {
    number: '02',
    icon: 'search',
    title: 'Get matched and checked',
    text: 'AI ranks programs by relevance while a rules engine checks your actual eligibility for each one.'
  },
  {
    number: '03',
    icon: 'flag',
    title: 'Follow your action plan',
    text: 'See exactly what documents you need and what to do next, in order, for every program you’re pursuing.'
  }
];

export default function LandingPage() {
  const { session, role, loading } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('qualifind_theme');
      if (stored) return stored === 'dark';
    } catch (_) {}
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('qualifind_theme', isDark ? 'dark' : 'light');
    } catch (_) {}
  }, [isDark]);

  // Already signed in — skip the marketing page and go straight to the right dashboard.
  if (!loading && session) {
    return <Navigate to={role === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;
  }

  return (
    <div className="bg-paper font-sans text-ink antialiased bg-dot-grid min-h-screen">
      {/* Header */}
      <header className="border-b-2 border-ink bg-paper/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline group cursor-pointer">
            <div className="w-11 h-11 bg-accent-violet rounded-2xl border-2 border-ink shadow-pop-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-[24px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl text-ink tracking-tight leading-none group-hover:text-accent-violet transition-colors">QualiFind</span>
              <span className="text-[9px] font-extrabold font-heading text-accent-violet uppercase tracking-wider mt-0.5">PH Student Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark((d) => !d)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-card border-2 border-ink shadow-pop-sm hover:bg-accent-amber transition-all cursor-pointer"
              title="Toggle dark mode"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined text-[20px] text-ink">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <Link to="/login" className="btn-candy btn-candy-secondary btn-candy-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn-candy btn-candy-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Hero */}
        <section className="pt-16 lg:pt-24 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="badge-sticker badge-amber w-fit">
              <span className="material-symbols-outlined text-[15px]">waving_hand</span> Mabuhay, future scholar!
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-ink tracking-tight leading-tight">
              Find student assistance that <span className="text-accent-violet underline decoration-accent-pink decoration-wavy">actually fits you</span>
            </h1>
            <p className="text-base text-ink-muted max-w-xl font-medium leading-relaxed">
              QualiFind matches Philippine students to scholarships, educational grants, LGU assistance, campus
              assistantships, and student loans — using AI to understand your situation and a transparent rules
              engine to check whether you really qualify, with a real reason either way.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/register" className="btn-candy px-6">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span> Get Started Free
              </Link>
              <Link to="/login" className="btn-candy btn-candy-secondary px-6">
                I already have an account
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="card-sticker bg-card shadow-pop-lg p-6 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-amber/40 rounded-full pointer-events-none"></div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="badge-sticker badge-cyan text-[10px]">Scholarship</span>
                  <span className="badge-sticker badge-mint text-[10px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Eligible
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold font-heading text-ink leading-snug">
                    Cebu City College Scholarship Program
                  </h3>
                  <p className="text-xs text-ink-muted font-medium mt-1">Cebu City Local Government Unit (LGU)</p>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl bg-accent-violet/5 border border-accent-violet/30">
                  <span className="material-symbols-outlined text-accent-violet text-[16px] mt-0.5 shrink-0">auto_awesome</span>
                  <p className="text-[11px] text-ink leading-relaxed font-medium">
                    Your GPA exceeds the 80% minimum, and this program directly covers the tuition support you're
                    looking for.
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-heading font-bold text-ink-muted pt-2 border-t-2 border-ink/10">
                  <span>Last Verified: Aug 1, 2026</span>
                  <span className="text-accent-violet flex items-center gap-1">
                    Official Site <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-12 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold font-heading text-ink tracking-tight">
              Not just a list — a system that checks your work
            </h2>
            <p className="text-sm text-ink-muted font-medium mt-2 leading-relaxed">
              Every result comes with a verified source, a real reason for its status, and a next step — not a wall
              of scholarship names you have to research yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-sticker p-6 bg-card flex flex-col gap-3">
                <div className={`w-12 h-12 rounded-2xl ${f.iconBoxClass} border-2 border-ink flex items-center justify-center shadow-pop-sm text-ink shrink-0`}>
                  <span className="material-symbols-outlined text-[24px]">{f.icon}</span>
                </div>
                <h3 className="text-base font-extrabold font-heading text-ink">{f.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed font-medium">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-12 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold font-heading text-ink tracking-tight">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.number} className="card-sticker p-6 bg-card flex flex-col gap-3 relative">
                <span className="text-3xl font-extrabold font-heading text-ink/10 absolute top-4 right-5">{s.number}</span>
                <div className="w-11 h-11 rounded-2xl bg-accent-violet text-white border-2 border-ink flex items-center justify-center shadow-pop-sm">
                  <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
                </div>
                <h3 className="text-sm font-extrabold font-heading text-ink">{s.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed font-medium">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fallback / honesty section — matches the app's actual behavior when a
            student isn't eligible, instead of pretending everyone qualifies. */}
        <section className="py-12">
          <div className="card-sticker card-sticker-amber bg-card p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-accent-amber/30 border-2 border-ink flex items-center justify-center shadow-pop-sm shrink-0">
              <span className="material-symbols-outlined text-[28px] text-ink">explore</span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-heading text-ink mb-1">Not eligible for one program? You'll know why — and what else to try.</h3>
              <p className="text-sm text-ink-muted leading-relaxed font-medium">
                "You may not qualify for this scholarship because your GPA is below the minimum, but you may still
                pursue educational assistance or a student assistantship." Every rejection comes with a specific
                reason and real alternatives, not a dead end.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 text-center flex flex-col items-center gap-5">
          <h2 className="text-2xl lg:text-3xl font-extrabold font-heading text-ink tracking-tight">
            Ready to find what you actually qualify for?
          </h2>
          <Link to="/register" className="btn-candy px-8 py-3.5 text-base">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span> Create Your Free Account
          </Link>
          <p className="text-xs text-ink-muted font-medium">No fees. Built for Philippine students.</p>
        </section>
      </main>

      <footer className="border-t-2 border-ink bg-card-subtle">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 no-underline group cursor-pointer">
              <div className="w-9 h-9 bg-accent-violet rounded-xl border-2 border-ink flex items-center justify-center shadow-pop-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-white text-[18px]">verified</span>
              </div>
              <span className="font-heading font-extrabold text-base text-ink group-hover:text-accent-violet transition-colors">QualiFind</span>
            </Link>
            <p className="text-xs text-ink-muted font-medium leading-relaxed max-w-xs">
              AI-matched, eligibility-checked student assistance for the Philippines — scholarships, grants,
              assistantships, loans, and training, in one place.
            </p>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink">Product</h4>
            <a href="#features" className="text-xs text-ink-muted font-medium hover:text-accent-violet w-fit">Features</a>
            <a href="#how-it-works" className="text-xs text-ink-muted font-medium hover:text-accent-violet w-fit">How It Works</a>
            <Link to="/register" className="text-xs text-ink-muted font-medium hover:text-accent-violet w-fit">Create an Account</Link>
            <Link to="/login" className="text-xs text-ink-muted font-medium hover:text-accent-violet w-fit">Sign In</Link>
          </div>

          {/* Coverage */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink">What's Covered</h4>
            <span className="text-xs text-ink-muted font-medium">Scholarships</span>
            <span className="text-xs text-ink-muted font-medium">Educational Assistance</span>
            <span className="text-xs text-ink-muted font-medium">Student Employment</span>
            <span className="text-xs text-ink-muted font-medium">Student Loans</span>
            <span className="text-xs text-ink-muted font-medium">Training &amp; Certification</span>
          </div>

          {/* Sources */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-ink">Program Sources</h4>
            <span className="text-xs text-ink-muted font-medium">DOST-SEI &amp; CHED / UniFAST</span>
            <span className="text-xs text-ink-muted font-medium">DSWD &amp; DICT</span>
            <span className="text-xs text-ink-muted font-medium">Local Government Units</span>
            <span className="text-xs text-ink-muted font-medium">Partner Universities &amp; Banks</span>
          </div>
        </div>

        <div className="border-t-2 border-ink">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4">
            <p className="text-[10px] text-ink-muted font-medium leading-relaxed max-w-3xl">
              <strong className="text-ink">Official Verification Disclaimer:</strong> AI eligibility assessments are
              provided for guidance purposes. Always verify requirements, deadlines, and submission procedures
              directly with the official program provider or your university's financial aid office.
            </p>
          </div>
        </div>

        <div className="border-t-2 border-ink">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-ink-muted font-medium">© 2026 QualiFind. Built for Philippine students.</p>
            <p className="text-[11px] text-ink-muted font-medium">DOST-SEI &amp; CHED Aligned · v2.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
