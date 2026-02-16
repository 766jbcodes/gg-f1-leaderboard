import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useNextRace } from './useRaces';

const SEASON_2026 = 2026;
const DRIVER_SLOTS = 22;
const CONSTRUCTOR_SLOTS = 11;

export interface OnboardingChecklistState {
  driversChampionshipDone: boolean;
  constructorsChampionshipDone: boolean;
  weeklyPointsFinishDone: boolean;
  /** Only present when there is an upcoming race to predict */
  nextRaceName: string | null;
}

export function useOnboardingChecklist(userId: string | undefined) {
  const { nextRace, isLoading: racesLoading } = useNextRace();

  const { data, isLoading } = useQuery({
    queryKey: ['onboarding-checklist', userId, nextRace?.id],
    queryFn: async (): Promise<OnboardingChecklistState> => {
      if (!userId) {
        return {
          driversChampionshipDone: false,
          constructorsChampionshipDone: false,
          weeklyPointsFinishDone: true,
          nextRaceName: null,
        };
      }

      const [seasonRes, weeklyRes] = await Promise.all([
        supabase
          .from('season_predictions')
          .select('championship_type, predictions')
          .eq('user_id', userId)
          .eq('season', SEASON_2026)
          .in('championship_type', ['drivers', 'constructors']),
        nextRace?.id
          ? supabase
              .from('weekly_predictions')
              .select('top10_driver_names')
              .eq('user_id', userId)
              .eq('race_id', nextRace.id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (seasonRes.error) throw seasonRes.error;

      const driversRow = (seasonRes.data ?? []).find((r) => r.championship_type === 'drivers');
      const constructorsRow = (seasonRes.data ?? []).find((r) => r.championship_type === 'constructors');

      const driversChampionshipDone =
        Array.isArray(driversRow?.predictions) && driversRow.predictions.length >= DRIVER_SLOTS;
      const constructorsChampionshipDone =
        Array.isArray(constructorsRow?.predictions) && constructorsRow.predictions.length >= CONSTRUCTOR_SLOTS;

      let weeklyPointsFinishDone = true;
      if (nextRace?.id) {
        if (weeklyRes.error) {
          weeklyPointsFinishDone = false;
        } else if (weeklyRes.data) {
          const names = (weeklyRes.data as { top10_driver_names?: string[] }).top10_driver_names;
          weeklyPointsFinishDone = Array.isArray(names) && names.length === 10;
        } else {
          weeklyPointsFinishDone = false; // no row yet
        }
      }

      return {
        driversChampionshipDone,
        constructorsChampionshipDone,
        weeklyPointsFinishDone,
        nextRaceName: nextRace?.name ?? null,
      };
    },
    enabled: Boolean(userId) && !racesLoading,
  });

  const checklist: OnboardingChecklistState | null = data ?? null;

  return {
    checklist,
    isLoading: racesLoading || isLoading,
    hasIncompleteTasks: checklist
      ? !checklist.driversChampionshipDone ||
        !checklist.constructorsChampionshipDone ||
        !checklist.weeklyPointsFinishDone
      : false,
  };
}
