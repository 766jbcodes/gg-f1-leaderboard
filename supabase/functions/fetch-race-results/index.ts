// Supabase Edge Function: backfill race_results from Ergast API.
// Run on a schedule (e.g. daily) or manually after each race.
// Finds races that have already happened and have no race_results row, fetches
// top 10 finishers from Ergast, inserts into race_results.
// Secret: ERGAST_BASE_URL (optional, default https://ergast.com/api/f1).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DEFAULT_ERGAST = 'https://ergast.com/api/f1';

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

    const now = new Date().toISOString();

    const { data: racesWithoutResult, error: racesError } = await supabase
      .from('races')
      .select('id, season, round, name')
      .lt('race_start_utc', now)
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

    const existingIds = new Set((existing ?? []).map((r) => r.race_id));
    const toFetch = (racesWithoutResult ?? []).filter((r) => !existingIds.has(r.id));

    if (toFetch.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No races to backfill', count: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

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

    return new Response(
      JSON.stringify({
        message: 'Race results backfill complete',
        fetched: toFetch.length,
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
