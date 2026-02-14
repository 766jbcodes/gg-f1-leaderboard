// Supabase Edge Function: send reminder emails ~24h before each race.
// Schedule via Supabase cron or external cron POST to the function URL.
// Secrets: MAILGUN_API_KEY, MAILGUN_DOMAIN; optionally FROM_EMAIL, APP_URL.
// For EU region use MAILGUN_EU=true (uses api.eu.mailgun.net).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const HOURS_AHEAD = 24;
const WINDOW_HOURS = 2;

interface RaceRow {
  id: string;
  name: string;
  race_start_utc: string;
}

async function sendMailgun(
  apiKey: string,
  domain: string,
  from: string,
  to: string,
  subject: string,
  html: string,
  eu: boolean
): Promise<boolean> {
  const base = eu ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net';
  const url = `${base}/v3/${domain}/messages`;
  const body = new FormData();
  body.set('from', from);
  body.set('to', to);
  body.set('subject', subject);
  body.set('html', html);
  const auth = btoa(`api:${apiKey}`);
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}` },
    body,
  });
  return res.ok;
}

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const mailgunKey = Deno.env.get('MAILGUN_API_KEY');
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
    const fromEmail = Deno.env.get('FROM_EMAIL') ?? `Gunther's Groupies <mailgun@${mailgunDomain ?? 'localhost'}>`;
    const appUrl = Deno.env.get('APP_URL') ?? 'https://localhost:5173';
    const mailgunEu = Deno.env.get('MAILGUN_EU') === 'true';

    if (!mailgunKey || !mailgunDomain) {
      return new Response(
        JSON.stringify({ error: 'MAILGUN_API_KEY and MAILGUN_DOMAIN must be set' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const now = new Date();
    const start = new Date(now.getTime() + HOURS_AHEAD * 60 * 60 * 1000);
    const end = new Date(start.getTime() + WINDOW_HOURS * 60 * 60 * 1000);

    const { data: races, error: racesError } = await supabase
      .from('races')
      .select('id, name, race_start_utc')
      .is('reminder_sent_at', null)
      .gte('race_start_utc', start.toISOString())
      .lte('race_start_utc', end.toISOString());

    if (racesError) {
      return new Response(
        JSON.stringify({ error: racesError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!races?.length) {
      return new Response(
        JSON.stringify({ message: 'No races due for reminder', count: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const users = usersData?.users ?? [];
    const emails = users.map((u) => u.email).filter(Boolean) as string[];

    const loginUrl = `${appUrl}/login`;
    const pointsFinishUrl = `${appUrl}/points-finish`;
    const sent: string[] = [];

    for (const race of races as RaceRow[]) {
      const raceTime = new Date(race.race_start_utc).toLocaleString('en-AU', {
        dateStyle: 'full',
        timeStyle: 'short',
      });

      const subject = `Points Finish reminder: ${race.name}`;
      const html = `
        <p>Hi,</p>
        <p>Just a reminder: <strong>${race.name}</strong> is coming up (${raceTime}).</p>
        <p>Submit your top 10 prediction before the deadline:</p>
        <p><a href="${pointsFinishUrl}">Open Points Finish</a></p>
        <p>If you need to log in first: <a href="${loginUrl}">Log in with magic link</a></p>
        <p>— Gunther's Groupies F1</p>
      `;

      for (const to of emails) {
        const ok = await sendMailgun(
          mailgunKey,
          mailgunDomain,
          fromEmail,
          to,
          subject,
          html,
          mailgunEu
        );
        if (ok) sent.push(to);
      }

      await supabase
        .from('races')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', race.id);
    }

    return new Response(
      JSON.stringify({
        message: 'Reminders sent',
        races: races.length,
        emailsSent: sent.length,
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
