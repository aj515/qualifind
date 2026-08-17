-- Even more made-up demo programs, aimed specifically at widening diversity of
-- field/course (agriculture, maritime, law, medicine, fine arts), applicant type
-- (PWD, OFW dependents, indigenous peoples), and region (Cordillera, Western
-- Visayas) beyond what 0001_init.sql and 0003_more_demo_programs.sql cover.
-- Same conventions as 0003: fictional/illustrative providers and programs,
-- source_url left null except where it points at a real agency's public
-- homepage.

-- New providers (10)
insert into public.providers (id, name, type, website) values
('b2222222-2222-2222-2222-222222222215', 'Agricultural Training Institute (ATI) - Department of Agriculture', 'government', 'https://ati.da.gov.ph'),
('b2222222-2222-2222-2222-222222222216', 'National Council on Disability Affairs (NCDA)', 'government', 'https://ncda.gov.ph'),
('b2222222-2222-2222-2222-222222222217', 'Maritime Industry Authority (MARINA)', 'government', 'https://marina.gov.ph'),
('b2222222-2222-2222-2222-222222222218', 'Overseas Workers Welfare Administration (OWWA)', 'government', 'https://owwa.gov.ph'),
('b2222222-2222-2222-2222-222222222219', 'National Commission on Indigenous Peoples (NCIP)', 'government', 'https://ncip.gov.ph'),
('b2222222-2222-2222-2222-222222222220', 'National Commission for Culture and the Arts (NCCA)', 'government', 'https://ncca.gov.ph'),
('b2222222-2222-2222-2222-222222222221', 'Integrated Bar of the Philippines (IBP)', 'private', null),
('b2222222-2222-2222-2222-222222222222', 'Department of Health (DOH) - Doctors to the Barrios Program', 'government', 'https://doh.gov.ph'),
('b2222222-2222-2222-2222-222222222223', 'Baguio City Local Government Unit (LGU)', 'lgu', null),
('b2222222-2222-2222-2222-222222222224', 'Iloilo City Local Government Unit (LGU)', 'lgu', null);

-- New reusable documents
insert into public.documents (id, name, description) values
('c3333333-3333-3333-3333-333333333318', 'PWD ID / Medical Certificate of Disability', 'Government-issued PWD identification or a physician-signed disability certificate.'),
('c3333333-3333-3333-3333-333333333319', 'Seaman''s Book / Maritime Pre-Enrollment Certificate', 'Proof of enrollment or pre-registration in a maritime/marine transportation program.'),
('c3333333-3333-3333-3333-333333333320', 'OWWA E-Registration / OFW Parent''s Contract Copy', 'Proof that a parent or guardian is an OWWA-registered overseas Filipino worker.'),
('c3333333-3333-3333-3333-333333333321', 'NCIP Certificate of Confirmation (Tribal Membership)', 'Certification of indigenous cultural community/indigenous peoples membership issued by NCIP.'),
('c3333333-3333-3333-3333-333333333322', 'Creative Portfolio / Audition Requirement', 'Work samples, portfolio, or audition recording required for arts-based programs.');

-- New programs
insert into public.programs
  (id, provider_id, title, type, dept, duration, summary, funding, annual_value, deadline, status,
   min_gpa, education_req, min_year_level, max_year_level, age_min, age_max, financial_req, course_req, location,
   degree_required, citizenship, lead_prof, icon, why_strong_match, tags, keywords, source_url, last_verified_at)
values

('a1111111-1111-1111-1111-111111111117', 'b2222222-2222-2222-2222-222222222215',
 'ATI Iskolar ng Kabuhayan Agricultural Scholarship', 'Scholarship',
 'Agriculture, Fisheries & Agribusiness', '4 Years (Full College)',
 'Government scholarship supporting Filipino students pursuing agriculture, fisheries, or agribusiness degrees, including a hands-on farm internship stipend.',
 '₱30,000 / yr + Farm Internship Stipend', 30000, '2026-09-10', 'Active',
 80.0, 'College', null, null, null, null, true, 'Agriculture / Agribusiness / Fisheries', null,
 'Undergraduate Agriculture-related Course', 'Filipino Citizen', 'ATI Scholarship Office', 'agriculture',
 ARRAY['Specifically for Agriculture, Fisheries, and Agribusiness majors.', 'Includes a paid farm internship on top of the annual stipend.'],
 ARRAY['Agriculture', 'ATI', 'Farm Internship', 'Fisheries'],
 ARRAY['agriculture', 'farming', 'fisheries', 'agribusiness', 'ati', 'rural', 'philippines'],
 'https://ati.da.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111118', 'b2222222-2222-2222-2222-222222222216',
 'NCDA Educational Assistance for Students with Disabilities', 'Educational Assistance',
 'General / All Courses (PWD Applicants)', 'Per Semester (Renewable)',
 'Tuition and assistive-device cost support for students with disabilities enrolled in any accredited college course.',
 '₱25,000 / yr', 25000, '2026-10-05', 'Active',
 75.0, 'College', null, null, null, null, true, null, null,
 'Undergraduate (Any Course, PWD-Registered)', 'Filipino Citizen (PWD)', 'NCDA Education Desk', 'accessibility_new',
 ARRAY['Open to any course as long as you are a registered person with disability.', 'Covers tuition plus assistive-device costs.'],
 ARRAY['PWD', 'Disability Support', 'Educational Assistance', 'Any Course'],
 ARRAY['pwd', 'disability', 'ncda', 'educational assistance', 'accessibility', 'philippines'],
 'https://ncda.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111119', 'b2222222-2222-2222-2222-222222222217',
 'MARINA Merit Scholarship for Maritime Studies', 'Scholarship',
 'Marine Transportation & Marine Engineering', '4 Years (Full College)',
 'Merit-based scholarship for high-performing students pursuing marine transportation or marine engineering degrees, with an onboard training stipend.',
 'Full Tuition + Onboard Training Stipend', 90000, '2026-09-20', 'Active',
 82.0, 'College', null, null, null, null, false, 'Marine Transportation / Marine Engineering', null,
 'Undergraduate Maritime Course', 'Filipino Citizen', 'MARINA Scholarship Division', 'directions_boat',
 ARRAY['Specifically for Marine Transportation and Marine Engineering students.', 'Covers full tuition and a stipend during onboard training.'],
 ARRAY['Maritime', 'MARINA', 'Marine Engineering', 'Onboard Training'],
 ARRAY['maritime', 'marina', 'seafarer', 'marine engineering', 'marine transportation', 'philippines'],
 'https://marina.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111120', 'b2222222-2222-2222-2222-222222222218',
 'OWWA Educational and Livelihood Assistance for OFW Dependents', 'Educational Assistance',
 'General / All Courses (OFW Dependents)', 'Per Semester (Renewable)',
 'Tuition subsidy for the college-enrolled children or dependents of active OWWA-registered overseas Filipino workers.',
 '₱20,000 / semester', 40000, '2026-10-25', 'Active',
 78.0, 'College', null, null, null, null, false, null, null,
 'Undergraduate (Dependent of OWWA Member)', 'Filipino Citizen (OFW Dependent)', 'OWWA Education Assistance Section', 'flight_takeoff',
 ARRAY['Open to any course for dependents of active OWWA-registered OFWs.', 'Renewable every semester while standing is maintained.'],
 ARRAY['OWWA', 'OFW Dependents', 'Educational Assistance', 'Any Course'],
 ARRAY['owwa', 'ofw', 'dependents', 'educational assistance', 'tuition', 'philippines'],
 'https://owwa.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111121', 'b2222222-2222-2222-2222-222222222219',
 'NCIP Katutubo Scholarship Program', 'Scholarship',
 'General / All Courses (Indigenous Peoples Applicants)', '1 Year (Renewable up to Graduation)',
 'National scholarship for members of indigenous cultural communities/indigenous peoples pursuing any college degree, including a book allowance.',
 '₱35,000 / yr + Book Allowance', 35000, '2026-11-05', 'Active',
 78.0, 'College', null, null, null, null, true, null, null,
 'Undergraduate (Indigenous Peoples Member)', 'Filipino Citizen (IP Member)', 'NCIP Education, Culture and Health Office', 'diversity_3',
 ARRAY['Open to any course for confirmed members of indigenous cultural communities.', 'Includes an annual book allowance on top of tuition support.'],
 ARRAY['Indigenous Peoples', 'NCIP', 'Katutubo', 'Any Course'],
 ARRAY['indigenous peoples', 'ncip', 'katutubo', 'scholarship', 'cultural community', 'philippines'],
 'https://ncip.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111122', 'b2222222-2222-2222-2222-222222222220',
 'NCCA Cultural Scholarship for the Arts', 'Scholarship',
 'Fine Arts, Music, Theater & Creative Writing', '1 Year (Renewable up to Graduation)',
 'Scholarship supporting students pursuing fine arts, music, theater, or creative writing degrees, paired with mentorship from NCCA-affiliated artists.',
 '₱40,000 / yr + Mentorship Program', 40000, '2026-10-20', 'Active',
 78.0, 'College', null, null, null, null, false, 'Fine Arts / Music / Theater Arts / Creative Writing', null,
 'Undergraduate Arts-related Course', 'Filipino Citizen', 'NCCA Scholarship Unit', 'palette',
 ARRAY['Specifically for Fine Arts, Music, Theater, and Creative Writing majors.', 'Pairs recipients with a mentor from the NCCA artist network.'],
 ARRAY['Fine Arts', 'NCCA', 'Music', 'Theater', 'Creative Writing'],
 ARRAY['fine arts', 'ncca', 'music', 'theater', 'creative writing', 'culture', 'scholarship', 'philippines'],
 'https://ncca.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111123', 'b2222222-2222-2222-2222-222222222221',
 'IBP Law Scholarship Program', 'Scholarship',
 'Law', '3 Years (Juris Doctor)',
 'Scholarship for Juris Doctor students with strong academic standing, including sponsorship toward Bar review costs in the final year.',
 '₱50,000 / yr + Bar Review Sponsorship', 50000, '2026-11-10', 'Active',
 85.0, 'Graduate', null, null, null, null, false, 'Law / Juris Doctor', null,
 'Juris Doctor / Law Student', 'Filipino Citizen', 'IBP National Scholarship Committee', 'gavel',
 ARRAY['Specifically for Juris Doctor / Law students with strong academic standing.', 'Includes Bar review sponsorship in the graduating year.'],
 ARRAY['Law', 'IBP', 'Juris Doctor', 'Bar Review Sponsorship'],
 ARRAY['law', 'ibp', 'juris doctor', 'bar exam', 'scholarship', 'philippines'],
 null, '2026-08-01'),

('a1111111-1111-1111-1111-111111111124', 'b2222222-2222-2222-2222-222222222222',
 'DOH Doctors to the Barrios Scholarship', 'Scholarship',
 'Medicine', '4 Years (Doctor of Medicine) + Return Service',
 'Government scholarship for Doctor of Medicine students who commit to a return service obligation in an underserved rural health unit after licensure.',
 'Full Tuition + ₱15,000 / mo Stipend', 480000, '2026-09-28', 'Active',
 85.0, 'Graduate', null, null, null, null, false, 'Medicine / Doctor of Medicine', null,
 'Doctor of Medicine Student', 'Filipino Citizen', 'DOH Health Human Resource Development Bureau', 'stethoscope',
 ARRAY['Specifically for Doctor of Medicine students willing to serve in a rural health unit post-licensure.', 'Covers full tuition plus a monthly stipend throughout medical school.'],
 ARRAY['Medicine', 'DOH', 'Doctors to the Barrios', 'Return Service'],
 ARRAY['medicine', 'doh', 'doctors to the barrios', 'rural health', 'medical school', 'philippines'],
 'https://doh.gov.ph', '2026-08-01'),

('a1111111-1111-1111-1111-111111111125', 'b2222222-2222-2222-2222-222222222223',
 'Baguio City Educational Assistance Program', 'Educational Assistance',
 'General / All Courses', 'Per Semester (Renewable)',
 'Local government tuition subsidy for financially disadvantaged Baguio City resident students enrolled in any accredited college course.',
 '₱18,000 / semester', 36000, '2026-09-15', 'Active',
 78.0, 'College', null, null, null, null, true, null, 'Baguio',
 'Undergraduate (Baguio City Resident)', 'Filipino Citizen (Baguio Resident)', 'Baguio City Scholarship Office', 'landscape',
 ARRAY['Open to any course for Baguio City residents with financial need.', 'Renewable each semester as long as standing is maintained.'],
 ARRAY['Baguio', 'LGU', 'Educational Assistance', 'Any Course', 'Cordillera'],
 ARRAY['baguio', 'lgu', 'educational assistance', 'tuition', 'financial aid', 'cordillera', 'luzon'],
 null, '2026-08-01'),

('a1111111-1111-1111-1111-111111111126', 'b2222222-2222-2222-2222-222222222224',
 'Iskolar Iloilo City Scholarship Program', 'Educational Assistance',
 'General / All Courses', 'Per Semester (Renewable)',
 'Local government tuition subsidy for financially disadvantaged Iloilo City resident students enrolled in any accredited college course.',
 '₱16,000 / semester', 32000, '2026-09-22', 'Active',
 78.0, 'College', null, null, null, null, true, null, 'Iloilo',
 'Undergraduate (Iloilo City Resident)', 'Filipino Citizen (Iloilo Resident)', 'Iloilo City Scholarship Office', 'water',
 ARRAY['Open to any course for Iloilo City residents with financial need.', 'Renewable each semester as long as standing is maintained.'],
 ARRAY['Iloilo', 'LGU', 'Educational Assistance', 'Any Course', 'Western Visayas'],
 ARRAY['iloilo', 'lgu', 'educational assistance', 'tuition', 'financial aid', 'western visayas', 'panay'],
 null, '2026-08-01');

-- Program <-> Document requirements
insert into public.program_documents (program_id, document_id) values
('a1111111-1111-1111-1111-111111111117', 'c3333333-3333-3333-3333-333333333302'),
('a1111111-1111-1111-1111-111111111117', 'c3333333-3333-3333-3333-333333333303'),

('a1111111-1111-1111-1111-111111111118', 'c3333333-3333-3333-3333-333333333318'),
('a1111111-1111-1111-1111-111111111118', 'c3333333-3333-3333-3333-333333333303'),

('a1111111-1111-1111-1111-111111111119', 'c3333333-3333-3333-3333-333333333319'),
('a1111111-1111-1111-1111-111111111119', 'c3333333-3333-3333-3333-333333333307'),

('a1111111-1111-1111-1111-111111111120', 'c3333333-3333-3333-3333-333333333320'),
('a1111111-1111-1111-1111-111111111120', 'c3333333-3333-3333-3333-333333333302'),

('a1111111-1111-1111-1111-111111111121', 'c3333333-3333-3333-3333-333333333321'),
('a1111111-1111-1111-1111-111111111121', 'c3333333-3333-3333-3333-333333333303'),

('a1111111-1111-1111-1111-111111111122', 'c3333333-3333-3333-3333-333333333322'),
('a1111111-1111-1111-1111-111111111122', 'c3333333-3333-3333-3333-333333333302'),

('a1111111-1111-1111-1111-111111111123', 'c3333333-3333-3333-3333-333333333311'),
('a1111111-1111-1111-1111-111111111123', 'c3333333-3333-3333-3333-333333333317'),

('a1111111-1111-1111-1111-111111111124', 'c3333333-3333-3333-3333-333333333305'),
('a1111111-1111-1111-1111-111111111124', 'c3333333-3333-3333-3333-333333333311'),

('a1111111-1111-1111-1111-111111111125', 'c3333333-3333-3333-3333-333333333302'),
('a1111111-1111-1111-1111-111111111125', 'c3333333-3333-3333-3333-333333333303'),

('a1111111-1111-1111-1111-111111111126', 'c3333333-3333-3333-3333-333333333302'),
('a1111111-1111-1111-1111-111111111126', 'c3333333-3333-3333-3333-333333333303');

-- Application steps (3 per program, same shape as prior migrations' seed data)
insert into public.application_steps (program_id, step_number, title, description) values
('a1111111-1111-1111-1111-111111111117', 1, 'Prepare Required Documents', 'Gather your Certificate of Enrollment and Barangay Indigency Certificate.'),
('a1111111-1111-1111-1111-111111111117', 2, 'Submit Official Application', 'Apply through the ATI Scholarship Office before the deadline.'),
('a1111111-1111-1111-1111-111111111117', 3, 'Confirmation & Endorsement', 'Receive your award notification and farm internship placement details.'),

('a1111111-1111-1111-1111-111111111118', 1, 'Prepare Required Documents', 'Gather your PWD ID or Medical Certificate of Disability and Barangay Indigency Certificate.'),
('a1111111-1111-1111-1111-111111111118', 2, 'Submit Official Application', 'Apply through the NCDA Education Desk before the deadline.'),
('a1111111-1111-1111-1111-111111111118', 3, 'Confirmation & Endorsement', 'Receive your application reference number and disbursement schedule.'),

('a1111111-1111-1111-1111-111111111119', 1, 'Prepare Required Documents', 'Gather your Seaman''s Book / Maritime Pre-Enrollment Certificate and valid Student/Government ID.'),
('a1111111-1111-1111-1111-111111111119', 2, 'Submit Official Application', 'Apply through the MARINA Scholarship Division before the deadline.'),
('a1111111-1111-1111-1111-111111111119', 3, 'Confirmation & Endorsement', 'Receive your scholarship award notification and onboard training assignment.'),

('a1111111-1111-1111-1111-111111111120', 1, 'Prepare Required Documents', 'Gather your OWWA E-Registration / OFW Parent''s Contract Copy and Certificate of Enrollment.'),
('a1111111-1111-1111-1111-111111111120', 2, 'Submit Official Application', 'Apply through the OWWA Education Assistance Section before the deadline.'),
('a1111111-1111-1111-1111-111111111120', 3, 'Confirmation & Endorsement', 'Receive your subsidy disbursement schedule confirmation.'),

('a1111111-1111-1111-1111-111111111121', 1, 'Prepare Required Documents', 'Gather your NCIP Certificate of Confirmation and Barangay Indigency Certificate.'),
('a1111111-1111-1111-1111-111111111121', 2, 'Submit Official Application', 'Apply through the NCIP Education, Culture and Health Office before the deadline.'),
('a1111111-1111-1111-1111-111111111121', 3, 'Confirmation & Endorsement', 'Receive your scholarship award notification.'),

('a1111111-1111-1111-1111-111111111122', 1, 'Prepare Required Documents', 'Gather your Creative Portfolio / Audition Requirement and Certificate of Enrollment.'),
('a1111111-1111-1111-1111-111111111122', 2, 'Submit Official Application', 'Submit through the NCCA Scholarship Unit before the deadline.'),
('a1111111-1111-1111-1111-111111111122', 3, 'Confirmation & Endorsement', 'Receive your award notification and mentor assignment.'),

('a1111111-1111-1111-1111-111111111123', 1, 'Prepare Required Documents', 'Gather your Good Moral Character Certificate and a recommendation letter from your dean or adviser.'),
('a1111111-1111-1111-1111-111111111123', 2, 'Submit Official Application', 'Submit through the IBP National Scholarship Committee before the deadline.'),
('a1111111-1111-1111-1111-111111111123', 3, 'Confirmation & Endorsement', 'Receive your scholarship award notification.'),

('a1111111-1111-1111-1111-111111111124', 1, 'Prepare Required Documents', 'Gather your Certificate of Registration and Good Moral Character Certificate.'),
('a1111111-1111-1111-1111-111111111124', 2, 'Submit Official Application', 'Apply through the DOH Health Human Resource Development Bureau before the deadline.'),
('a1111111-1111-1111-1111-111111111124', 3, 'Confirmation & Endorsement', 'Receive your scholarship award notification and return-service agreement.'),

('a1111111-1111-1111-1111-111111111125', 1, 'Prepare Required Documents', 'Gather your Certificate of Enrollment and Barangay Indigency Certificate.'),
('a1111111-1111-1111-1111-111111111125', 2, 'Submit Official Application', 'Apply through the Baguio City Scholarship Office before the deadline.'),
('a1111111-1111-1111-1111-111111111125', 3, 'Confirmation & Endorsement', 'Receive your application reference number and subsidy disbursement schedule.'),

('a1111111-1111-1111-1111-111111111126', 1, 'Prepare Required Documents', 'Gather your Certificate of Enrollment and Barangay Indigency Certificate.'),
('a1111111-1111-1111-1111-111111111126', 2, 'Submit Official Application', 'Apply through the Iloilo City Scholarship Office before the deadline.'),
('a1111111-1111-1111-1111-111111111126', 3, 'Confirmation & Endorsement', 'Receive your application reference number and subsidy disbursement schedule.');
