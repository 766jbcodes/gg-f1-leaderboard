/**
 * Type definitions for F1 API responses
 */

export interface ApiDriverStanding {
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

export interface ApiConstructorStanding {
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

export interface ApiResponse<T> {
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

export interface ApiSeasonResponse {
  MRData: {
    StandingsTable: {
      season: string;
    };
  };
}

export interface ApiRaceResponse {
  MRData?: {
    RaceTable?: {
      Races?: Array<{
        raceName: string;
      }>;
    };
  };
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  etag?: string;
}

export interface LocalStorageCache {
  [key: string]: CacheEntry;
}

