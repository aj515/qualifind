-- Adds an optional total-slots capacity to programs, admin-set and purely
-- informational (QualiFind doesn't process real applications or verify actual
-- acceptances — see computeEligibility()/README scope notes). Null = no
-- stated cap, shown as unlimited/not displayed.

alter table public.programs add column if not exists slots_total int;
