-- Seed placeholder 2026 races so Points Finish UI has data.
-- Replace or extend via Ergast sync or manual updates when schedule is final.
insert into public.races (season, round, name, race_start_utc, qualifying_end_utc)
values
  (2026, 1, 'Bahrain Grand Prix', '2026-03-01 15:00:00+00', '2026-02-28 18:00:00+00'),
  (2026, 2, 'Saudi Arabian Grand Prix', '2026-03-08 17:00:00+00', '2026-03-07 18:00:00+00')
on conflict (season, round) do nothing;
