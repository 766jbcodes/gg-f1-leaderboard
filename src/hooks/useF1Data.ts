import { useQuery } from '@tanstack/react-query';
import type { SeasonType, ChampionshipType } from '../types/common';
import { fetchCurrentStandings } from '../services/f1Api';
import {
  fetch2026SeasonData,
  fetchPastSeasonData,
  isPastSeason,
} from '../services/supabasePredictions';

export const useF1Data = (season: SeasonType, championshipType: ChampionshipType) => {
  const isCurrentSeason = season === 'current';
  const is2025Season = season === '2025';
  const is2026Season = season === '2026';
  const isPast = isPastSeason(season);

  return useQuery({
    queryKey: ['f1', season, championshipType],
    queryFn: () => {
      if (is2026Season) return fetch2026SeasonData(championshipType);
      if (isPast) return fetchPastSeasonData(season, championshipType);
      return fetchCurrentStandings(championshipType);
    },
    enabled: isCurrentSeason || is2025Season || is2026Season || isPast,
  });
}; 