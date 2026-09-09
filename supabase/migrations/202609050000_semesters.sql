begin;

create table public.semesters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  starts_on date,
  ends_on date,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint semesters_nonblank_name
    check (name ~ '[^[:space:]]'),

  constraint semesters_valid_dates
    check (
      starts_on is null
      or ends_on is null
      or ends_on >= starts_on
    )
);

create index semesters_user_id_idx
  on public.semesters(user_id);

create function public.semesters_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger semesters_set_updated_at
  before update on public.semesters
  for each row
  execute function public.semesters_set_updated_at();

alter table public.semesters enable row level security;

revoke all on public.semesters from anon, authenticated;

grant select, insert, update, delete
  on public.semesters to authenticated;

create policy semesters_owner_access
  on public.semesters
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

commit;