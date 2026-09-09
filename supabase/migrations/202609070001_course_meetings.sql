begin;

-- One row per weekly meeting. Dates are inclusive, in the meeting's timezone.
create table public.course_meetings (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6), -- Sunday = 0
  starts_at time not null,
  ends_at time not null,
  timezone text not null,
  starts_on date not null,
  ends_on date not null,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint course_meetings_valid_times check (
    starts_at < ends_at and ends_at < time '24:00'
    and extract(second from starts_at) = 0 and extract(second from ends_at) = 0
  ),
  constraint course_meetings_valid_dates check (
    ends_on >= starts_on and starts_on >= date '0001-01-01'
    and ends_on <= date '9999-12-31'
  )
);
create index course_meetings_course_id_idx on public.course_meetings(course_id);

create function public.course_meetings_validate_timezone()
returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists (select 1 from pg_catalog.pg_timezone_names where name = new.timezone) then
    raise exception 'A valid timezone is required' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger course_meetings_validate_timezone
  before insert or update on public.course_meetings
  for each row execute function public.course_meetings_validate_timezone();
create trigger course_meetings_set_updated_at
  before update on public.course_meetings
  for each row execute function public.courses_set_updated_at();

-- Ownership comes from the parent course, with no second owner field to drift.
alter table public.course_meetings enable row level security;
revoke all on public.course_meetings from anon, authenticated;
grant select, insert, update, delete on public.course_meetings to authenticated;
create policy course_meetings_owner_access on public.course_meetings
  for all to authenticated
  using (exists (
    select 1 from public.courses c
    where c.id = course_id and c.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.courses c
    where c.id = course_id and c.user_id = (select auth.uid())
  ));

-- Today means the local day in each meeting's timezone, including past classes.
create function public.today_course_meetings(at_instant timestamptz default now())
returns table (
  id uuid, course_id uuid, course_name text, location text, timezone text,
  starts_at timestamptz, ends_at timestamptz
)
language sql stable security invoker set search_path = '' as $$
  select m.id, m.course_id, c.name, m.location, m.timezone,
    (d.local_date + m.starts_at) at time zone m.timezone,
    (d.local_date + m.ends_at) at time zone m.timezone
  from public.course_meetings m
  join public.courses c on c.id = m.course_id
  cross join lateral (
    select (at_instant at time zone m.timezone)::date as local_date
  ) d
  where d.local_date between m.starts_on and m.ends_on
    and extract(dow from d.local_date) = m.weekday
  order by 6, m.id;
$$;
revoke all on function public.today_course_meetings(timestamptz) from public, anon;
grant execute on function public.today_course_meetings(timestamptz) to authenticated;

commit;
