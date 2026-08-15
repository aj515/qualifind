-- QualiFind v3: normalized schema.
-- Replaces the polymorphic `profiles` table and denormalized `programs`
-- (text provider, static per-program eligibility, JSONB requirements) with
-- proper entities: providers, students/admins, documents, program_documents,
-- application_steps, saved_programs, eligibility_results (per-student, computed
-- client-side and persisted — see src/lib/eligibility.js).
--
-- CONFIRMED WITH USER: this drops and recreates the affected tables rather than
-- migrating existing data. Any test accounts' profile/saved-program data will
-- need recreating after this runs. Run in the Supabase SQL Editor.

-- =========================================================================
-- DROP OLD OBJECTS
-- =========================================================================
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.saved_applications cascade;
drop table if exists public.programs cascade;
drop table if exists public.profiles cascade;

-- =========================================================================
-- PROFILES — identity + role only (used for RLS role checks and display)
-- =========================================================================
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'admin')),
  name text,
  avatar text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);

-- =========================================================================
-- STUDENTS — 1:1 extension of profiles for student-only fields
-- =========================================================================
create table public.students (
  user_id uuid primary key references auth.users(id) on delete cascade,
  gpa numeric,
  education_level text,
  year_level int,
  birthdate date,
  location text,
  course text,
  is_financially_disadvantaged boolean default false,
  institution text,
  bio text,
  skills text[] default '{}',
  interests text[] default '{}',
  profile_strength int default 40
);

alter table public.students enable row level security;

create policy "Students can view own row" on public.students for select using (auth.uid() = user_id);
create policy "Students can update own row" on public.students for update using (auth.uid() = user_id);
create policy "Students can insert own row" on public.students for insert with check (auth.uid() = user_id);
create policy "Admins can view all students" on public.students for select using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);

-- =========================================================================
-- ADMINS — 1:1 extension of profiles for admin-only fields
-- =========================================================================
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  agency text,
  position text
);

alter table public.admins enable row level security;

create policy "Admins can view own row" on public.admins for select using (auth.uid() = user_id);
create policy "Admins can update own row" on public.admins for update using (auth.uid() = user_id);
create policy "Admins can insert own row" on public.admins for insert with check (auth.uid() = user_id);

-- =========================================================================
-- Signup trigger: creates profiles row + a blank students/admins row by role,
-- so Register/Profile forms always UPDATE, never conditionally INSERT.
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_role text := coalesce(new.raw_user_meta_data->>'role', 'student');
  new_name text := coalesce(new.raw_user_meta_data->>'name', new.email);
  new_avatar text := upper(left(coalesce(new.raw_user_meta_data->>'name', new.email), 2));
begin
  insert into public.profiles (user_id, role, name, avatar)
  values (new.id, new_role, new_name, new_avatar);

  if new_role = 'admin' then
    insert into public.admins (user_id) values (new.id);
  else
    insert into public.students (user_id) values (new.id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- PROVIDERS
-- =========================================================================
create table public.providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('government', 'lgu', 'private', 'school', 'bank')),
  website text
);

alter table public.providers enable row level security;

create policy "Authenticated users can view providers" on public.providers for select using (auth.role() = 'authenticated');
create policy "Admins can insert providers" on public.providers for insert with check (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can update providers" on public.providers for update using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can delete providers" on public.providers for delete using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);

-- =========================================================================
-- PROGRAMS
-- =========================================================================
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references public.providers(id) on delete set null,
  title text not null,
  type text check (type in ('Scholarship', 'Educational Assistance', 'Student Employment', 'Student Loan', 'Training & Certification')),
  dept text,
  duration text,
  summary text,
  funding text,
  annual_value numeric,
  deadline date,
  status text default 'Active' check (status in ('Active', 'In Review', 'Draft', 'Expired')),

  -- Eligibility-matching fields (nullable = "no restriction"). See
  -- src/lib/eligibility.js computeEligibility() for how these are compared
  -- against a student's profile.
  min_gpa numeric,
  education_req text,
  min_year_level int,
  max_year_level int,
  age_min int,
  age_max int,
  financial_req boolean default false,
  course_req text,
  location text,

  -- Display/matcher fields
  degree_required text,
  citizenship text,
  lead_prof text,
  icon text,
  why_strong_match text[] default '{}',
  tags text[] default '{}',
  keywords text[] default '{}',
  source_url text,
  last_verified_at date,
  created_at timestamptz default now()
);

alter table public.programs enable row level security;

create policy "Authenticated users can view programs" on public.programs for select using (auth.role() = 'authenticated');
create policy "Admins can insert programs" on public.programs for insert with check (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can update programs" on public.programs for update using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can delete programs" on public.programs for delete using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);

-- =========================================================================
-- DOCUMENTS (reusable catalog) + PROGRAM_DOCUMENTS (junction)
-- =========================================================================
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text
);

alter table public.documents enable row level security;
create policy "Authenticated users can view documents" on public.documents for select using (auth.role() = 'authenticated');
create policy "Admins can insert documents" on public.documents for insert with check (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can update documents" on public.documents for update using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can delete documents" on public.documents for delete using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);

create table public.program_documents (
  program_id uuid references public.programs(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  is_required boolean default true,
  primary key (program_id, document_id)
);

alter table public.program_documents enable row level security;
create policy "Authenticated users can view program_documents" on public.program_documents for select using (auth.role() = 'authenticated');
create policy "Admins can insert program_documents" on public.program_documents for insert with check (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can update program_documents" on public.program_documents for update using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can delete program_documents" on public.program_documents for delete using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);

-- =========================================================================
-- APPLICATION_STEPS
-- =========================================================================
create table public.application_steps (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete cascade,
  step_number int not null,
  title text not null,
  description text not null,
  unique (program_id, step_number)
);

alter table public.application_steps enable row level security;
create policy "Authenticated users can view application_steps" on public.application_steps for select using (auth.role() = 'authenticated');
create policy "Admins can insert application_steps" on public.application_steps for insert with check (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can update application_steps" on public.application_steps for update using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);
create policy "Admins can delete application_steps" on public.application_steps for delete using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);

-- =========================================================================
-- SAVED_PROGRAMS (renamed from saved_applications)
-- =========================================================================
create table public.saved_programs (
  student_id uuid references auth.users(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  status text default 'saved' check (status in ('saved', 'applied', 'withdrawn')),
  saved_at timestamptz default now(),
  primary key (student_id, program_id)
);

alter table public.saved_programs enable row level security;
create policy "Students manage own saved programs" on public.saved_programs for all
  using (auth.uid() = student_id) with check (auth.uid() = student_id);

-- =========================================================================
-- ELIGIBILITY_RESULTS — per-student, computed client-side (see
-- src/lib/eligibility.js computeEligibility) and upserted here for
-- persistence/admin analytics. Not the source of truth for a single render —
-- the frontend recomputes and upserts on each load.
-- =========================================================================
create table public.eligibility_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  result text check (result in ('eligible', 'potentially_eligible', 'not_eligible')),
  explanation text,
  checked_at timestamptz default now(),
  unique (student_id, program_id)
);

alter table public.eligibility_results enable row level security;
create policy "Students manage own eligibility results" on public.eligibility_results for all
  using (auth.uid() = student_id) with check (auth.uid() = student_id);
create policy "Admins can view all eligibility results" on public.eligibility_results for select using (
  exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
);

-- =========================================================================
-- SEED DATA
-- =========================================================================

-- Providers (7 unique — the two DOST-SEI program listings share one real agency)
insert into public.providers (id, name, type, website) values
('b2222222-2222-2222-2222-222222222201', 'Cebu City Local Government Unit (LGU)', 'lgu', null),
('b2222222-2222-2222-2222-222222222202', 'Campus Student Affairs & IT Services Office', 'school', null),
('b2222222-2222-2222-2222-222222222203', 'Commission on Higher Education (CHED) & UniFAST', 'government', 'https://ched.gov.ph'),
('b2222222-2222-2222-2222-222222222204', 'Department of Information and Communications Technology (DICT)', 'government', 'https://dict.gov.ph'),
('b2222222-2222-2222-2222-222222222205', 'Department of Social Welfare and Development (DSWD)', 'government', 'https://dswd.gov.ph'),
('b2222222-2222-2222-2222-222222222206', 'Department of Science and Technology - SEI (DOST-SEI)', 'government', 'https://www.dost.gov.ph'),
('b2222222-2222-2222-2222-222222222207', 'Land Bank of the Philippines & CHED UniFAST', 'bank', 'https://www.landbank.com');

-- Documents (13 unique, deduped across all 8 programs' old requirement checklists)
insert into public.documents (id, name, description) values
('c3333333-3333-3333-3333-333333333301', 'Cebu Residency & Voter''s Certification', 'Proof of bona fide residency in Cebu City.'),
('c3333333-3333-3333-3333-333333333302', 'Certificate of Enrollment (COE)', 'Proof of current enrollment in an accredited Philippine institution.'),
('c3333333-3333-3333-3333-333333333303', 'Barangay Indigency Certificate', 'Proof of low or limited family household income.'),
('c3333333-3333-3333-3333-333333333304', 'Class Timetable / Work Schedule', 'Current class schedule showing availability for work-study hours.'),
('c3333333-3333-3333-3333-333333333305', 'Certificate of Registration', 'Official certified enrollment/registration record.'),
('c3333333-3333-3333-3333-333333333306', 'Income Tax Return / BIR Certificate of Exemption', 'Proof of parental/household income for subsidy eligibility.'),
('c3333333-3333-3333-3333-333333333307', 'Valid Student ID / Government ID', 'Proof of identity and student status.'),
('c3333333-3333-3333-3333-333333333308', 'Online Readiness Assessment', 'Short digital literacy check required before enrollment.'),
('c3333333-3333-3333-3333-333333333309', 'Social Worker Assessment & Case Study', 'Interview with a local DSWD or LGU social welfare desk.'),
('c3333333-3333-3333-3333-333333333310', 'Barangay Certificate (Community Endorsement)', 'Local community endorsement of the applicant.'),
('c3333333-3333-3333-3333-333333333311', 'Good Moral Character Certificate', 'Certificate of good moral standing from the dean or school registrar.'),
('c3333333-3333-3333-3333-333333333312', 'Certificate of Assessment / Tuition Bill', 'Official school statement of account.'),
('c3333333-3333-3333-3333-333333333313', 'Co-Maker / Parent Guarantor Agreement', 'Signed agreement from an employed or barangay-certified guarantor.');

-- Programs
insert into public.programs
  (id, provider_id, title, type, dept, duration, summary, funding, annual_value, deadline, status,
   min_gpa, education_req, min_year_level, max_year_level, age_min, age_max, financial_req, course_req, location,
   degree_required, citizenship, lead_prof, icon, why_strong_match, tags, keywords, source_url, last_verified_at)
values

('a1111111-1111-1111-1111-111111111101', 'b2222222-2222-2222-2222-222222222201',
 'Cebu City College Scholarship Program (CCCSP)', 'Educational Assistance',
 'Information Technology & Tertiary Education', 'Per Semester (Renewable)',
 'Financial aid and tuition assistance program for qualified resident tertiary students enrolled in accredited colleges and universities across Cebu.',
 '₱50,000 / yr + Tuition Support', 50000, '2026-09-30', 'Active',
 80.0, 'College', null, null, null, null, true, null, 'Cebu',
 'Undergraduate (Enrolled in Cebu HEI / SUC)', 'Filipino Citizen (Cebu Resident)', 'Mayor''s Scholarship Office', 'location_city',
 ARRAY['Your GPA exceeds the 80% minimum requirement for Cebu City tertiary aid.', 'Matches undergraduate students located in Cebu (Region VII).', 'Directly provides tuition assistance and daily transport subsidy for indigent students.'],
 ARRAY['Cebu LGU', 'Tuition Aid', 'Transportation Allowance', 'Undergraduate', 'Region VII'],
 ARRAY['cebu', 'lgu', 'scholarship', 'tuition', 'transportation', 'information technology', 'undergraduate', 'it', 'philippines'],
 null, '2026-08-01'),

('a1111111-1111-1111-1111-111111111102', 'b2222222-2222-2222-2222-222222222202',
 'University IT & Computer Lab Student Assistantship', 'Student Employment',
 'Computer Science & IT Infrastructure', '1 Academic Year (Flexible 15 hrs/wk)',
 'Work-study employment for computing students to assist in university computer labs, software maintenance, and student helpdesk support while earning tuition credits.',
 '₱42,000 / yr (₱70/hr + Tuition Discount)', 42000, '2026-09-15', 'Active',
 75.0, 'College', 2, 4, null, null, false, 'IT / Computer Science', 'Cebu',
 '2nd to 4th Year IT / Computer Science', 'Enrolled Student', 'Prof. Alan Turing / Head of IT Lab', 'laptop_chromebook',
 ARRAY['Perfect fit for IT students looking to offset transport expenses through campus hours.', 'Requires minimum 75% GPA.', 'Flexible schedule tailored around your class timetable.'],
 ARRAY['Student Job', 'IT Lab Assistant', 'Campus Employment', 'Tuition Credit'],
 ARRAY['student assistant', 'assistantship', 'it', 'computer lab', 'employment', 'tuition discount', 'cebu', 'work study'],
 null, '2026-08-01'),

('a1111111-1111-1111-1111-111111111103', 'b2222222-2222-2222-2222-222222222203',
 'CHED Tulong Dunong Program (TDP-TES)', 'Educational Assistance',
 'Higher Education Priority Disciplines', '1 Year (Renewable)',
 'Government educational subsidy for underprivileged Filipino students enrolled in CHED-recognized higher education institutions to assist with educational living costs.',
 '₱15,000 / semester (₱30,000 / yr)', 30000, '2026-10-15', 'Active',
 80.0, 'College', null, null, null, null, true, null, null,
 'Undergraduate Student in SUC / LUC / HEI', 'Filipino Citizen', 'CHED Regional Office VII', 'account_balance',
 ARRAY['Targeted for students facing financial constraints to cover books, daily allowances, and school supplies.', 'Meets the CHED Tulong Dunong GWA threshold.'],
 ARRAY['CHED', 'UniFAST', 'Tulong Dunong', 'Educational Grant', 'National Aid'],
 ARRAY['ched', 'unifast', 'tulong dunong', 'grant', 'subsidy', 'philippines', 'allowance'],
 'https://ched.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111104', 'b2222222-2222-2222-2222-222222222204',
 'DICT digitaljobsPH & Cloud Skills Certification Voucher', 'Training & Certification',
 'Information Technology & Cloud Computing', '3 - 6 Months Self-Paced',
 'Free industry-recognized tech certification vouchers (AWS, Google Cloud, Python, Web Dev) sponsored by DICT to boost employment prospects for tech students.',
 'Free Full Certification Voucher (₱25,000 value)', 25000, '2026-11-01', 'Active',
 75.0, null, null, null, null, null, false, null, null,
 'Filipino Youth & College Students', 'Filipino Citizen', 'DICT Regional Cluster - Visayas', 'terminal',
 ARRAY['Directly complements IT coursework with zero out-of-pocket costs.', 'Provides verified credentials that boost candidacy for campus and remote student jobs.'],
 ARRAY['DICT', 'Free Certification', 'IT Skills', 'Cloud Computing', 'DigitaljobsPH'],
 ARRAY['dict', 'certification', 'it', 'free voucher', 'technology', 'python', 'cloud', 'cebu'],
 'https://dict.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111105', 'b2222222-2222-2222-2222-222222222205',
 'DSWD AICS Educational & Transport Assistance', 'Educational Assistance',
 'Student Welfare & Emergency Aid', 'One-Time Outright Cash Aid (Renewable Annually)',
 'Assistance to Individuals in Crisis Situations (AICS) providing immediate cash grants for low-income students needing direct assistance for tuition and daily commuting fare.',
 '₱5,000 - ₱10,000 Cash Grant', 10000, '2026-12-15', 'Active',
 75.0, 'College', null, null, null, null, true, null, 'Cebu',
 'Enrolled in Tertiary Education', 'Filipino Citizen', 'DSWD Field Office VII', 'handshake',
 ARRAY['Directly addresses urgent need for daily transportation expenses and school fees.', 'Low GPA threshold, focusing on financial need rather than academic rank.'],
 ARRAY['DSWD', 'AICS', 'Cash Assistance', 'Transportation Fare', 'Emergency Aid'],
 ARRAY['dswd', 'aics', 'financial assistance', 'transportation', 'indigent', 'crisis', 'cash grant'],
 'https://dswd.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111106', 'b2222222-2222-2222-2222-222222222206',
 'DOST-SEI S&T Undergraduate Merit Scholarship', 'Scholarship',
 'Priority STEM Disciplines (BS IT / CS)', '4 Years (Full College)',
 'Competitive national scholarship awarded to students with high aptitude in science and mathematics pursuing priority degree programs.',
 '₱480,000 / yr + Tuition + Allowance', 480000, '2026-10-15', 'Active',
 90.0, 'College', null, null, null, null, false, 'BS IT / Computer Science / Engineering', null,
 'Top 5% of Class / Min 90% GPA', 'Natural-Born Filipino Citizen', 'Dr. Josette T. Biyo / SEI Director', 'biotech',
 ARRAY['B.S. Information Technology is an accredited DOST Priority STEM course.', 'Open to Filipino citizens studying in a recognized Philippine institution.'],
 ARRAY['DOST-SEI', 'Merit Scholarship', 'High GPA', 'STEM Priority'],
 ARRAY['dost', 'merit', 'scholarship', 'stem', 'it', 'computer science', 'philippines'],
 'https://www.dost.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111107', 'b2222222-2222-2222-2222-222222222207',
 'UniFAST & Landbank I-RESCUE Student Loan Program', 'Student Loan',
 'Higher Education Tuition Financing', 'Flexible Repayment (Up to 5 years post-grad)',
 'Government-backed soft student loan program designed to cover unpaid tuition, laptops, and educational devices with grace periods until after graduation.',
 'Up to ₱150,000 / yr (Low 5% Interest)', 150000, '2026-11-30', 'Active',
 75.0, null, null, null, null, null, false, null, null,
 'Undergraduate or Vocational Student', 'Filipino Citizen', 'UniFAST Secretariat', 'payments',
 ARRAY['Enables students facing mid-semester tuition blockages to clear balances.', 'Passing-grade requirement only (75%).'],
 ARRAY['Student Loan', 'Landbank', 'UniFAST', 'Tuition Bridge', 'Low Interest'],
 ARRAY['loan', 'landbank', 'unifast', 'tuition', 'financing', 'student loan'],
 'https://www.landbank.com', '2026-08-01'),

('a1111111-1111-1111-1111-111111111108', 'b2222222-2222-2222-2222-222222222206',
 'DOST-SEI ASTHRDP Graduate Research Scholarship', 'Scholarship',
 'Advanced IT & AI Systems', '2 Years',
 'Graduate fellowship for Master''s and Ph.D. students conducting advanced technological and scientific research.',
 '₱480,000 / yr + Tuition', 480000, '2026-08-01', 'Expired',
 88.0, 'Graduate', null, null, null, null, false, null, null,
 'M.S. STEM Enrolled', 'Filipino Citizen', 'Dr. Jaime C. Montoya', 'school',
 ARRAY['Requires graduate enrollment (M.S./Ph.D.). Shown for historical registry reference.'],
 ARRAY['DOST-SEI', 'Graduate Only', 'Expired'],
 ARRAY['dost', 'graduate', 'master', 'phd'],
 'https://www.dost.gov.ph', '2026-08-01');

-- Program <-> Document requirements
insert into public.program_documents (program_id, document_id) values
('a1111111-1111-1111-1111-111111111101', 'c3333333-3333-3333-3333-333333333301'),
('a1111111-1111-1111-1111-111111111101', 'c3333333-3333-3333-3333-333333333302'),
('a1111111-1111-1111-1111-111111111101', 'c3333333-3333-3333-3333-333333333303'),

('a1111111-1111-1111-1111-111111111102', 'c3333333-3333-3333-3333-333333333304'),

('a1111111-1111-1111-1111-111111111103', 'c3333333-3333-3333-3333-333333333305'),
('a1111111-1111-1111-1111-111111111103', 'c3333333-3333-3333-3333-333333333306'),

('a1111111-1111-1111-1111-111111111104', 'c3333333-3333-3333-3333-333333333307'),
('a1111111-1111-1111-1111-111111111104', 'c3333333-3333-3333-3333-333333333308'),

('a1111111-1111-1111-1111-111111111105', 'c3333333-3333-3333-3333-333333333302'),
('a1111111-1111-1111-1111-111111111105', 'c3333333-3333-3333-3333-333333333309'),
('a1111111-1111-1111-1111-111111111105', 'c3333333-3333-3333-3333-333333333307'),
('a1111111-1111-1111-1111-111111111105', 'c3333333-3333-3333-3333-333333333310'),

('a1111111-1111-1111-1111-111111111106', 'c3333333-3333-3333-3333-333333333311'),

('a1111111-1111-1111-1111-111111111107', 'c3333333-3333-3333-3333-333333333312'),
('a1111111-1111-1111-1111-111111111107', 'c3333333-3333-3333-3333-333333333313');
-- DOST-ASTHRDP-GRAD (...108) intentionally has no required documents (expired historical listing)

-- Application steps (3 per active program, matching what the UI previously hardcoded client-side)
insert into public.application_steps (program_id, step_number, title, description) values
('a1111111-1111-1111-1111-111111111101', 1, 'Prepare Required Documents', 'Gather your Cebu residency certification, Certificate of Enrollment, and Barangay Indigency Certificate.'),
('a1111111-1111-1111-1111-111111111101', 2, 'Submit Official Application', 'Complete the application through the Cebu City Mayor''s Scholarship Office before the deadline.'),
('a1111111-1111-1111-1111-111111111101', 3, 'Confirmation & Endorsement', 'Receive your application reference number and retain it for university financial clearance.'),

('a1111111-1111-1111-1111-111111111102', 1, 'Prepare Required Documents', 'Gather your current class timetable showing availability for lab monitoring hours.'),
('a1111111-1111-1111-1111-111111111102', 2, 'Submit Official Application', 'Apply through the Campus Student Affairs & IT Services Office before the deadline.'),
('a1111111-1111-1111-1111-111111111102', 3, 'Confirmation & Endorsement', 'Receive your shift assignment and supervisor confirmation.'),

('a1111111-1111-1111-1111-111111111103', 1, 'Prepare Required Documents', 'Gather your Certificate of Registration and Income Tax Return / BIR Certificate of Exemption.'),
('a1111111-1111-1111-1111-111111111103', 2, 'Submit Official Application', 'Submit through CHED Regional Office VII before the deadline.'),
('a1111111-1111-1111-1111-111111111103', 3, 'Confirmation & Endorsement', 'Receive your subsidy disbursement schedule confirmation.'),

('a1111111-1111-1111-1111-111111111104', 1, 'Prepare Required Documents', 'Gather a valid Student/Government ID and complete the Online Readiness Assessment.'),
('a1111111-1111-1111-1111-111111111104', 2, 'Submit Official Application', 'Register through the DICT digitaljobsPH portal before the deadline.'),
('a1111111-1111-1111-1111-111111111104', 3, 'Confirmation & Endorsement', 'Receive your voucher confirmation and certification track assignment.'),

('a1111111-1111-1111-1111-111111111105', 1, 'Prepare Required Documents', 'Gather your Certificate of Enrollment, Valid ID, and Barangay Certificate.'),
('a1111111-1111-1111-1111-111111111105', 2, 'Submit Official Application', 'Visit DSWD Field Office VII to schedule your Social Worker Assessment interview.'),
('a1111111-1111-1111-1111-111111111105', 3, 'Confirmation & Endorsement', 'Receive your case number and cash grant disbursement schedule.'),

('a1111111-1111-1111-1111-111111111106', 1, 'Prepare Required Documents', 'Gather your Good Moral Character Certificate from your dean or registrar.'),
('a1111111-1111-1111-1111-111111111106', 2, 'Submit Official Application', 'Submit through DOST-SEI before the deadline.'),
('a1111111-1111-1111-1111-111111111106', 3, 'Confirmation & Endorsement', 'Receive your scholarship award notification.'),

('a1111111-1111-1111-1111-111111111107', 1, 'Prepare Required Documents', 'Gather your Certificate of Assessment / Tuition Bill and a signed Co-Maker / Parent Guarantor Agreement.'),
('a1111111-1111-1111-1111-111111111107', 2, 'Submit Official Application', 'Apply through Land Bank of the Philippines / UniFAST Secretariat before the deadline.'),
('a1111111-1111-1111-1111-111111111107', 3, 'Confirmation & Endorsement', 'Receive your loan approval and disbursement schedule.'),

('a1111111-1111-1111-1111-111111111108', 1, 'Prepare Required Documents', 'This listing is past its deadline — documents are shown for historical registry reference only.'),
('a1111111-1111-1111-1111-111111111108', 2, 'Submit Official Application', 'Applications are closed for this cycle.'),
('a1111111-1111-1111-1111-111111111108', 3, 'Confirmation & Endorsement', 'Check DOST-SEI directly for the next graduate scholarship cycle.');
