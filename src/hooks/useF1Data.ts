import { useQuery } from '@tanstack/react-query';
import type { SeasonType, ChampionshipType } from '../types/common';
import { data2023 } from '../data/staticData/2023';
import { data2024 } from '../data/staticData/2024';
import { data2025 } from '../data/staticData/2025';
import { fetchCurrentStandings } from '../services/f1Api';
import { fetch2026SeasonData } from '../services/supabasePredictions';

const STATIC_DATA: Record<string, typeof data2023> = {
  '2023': data2023,
  '2024': data2024,
  '2025': data2025,
  'current': data2025, // Use 2025 data for current season
};

export const useF1Data = (season: SeasonType, championshipType: ChampionshipType) => {
  const isCurrentSeason = season === 'current';
  const is2025Season = season === '2025';
  const is2026Season = season === '2026';

  const liveQueryResult = useQuery({
    queryKey: ['f1', season, championshipType],
    queryFn: () =>
      is2026Season ? fetch2026SeasonData(championshipType) : fetchCurrentStandings(championshipType),
    enabled: isCurrentSeason || is2025Season || is2026Season,
  });

  if (isCurrentSeason || is2025Season || is2026Season) {
    return liveQueryResult;
  }

  const staticData = STATIC_DATA[season];

  if (!staticData) {
    return {
      data: undefined,
      isLoading: false,
      error: new Error(`No data available for season ${season}`),
    };
  }

  return {
    data: {
      standings: staticData.standings[championshipType],
      predictions: staticData.predictions[championshipType],
      participants: staticData.participants,
    },
    isLoading: false,
    error: null,
  };
}; 