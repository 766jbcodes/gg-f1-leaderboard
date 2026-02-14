import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface WeeklyScore {
  userId: string;
  displayName: string;
  raceId: string;
  raceName: string;
  round: number;
  score: number;
  totalRaces: number;
}

export interface AggregateScore {
  userId: string;
  displayName: string;
  totalCorrect: number;
  racesScored: number;
}

/** One point per exact position match (predicted P1 vs actual P1, etc.). Order matters. */
function scorePrediction(predicted: string[], actual: string[]): number {
  let score = 0;
  const len = Math.min(predicted.length, actual.length, 10);
  for (let i = 0; i < len; i++) {
    if (predicted[i].trim().toLowerCase() === actual[i].trim().toLowerCase()) {
      score += 1;
    }
  }
  return score;
}

export function useWeeklyLeaderboard(season: number = 2026) {
  return useQuery({
    queryKey: ['weekly-leaderboard', season],
    queryFn: async (): Promise<{ perRace: WeeklyScore[]; aggregate: AggregateScore[] }> => {
      const { data: races, error: racesErr } = await supabase
        .from('races')
        .select('id, name, round')
        .eq('season', season)
        .order('round');

      if (racesErr) throw racesErr;

      const { data: results, error: resultsErr } = await supabase
        .from('race_results')
        .select('race_id, top10_driver_names')
        .in('race_id', (races ?? []).map((r) => r.id));

      if (resultsErr) throw resultsErr;

      const resultsByRace = new Map(
        (results ?? []).map((r) => [r.race_id, (r.top10_driver_names as string[]) ?? []])
      );

      const { data: predictions, error: predErr } = await supabase
        .from('weekly_predictions')
        .select('user_id, race_id, top10_driver_names')
        .in('race_id', (races ?? []).map((r) => r.id));

      if (predErr) throw predErr;

      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, display_name');

      if (profErr) throw profErr;

      const nameByUserId = new Map(
        (profiles ?? []).map((p) => [p.id, p.display_name ?? p.id.slice(0, 8)])
      );
      const raceById = new Map((races ?? []).map((r) => [r.id, r]));

      const perRace: WeeklyScore[] = [];
      const aggregateByUser = new Map<string, { totalCorrect: number; racesScored: number }>();

      for (const wp of predictions ?? []) {
        const actual = resultsByRace.get(wp.race_id);
        if (!actual?.length) continue;

        const predicted = (wp.top10_driver_names as string[]) ?? [];
        const score = scorePrediction(predicted, actual);
        const race = raceById.get(wp.race_id);

        perRace.push({
          userId: wp.user_id,
          displayName: nameByUserId.get(wp.user_id) ?? wp.user_id.slice(0, 8),
          raceId: wp.race_id,
          raceName: race?.name ?? '',
          round: race?.round ?? 0,
          score,
          totalRaces: 1,
        });

        const agg = aggregateByUser.get(wp.user_id) ?? { totalCorrect: 0, racesScored: 0 };
        agg.totalCorrect += score;
        agg.racesScored += 1;
        aggregateByUser.set(wp.user_id, agg);
      }

      const aggregate: AggregateScore[] = Array.from(aggregateByUser.entries()).map(
        ([userId, agg]) => ({
          userId,
          displayName: nameByUserId.get(userId) ?? userId.slice(0, 8),
          totalCorrect: agg.totalCorrect,
          racesScored: agg.racesScored,
        })
      );

      aggregate.sort((a, b) => b.totalCorrect - a.totalCorrect);

      return { perRace, aggregate };
    },
  });
}
