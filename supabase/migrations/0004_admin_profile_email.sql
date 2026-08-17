-- Adds a denormalized email column to profiles so admin views (e.g. the
-- Analytics dashboard) can distinguish real students from throwaway test
-- accounts without needing service-role access to auth.users. Email is
-- captured at signup by the existing handle_new_user() trigger and backfilled
-- here for accounts that already exist.

alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.user_id and p.email is null;

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
  insert into public.profiles (user_id, role, name, avatar, email)
  values (new.id, new_role, new_name, new_avatar, new.email);

  if new_role = 'admin' then
    insert into public.admins (user_id) values (new.id);
  else
    insert into public.students (user_id) values (new.id);
  end if;

  return new;
end;
$$;

-- Admins previously had no way to read any profile but their own, so admin
-- views (analytics) could only aggregate by student_id with no identity to
-- filter or display. This mirrors the existing "Admins can view all
-- students"/"...eligibility results" policies.
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles p2 where p2.user_id = auth.uid() and p2.role = 'admin')
);
