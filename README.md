# QualiFind 🇵🇭

AI-powered assistance matching platform connecting Filipino students with scholarships,
educational grants, LGU/government assistance, campus assistantships, training
certifications, and student loans — calibrated for Philippine higher education
(DOST-SEI, CHED, LGU, and partner programs).

## Key Features

- **Real accounts, not a shared demo persona**: Supabase Auth + Row-Level Security.
  Public signup only ever creates Student accounts — admin accounts are never
  self-service (anyone self-selecting "Admin" would otherwise get RLS write access to
  the program catalog). See [Creating an admin account](#creating-an-admin-account).
- **Natural Language AI Matcher**: free-text profile description, matched against the
  program catalog with a keyword + GWA relevance heuristic.
- **Per-student eligibility, computed live**: each program's GPA/education level/year
  level/age/course/location/financial-need requirements are compared against *your*
  actual profile — two different students can see different results for the same
  program. Results are Eligible / Potentially Eligible / Not Eligible, with a
  plain-language reason and alternative-category suggestions when a program isn't a
  fit. Missing profile data (e.g. no GPA on file yet) shows as "needs verification,"
  never a silent wrong answer.
- **Personalized Action Plans**: required documents and a step-by-step application
  flow pulled from real per-program data (admin-manageable, not hardcoded text).
- **Application progress tracking**: check off Action Plan steps as you complete them;
  status auto-advances Saved → In Progress → Submitted as you go, with a manual
  override for steps that happen on the provider's end.
- **Verified sources**: programs link to their real official agency site where one
  reliably exists, plus a "last verified" date — no invented URLs.
- **Saved Applications**: bookmark programs, persisted server-side per account.

## Tech Stack

- **Frontend**: React (Vite) + React Router, Tailwind CSS.
- **Backend**: Supabase — Postgres, Auth, and Row-Level Security (no separate API server).
- **Design System**: Playful Geometric design tokens in `src/index.css`, shared
  `btn-candy`/`card-sticker`/`badge-sticker` component classes.

## Data Model

Normalized Postgres schema (see `supabase/migrations/`) — no denormalized text
columns or one-size-fits-all eligibility flags:

- `profiles` — identity + role only, 1:1 with `auth.users`.
- `students` / `admins` — role-specific fields as separate 1:1 extension tables
  (academic profile vs. office/agency info), not nullable columns bolted onto one
  polymorphic table.
- `providers` — the agency/institution running a program.
- `programs` — the catalog; eligibility-matching fields (`min_gpa`, `education_req`,
  `min_year_level`/`max_year_level`, `age_min`/`age_max`, `financial_req`,
  `course_req`, `location`) are nullable = "no restriction."
- `documents` / `program_documents` — a reusable document catalog, many-to-many with
  programs.
- `application_steps` — real per-program rows (not hardcoded frontend text).
- `saved_programs` — bookmarks, with a `status` (saved/in_progress/applied/withdrawn).
- `eligibility_results` — per-student eligibility, computed client-side
  (`src/lib/eligibility.js`) and upserted here for persistence/admin analytics.
- `student_step_progress` — which Action Plan steps a student has checked off.

## Project Structure

```
src/
  components/       Shared UI: layout shell, route guard, eligibility badge
  context/          AuthContext (session/profile) and DataContext (programs/saved/eligibility)
  lib/              Pure helper logic: eligibility computation, AI matcher scoring
  pages/            Login, Register, setup placeholder
  pages/student/    Dashboard, Matcher, Opportunities, Eligibility, Action Plan, Saved, Profile
  pages/admin/      Admin views (placeholder — full Programs CRUD dashboard is in progress)
supabase/
  migrations/       0001_init.sql — full schema, RLS policies, signup trigger, seed data
```

## Running Locally

Supabase is a **hosted** backend, not something each developer runs locally — the
whole team shares **one** Supabase project, not one each. Only do step 2 once, as a
team; everyone else skips straight to "join an existing project" below.

1. **Install dependencies**:
   ```bash
   npm install
   ```

   **Everyone (including whoever just created the project)**:
   - Copy `.env.local.example` to `.env.local` and fill in the shared Project URL and
     anon key. Never commit `.env.local`.

3. **Start the dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080`. Everyone's local frontend talks to the same remote
   Supabase project, so you'll see each other's test accounts and data. If Supabase
   isn't connected yet, the app shows setup instructions instead of a broken auth flow.

### Creating an admin account

Public registration only creates Student accounts. To test the admin side:

1. Register a normal account through `/register`.
2. In the Supabase dashboard → Table Editor → `profiles`, change that user's `role`
   from `student` to `admin`.
3. In the `admins` table, insert a row with that same `user_id` (agency/position can
   be filled in later).

A real deployment would want a proper admin-invite flow instead of manual table
edits — out of scope for this build.

## License
MIT License.
