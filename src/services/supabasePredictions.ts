import { supabase } from '../lib/supabase';
import type { ChampionshipType } from '../types/common';
import type { Participant, DriverPrediction, ConstructorPrediction } from '../types';
import type { DriverStanding, ConstructorStanding } from '../types';
import { f1ApiService } from './f1Api';
import { logger } from '../utils/logger';

const SEASON_2026 = 2026;

/**
 * Fetch 2026 season data: standings from Ergast API, predictions and participants from Supabase.
 * Returns same shape as fetchCurrentStandings for use in leaderboard/UI.
 */
export async function fetch2026SeasonData(championshipType: ChampionshipType): Promise<{
  standings: DriverStanding[] | ConstructorStanding[];
  predictions: DriverPrediction[] | ConstructorPrediction[];
  participants: Participant[];
}> {
  const [standings, { predictions, participants }] = await Promise.all([
    championshipType === 'drivers'
      ? f1ApiService.getCurrentDriverStandings()
      : f1ApiService.getCurrentConstructorStandings(),
    fetch2026PredictionsAndParticipants(championshipType),
  ]);

  return {
    standings,
    predictions,
    participants,
  };
}

async function fetch2026PredictionsAndParticipants(
  championshipType: ChampionshipType
): Promise<{
  predictions: DriverPrediction[] | ConstructorPrediction[];
  participants: Participant[];
}> {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .order('display_name');

  if (profilesError) {
    logger.error('Supabase profiles error:', profilesError.message);
    throw new Error(profilesError.message);
  }

  const { data: rows, error: predError } = await supabase
    .from('season_predictions')
    .select('user_id, predictions')
    .eq('season', SEASON_2026)
    .eq('championship_type', championshipType);

  if (predError) {
    logger.error('Supabase season_predictions error:', predError.message);
    throw new Error(predError.message);
  }

  const participants: Participant[] = (profiles ?? []).map((p) => ({
    id: p.id,
    name: p.display_name ?? p.id.slice(0, 8),
  }));

  const predictions: (DriverPrediction | ConstructorPrediction)[] = (rows ?? []).map((r) => ({
    participantId: r.user_id,
    predictions: Array.isArray(r.predictions) ? r.predictions : [],
  }));

  return { predictions, participants };
}
