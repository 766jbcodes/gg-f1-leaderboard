import { useState, useEffect, useCallback } from 'react';
import type { DriverStanding, ConstructorStanding, SeasonType } from '../types';
import { f1ApiService } from '../services/f1Api';
import { data2023 } from '../data/staticData/2023';
import { data2024 } from '../data/staticData/2024';

interface StandingsState {
  driverStandings: DriverStanding[];
  constructorStandings: ConstructorStanding[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isLive: boolean;
  cacheInfo: { memoryEntries: number; localStorageSize: number };
}

export function useStandings(season: SeasonType = 'current') {
  const [state, setState] = useState<StandingsState>({
    driverStandings: [],
    constructorStandings: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    isLive: false,
    cacheInfo: { memoryEntries: 0, localStorageSize: 0 }
  });

  const fetchStandings = useCallback(async (forceRefresh = false) => {
    if (season === '2023') {
      setState(prev => ({
        ...prev,
        driverStandings: data2023.standings.drivers,
        constructorStandings: data2023.standings.constructors,
        isLoading: false,
        error: null,
        lastUpdated: null,
        isLive: false,
        cacheInfo: { memoryEntries: 0, localStorageSize: 0 }
      }));
      return;
    } else if (season === '2024') {
      setState(prev => ({
        ...prev,
        driverStandings: data2024.standings.drivers,
        constructorStandings: data2024.standings.constructors,
        isLoading: false,
        error: null,
        lastUpdated: null,
        isLive: false,
        cacheInfo: { memoryEntries: 0, localStorageSize: 0 }
      }));
      return;
    }

    if (forceRefresh) {
      f1ApiService.clearCache();
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [driverStandings, constructorStandings] = await Promise.all([
        f1ApiService.getCurrentDriverStandings(),
        f1ApiService.getCurrentConstructorStandings()
      ]);

      setState(prev => ({
        ...prev,
        driverStandings,
        constructorStandings,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
        isLive: true,
        cacheInfo: f1ApiService.getCacheInfo()
      }));
    } catch (error) {
      // Error is handled in state, no need to log here as it's already logged in the service
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch live standings. Using cached data.',
        isLive: false,
        cacheInfo: f1ApiService.getCacheInfo()
      }));
    }
  }, [season]);

  const refreshStandings = useCallback(() => {
    fetchStandings(true);
  }, [fetchStandings]);

  const startBackgroundRefresh = useCallback(() => {
    if (season === 'current') {
      f1ApiService.startBackgroundRefresh(5); // Refresh every 5 minutes
    }
  }, [season]);

  const stopBackgroundRefresh = useCallback(() => {
    if (season === 'current') {
      f1ApiService.stopBackgroundRefresh();
    }
  }, [season]);

  useEffect(() => {
    fetchStandings();
    if (season === 'current') {
      startBackgroundRefresh();
      return () => {
        stopBackgroundRefresh();
      };
    }
    // For static seasons, no background refresh needed
    return undefined;
  }, [fetchStandings, startBackgroundRefresh, stopBackgroundRefresh, season]);

  return {
    ...state,
    refreshStandings,
    startBackgroundRefresh,
    stopBackgroundRefresh
  };
} 