# Supabase Edge Functions

## ensure-race-results

**Invoked when a user logs in** (client calls it once per session). Ensures the most recent completed race has results in `race_results`; if not, fetches from Ergast and stores them. Uses `app_sync_state` so that if a sync started in the last 2 minutes, other logins skip and don’t trigger duplicate API calls.

- **Secrets:** `ERGAST_BASE_URL` (optional). Default: `https://ergast.com/api/f1`.
- **Deploy:** `supabase functions deploy ensure-race-results`. Leave JWT verification on so only logged-in users can invoke it.

## fetch-race-results

Backfills `race_results` from the Ergast API so the Points Finish leaderboard can score automatically. Finds races that have already happened and have no result row, fetches top 10 finishers, inserts into `race_results`.

- **Secret:** `ERGAST_BASE_URL` (optional). Default: `https://ergast.com/api/f1`. Use your primary API (e.g. Jolpi) if different.
- **Schedule:** Run daily or after each race weekend (manual invoke is fine).
- See [Race results automation](race-results-automation.md) for full detail.

## send-race-reminders

Sends reminder emails about 24 hours before each race. Uses Mailgun for delivery.

### Secrets (Supabase Dashboard → Edge Functions → Secrets)

- `MAILGUN_API_KEY` – required. From Mailgun dashboard → Settings → API Keys (private key).
- `MAILGUN_DOMAIN` – required. Your sending domain (e.g. sandbox or verified domain).
- `FROM_EMAIL` – optional. Must be from your Mailgun domain. Defaults to `mailgun@<MAILGUN_DOMAIN>`.
- `APP_URL` – optional. Frontend URL for login and Points Finish links. Defaults to `https://localhost:5173`.
- `MAILGUN_EU` – optional. Set to `true` if your Mailgun account is in the EU region.

### Scheduling

Run once or twice daily so races in the “next 24h” window get reminders.

- **cron-job.org:** See below.
- **Supabase cron:** Enable `pg_cron` + `pg_net`, store URL and key in Vault, then `cron.schedule()` with `net.http_post()` to the function URL.
- **External cron:** Use Netlify Scheduled Functions, Vercel Cron, or system cron to POST to the function’s invoke URL with the required Authorization header.
- **Manual:** Supabase Dashboard → Edge Functions → send-race-reminders → Invoke.

#### cron-job.org (daily)

1. Log in at [cron-job.org](https://cron-job.org).
2. Create a new cron job.
3. **URL:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-race-reminders`  
   (replace `YOUR_PROJECT_REF` with your Supabase project ref, e.g. `jfjvckiblzbsdlnburju`).
4. **Schedule:** e.g. once daily (e.g. 00:00 or 12:00 UTC). Races are checked for the 24–26h window, so one run per day is enough.
5. **Request method:** POST.
6. **Request headers:** Add one header:
   - **Name:** `Authorization`  
   - **Value:** `Bearer YOUR_ANON_KEY`  
   Use your project's anon (publishable) key from Supabase → Project Settings → API. Do not use the service role key here.
7. **Request body:** Optional. Leave empty or `{}`.
8. Save and enable the job.

### Behaviour

1. Finds races where `race_start_utc` is between 24h and 26h from now and `reminder_sent_at` is null.
2. Lists auth users and sends each an email with a link to Points Finish and login.
3. Sets `reminder_sent_at` on those races so they are not reminded again.

### Test run (send real emails)

To trigger the email path once:

1. **Supabase Dashboard → SQL Editor.** Run this to put a race in the 24–26h window (uses Bahrain 2026):

   ```sql
   update public.races
   set race_start_utc = now() + interval '25 hours', reminder_sent_at = null
   where season = 2026 and round = 1;
   ```

2. **Edge Functions → send-race-reminders → Test.** Send Request (POST, service role).

3. Check inbox(es) for the reminder. Response should be `{ "message": "Reminders sent", "races": 1, "emailsSent": N }`.

4. **(Optional)** Restore the real race time so the row is correct for the season:

   ```sql
   update public.races
   set race_start_utc = '2026-03-01 15:00:00+00'
   where season = 2026 and round = 1;
   ```
