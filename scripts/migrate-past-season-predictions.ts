/**
 * One-off migration: copy 2023, 2024, 2025 season predictions from static data into Supabase.
 * Requires profiles to have participant_id set (emma, jeremy, laura, jacob).
 * Run with: npm run migrate:predictions
 * Loads .env from project root. Needs VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();
import { data2023 } from '../src/data/staticData/2023';
import { data2024 } from '../src/data/staticData/2024';
import { data2025 } from '../src/data/staticData/2025';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Set VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

const PAST_SEASONS = [
  { season: 2023, data: data2023 },
  { season: 2024, data: data2024 },
  { season: 2025, data: data2025 },
] as const;

async function main() {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, participant_id')
    .in('participant_id', ['emma', 'jeremy', 'laura', 'jacob']);

  if (profilesError) {
    console.error('Profiles error:', profilesError.message);
    process.exit(1);
  }

  if (!profiles?.length) {
    console.log('No profiles with participant_id in (emma, jeremy, laura, jacob). Set participant_id on profiles first.');
    process.exit(0);
  }

  for (const { season, data } of PAST_SEASONS) {
    const driverPreds = data.predictions.drivers;
    const constructorPreds = data.predictions.constructors;

    for (const row of profiles) {
      const participantId = row.participant_id!;
      const userId = row.id;

      if (driverPreds.length > 0) {
        const pred = driverPreds.find((p) => p.participantId === participantId);
        if (pred) {
          const { error } = await supabase.from('season_predictions').upsert(
            {
              user_id: userId,
              season,
              championship_type: 'drivers',
              predictions: pred.predictions,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,season,championship_type' }
          );
          if (error) console.error(`Season ${season} drivers ${participantId}:`, error.message);
          else console.log(`OK ${season} drivers ${participantId}`);
        }
      }

      if (constructorPreds.length > 0) {
        const pred = constructorPreds.find((p) => p.participantId === participantId);
        if (pred) {
          const { error } = await supabase.from('season_predictions').upsert(
            {
              user_id: userId,
              season,
              championship_type: 'constructors',
              predictions: pred.predictions,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,season,championship_type' }
          );
          if (error) console.error(`Season ${season} constructors ${participantId}:`, error.message);
          else console.log(`OK ${season} constructors ${participantId}`);
        }
      }
    }
  }

  console.log('Done.');
}

main();
