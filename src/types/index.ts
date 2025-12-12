export type TabType = 'predictions' | 'standings' | 'leaderboard' | 'admin';

export type SeasonType = 'current' | '2023' | '2024' | '2025';

export interface Tab {
  id: TabType;
  label: string;
  icon?: string;
}

export interface SeasonTab {
  id: SeasonType;
  label: string;
  icon?: string;
}

export interface Participant {
  id: string;
  name: string;
}

export interface ConstructorPrediction {
  participantId: string;
  predictions: string[]; // Array of constructor names in predicted order
}

export interface DriverPrediction {
  participantId: string;
  predictions: string[]; // Array of driver names in predicted order
}

export interface ConstructorStanding {
  position: number;
  constructor: string;
  points: number;
}

export interface DriverStanding {
  position: number;
  driver: string;
  constructor: string;
  points: number;
}

/**
 * Response structure from fetchCurrentStandings
 */
export interface F1StandingsResponse {
  standings: DriverStanding[] | ConstructorStanding[];
  predictions: DriverPrediction[] | ConstructorPrediction[];
  participants: Participant[];
} 