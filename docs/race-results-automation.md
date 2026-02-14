# Automating race results with the Ergast API

**On login:** When any user logs in, the app calls the **ensure-race-results** Edge Function once. That function checks whether the latest completed race already has a row in `race_results`. If not, it fetches from Ergast and inserts. It uses a sync-state flag (`app_sync_state`) so that if another user triggered the same job in the last 2 minutes, the call is skipped and no duplicate API request is made.

**Manual / scheduled:** You can still run **fetch-race-results** on a schedule or manually to backfill any past races; **ensure-race-results** only runs when invoked by the client on login.

---

# Automating race results with the Ergast API (detail)

Points Finish scoring needs the **actual top 10 finishers** per race in the `race_results` table. You can fill that manually in Supabase, or automate it using the same Ergast API the app already uses.

## How it fits together

- **Ergast** exposes race results at:  
  `GET https://ergast.com/api/f1/{season}/{round}/results.json`  
  (or your primary base URL, e.g. `https://api.jolpi.ca/ergast/f1`.)
- The response has `MRData.RaceTable.Races[0].Results[]`, each with `position` and `Driver.familyName`.
- Your **races** table has `season`, `round`, and `id` (UUID).
- **race_results** has `race_id` (→ races.id) and `top10_driver_names` (JSONB array of strings).

So automation can:

1. Find races that have already happened (`race_start_utc` &lt; now) and don’t yet have a row in `race_results`.
2. For each such race, call Ergast `/{season}/{round}/results.json`.
3. Take the first 10 results (by position), collect `Driver.familyName`.
4. Insert (or upsert) into `race_results` with that `race_id` and `top10_driver_names`.

That gives you the same “actual top 10” the Points Finish leaderboard expects, with no manual data entry.

## Important details

- **Which result to use**  
  Use the **main race** result. For sprint weekends, Ergast has both; the main grand prix is the one that counts for “points finish” (top 10). The standard `results.json` endpoint returns the main race results.
- **Ergast update delay**  
  Results usually appear a few hours after the race. Running the job once per day (e.g. after 22:00 UTC on race days) is enough; no need to poll every minute.
- **Name matching**  
  Ergast uses `Driver.familyName` (e.g. "Verstappen"). Your weekly predictions store driver names the same way, so scoring “correct if in top 10” works without extra normalisation. If you later add nickname or alternate-spelling handling, do it in one place (e.g. when computing the score).
- **Sprints**  
  If you ever want to score sprint results separately, you’d use a different endpoint (e.g. sprint results if/when available) and possibly an extra column or table; the current schema and this flow are for the main race only.

## Implementation options

1. **Edge Function (recommended)**  
   A Supabase Edge Function (e.g. `fetch-race-results`) that:
   - Uses the service role client to query `races` and insert into `race_results`.
   - Calls Ergast (or your proxy) from the server.
   - Is invoked on a schedule (e.g. daily via cron or Netlify/Vercel cron calling the function URL).  
   Same pattern as the reminder emails: no front-end code, one scheduled job, and you can still trigger it manually from the Supabase dashboard for testing.

2. **Netlify / Vercel scheduled function**  
   A serverless function that runs on a schedule, calls Ergast, and then uses the Supabase client (with service role key) to insert into `race_results`. Same logic as the Edge Function, different host and cron setup.

3. **Manual backfill**  
   Keep the Edge Function (or a small script) and run it by hand after each race weekend (e.g. “Run” in Supabase → Edge Functions → `fetch-race-results`). No cron needed; you just click once the results are available.

An Edge Function **fetch-race-results** is in `supabase/functions/fetch-race-results/`. It:

- Selects races where `race_start_utc` is in the past and no `race_results` row exists.
- For each, fetches `{ERGAST_BASE_URL}/{season}/{round}/results.json` (default: `https://ergast.com/api/f1`).
- Parses the top 10 finishers by `position` and inserts into `race_results` with `top10_driver_names`.

**Secrets:** `ERGAST_BASE_URL` (optional) — e.g. `https://api.jolpi.ca/ergast/f1` if you use that instead of Ergast.

**Run:** Deploy with `supabase functions deploy fetch-race-results`, then either schedule it (e.g. daily) or invoke it manually from the Supabase dashboard after each race weekend.
