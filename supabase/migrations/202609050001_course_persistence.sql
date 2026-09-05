begin;

do $$
begin
  if to_regclass('public.semesters') is null then
    raise exception 'Apply the existing semesters schema before this migration.';
  end if;
end $$;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  semester_id uuid references public.semesters(id),
  code text,
  name text not null,
  instructor text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses
  add constraint courses_nonblank_name check (name is not null and name ~ '[^[:space:]]'),
  add constraint courses_owner_required check (user_id is not null);

create index if not exists courses_user_id_idx on public.courses(user_id);

create function public.courses_set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.courses_set_updated_at();

alter table public.courses enable row level security;
revoke all on public.courses from anon;
grant select, insert, update, delete on public.courses to authenticated;

create policy courses_owner_access on public.courses
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Restrictive policies also constrain any pre-existing permissive policies.
create policy courses_owner_guard on public.courses
  as restrictive for all to public
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (
      semester_id is null
      or exists (
        select 1 from public.semesters s
        where s.id = courses.semester_id and s.user_id = (select auth.uid())
      )
    )
  );

commit;
