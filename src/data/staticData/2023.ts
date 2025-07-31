import type {
  DriverStanding,
  ConstructorStanding,
  Participant,
  DriverPrediction,
  ConstructorPrediction,
} from '../../types';

const participants: Participant[] = [
  { id: 'emma', name: 'Emma' },
  { id: 'jeremy', name: 'Jeremy' },
  { id: 'laura', name: 'Laura' },
  { id: 'jacob', name: 'Jacob' },
];

// No driver predictions for 2023
const driverPredictions: DriverPrediction[] = [];

const constructorPredictions: ConstructorPrediction[] = [
  {
    participantId: 'emma',
    predictions: [
      'Red Bull Racing', 'Ferrari', 'Mercedes', 'Aston Martin', 'Alpine F1 Team', 'McLaren', 'Haas F1 Team', 'Alfa Romeo', 'AlphaTauri', 'Williams'
    ]
  },
  {
    participantId: 'jeremy',
    predictions: [
      'Red Bull Racing', 'Mercedes', 'Ferrari', 'Aston Martin', 'Alpine F1 Team', 'Alfa Romeo', 'McLaren', 'Haas F1 Team', 'AlphaTauri', 'Williams'
    ]
  },
  {
    participantId: 'laura',
    predictions: [
      'Red Bull Racing', 'Mercedes', 'Ferrari', 'Alpine F1 Team', 'McLaren', 'Aston Martin', 'Alfa Romeo', 'Haas F1 Team', 'AlphaTauri', 'Williams'
    ]
  },
  {
    participantId: 'jacob',
    predictions: [
      'Red Bull Racing', 'Mercedes', 'Ferrari', 'McLaren', 'Alpine F1 Team', 'Aston Martin', 'Alfa Romeo', 'Haas F1 Team', 'AlphaTauri', 'Williams'
    ]
  }
];

const driverStandings: DriverStanding[] = [
  { position: 1, driver: 'Verstappen', constructor: 'Red Bull Racing', points: 575 },
  { position: 2, driver: 'Pérez', constructor: 'Red Bull Racing', points: 285 },
  { position: 3, driver: 'Hamilton', constructor: 'Mercedes', points: 234 },
  { position: 4, driver: 'Alonso', constructor: 'Aston Martin', points: 206 },
  { position: 5, driver: 'Leclerc', constructor: 'Ferrari', points: 206 },
  { position: 6, driver: 'Norris', constructor: 'McLaren', points: 205 },
  { position: 7, driver: 'Sainz', constructor: 'Ferrari', points: 200 },
  { position: 8, driver: 'Russell', constructor: 'Mercedes', points: 175 },
  { position: 9, driver: 'Piastri', constructor: 'McLaren', points: 97 },
  { position: 10, driver: 'Stroll', constructor: 'Aston Martin', points: 74 },
  { position: 11, driver: 'Gasly', constructor: 'Alpine', points: 62 },
  { position: 12, driver: 'Ocon', constructor: 'Alpine', points: 58 },
  { position: 13, driver: 'Albon', constructor: 'Williams', points: 27 },
  { position: 14, driver: 'Tsunoda', constructor: 'AlphaTauri', points: 17 },
  { position: 15, driver: 'Bottas', constructor: 'Alfa Romeo', points: 10 },
  { position: 16, driver: 'Hülkenberg', constructor: 'Haas F1 Team', points: 9 },
  { position: 17, driver: 'Ricciardo', constructor: 'AlphaTauri', points: 6 },
  { position: 18, driver: 'Zhou', constructor: 'Alfa Romeo', points: 6 },
  { position: 19, driver: 'Magnussen', constructor: 'Haas F1 Team', points: 3 },
  { position: 20, driver: 'Lawson', constructor: 'AlphaTauri', points: 2 },
  { position: 21, driver: 'Sargeant', constructor: 'Williams', points: 1 },
  { position: 22, driver: 'de Vries', constructor: 'AlphaTauri', points: 0 }
];

const constructorStandings: ConstructorStanding[] = [
  { position: 1, constructor: 'Red Bull Racing', points: 860 },
  { position: 2, constructor: 'Mercedes', points: 409 },
  { position: 3, constructor: 'Ferrari', points: 406 },
  { position: 4, constructor: 'McLaren', points: 302 },
  { position: 5, constructor: 'Aston Martin', points: 280 },
  { position: 6, constructor: 'Alpine', points: 120 },
  { position: 7, constructor: 'Williams', points: 28 },
  { position: 8, constructor: 'AlphaTauri', points: 25 },
  { position: 9, constructor: 'Alfa Romeo', points: 16 },
  { position: 10, constructor: 'Haas F1 Team', points: 12 }
];

export const data2023 = {
  participants,
  predictions: {
    drivers: driverPredictions,
    constructors: constructorPredictions,
  },
  standings: {
    drivers: driverStandings,
    constructors: constructorStandings,
  },
}; 