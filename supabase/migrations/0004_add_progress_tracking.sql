-- Adds application-progress tracking: a richer status on saved_programs
-- (adds 'in_progress' between 'saved' and 'applied') plus a new table recording
-- which application_steps a student has actually checked off. Status is mostly
-- derived client-side from step completion (see src/pages/student/ActionPlanPage.jsx)
-- but stays independently settable so it still works for programs with no steps,
-- or steps that happen on the provider's end and can't be self-checked.
-- Run this in the Supabase SQL Editor after 0003_normalize_schema.sql.

alter table public.saved_programs drop constraint if exists saved_programs_status_check;
alter table public.saved_programs add constraint saved_programs_status_check
  check (status in ('saved', 'in_progress', 'applied', 'withdrawn'));

create table public.student_step_progress (
  student_id uuid references auth.users(id) on delete cascade,
  step_id uuid references public.application_steps(id) on delete cascade,
  completed_at timestamptz default now(),
  primary key (student_id, step_id)
);

alter table public.student_step_progress enable row level security;

create policy "Students manage own step progress" on public.student_step_progress for all
  using (auth.uid() = student_id) with check (auth.uid() = student_id);
