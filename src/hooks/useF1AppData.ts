import { useQuery } from '@tanstack/react-query';
import { fetch2026SeasonData } from '../services/supabasePredictions';
import type { ChampionshipType } from '../types/common';

export function useF1AppData(championshipType: ChampionshipType) {
  return useQuery({
    queryKey: ['f1-app-data', championshipType],
    queryFn: () => fetch2026SeasonData(championshipType),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
} 