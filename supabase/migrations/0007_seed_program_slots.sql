-- Backfills slots_total (see 0006_program_slots.sql) for the existing seeded
-- programs across 0001_init.sql, 0003_more_demo_programs.sql, and
-- 0005_more_diverse_programs.sql. Values are illustrative, roughly scaled by
-- program type/reach (national government programs and TESDA-style mass
-- training get large counts; competitive/corporate scholarships get small
-- ones; LGU programs get a mid-size cap). Left null (no stated cap) for
-- programs that are ongoing/case-by-case rather than slot-based: DSWD AICS
-- (crisis aid, released case by case) and the two student loan programs
-- (funding-limited, not seat-limited).

update public.programs set slots_total = 150 where id = 'a1111111-1111-1111-1111-111111111101'; -- Cebu City College Scholarship Program (CCCSP)
update public.programs set slots_total = 10  where id = 'a1111111-1111-1111-1111-111111111102'; -- University IT & Computer Lab Student Assistantship
update public.programs set slots_total = 500 where id = 'a1111111-1111-1111-1111-111111111103'; -- CHED Tulong Dunong Program (TDP-TES)
update public.programs set slots_total = 200 where id = 'a1111111-1111-1111-1111-111111111104'; -- DICT digitaljobsPH & Cloud Skills Certification Voucher
-- 111105 (DSWD AICS) intentionally left null — case-by-case crisis aid, not slot-based
update public.programs set slots_total = 30  where id = 'a1111111-1111-1111-1111-111111111106'; -- DOST-SEI S&T Undergraduate Merit Scholarship
-- 111107 (UniFAST & Landbank I-RESCUE Student Loan) intentionally left null — funding-limited, not seat-limited
update public.programs set slots_total = 15  where id = 'a1111111-1111-1111-1111-111111111108'; -- DOST-SEI ASTHRDP Graduate Research Scholarship (expired)

update public.programs set slots_total = 200 where id = 'a1111111-1111-1111-1111-111111111109'; -- QCYDO Educational Assistance
update public.programs set slots_total = 500 where id = 'a1111111-1111-1111-1111-111111111110'; -- TESDA Training for Work Scholarship Program
-- 111111 (BDO Foundation Study Now, Pay Later Loan) intentionally left null — funding-limited, not seat-limited
update public.programs set slots_total = 25  where id = 'a1111111-1111-1111-1111-111111111112'; -- Philippine Nurses Association Merit Scholarship
update public.programs set slots_total = 20  where id = 'a1111111-1111-1111-1111-111111111113'; -- DOST-SEI ERDT Graduate Scholarship
update public.programs set slots_total = 50  where id = 'a1111111-1111-1111-1111-111111111114'; -- SM Foundation College Scholarship
update public.programs set slots_total = 150 where id = 'a1111111-1111-1111-1111-111111111115'; -- Davao City Comprehensive Scholarship Program
update public.programs set slots_total = 100 where id = 'a1111111-1111-1111-1111-111111111116'; -- DepEd Future Educators Grant

update public.programs set slots_total = 40  where id = 'a1111111-1111-1111-1111-111111111117'; -- ATI Iskolar ng Kabuhayan Agricultural Scholarship
update public.programs set slots_total = 60  where id = 'a1111111-1111-1111-1111-111111111118'; -- NCDA Educational Assistance for Students with Disabilities
update public.programs set slots_total = 30  where id = 'a1111111-1111-1111-1111-111111111119'; -- MARINA Merit Scholarship for Maritime Studies
update public.programs set slots_total = 150 where id = 'a1111111-1111-1111-1111-111111111120'; -- OWWA Educational and Livelihood Assistance for OFW Dependents
update public.programs set slots_total = 80  where id = 'a1111111-1111-1111-1111-111111111121'; -- NCIP Katutubo Scholarship Program
update public.programs set slots_total = 25  where id = 'a1111111-1111-1111-1111-111111111122'; -- NCCA Cultural Scholarship for the Arts
update public.programs set slots_total = 15  where id = 'a1111111-1111-1111-1111-111111111123'; -- IBP Law Scholarship Program
update public.programs set slots_total = 20  where id = 'a1111111-1111-1111-1111-111111111124'; -- DOH Doctors to the Barrios Scholarship
update public.programs set slots_total = 100 where id = 'a1111111-1111-1111-1111-111111111125'; -- Baguio City Educational Assistance Program
update public.programs set slots_total = 100 where id = 'a1111111-1111-1111-1111-111111111126'; -- Iskolar Iloilo City Scholarship Program
