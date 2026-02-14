// Invoked when a user logs in (or loads the app while logged in).
// Ensures the most recent completed race has results in race_results.
// Uses app_sync_state to avoid duplicate API calls: if a sync started recently
// and hasn't completed, we skip. Secret: ERGAST_BASE_URL (optional).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DEFAULT_ERGAST = 'https://ergast.com/api/f1';
const SYNC_KEY = 'race_results_backfill';
const IN_PROGRESS_WINDOW_MS = 2 * 60 * 1000; // 2 minutes

interface ErgastResult {
  position: string;
  Driver: { familyName: string; givenName: string };
}

interface ErgastResponse {
  MRData?: {
    RaceTable?: {
      Races?: Array<{ Results?: ErgastResult[] }>;
    };
  };
}

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ergastBase = Deno.env.get('ERGAST_BASE_URL') ?? DEFAULT_ERGAST;

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const now = new Date();
    const nowIso = now.toISOString();

    const { data: syncRow, error: syncReadErr } = await supabase
      .from('app_sync_state')
      .select('last_started_at, last_completed_at')
      .eq('key', SYNC_KEY)
      .single();

    if (!syncReadErr && syncRow?.last_started_at) {
      const started = new Date(syncRow.last_started_at).getTime();
      const completed = syncRow.last_completed_at
        ? new Date(syncRow.last_completed_at).getTime()
        : 0;
      if (now.getTime() - started < IN_PROGRESS_WINDOW_MS && completed <= started) {
        return new Response(
          JSON.stringify({ status: 'skipped', reason: 'sync_in_progress' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const { data: racesWithoutResult, error: racesError } = await supabase
      .from('races')
      .select('id, season, round, name')
      .lt('race_start_utc', nowIso)
      .order('race_start_utc', { ascending: false });

    if (racesError) {
      return new Response(
        JSON.stringify({ error: racesError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: existing } = await supabase
      .from('race_results')
      .select('race_id');

    const existingIds = new Set((existing ?? []).map((r: { race_id: string }) => r.race_id));
    const toFetch = (racesWithoutResult ?? []).filter(
      (r: { id: string }) => !existingIds.has(r.id)
    );

    if (toFetch.length === 0) {
      return new Response(
        JSON.stringify({ status: 'ok', reason: 'up_to_date', inserted: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await supabase.from('app_sync_state').upsert(
      {
        key: SYNC_KEY,
        last_started_at: nowIso,
        last_completed_at: null,
        updated_at: nowIso,
      },
      { onConflict: 'key' }
    );

    const inserted: string[] = [];

    for (const race of toFetch) {
      const url = `${ergastBase}/${race.season}/${race.round}/results.json`;
      const res = await fetch(url);
      if (!res.ok) continue;

      const json = (await res.json()) as ErgastResponse;
      const results = json.MRData?.RaceTable?.Races?.[0]?.Results;
      if (!results?.length) continue;

      const top10 = results
        .slice(0, 10)
        .map((r) => r.Driver?.familyName)
        .filter(Boolean) as string[];

      if (top10.length === 0) continue;

      const { error: insertErr } = await supabase.from('race_results').insert({
        race_id: race.id,
        top10_driver_names: top10,
      });

      if (!insertErr) {
        inserted.push(race.name);
      }
    }

    await supabase
      .from('app_sync_state')
      .update({
        last_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('key', SYNC_KEY);

    return new Response(
      JSON.stringify({
        status: 'ok',
        reason: 'backfill_done',
        inserted: inserted.length,
        races: inserted,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
