-- Sync state for background jobs (e.g. race results backfill).
-- Only service role can read/write; anon/authenticated get no rows.
create table if not exists public.app_sync_state (
  key text primary key,
  last_started_at timestamptz,
  last_completed_at timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.app_sync_state (key, updated_at)
values ('race_results_backfill', now())
on conflict (key) do nothing;

alter table public.app_sync_state enable row level security;

-- No policies: anon/authenticated see no rows. Service role bypasses RLS.
create policy "No public access"
  on public.app_sync_state for all
  using (false);
