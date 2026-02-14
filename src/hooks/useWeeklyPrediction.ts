import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useWeeklyPrediction(raceId: string | null, userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: prediction, isLoading, error } = useQuery({
    queryKey: ['weekly-prediction', raceId, userId],
    queryFn: async () => {
      if (!raceId || !userId) return null;
      const { data, error: e } = await supabase
        .from('weekly_predictions')
        .select('id, top10_driver_names, updated_at')
        .eq('race_id', raceId)
        .eq('user_id', userId)
        .maybeSingle();
      if (e) throw e;
      return data;
    },
    enabled: Boolean(raceId && userId),
  });

  const mutation = useMutation({
    mutationFn: async (top10: string[]) => {
      if (!raceId || !userId) throw new Error('Missing race or user');
      if (top10.length !== 10) throw new Error('Exactly 10 drivers required');
      const { error } = await supabase.from('weekly_predictions').upsert(
        {
          user_id: userId,
          race_id: raceId,
          top10_driver_names: top10,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,race_id' }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-prediction', raceId, userId] });
      queryClient.invalidateQueries({ queryKey: ['weekly-leaderboard'] });
    },
  });

  return {
    prediction: prediction?.top10_driver_names ?? null,
    updatedAt: prediction?.updated_at ?? null,
    isLoading,
    error,
    save: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
}
