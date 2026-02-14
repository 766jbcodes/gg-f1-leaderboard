// Returns race-results sync status for the admin panel.
// Uses service role to read app_sync_state (RLS blocks anon/authenticated).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SYNC_KEY = 'race_results_backfill';

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: syncRow, error: syncErr } = await supabase
      .from('app_sync_state')
      .select('last_started_at, last_completed_at')
      .eq('key', SYNC_KEY)
      .single();

    if (syncErr) {
      return new Response(
        JSON.stringify({ error: syncErr.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { count, error: countErr } = await supabase
      .from('race_results')
      .select('*', { count: 'exact', head: true });

    return new Response(
      JSON.stringify({
        lastStartedAt: syncRow?.last_started_at ?? null,
        lastCompletedAt: syncRow?.last_completed_at ?? null,
        raceResultsCount: countErr ? null : count,
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
