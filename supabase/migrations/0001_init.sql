-- QualiFind: initial schema, RLS policies, signup trigger, and seed data.
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query > paste > Run).

-- =========================================================================
-- PROFILES (1:1 with auth.users)
-- =========================================================================
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'admin')),
  name text,
  avatar text,
  badge text,
  title text,
  location text,
  education_level text,
  course text,
  gpa numeric,
  gpa_formatted text,
  income_bracket text,
  needs text,
  department text,
  institution text,
  profile_strength int default 40,
  skills text[] default '{}',
  interests text[] default '{}',
  bio text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Auto-create a profile row whenever a new auth user signs up.
-- The frontend passes `role` and `name` via supabase.auth.signUp({ options: { data: { role, name } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, role, name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'name', new.email),
    upper(left(coalesce(new.raw_user_meta_data->>'name', new.email), 2))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- PROGRAMS (the assistance-program catalog, admin-managed)
-- =========================================================================
create table public.programs (
  id text primary key,
  title text not null,
  provider text,
  type text,
  dept text,
  duration text,
  funding text,
  annual_value numeric,
  deadline date,
  status text default 'Active' check (status in ('Active', 'In Review', 'Draft', 'Expired')),
  min_gpa numeric,
  eligibility_status text check (eligibility_status in ('Eligible', 'Potentially Eligible', 'Not Eligible')),
  eligibility_notes text,
  degree_required text,
  citizenship text,
  lead_prof text,
  icon text,
  summary text,
  why_strong_match text[] default '{}',
  tags text[] default '{}',
  keywords text[] default '{}',
  requirements jsonb default '[]'::jsonb,
  gap_analysis jsonb,
  created_at timestamptz default now()
);

alter table public.programs enable row level security;

create policy "Authenticated users can view programs"
  on public.programs for select
  using (auth.role() = 'authenticated');

create policy "Admins can insert programs"
  on public.programs for insert
  with check (exists (
    select 1 from public.profiles where user_id = auth.uid() and role = 'admin'
  ));

create policy "Admins can update programs"
  on public.programs for update
  using (exists (
    select 1 from public.profiles where user_id = auth.uid() and role = 'admin'
  ));

create policy "Admins can delete programs"
  on public.programs for delete
  using (exists (
    select 1 from public.profiles where user_id = auth.uid() and role = 'admin'
  ));

-- =========================================================================
-- SAVED APPLICATIONS (student bookmarks, replaces the old localStorage array)
-- =========================================================================
create table public.saved_applications (
  user_id uuid references auth.users(id) on delete cascade,
  program_id text references public.programs(id) on delete cascade,
  saved_at timestamptz default now(),
  primary key (user_id, program_id)
);

alter table public.saved_applications enable row level security;

create policy "Users manage own saved applications"
  on public.saved_applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================================
-- SEED DATA: the 8 existing mock programs, migrated as-is
-- =========================================================================
insert into public.programs
  (id, title, provider, type, dept, duration, funding, annual_value, deadline, status,
   min_gpa, eligibility_status, eligibility_notes, degree_required, citizenship, lead_prof,
   icon, summary, why_strong_match, tags, keywords, requirements, gap_analysis)
values

('CEBU-LGU-SCHOLARSHIP-2024', 'Cebu City College Scholarship Program (CCCSP)', 'Cebu City Local Government Unit (LGU)', 'Educational Assistance', 'Information Technology & Tertiary Education', 'Per Semester (Renewable)', '₱50,000 / yr + Tuition Support', 50000, '2026-09-30', 'Active',
 80.0, 'Eligible', 'Requirements appear to be met (Cebu Resident & 82% GPA)', 'Undergraduate (Enrolled in Cebu HEI / SUC)', 'Filipino Citizen (Cebu Resident)', 'Mayor''s Scholarship Office',
 'location_city', 'Financial aid and tuition assistance program for qualified resident tertiary students enrolled in accredited colleges and universities across Cebu.',
 ARRAY['Your current 82% GPA exceeds the 80% minimum requirement for Cebu City tertiary aid.', 'Matches your location in Cebu (Region VII) and undergraduate 2nd-year standing.', 'Directly provides tuition assistance and daily transport subsidy for indigent students.'],
 ARRAY['Cebu LGU', 'Tuition Aid', 'Transportation Allowance', 'Undergraduate', 'Region VII'],
 ARRAY['cebu', 'lgu', 'scholarship', 'tuition', 'transportation', 'information technology', 'undergraduate', 'it', 'philippines'],
 $j$[{"id":"req-1","title":"Cebu Residency & Voter's Certification","desc":"Must be a bona fide resident of Cebu City.","status":"satisfied","note":"Satisfied: Cebu Resident"},{"id":"req-2","title":"Academic GPA Cutoff (Min 80%)","desc":"General weighted average of at least 80% with no failing marks.","status":"satisfied","note":"Satisfied: 82% GPA"},{"id":"req-3","title":"Certificate of Enrollment (COE)","desc":"Proof of enrollment in an accredited Philippine college.","status":"action","note":"Action: Upload 2nd Year COE"},{"id":"req-4","title":"Barangay Indigency Certificate","desc":"Proof of low or limited family household income.","status":"action","note":"Action: Submit Indigency Slip"}]$j$::jsonb,
 null),

('CIT-STUDENT-ASSISTANT-2024', 'University IT & Computer Lab Student Assistantship', 'Campus Student Affairs & IT Services Office', 'Student Employment', 'Computer Science & IT Infrastructure', '1 Academic Year (Flexible 15 hrs/wk)', '₱42,000 / yr (₱70/hr + Tuition Discount)', 42000, '2026-09-15', 'Active',
 75.0, 'Eligible', 'Excellent Match: IT Student Skills Match', '2nd to 4th Year IT / Computer Science', 'Enrolled Student', 'Prof. Alan Turing / Head of IT Lab',
 'laptop_chromebook', 'Work-study employment for computing students to assist in university computer labs, software maintenance, and student helpdesk support while earning tuition credits.',
 ARRAY['Perfect fit for 2nd-year B.S. IT students looking to offset transport expenses through campus hours.', 'Requires minimum 75% GPA, well below your 82% academic standing.', 'Flexible schedule tailored around your class timetable.'],
 ARRAY['Student Job', 'IT Lab Assistant', 'Campus Employment', 'Tuition Credit'],
 ARRAY['student assistant', 'assistantship', 'it', 'computer lab', 'employment', 'tuition discount', 'cebu', 'work study'],
 $j$[{"id":"req-1","title":"Enrolled in IT / Computing Course","desc":"Currently enrolled in 2nd year or higher.","status":"satisfied","note":"Satisfied: 2nd Year IT"},{"id":"req-2","title":"Academic Standing (Min 75%)","desc":"Must maintain good standing without academic probation.","status":"satisfied","note":"Satisfied: 82% GPA"},{"id":"req-3","title":"Student Work Permit & Schedule","desc":"Available for 12-15 hours of lab monitoring per week.","status":"action","note":"Action: Submit Class Timetable"}]$j$::jsonb,
 null),

('CHED-TULONG-DUNONG-2024', 'CHED Tulong Dunong Program (TDP-TES)', 'Commission on Higher Education (CHED) & UniFAST', 'Educational Assistance', 'Higher Education Priority Disciplines', '1 Year (Renewable)', '₱15,000 / semester (₱30,000 / yr)', 30000, '2026-10-15', 'Active',
 80.0, 'Eligible', 'Eligible for Tertiary Education Subsidy', 'Undergraduate Student in SUC / LUC / HEI', 'Filipino Citizen', 'CHED Regional Office VII',
 'account_balance', 'Government educational subsidy for underprivileged Filipino students enrolled in CHED-recognized higher education institutions to assist with educational living costs.',
 ARRAY['Targeted for students facing financial constraints to cover books, daily allowances, and school supplies.', 'Your 82% GPA easily meets the CHED Tulong Dunong threshold.'],
 ARRAY['CHED', 'UniFAST', 'Tulong Dunong', 'Educational Grant', 'National Aid'],
 ARRAY['ched', 'unifast', 'tulong dunong', 'grant', 'subsidy', 'philippines', 'allowance'],
 $j$[{"id":"req-1","title":"Certificate of True Copy of Grades","desc":"Weighted average of 80% or equivalent.","status":"satisfied","note":"Satisfied: 82% GPA"},{"id":"req-2","title":"Certificate of Registration","desc":"Certified enrollment in CHED-recognized program.","status":"satisfied","note":"Satisfied: B.S. IT"},{"id":"req-3","title":"Income Tax Return or BIR Certificate of Exemption","desc":"Combined parental income not exceeding ₱400,000/yr.","status":"action","note":"Action: Submit BIR Certificate"}]$j$::jsonb,
 null),

('DICT-DIGITALJOBS-2024', 'DICT digitaljobsPH & Cloud Skills Certification Voucher', 'Department of Information and Communications Technology', 'Training & Certification', 'Information Technology & Cloud Computing', '3 - 6 Months Self-Paced', 'Free Full Certification Voucher (₱25,000 value)', 25000, '2026-11-01', 'Active',
 75.0, 'Eligible', 'Eligible (Free Industry IT Certification)', 'Filipino Youth & College Students', 'Filipino Citizen', 'DICT Regional Cluster - Visayas',
 'terminal', 'Free industry-recognized tech certification vouchers (AWS, Google Cloud, Python, Web Dev) sponsored by DICT to boost employment prospects for tech students.',
 ARRAY['Directly complements your B.S. Information Technology coursework with zero out-of-pocket costs.', 'Provides verified credentials that boost candidacy for campus and remote student jobs.'],
 ARRAY['DICT', 'Free Certification', 'IT Skills', 'Cloud Computing', 'DigitaljobsPH'],
 ARRAY['dict', 'certification', 'it', 'free voucher', 'technology', 'python', 'cloud', 'cebu'],
 $j$[{"id":"req-1","title":"Valid Student ID / Government ID","desc":"Proof of identity and student status.","status":"satisfied","note":"Satisfied"},{"id":"req-2","title":"Online Readiness Assessment","desc":"Short 20-minute digital literacy check.","status":"action","note":"Action: Take 20-Min Quiz"}]$j$::jsonb,
 null),

('DSWD-AICS-STUDENT-2024', 'DSWD AICS Educational & Transport Assistance', 'Department of Social Welfare and Development (DSWD)', 'Educational Assistance', 'Student Welfare & Emergency Aid', 'One-Time Outright Cash Aid (Renewable Annually)', '₱5,000 - ₱10,000 Cash Grant', 10000, '2026-12-15', 'Active',
 75.0, 'Potentially Eligible', 'Potentially Eligible (Requires Social Worker Interview)', 'Enrolled in Tertiary Education', 'Filipino Citizen', 'DSWD Field Office VII',
 'handshake', 'Assistance to Individuals in Crisis Situations (AICS) providing immediate cash grants for low-income students needing direct assistance for tuition and daily commuting fare.',
 ARRAY['Directly addresses your urgent need for daily transportation expenses and school fees.', 'Low GPA threshold (75% passing), focusing on financial need rather than academic rank.'],
 ARRAY['DSWD', 'AICS', 'Cash Assistance', 'Transportation Fare', 'Emergency Aid'],
 ARRAY['dswd', 'aics', 'financial assistance', 'transportation', 'indigent', 'crisis', 'cash grant'],
 $j$[{"id":"req-1","title":"Certificate of Enrollment","desc":"Valid enrollment registration.","status":"satisfied","note":"Satisfied"},{"id":"req-2","title":"Social Worker Assessment & Case Study","desc":"Interview with local DSWD or LGU social welfare desk.","status":"pending","note":"Pending: Schedule Interview"},{"id":"req-3","title":"Valid Student ID & Barangay Certificate","desc":"Local community endorsement.","status":"action","note":"Action: Submit Barangay Certificate"}]$j$::jsonb,
 null),

('DOST-SEI-MERIT-2024', 'DOST-SEI S&T Undergraduate Merit Scholarship', 'Department of Science and Technology - SEI', 'Scholarship', 'Priority STEM Disciplines (BS IT / CS)', '4 Years (Full College)', '₱480,000 / yr + Tuition + Allowance', 480000, '2026-10-15', 'Active',
 90.0, 'Not Eligible', 'Unmet Requirement: Minimum GPA is 90% (Your GPA: 82%)', 'Top 5% of Class / Min 90% GPA', 'Natural-Born Filipino Citizen', 'Dr. Josette T. Biyo / SEI Director',
 'biotech', 'Competitive national scholarship awarded to students with high aptitude in science and mathematics pursuing priority degree programs.',
 ARRAY['Your B.S. Information Technology degree is an accredited DOST Priority STEM course.', 'Filipino citizen studying in a recognized Philippine institution.'],
 ARRAY['DOST-SEI', 'Merit Scholarship', 'High GPA', 'STEM Priority'],
 ARRAY['dost', 'merit', 'scholarship', 'stem', 'it', 'computer science', 'philippines'],
 $j$[{"id":"req-1","title":"Academic GPA Standing (Min 90%)","desc":"Must maintain a minimum General Weighted Average of 90.0%.","status":"unmet","note":"Unmet: Your GPA is 82.0%"},{"id":"req-2","title":"Enrolled in DOST Priority S&T Course","desc":"BS IT / Computer Science / Engineering.","status":"satisfied","note":"Satisfied: BS IT"},{"id":"req-3","title":"Natural-Born Filipino Citizen","desc":"PSA Birth Certificate verified.","status":"satisfied","note":"Satisfied"},{"id":"req-4","title":"Good Moral Character","desc":"Certificate of good moral standing from dean.","status":"satisfied","note":"Satisfied"}]$j$::jsonb,
 $j${"metCount":3,"totalCount":4,"gapSummary":"You meet 3 of 4 requirements. The program requires a minimum GPA of 90%, while your current GPA is 82%.","missingRequirement":"Academic GPA Standing (Min 90% Required)","alternativeCategories":["Educational Assistance","Student Employment","Training & Certification"]}$j$::jsonb),

('LANDBANK-STUDENT-LOAN-2024', 'UniFAST & Landbank I-RESCUE Student Loan Program', 'Land Bank of the Philippines & CHED UniFAST', 'Student Loan', 'Higher Education Tuition Financing', 'Flexible Repayment (Up to 5 years post-grad)', 'Up to ₱150,000 / yr (Low 5% Interest)', 150000, '2026-11-30', 'Active',
 75.0, 'Potentially Eligible', 'Potentially Eligible (Requires Co-Maker / Parent Guarantor)', 'Undergraduate or Vocational Student', 'Filipino Citizen', 'UniFAST Secretariat',
 'payments', 'Government-backed soft student loan program designed to cover unpaid tuition, laptops, and educational devices with grace periods until after graduation.',
 ARRAY['Enables students facing mid-semester tuition blockages to clear balances.', '75% passing grade requirement is met by your 82% standing.'],
 ARRAY['Student Loan', 'Landbank', 'UniFAST', 'Tuition Bridge', 'Low Interest'],
 ARRAY['loan', 'landbank', 'unifast', 'tuition', 'financing', 'student loan'],
 $j$[{"id":"req-1","title":"Certificate of Assessment / Tuition Bill","desc":"Official school statement of account.","status":"action","note":"Action: Submit Assessment Bill"},{"id":"req-2","title":"Co-Maker / Parent Guarantor","desc":"Employed or barangay-certified guarantor.","status":"pending","note":"Pending: Co-Maker Sign"}]$j$::jsonb,
 null),

('DOST-ASTHRDP-GRAD-2024', 'DOST-SEI ASTHRDP Graduate Research Scholarship', 'DOST-SEI Graduate Consortium', 'Scholarship', 'Advanced IT & AI Systems', '2 Years', '₱480,000 / yr + Tuition', 480000, '2026-08-01', 'Expired',
 88.0, 'Not Eligible', 'Past deadline & Requires Graduate (M.S.) standing', 'M.S. STEM Enrolled', 'Filipino Citizen', 'Dr. Jaime C. Montoya',
 'school', 'Graduate fellowship for Master''s and Ph.D. students conducting advanced technological and scientific research.',
 ARRAY['Requires graduate enrollment (M.S./Ph.D.). Shown for historical registry reference.'],
 ARRAY['DOST-SEI', 'Graduate Only', 'Expired'],
 ARRAY['dost', 'graduate', 'master', 'phd'],
 '[]'::jsonb,
 null);
