-- Adds "verified source" and "last verified" fields to programs, so the eligibility
-- and action-plan views can show where a program's info came from and when it was
-- last checked, instead of implying every listing is freshly confirmed.
-- Run this in the Supabase SQL Editor after 0001_init.sql.

alter table public.programs
  add column source_url text,
  add column last_verified_at date;

comment on column public.programs.source_url is
  'Official agency URL for this program. Left null when no single reliable official page exists (e.g. LGU/campus-specific programs) — the UI should fall back to "verify directly with the provider" rather than showing a guessed link.';
comment on column public.programs.last_verified_at is
  'Date an admin last confirmed this program''s details against the official source. Seed data below uses a placeholder date — replace with real verification dates as programs are reviewed.';

-- Backfill source_url only for programs whose provider has one well-known, stable
-- official domain. Left null for LGU/campus-specific programs where no single
-- authoritative page exists — inventing a deep link would be worse than no link.
update public.programs set source_url = 'https://ched.gov.ph', last_verified_at = '2026-08-01' where id = 'CHED-TULONG-DUNONG-2024';
update public.programs set source_url = 'https://dict.gov.ph', last_verified_at = '2026-08-01' where id = 'DICT-DIGITALJOBS-2024';
update public.programs set source_url = 'https://dswd.gov.ph', last_verified_at = '2026-08-01' where id = 'DSWD-AICS-STUDENT-2024';
update public.programs set source_url = 'https://www.dost.gov.ph', last_verified_at = '2026-08-01' where id = 'DOST-SEI-MERIT-2024';
update public.programs set source_url = 'https://www.dost.gov.ph', last_verified_at = '2026-08-01' where id = 'DOST-ASTHRDP-GRAD-2024';
update public.programs set source_url = 'https://www.landbank.com', last_verified_at = '2026-08-01' where id = 'LANDBANK-STUDENT-LOAN-2024';

-- No reliable single official URL for these — left null on purpose:
--   CEBU-LGU-SCHOLARSHIP-2024 (Cebu City LGU scholarship office)
--   CIT-STUDENT-ASSISTANT-2024 (campus-specific student affairs office)
update public.programs set last_verified_at = '2026-08-01' where id in ('CEBU-LGU-SCHOLARSHIP-2024', 'CIT-STUDENT-ASSISTANT-2024');
