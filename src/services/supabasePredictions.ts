import { supabase } from '../lib/supabase';
import type { ChampionshipType } from '../types/common';
import type { Participant, DriverPrediction, ConstructorPrediction } from '../types';
import type { DriverStanding, ConstructorStanding } from '../types';
import { f1ApiService } from './f1Api';
import { logger } from '../utils/logger';

const SEASON_2026 = 2026;

const PAST_SEASONS = [2023, 2024, 2025] as const;
export type PastSeason = (typeof PAST_SEASONS)[number];
export type PastSeasonString = '2023' | '2024' | '2025';

export function isPastSeason(season: string): season is PastSeasonString {
  const n = Number(season);
  return PAST_SEASONS.includes(n as PastSeason);
}

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

/**
 * Fetch past season (2023, 2024, 2025) data from Supabase: standings, predictions, participants.
 * Same shape as fetch2026SeasonData for use in dashboards.
 */
export async function fetchPastSeasonData(
  season: PastSeasonString | number,
  championshipType: ChampionshipType
): Promise<{
  standings: DriverStanding[] | ConstructorStanding[];
  predictions: DriverPrediction[] | ConstructorPrediction[];
  participants: Participant[];
}> {
  const seasonNum = (typeof season === 'string' ? Number(season) : season) as PastSeason;
  const [standings, { predictions, participants }] = await Promise.all([
    fetchSeasonStandings(seasonNum, championshipType),
    fetchPastPredictionsAndParticipants(seasonNum, championshipType),
  ]);

  return {
    standings,
    predictions,
    participants,
  };
}

async function fetchSeasonStandings(
  season: PastSeason | PastSeasonString,
  championshipType: ChampionshipType
): Promise<DriverStanding[] | ConstructorStanding[]> {
  const seasonNum = typeof season === 'string' ? Number(season) : season;
  const { data, error } = await supabase
    .from('season_standings')
    .select('standings')
    .eq('season', seasonNum)
    .eq('championship_type', championshipType)
    .maybeSingle();

  if (error) {
    logger.error('Supabase season_standings error:', error.message);
    throw new Error(error.message);
  }

  const raw = Array.isArray(data?.standings) ? data.standings : [];
  return raw as DriverStanding[] | ConstructorStanding[];
}

/**
 * Fetch both driver and constructor standings for a past season (for useStandings).
 */
export async function fetchSeasonStandingsBoth(
  season: PastSeason | PastSeasonString
): Promise<{ drivers: DriverStanding[]; constructors: ConstructorStanding[] }> {
  const seasonNum = (typeof season === 'string' ? Number(season) : season) as PastSeason;
  const { data, error } = await supabase
    .from('season_standings')
    .select('championship_type, standings')
    .eq('season', seasonNum);

  if (error) {
    logger.error('Supabase season_standings error:', error.message);
    throw new Error(error.message);
  }

  const drivers =
    (data?.find((r) => r.championship_type === 'drivers')?.standings as DriverStanding[]) ?? [];
  const constructors =
    (data?.find((r) => r.championship_type === 'constructors')?.standings as ConstructorStanding[]) ??
    [];
  return { drivers, constructors };
}

async function fetchPastPredictionsAndParticipants(
  season: PastSeason | PastSeasonString,
  championshipType: ChampionshipType
): Promise<{
  predictions: DriverPrediction[] | ConstructorPrediction[];
  participants: Participant[];
}> {
  const seasonNum = typeof season === 'string' ? Number(season) : season;
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
    .eq('season', seasonNum)
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
