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

- **Supabase cron:** Enable `pg_cron`, then create a cron job that calls the function.
- **External cron:** Use Netlify Scheduled Functions, Vercel Cron, or system cron to POST to the function’s invoke URL with the required Authorization header.
- **Manual:** Supabase Dashboard → Edge Functions → send-race-reminders → Invoke.

### Behaviour

1. Finds races where `race_start_utc` is between 24h and 26h from now and `reminder_sent_at` is null.
2. Lists auth users and sends each an email with a link to Points Finish and login.
3. Sets `reminder_sent_at` on those races so they are not reminded again.
