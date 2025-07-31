import { useQuery } from '@tanstack/react-query';
import type { SeasonType, ChampionshipType } from '../types/common';
import { data2023 } from '../data/staticData/2023';
import { data2024 } from '../data/staticData/2024';
import { fetchCurrentStandings } from '../services/f1Api';

const STATIC_DATA: Record<string, typeof data2023> = {
  '2023': data2023,
  '2024': data2024,
};

export const useF1Data = (season: SeasonType, championshipType: ChampionshipType) => {
  const isCurrentSeason = season === 'current';

  const queryResult = useQuery({
    queryKey: ['f1', season, championshipType],
    queryFn: () => fetchCurrentStandings(championshipType),
    enabled: isCurrentSeason,
  });

  if (isCurrentSeason) {
    return queryResult;
  }

  const staticData = STATIC_DATA[season];

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