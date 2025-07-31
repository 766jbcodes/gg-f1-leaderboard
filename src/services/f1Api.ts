import type { DriverStanding, ConstructorStanding } from '../types';
import type { ChampionshipType } from "../types/common";
import { participants, driverPredictions, constructorPredictions } from "../data/predictions";

const API_BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const FALLBACK_API_URL = 'https://ergast.com/api/f1'; // Official Ergast API as fallback
const STORAGE_KEY = 'f1_standings_cache';
const THROTTLE_DELAY = 1000; // 1 second between requests

interface ApiDriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  Constructors: Array<{
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  }>;
}

interface ApiConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  };
}

interface ApiResponse<T> {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    StandingsTable: {
      season: string;
      StandingsLists: Array<{
        season: string;
        round: string;
        DriverStandings?: T[];
        ConstructorStandings?: T[];
      }>;
    };
  };
}

interface CacheEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  timestamp: number;
  etag?: string;
}

interface LocalStorageCache {
  [key: string]: CacheEntry;
}

export class F1ApiService {
  private static instance: F1ApiService;
  private memoryCache: Map<string, CacheEntry> = new Map();
  private lastRequestTime: number = 0;
  private backgroundRefreshInterval: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly LOCAL_STORAGE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): F1ApiService {
    if (!F1ApiService.instance) {
      F1ApiService.instance = new F1ApiService();
    }
    return F1ApiService.instance;
  }

  private getLocalStorageCache(): LocalStorageCache {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return {};
    }
  }

  private setLocalStorageCache(cache: LocalStorageCache): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  }

  private async throttleRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < THROTTLE_DELAY) {
      await new Promise(resolve => 
        setTimeout(resolve, THROTTLE_DELAY - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  private async fetchWithEnhancedCache<T>(url: string, cacheKey: string): Promise<T> {
    const now = Date.now();
    
    // Check memory cache first
    const memoryCached = this.memoryCache.get(cacheKey);
    if (memoryCached && (now - memoryCached.timestamp) < this.CACHE_DURATION) {
      return memoryCached.data;
    }

    // Check localStorage cache
    const localCache = this.getLocalStorageCache();
    const localCached = localCache[cacheKey];
    if (localCached && (now - localCached.timestamp) < this.LOCAL_STORAGE_DURATION) {
      // Return cached data immediately for offline experience
      this.memoryCache.set(cacheKey, localCached);
      
      // Try to refresh in background if cache is stale
      if ((now - localCached.timestamp) > this.CACHE_DURATION) {
        this.refreshInBackground(url, cacheKey);
      }
      
      return localCached.data;
    }

    // Fetch fresh data
    await this.throttleRequest();
    
    // Try primary API first, then fallback
    const urlsToTry = [url];
    if (url.includes(API_BASE_URL)) {
      const fallbackUrl = url.replace(API_BASE_URL, FALLBACK_API_URL);
      urlsToTry.push(fallbackUrl);
    }
    
    for (const tryUrl of urlsToTry) {
      try {
        console.log(`Attempting to fetch from: ${tryUrl}`);
        const response = await fetch(tryUrl, {
          headers: localCached?.etag ? { 'If-None-Match': localCached.etag } : {}
        });
        
        if (response.status === 304) {
          // Not modified, use cached data
          const cachedData = localCached || memoryCached;
          if (cachedData) {
            this.memoryCache.set(cacheKey, cachedData);
            return cachedData.data;
          }
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const etag = response.headers.get('etag');
        
        const cacheEntry: CacheEntry = {
          data,
          timestamp: now,
          etag: etag || undefined
        };
        
        // Update both caches
        this.memoryCache.set(cacheKey, cacheEntry);
        localCache[cacheKey] = cacheEntry;
        this.setLocalStorageCache(localCache);
        
        console.log(`Successfully fetched from: ${tryUrl}`);
        return data;
      } catch (error) {
        console.error(`Failed to fetch from ${tryUrl}:`, error);
        console.error('Error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // If this was the last URL to try, throw the error
        if (tryUrl === urlsToTry[urlsToTry.length - 1]) {
          // Return cached data if available, even if stale
          const fallbackData = localCached || memoryCached;
          if (fallbackData) {
            console.log('Using cached data due to fetch error');
            return fallbackData.data;
          }
          
          throw error;
        }
        // Otherwise, continue to the next URL
      }
    }
    
    // This should never be reached, but just in case
    throw new Error('All API endpoints failed');
  }

  private async refreshInBackground(url: string, cacheKey: string): Promise<void> {
    try {
      await this.throttleRequest();
      
      // Try primary API first, then fallback
      const urlsToTry = [url];
      if (url.includes(API_BASE_URL)) {
        const fallbackUrl = url.replace(API_BASE_URL, FALLBACK_API_URL);
        urlsToTry.push(fallbackUrl);
      }
      
      for (const tryUrl of urlsToTry) {
        try {
          const response = await fetch(tryUrl);
          
          if (response.ok) {
            const data = await response.json();
            const etag = response.headers.get('etag');
            
            const cacheEntry: CacheEntry = {
              data,
              timestamp: Date.now(),
              etag: etag || undefined
            };
            
            // Update caches silently
            this.memoryCache.set(cacheKey, cacheEntry);
            const localCache = this.getLocalStorageCache();
            localCache[cacheKey] = cacheEntry;
            this.setLocalStorageCache(localCache);
            
            console.log('Background refresh completed for:', cacheKey, 'from:', tryUrl);
            return;
          }
        } catch (error) {
          console.warn(`Background refresh failed for ${tryUrl}:`, error);
          // Continue to next URL if available
        }
      }
      
      console.warn('Background refresh failed for all endpoints:', cacheKey);
    } catch (error) {
      console.warn('Background refresh failed:', error);
    }
  }

  startBackgroundRefresh(intervalMinutes: number = 5): void {
    if (this.backgroundRefreshInterval) {
      clearInterval(this.backgroundRefreshInterval);
    }
    
    this.backgroundRefreshInterval = setInterval(() => {
      console.log('Performing background refresh...');
      this.refreshAllDataInBackground();
    }, intervalMinutes * 60 * 1000);
  }

  stopBackgroundRefresh(): void {
    if (this.backgroundRefreshInterval) {
      clearInterval(this.backgroundRefreshInterval);
      this.backgroundRefreshInterval = null;
    }
  }

  private async refreshAllDataInBackground(): Promise<void> {
    const promises = [
      this.refreshInBackground(`${API_BASE_URL}/current/driverStandings.json`, 'driver_standings'),
      this.refreshInBackground(`${API_BASE_URL}/current/constructorStandings.json`, 'constructor_standings'),
      this.refreshInBackground(`${API_BASE_URL}/current.json`, 'current_season')
    ];
    
    await Promise.allSettled(promises);
  }

  async getCurrentDriverStandings(): Promise<DriverStanding[]> {
    try {
      const response: ApiResponse<ApiDriverStanding> = await this.fetchWithEnhancedCache(
        `${API_BASE_URL}/current/driverStandings.json`,
        'driver_standings'
      );
      
      const standingsList = response.MRData.StandingsTable.StandingsLists[0];
      if (!standingsList?.DriverStandings) {
        throw new Error('No driver standings data available');
      }

      return standingsList.DriverStandings.map(standing => ({
        position: parseInt(standing.position),
        driver: standing.Driver.familyName,
        constructor: standing.Constructors[0]?.name || 'Unknown',
        points: parseInt(standing.points)
      }));
    } catch (error) {
      console.error('Failed to fetch driver standings:', error);
      throw error;
    }
  }

  async getCurrentConstructorStandings(): Promise<ConstructorStanding[]> {
    try {
      const response: ApiResponse<ApiConstructorStanding> = await this.fetchWithEnhancedCache(
        `${API_BASE_URL}/current/constructorStandings.json`,
        'constructor_standings'
      );
      
      const standingsList = response.MRData.StandingsTable.StandingsLists[0];
      if (!standingsList?.ConstructorStandings) {
        throw new Error('No constructor standings data available');
      }

      return standingsList.ConstructorStandings.map(standing => ({
        position: parseInt(standing.position),
        constructor: standing.Constructor.name,
        points: parseInt(standing.points)
      }));
    } catch (error) {
      console.error('Failed to fetch constructor standings:', error);
      throw error;
    }
  }

  async getCurrentSeason(): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await this.fetchWithEnhancedCache(
        `${API_BASE_URL}/current.json`,
        'current_season'
      );
      return response.MRData.StandingsTable.season;
    } catch (error) {
      console.error('Failed to fetch current season:', error);
      return '2025'; // Fallback
    }
  }

  async getLatestRace(): Promise<{ name: string; type: 'race' | 'sprint' } | null> {
    try {
      const response = await this.fetchWithEnhancedCache<{
        MRData?: {
          RaceTable?: {
            Races?: Array<{
              raceName: string;
            }>;
          };
        };
      }>(
        `${API_BASE_URL}/current/last/results.json`,
        'latest_race'
      );
      
      if (response.MRData?.RaceTable?.Races?.[0]) {
        const race = response.MRData.RaceTable.Races[0];
        const raceName = race.raceName;
        const isSprint = raceName.toLowerCase().includes('sprint');
        
        return {
          name: raceName,
          type: isSprint ? 'sprint' : 'race'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get latest race:', error);
      return null;
    }
  }

  clearCache(): void {
    this.memoryCache.clear();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  getCacheInfo(): { memoryEntries: number; localStorageSize: number } {
    const localCache = this.getLocalStorageCache();
    return {
      memoryEntries: this.memoryCache.size,
      localStorageSize: Object.keys(localCache).length
    };
  }
}

export const f1ApiService = F1ApiService.getInstance();

// A simple in-memory cache
const cache = new Map<string, unknown>();

async function fetchWithFallback(url: string) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${url}`);
    if (!response.ok) throw new Error('Primary API failed');
    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch {
    console.warn('Primary API failed, trying fallback...');
    const response = await fetch(`${FALLBACK_API_URL}/${url}`);
    if (!response.ok) throw new Error('Fallback API also failed');
    const data = await response.json();
    cache.set(url, data);
    return data;
  }
}

export const fetchCurrentStandings = async (championshipType: ChampionshipType) => {
  const endpoint = championshipType === 'drivers' 
    ? 'current/driverStandings.json' 
    : 'current/constructorStandings.json';
  
  const data = await fetchWithFallback(endpoint);

  const standingsTable = data.MRData.StandingsTable.StandingsLists[0];
  
  let standings: (DriverStanding | ConstructorStanding)[];

  if (championshipType === 'drivers') {
    standings = standingsTable.DriverStandings.map((s: ApiDriverStanding): DriverStanding => ({
      position: parseInt(s.position),
      driver: `${s.Driver.givenName} ${s.Driver.familyName}`,
      constructor: s.Constructors[0].name,
      points: parseInt(s.points),
    }));
  } else {
    standings = standingsTable.ConstructorStandings.map((s: ApiConstructorStanding): ConstructorStanding => ({
      position: parseInt(s.position),
      constructor: s.Constructor.name,
      points: parseInt(s.points),
    }));
  }

  // Use the real predictions for the current season
  const predictions = championshipType === 'drivers' 
    ? driverPredictions
    : constructorPredictions;

  return {
    standings,
    predictions,
    participants,
  };
}; 