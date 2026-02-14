import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { ChampionshipType } from '../types/common';

const SEASON = 2026;

export function useSeasonPredictions2026(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: driverPred, isLoading: loadingDrivers } = useQuery({
    queryKey: ['season-predictions-2026', userId, 'drivers'],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('season_predictions')
        .select('predictions')
        .eq('user_id', userId)
        .eq('season', SEASON)
        .eq('championship_type', 'drivers')
        .maybeSingle();
      if (error) throw error;
      return Array.isArray(data?.predictions) ? (data.predictions as string[]) : null;
    },
    enabled: Boolean(userId),
  });

  const { data: constructorPred, isLoading: loadingConstructors } = useQuery({
    queryKey: ['season-predictions-2026', userId, 'constructors'],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('season_predictions')
        .select('predictions')
        .eq('user_id', userId)
        .eq('season', SEASON)
        .eq('championship_type', 'constructors')
        .maybeSingle();
      if (error) throw error;
      return Array.isArray(data?.predictions) ? (data.predictions as string[]) : null;
    },
    enabled: Boolean(userId),
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      championshipType,
      predictions,
    }: {
      championshipType: ChampionshipType;
      predictions: string[];
    }) => {
      if (!userId) throw new Error('Not logged in');
      const { error } = await supabase.from('season_predictions').upsert(
        {
          user_id: userId,
          season: SEASON,
          championship_type: championshipType,
          predictions,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,season,championship_type' }
      );
      if (error) throw error;
    },
    onSuccess: (_, { championshipType }) => {
      queryClient.invalidateQueries({
        queryKey: ['season-predictions-2026', userId, championshipType],
      });
      queryClient.invalidateQueries({ queryKey: ['f1', '2026'] });
    },
  });

  return {
    driverPredictions: driverPred ?? null,
    constructorPredictions: constructorPred ?? null,
    isLoading: loadingDrivers || loadingConstructors,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
  };
}
