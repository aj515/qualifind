-- Registration collects institution/course/GWA/birthdate/location/financial-status
-- up front, but handle_new_user() only ever wrote a blank students row from these
-- fields. RegisterPage.jsx tried to backfill them with a direct .update() right
-- after signUp(), but that only runs when Supabase returns a session immediately
-- (i.e. "Confirm email" is OFF). With email confirmation on (the default), signUp()
-- returns no session, so the update was skipped and everything the student typed
-- was silently discarded — Profile then loaded a blank row after they confirmed.
--
-- Fix: read the same fields out of auth metadata inside the trigger, which runs
-- server-side at row-insert time regardless of email confirmation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_role text := coalesce(new.raw_user_meta_data->>'role', 'student');
  new_name text := coalesce(new.raw_user_meta_data->>'name', new.email);
  new_avatar text := coalesce(
    nullif(new.raw_user_meta_data->>'avatar', ''),
    upper(left(coalesce(new.raw_user_meta_data->>'name', new.email), 2))
  );
begin
  insert into public.profiles (user_id, role, name, avatar)
  values (new.id, new_role, new_name, new_avatar);

  if new_role = 'admin' then
    insert into public.admins (user_id) values (new.id);
  else
    insert into public.students (
      user_id, institution, course, education_level, year_level,
      gpa, birthdate, location, is_financially_disadvantaged
    ) values (
      new.id,
      nullif(new.raw_user_meta_data->>'institution', ''),
      nullif(new.raw_user_meta_data->>'course', ''),
      nullif(new.raw_user_meta_data->>'education_level', ''),
      nullif(new.raw_user_meta_data->>'year_level', '')::int,
      nullif(new.raw_user_meta_data->>'gpa', '')::numeric,
      nullif(new.raw_user_meta_data->>'birthdate', '')::date,
      nullif(new.raw_user_meta_data->>'location', ''),
      coalesce((new.raw_user_meta_data->>'is_financially_disadvantaged')::boolean, false)
    );
  end if;

  return new;
end;
$$;
