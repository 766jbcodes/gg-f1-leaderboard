import { useQuery } from '@tanstack/react-query';
import type { SeasonType, ChampionshipType } from '../types/common';
import { data2023 } from '../data/staticData/2023';
import { data2024 } from '../data/staticData/2024';
import { data2025 } from '../data/staticData/2025';
import { fetchCurrentStandings } from '../services/f1Api';

const STATIC_DATA: Record<string, typeof data2023> = {
  '2023': data2023,
  '2024': data2024,
  '2025': data2025,
  'current': data2025, // Use 2025 data for current season
};

export const useF1Data = (season: SeasonType, championshipType: ChampionshipType) => {
  const isCurrentSeason = season === 'current';
  // Treat 2025 the same as current - both use live API data since 2025 is the current year
  const is2025Season = season === '2025';

  // For both 'current' and '2025', use live API data
  const queryResult = useQuery({
    queryKey: ['f1', season, championshipType],
    queryFn: () => fetchCurrentStandings(championshipType),
    enabled: isCurrentSeason || is2025Season,
  });

  if (isCurrentSeason || is2025Season) {
    return queryResult;
  }

  // For past seasons (2023, 2024), use static data
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