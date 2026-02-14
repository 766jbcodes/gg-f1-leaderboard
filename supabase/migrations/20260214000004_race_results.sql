-- Store actual top 10 finishers per race for Points Finish scoring.
create table if not exists public.race_results (
  id uuid primary key default gen_random_uuid(),
  race_id uuid not null references public.races (id) on delete cascade,
  top10_driver_names jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (race_id)
);

alter table public.race_results enable row level security;

-- Authenticated users can read (for leaderboard).
drop policy if exists "Authenticated can read race_results" on public.race_results;
create policy "Authenticated can read race_results" on public.race_results for select to authenticated using (true);
-- Only service role or future admin can insert/update (e.g. via Edge Function or backend).
-- No insert/update policy for authenticated = only service role can write.
-- To allow admin later: create policy "Admin can manage race_results" ...
