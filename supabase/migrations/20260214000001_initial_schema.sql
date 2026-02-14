-- Profiles: link auth.users to display name and optional legacy participant_id
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  participant_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Season predictions: driver/constructor order per user per season
create table if not exists public.season_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  season int not null,
  championship_type text not null check (championship_type in ('drivers', 'constructors')),
  predictions jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, season, championship_type)
);

-- Races: schedule for reminder and weekly predictions
create table if not exists public.races (
  id uuid primary key default gen_random_uuid(),
  season int not null,
  round int not null,
  name text not null,
  race_start_utc timestamptz not null,
  qualifying_end_utc timestamptz,
  reminder_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season, round)
);

-- Weekly predictions: top 10 drivers per user per race
create table if not exists public.weekly_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  race_id uuid not null references public.races (id) on delete cascade,
  top10_driver_names jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, race_id)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.season_predictions enable row level security;
alter table public.races enable row level security;
alter table public.weekly_predictions enable row level security;

-- Profiles: users can read/update own row
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
-- Insert on signup via trigger (see below)
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Season predictions: own rows only
create policy "Users can manage own season_predictions" on public.season_predictions for all using (auth.uid() = user_id);

-- Races: readable by all authenticated
create policy "Authenticated can read races" on public.races for select to authenticated using (true);

-- Weekly predictions: own rows only
create policy "Users can manage own weekly_predictions" on public.weekly_predictions for all using (auth.uid() = user_id);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Optional: allow service role to update races (reminder_sent_at) and read all for reminder job
-- Reminder job will use service role key; no extra policy needed for anon/authenticated.
