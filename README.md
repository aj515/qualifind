# QualiFind 🇵🇭

AI-powered assistance matching platform connecting Filipino students with scholarships,
educational grants, LGU/government assistance, campus assistantships, training
certifications, and student loans — calibrated for Philippine higher education
(DOST-SEI, CHED, LGU, and partner programs).

## Key Features

- **Dual-role accounts**: Student Seeker and DOST/CHED Admin, role set at signup and
  enforced by Postgres Row-Level Security — not just client-side routing.
- **Natural Language AI Matcher**: free-text profile description, matched against the
  program catalog with a keyword + GWA relevance heuristic.
- **3-Tier Eligibility Assessment**: Eligible / Potentially Eligible / Not Eligible per
  program, with a plain-language requirement gap diagnosis and alternative-category
  suggestions when a program isn't a fit.
- **Personalized Action Plans**: required documents, next step, and a step-by-step
  application flow generated from each program's real requirement checklist.
- **Saved Applications**: bookmark programs, persisted server-side per account.

## Tech Stack

- **Frontend**: React (Vite) + React Router, Tailwind CSS.
- **Backend**: Supabase — Postgres, Auth, and Row-Level Security (no separate API server).
- **Design System**: Playful Geometric design tokens in `src/index.css`, shared
  `btn-candy`/`card-sticker`/`badge-sticker` component classes.

## Project Structure

```
src/
  components/       Shared UI: layout shell, route guard, badges
  context/          AuthContext (session/profile) and DataContext (programs/saved apps)
  lib/              Pure helper logic: eligibility/gap-analysis, AI matcher scoring
  pages/            Login, Register, setup placeholder
  pages/student/    Dashboard, Matcher, Opportunities, Eligibility, Action Plan, Profile
  pages/admin/      Admin views (placeholder — full CRUD dashboard is in progress)
supabase/
  migrations/       SQL schema, RLS policies, and seed data
```

## Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Connect a Supabase project**:
   - Create a project at [supabase.com](https://supabase.com).
   - Open its SQL Editor and run `supabase/migrations/0001_init.sql` — this creates the
     schema, RLS policies, and seeds the program catalog.
   - Copy `.env.local.example` to `.env.local` and fill in your Project URL and anon
     public key (Project Settings → API). Never commit `.env.local` or use the
     `service_role` key here.

3. **Start the dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080`. If Supabase isn't connected yet, the app shows setup
   instructions instead of a broken auth flow.

## License
MIT License.
