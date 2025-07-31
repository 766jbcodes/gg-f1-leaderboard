import { useQuery } from '@tanstack/react-query';
import { fetchCurrentStandings } from '../services/f1Api';
import type { ChampionshipType } from '../types/common';

export function useF1AppData(championshipType: ChampionshipType) {
  // Fetch all app data for the current season and championship type
  return useQuery({
    queryKey: ['f1-app-data', championshipType],
    queryFn: () => fetchCurrentStandings(championshipType),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
} 