import type { DriverStanding, ConstructorStanding } from '../types';

// Current Drivers Championship Standings (as of the data provided)
export const currentDriverStandings: DriverStanding[] = [
  { position: 1, driver: 'Norris', constructor: 'McLaren', points: 44 },
  { position: 2, driver: 'Verstappen', constructor: 'Red Bull', points: 36 },
  { position: 3, driver: 'Russell', constructor: 'Mercedes', points: 35 },
  { position: 4, driver: 'Piastri', constructor: 'McLaren', points: 34 },
  { position: 5, driver: 'Antonelli', constructor: 'Mercedes', points: 22 },
  { position: 6, driver: 'Albon', constructor: 'Williams', points: 16 },
  { position: 7, driver: 'Ocon', constructor: 'Alpine', points: 10 },
  { position: 8, driver: 'Stroll', constructor: 'Aston Martin', points: 10 },
  { position: 9, driver: 'Hamilton', constructor: 'Mercedes', points: 9 },
  { position: 10, driver: 'Leclerc', constructor: 'Ferrari', points: 8 },
  { position: 11, driver: 'Hülkenberg', constructor: 'Sauber', points: 6 },
  { position: 12, driver: 'Bearman', constructor: 'Ferrari', points: 4 },
  { position: 13, driver: 'Tsunoda', constructor: 'Racing Bulls', points: 3 },
  { position: 14, driver: 'Sainz', constructor: 'Ferrari', points: 1 },
  { position: 15, driver: 'Hadjar', constructor: 'Racing Bulls', points: 0 },
  { position: 16, driver: 'Gasly', constructor: 'Alpine', points: 0 },
  { position: 17, driver: 'Lawson', constructor: 'Racing Bulls', points: 0 },
  { position: 18, driver: 'Doohan', constructor: 'Alpine', points: 0 },
  { position: 19, driver: 'Bortoleto', constructor: 'Williams', points: 0 },
  { position: 20, driver: 'Alonso', constructor: 'Aston Martin', points: 0 }
];

// Current Constructors Championship Standings (as of the data provided)
export const currentConstructorStandings: ConstructorStanding[] = [
  { position: 1, constructor: 'McLaren', points: 78 },
  { position: 2, constructor: 'Mercedes', points: 57 },
  { position: 3, constructor: 'Red Bull', points: 36 },
  { position: 4, constructor: 'Ferrari', points: 17 },
  { position: 5, constructor: 'Williams', points: 17 },
  { position: 6, constructor: 'Haas', points: 14 },
  { position: 7, constructor: 'Aston Martin', points: 10 },
  { position: 8, constructor: 'Sauber', points: 6 },
  { position: 9, constructor: 'Racing Bulls', points: 3 },
  { position: 10, constructor: 'Alpine', points: 0 }
]; 