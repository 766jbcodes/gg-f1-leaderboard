-- Allow authenticated users to read all profiles and season_predictions for leaderboard display
drop policy if exists "Authenticated can read all profiles" on public.profiles;
create policy "Authenticated can read all profiles" on public.profiles for select to authenticated using (true);
drop policy if exists "Authenticated can read all season_predictions" on public.season_predictions;
create policy "Authenticated can read all season_predictions" on public.season_predictions for select to authenticated using (true);
