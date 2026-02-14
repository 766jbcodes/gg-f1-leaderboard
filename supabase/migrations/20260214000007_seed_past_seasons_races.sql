-- One representative race per past season so race_results can store top 10 (from final standings).
insert into public.races (season, round, name, race_start_utc, qualifying_end_utc)
values
  (2023, 1, '2023 Season', '2023-11-26 17:00:00+00', '2023-11-25 18:00:00+00'),
  (2024, 1, '2024 Season', '2024-12-08 17:00:00+00', '2024-12-07 18:00:00+00'),
  (2025, 1, '2025 Season', '2025-12-07 17:00:00+00', '2025-12-06 18:00:00+00')
on conflict (season, round) do nothing;

-- Top 10 drivers from final standings per season (for Points Finish / leaderboard use).
insert into public.race_results (race_id, top10_driver_names)
select r.id, coalesce(
  (
    select jsonb_agg((elem->>'driver') order by (elem->>'position')::int)
    from public.season_standings s,
         jsonb_array_elements(s.standings) elem
    where s.season = r.season and s.championship_type = 'drivers'
      and (elem->>'position')::int <= 10
  ),
  '[]'::jsonb
)
from public.races r
where r.season in (2023, 2024, 2025)
  and not exists (select 1 from public.race_results rr where rr.race_id = r.id);
