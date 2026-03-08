import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface UserWeeklyPrediction {
  userId: string;
  displayName: string;
  top10: string[];
}

export function useAllWeeklyPredictions(raceId: string | null) {
  return useQuery({
    queryKey: ['all-weekly-predictions', raceId],
    enabled: !!raceId,
    queryFn: async (): Promise<UserWeeklyPrediction[]> => {
      const { data: predictions, error: predErr } = await supabase
        .from('weekly_predictions')
        .select('user_id, top10_driver_names')
        .eq('race_id', raceId!);

      if (predErr) throw predErr;

      const userIds = (predictions ?? []).map((p) => p.user_id);
      if (userIds.length === 0) return [];

      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);

      if (profErr) throw profErr;

      const nameByUserId = new Map(
        (profiles ?? []).map((p) => [p.id, p.display_name ?? p.id.slice(0, 8)])
      );

      return (predictions ?? []).map((p) => ({
        userId: p.user_id,
        displayName: nameByUserId.get(p.user_id) ?? p.user_id.slice(0, 8),
        top10: (p.top10_driver_names as string[]) ?? [],
      })).sort((a, b) => a.displayName.localeCompare(b.displayName));
    },
  });
}
