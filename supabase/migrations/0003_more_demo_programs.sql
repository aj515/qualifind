-- More made-up demo programs for the hackathon build, to give the AI Matcher and
-- eligibility engine a wider variety of courses/regions/eligibility outcomes to
-- work with than the original 8-program seed. All providers/programs here are
-- fictional or illustrative — this whole table gets swapped for a real sourced
-- dataset later, so source_url is left null except where it points at a real
-- agency's public homepage (not a fabricated program page), matching the
-- "no invented URLs" convention from 0001_init.sql's seed data.

-- New providers (7 — DOST-SEI itself is reused from 0001_init.sql for the ERDT program)
insert into public.providers (id, name, type, website) values
('b2222222-2222-2222-2222-222222222208', 'Quezon City Youth Development Office (QCYDO)', 'lgu', null),
('b2222222-2222-2222-2222-222222222209', 'Technical Education and Skills Development Authority (TESDA)', 'government', 'https://tesda.gov.ph'),
('b2222222-2222-2222-2222-222222222210', 'BDO Foundation', 'private', null),
('b2222222-2222-2222-2222-222222222211', 'Philippine Nurses Association', 'private', null),
('b2222222-2222-2222-2222-222222222212', 'SM Foundation', 'private', null),
('b2222222-2222-2222-2222-222222222213', 'Davao City Local Government Unit (LGU)', 'lgu', null),
('b2222222-2222-2222-2222-222222222214', 'Department of Education (DepEd)', 'government', 'https://deped.gov.ph');

-- New reusable documents
insert into public.documents (id, name, description) values
('c3333333-3333-3333-3333-333333333314', 'Local/City Residency Certification', 'Proof of bona fide residency in the LGU''s covered city.'),
('c3333333-3333-3333-3333-333333333315', 'TESDA Enrollment / Skills Assessment Form', 'Completed intake form for the chosen technical-vocational track.'),
('c3333333-3333-3333-3333-333333333316', 'Loan Application & Promissory Note', 'Signed loan application and repayment promissory note.'),
('c3333333-3333-3333-3333-333333333317', 'Recommendation Letter (Dean/Adviser)', 'Endorsement letter from the applicant''s college dean or academic adviser.');

-- New programs
insert into public.programs
  (id, provider_id, title, type, dept, duration, summary, funding, annual_value, deadline, status,
   min_gpa, education_req, min_year_level, max_year_level, age_min, age_max, financial_req, course_req, location,
   degree_required, citizenship, lead_prof, icon, why_strong_match, tags, keywords, source_url, last_verified_at)
values

('a1111111-1111-1111-1111-111111111109', 'b2222222-2222-2222-2222-222222222208',
 'Quezon City Youth Development Office (QCYDO) Educational Assistance', 'Educational Assistance',
 'General / All Courses', 'Per Semester (Renewable)',
 'Local government tuition and school-supply subsidy for financially disadvantaged Quezon City resident students enrolled in any accredited course.',
 '₱20,000 / semester', 40000, '2026-09-20', 'Active',
 78.0, 'College', null, null, null, null, true, null, 'Quezon City',
 'Undergraduate (Enrolled in QC-based or QC-resident-eligible HEI)', 'Filipino Citizen (Quezon City Resident)', 'QCYDO Scholarship Section', 'apartment',
 ARRAY['Open to any course as long as you''re a Quezon City resident with financial need.', 'Covers tuition and school-supply costs each semester.'],
 ARRAY['Quezon City', 'LGU', 'Educational Assistance', 'Any Course'],
 ARRAY['quezon city', 'lgu', 'educational assistance', 'tuition', 'financial aid', 'metro manila'],
 null, '2026-08-01'),

('a1111111-1111-1111-1111-111111111110', 'b2222222-2222-2222-2222-222222222209',
 'TESDA Training for Work Scholarship Program (TWSP)', 'Training & Certification',
 'Technical-Vocational Skills Training', '2 - 6 Months (Track-Dependent)',
 'Free technical-vocational skills training and NC I-III certification for out-of-school youth and low-income students to boost employability outside a traditional degree track.',
 'Free Full Training + ₱3,000 Training Allowance', 15000, '2026-10-01', 'Active',
 null, null, null, null, null, null, true, null, null,
 'Open to All (No Degree Required)', 'Filipino Citizen', 'TESDA Regional Office', 'construction',
 ARRAY['No GPA or course requirement — open to any student or out-of-school youth.', 'Fully free, with a training allowance for low-income applicants.'],
 ARRAY['TESDA', 'Skills Training', 'Free Certification', 'TVET'],
 ARRAY['tesda', 'skills training', 'certification', 'vocational', 'nc ii', 'free training', 'philippines'],
 'https://tesda.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222210',
 'BDO Foundation Study Now, Pay Later Loan', 'Student Loan',
 'Tuition Financing (All Courses)', 'Flexible Repayment (Starts 1 Year Post-Grad)',
 'Low-interest private education loan covering tuition and school fees, with repayment deferred until a year after graduation.',
 'Up to ₱80,000 / yr (0% Interest First 2 Years)', 80000, '2026-11-20', 'Active',
 75.0, 'College', null, null, null, null, false, null, null,
 'Undergraduate Student (Any Course)', 'Filipino Citizen', 'BDO Foundation Education Desk', 'savings',
 ARRAY['Passing-grade requirement only (75%).', 'Deferred repayment removes pressure while you''re still studying.'],
 ARRAY['Student Loan', 'BDO Foundation', 'Tuition Financing', 'Low Interest'],
 ARRAY['loan', 'bdo', 'tuition financing', 'student loan', 'private loan'],
 null, '2026-08-01'),

('a1111111-1111-1111-1111-111111111112', 'b2222222-2222-2222-2222-222222222211',
 'Philippine Nurses Association Merit Scholarship', 'Scholarship',
 'Nursing', '1 Year (Renewable up to Graduation)',
 'Merit scholarship for high-performing nursing students, including sponsorship toward board exam review costs in the final year.',
 '₱60,000 / yr + Board Exam Review Sponsorship', 60000, '2026-10-30', 'Active',
 85.0, 'College', null, null, null, null, false, 'Nursing', null,
 'Undergraduate Nursing Student', 'Filipino Citizen', 'PNA Scholarship Committee', 'medical_services',
 ARRAY['Specifically for Nursing students with strong academic standing.', 'Includes board exam review sponsorship in the graduating year.'],
 ARRAY['Nursing', 'Merit Scholarship', 'Board Exam Sponsorship'],
 ARRAY['nursing', 'scholarship', 'merit', 'board exam', 'healthcare', 'philippines'],
 null, '2026-08-01'),

('a1111111-1111-1111-1111-111111111113', 'b2222222-2222-2222-2222-222222222206',
 'DOST-SEI ERDT Graduate Scholarship', 'Scholarship',
 'Engineering Research & Development for Technology', '2 Years',
 'Graduate fellowship under the Engineering Research and Development for Technology (ERDT) consortium for Master''s and Ph.D. students in engineering and computing fields.',
 '₱35,000 / mo Stipend + Tuition', 420000, '2026-11-15', 'Active',
 85.0, 'Graduate', null, null, null, null, false, 'Engineering / Computer Science', null,
 'M.S. / Ph.D. Engineering or Computing', 'Filipino Citizen', 'Dr. Josette T. Biyo / SEI Director', 'engineering',
 ARRAY['Open to graduate Engineering and Computer Science students, unlike the undergrad-only DOST-SEI merit track.', 'Full monthly stipend plus tuition coverage.'],
 ARRAY['DOST-SEI', 'ERDT', 'Graduate Scholarship', 'Engineering'],
 ARRAY['dost', 'erdt', 'graduate', 'engineering', 'research', 'master', 'phd', 'computer science'],
 'https://www.dost.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111114', 'b2222222-2222-2222-2222-222222222212',
 'SM Foundation College Scholarship', 'Scholarship',
 'Business, Accountancy, Engineering & IT', '1 Year (Renewable)',
 'Full-tuition corporate-sponsored scholarship with a monthly living allowance for financially disadvantaged students in business, accountancy, engineering, or IT programs.',
 'Full Tuition + ₱1,000 / mo Allowance', 60000, '2026-09-30', 'Active',
 85.0, 'College', null, null, null, null, true, 'Business Administration / Accountancy / Engineering / Information Technology', null,
 'Undergraduate (Priority Courses)', 'Filipino Citizen', 'SM Foundation Scholarship Program', 'storefront',
 ARRAY['Covers full tuition plus a monthly allowance for qualified priority-course students.', 'Prioritizes applicants with demonstrated financial need.'],
 ARRAY['SM Foundation', 'Full Tuition', 'Corporate Scholarship', 'Business', 'IT'],
 ARRAY['sm foundation', 'scholarship', 'business', 'accountancy', 'engineering', 'it', 'full tuition'],
 null, '2026-08-01'),

('a1111111-1111-1111-1111-111111111115', 'b2222222-2222-2222-2222-222222222213',
 'Davao City Comprehensive Scholarship Program (CSP)', 'Educational Assistance',
 'General / All Courses', 'Per Semester (Renewable)',
 'Local government tuition subsidy for financially disadvantaged Davao City resident students enrolled in any accredited college course.',
 '₱15,000 / semester', 30000, '2026-09-25', 'Active',
 78.0, 'College', null, null, null, null, true, null, 'Davao',
 'Undergraduate (Davao City Resident)', 'Filipino Citizen (Davao Resident)', 'Davao City Scholarship Office', 'location_city',
 ARRAY['Open to any course for Davao City residents with financial need.', 'Renewable each semester as long as standing is maintained.'],
 ARRAY['Davao', 'LGU', 'Educational Assistance', 'Any Course'],
 ARRAY['davao', 'lgu', 'educational assistance', 'tuition', 'financial aid', 'mindanao'],
 null, '2026-08-01'),

('a1111111-1111-1111-1111-111111111116', 'b2222222-2222-2222-2222-222222222214',
 'DepEd Future Educators Grant', 'Scholarship',
 'Education', '1 Year (Renewable)',
 'Government grant for Education majors preparing to become licensed public-school teachers, including free review for the Licensure Examination for Teachers (LET).',
 '₱40,000 / yr + Free LET Review', 40000, '2026-10-10', 'Active',
 80.0, 'College', null, null, null, null, false, 'Education', null,
 'Undergraduate Education Student', 'Filipino Citizen', 'DepEd Scholarship Division', 'menu_book',
 ARRAY['Specifically for Education majors preparing for a public-school teaching career.', 'Includes free Licensure Examination for Teachers review.'],
 ARRAY['DepEd', 'Education Major', 'Teacher Scholarship', 'LET Review'],
 ARRAY['deped', 'education', 'teaching', 'scholarship', 'let review', 'philippines'],
 'https://deped.gov.ph', '2026-08-01');

-- Program <-> Document requirements
insert into public.program_documents (program_id, document_id) values
('a1111111-1111-1111-1111-111111111109', 'c3333333-3333-3333-3333-333333333302'),
('a1111111-1111-1111-1111-111111111109', 'c3333333-3333-3333-3333-333333333303'),
('a1111111-1111-1111-1111-111111111109', 'c3333333-3333-3333-3333-333333333314'),

('a1111111-1111-1111-1111-111111111110', 'c3333333-3333-3333-3333-333333333307'),
('a1111111-1111-1111-1111-111111111110', 'c3333333-3333-3333-3333-333333333315'),

('a1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333312'),
('a1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333316'),

('a1111111-1111-1111-1111-111111111112', 'c3333333-3333-3333-3333-333333333311'),
('a1111111-1111-1111-1111-111111111112', 'c3333333-3333-3333-3333-333333333317'),

('a1111111-1111-1111-1111-111111111113', 'c3333333-3333-3333-3333-333333333305'),
('a1111111-1111-1111-1111-111111111113', 'c3333333-3333-3333-3333-333333333311'),

('a1111111-1111-1111-1111-111111111114', 'c3333333-3333-3333-3333-333333333303'),
('a1111111-1111-1111-1111-111111111114', 'c3333333-3333-3333-3333-333333333305'),
('a1111111-1111-1111-1111-111111111114', 'c3333333-3333-3333-3333-333333333317'),

('a1111111-1111-1111-1111-111111111115', 'c3333333-3333-3333-3333-333333333302'),
('a1111111-1111-1111-1111-111111111115', 'c3333333-3333-3333-3333-333333333303'),
('a1111111-1111-1111-1111-111111111115', 'c3333333-3333-3333-3333-333333333314'),

('a1111111-1111-1111-1111-111111111116', 'c3333333-3333-3333-3333-333333333305'),
('a1111111-1111-1111-1111-111111111116', 'c3333333-3333-3333-3333-333333333311');

-- Application steps (3 per program, same shape as 0001_init.sql's seed)
insert into public.application_steps (program_id, step_number, title, description) values
('a1111111-1111-1111-1111-111111111109', 1, 'Prepare Required Documents', 'Gather your Certificate of Enrollment, Barangay Indigency Certificate, and Quezon City residency proof.'),
('a1111111-1111-1111-1111-111111111109', 2, 'Submit Official Application', 'Apply through the QCYDO Scholarship Section before the deadline.'),
('a1111111-1111-1111-1111-111111111109', 3, 'Confirmation & Endorsement', 'Receive your application reference number and subsidy disbursement schedule.'),

('a1111111-1111-1111-1111-111111111110', 1, 'Prepare Required Documents', 'Gather a valid ID and complete the TESDA enrollment / skills assessment form.'),
('a1111111-1111-1111-1111-111111111110', 2, 'Submit Official Application', 'Register at your nearest TESDA Regional Office or accredited training center before the deadline.'),
('a1111111-1111-1111-1111-111111111110', 3, 'Confirmation & Endorsement', 'Receive your training schedule and track assignment.'),

('a1111111-1111-1111-1111-111111111111', 1, 'Prepare Required Documents', 'Gather your Certificate of Assessment / Tuition Bill and complete the loan application & promissory note.'),
('a1111111-1111-1111-1111-111111111111', 2, 'Submit Official Application', 'Apply through the BDO Foundation Education Desk before the deadline.'),
('a1111111-1111-1111-1111-111111111111', 3, 'Confirmation & Endorsement', 'Receive your loan approval and disbursement schedule.'),

('a1111111-1111-1111-1111-111111111112', 1, 'Prepare Required Documents', 'Gather your Good Moral Character Certificate and a recommendation letter from your dean or adviser.'),
('a1111111-1111-1111-1111-111111111112', 2, 'Submit Official Application', 'Submit through the PNA Scholarship Committee before the deadline.'),
('a1111111-1111-1111-1111-111111111112', 3, 'Confirmation & Endorsement', 'Receive your scholarship award notification.'),

('a1111111-1111-1111-1111-111111111113', 1, 'Prepare Required Documents', 'Gather your Certificate of Registration and Good Moral Character Certificate.'),
('a1111111-1111-1111-1111-111111111113', 2, 'Submit Official Application', 'Apply through the DOST-SEI ERDT consortium before the deadline.'),
('a1111111-1111-1111-1111-111111111113', 3, 'Confirmation & Endorsement', 'Receive your fellowship award notification.'),

('a1111111-1111-1111-1111-111111111114', 1, 'Prepare Required Documents', 'Gather your Barangay Indigency Certificate, Certificate of Registration, and a recommendation letter.'),
('a1111111-1111-1111-1111-111111111114', 2, 'Submit Official Application', 'Apply through the SM Foundation Scholarship Program before the deadline.'),
('a1111111-1111-1111-1111-111111111114', 3, 'Confirmation & Endorsement', 'Receive your scholarship award notification and disbursement schedule.'),

('a1111111-1111-1111-1111-111111111115', 1, 'Prepare Required Documents', 'Gather your Certificate of Enrollment, Barangay Indigency Certificate, and Davao City residency proof.'),
('a1111111-1111-1111-1111-111111111115', 2, 'Submit Official Application', 'Apply through the Davao City Scholarship Office before the deadline.'),
('a1111111-1111-1111-1111-111111111115', 3, 'Confirmation & Endorsement', 'Receive your application reference number and subsidy disbursement schedule.'),

('a1111111-1111-1111-1111-111111111116', 1, 'Prepare Required Documents', 'Gather your Certificate of Registration and Good Moral Character Certificate.'),
('a1111111-1111-1111-1111-111111111116', 2, 'Submit Official Application', 'Apply through the DepEd Scholarship Division before the deadline.'),
('a1111111-1111-1111-1111-111111111116', 3, 'Confirmation & Endorsement', 'Receive your grant award notification and LET review enrollment details.');
