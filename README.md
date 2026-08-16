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
- **Natural Language AI Matcher**: describe your situation in free text and Claude
  scores every program for topical relevance, synthesized with your already-computed
  eligibility into a plain-language explanation. Falls back to a client-side keyword +
  GWA heuristic if the AI call fails (no API key, network issue, rate limit).
- **Document upload for the matcher**: upload a transcript, Certificate of
  Registration, or indigency certificate (PDF, image, or `.txt`) and Claude extracts
  the relevant fields (course, GWA, location, household income, etc.) plus a ready-to-
  use summary that's appended straight into the matcher prompt. See `demo-docs/` for a
  sample file to try it with.
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
- **Admin program management**: full CRUD dashboard for the program catalog
  (`/admin-dashboard`), gated to admin accounts by RLS.
- **Verified sources**: programs link to their real official agency site where one
  reliably exists, plus a "last verified" date — no invented URLs.
- **Saved Applications**: bookmark programs, persisted server-side per account.

## Tech Stack

- **Frontend**: React (Vite) + React Router, Tailwind CSS.
- **Backend**: Supabase — Postgres, Auth, and Row-Level Security (no separate API server).
- **AI**: Anthropic Claude (`@anthropic-ai/sdk`), called from a dev-only Vite
  middleware (`server/aiMatcher.js`, `server/aiDocumentExtractor.js`) — see
  [AI Matcher & Document Upload](#ai-matcher--document-upload) below.
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

Migrations run in order: `0001_init.sql` (full schema, RLS policies, signup trigger,
seed data), then `0002_signup_metadata_fields.sql` (additional profile fields captured
at signup — institution, course, GWA, location, financial-need flag, etc.).

## Project Structure

```
server/
  aiMatcher.js            Claude call: scores programs against free-text + eligibility
  aiDocumentExtractor.js  Claude call: extracts fields/summary from an uploaded document
src/
  components/       Shared UI: layout shell, route guard, eligibility badge
  context/          AuthContext (session/profile) and DataContext (programs/saved/eligibility)
  lib/              Pure helper logic: eligibility computation, AI matcher client calls
  pages/            Login, Register, setup placeholder
  pages/student/    Dashboard, Matcher, Opportunities, Eligibility, Action Plan, Saved, Profile
  pages/admin/      Admin program list + create/edit form (full CRUD)
supabase/
  migrations/       0001_init.sql, 0002_signup_metadata_fields.sql
demo-docs/          Sample documents for testing the matcher's document upload
vite.config.js      Dev-only /api/match and /api/extract-document middleware
```

## Running Locally

Supabase is a **hosted** backend, not something each developer runs locally — the
whole team shares **one** Supabase project. Only the first step below happens once,
by whoever sets the project up; everyone else starts from step 2.

**1. Create the shared Supabase project (once per team, not once per person)**

- Create a project at [supabase.com](https://supabase.com).
- Open its SQL Editor and run `supabase/migrations/0001_init.sql`, then
  `0002_signup_metadata_fields.sql`, in order. This creates the full schema, RLS
  policies, the signup trigger, and seeds the program catalog.
- Optional, for faster local testing: turn off **Confirm email** under Authentication
  → Providers → Email, so signup logs you in immediately instead of requiring an
  email click-through.
- Share the Project URL and anon public key (Project Settings → API) with the rest of
  the team directly — Slack, DM, whatever — never via a commit. The anon key is the
  public client-side key, safe to share with trusted teammates since it's gated by
  RLS. **Never share the `service_role` key** — that one bypasses RLS entirely.

**2. Each person sets up their local copy**

```bash
npm install
```

Create `.env.local` in the project root with:

```
VITE_SUPABASE_URL=<shared Project URL from step 1>
VITE_SUPABASE_ANON_KEY=<shared anon public key from step 1>
ANTHROPIC_API_KEY=<your Claude API key>
```

Never commit `.env.local`. `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are required
for auth and data to work at all; `ANTHROPIC_API_KEY` powers the AI Matcher and
document upload — without it, the matcher silently falls back to the offline keyword
heuristic and document upload returns an error.

**3. Start the dev server**

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

## AI Matcher & Document Upload

Both AI features are served by dev-only middleware registered in `vite.config.js`
(`configureServer`), so no separate backend process is needed while running
`npm run dev`:

- `POST /api/match` (`server/aiMatcher.js`) — takes the student's free-text situation
  plus the program catalog and each program's already-computed eligibility result, and
  asks Claude for a 0–100 relevance score and a one-to-two-sentence explanation per
  program. Eligibility itself is never re-derived by the model — it's passed in as
  ground truth and only explained in the student's own terms.
- `POST /api/extract-document` (`server/aiDocumentExtractor.js`) — takes an uploaded
  PDF, image, or `.txt` file and asks Claude to pull out scholarship-relevant fields
  (course, GWA, location, household income, etc.) plus a summary paragraph the student
  can drop straight into the matcher prompt. Never invents values not present in the
  document.

These endpoints only exist under `vite dev` — they are **not** included in
`vite build` output. For a production deploy, port `server/aiMatcher.js` and
`server/aiDocumentExtractor.js` into Supabase Edge Functions and update
`src/lib/matcher.js` to call those instead of `/api/match` / `/api/extract-document`.

## License
MIT License.
