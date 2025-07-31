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

const driverPredictions: DriverPrediction[] = [
  {
    participantId: 'emma',
    predictions: [
      'Verstappen', 'Leclerc', 'Hamilton', 'Norris', 'Perez', 'Russell', 'Sainz', 'Piastri', 'Alonso', 'Albon',
      'Stroll', 'Tsunoda', 'Ricciardo', 'Gasly', 'Ocon', 'Magnussen', 'Bottas', 'Hulkenberg', 'Zhou', 'Sargeant'
    ]
  },
  {
    participantId: 'jeremy',
    predictions: [
      'Verstappen', 'Hamilton', 'Perez', 'Leclerc', 'Norris', 'Russell', 'Sainz', 'Alonso', 'Piastri', 'Ricciardo',
      'Tsunoda', 'Stroll', 'Gasly', 'Albon', 'Ocon', 'Bottas', 'Sargeant', 'Hulkenberg', 'Zhou', 'Magnussen'
    ]
  },
  {
    participantId: 'laura',
    predictions: [
      'Verstappen', 'Leclerc', 'Perez', 'Norris', 'Alonso', 'Piastri', 'Russell', 'Hamilton', 'Sainz', 'Stroll',
      'Tsunoda', 'Gasly', 'Ocon', 'Albon', 'Ricciardo', 'Zhou', 'Magnussen', 'Hulkenberg', 'Sargeant', 'Magnussen'
    ]
  },
  {
    participantId: 'jacob',
    predictions: [
      'Verstappen', 'Perez', 'Leclerc', 'Norris', 'Hamilton', 'Sainz', 'Piastri', 'Alonso', 'Russell', 'Ricciardo',
      'Stroll', 'Tsunoda', 'Gasly', 'Ocon', 'Albon', 'Bottas', 'Hulkenberg', 'Zhou', 'Sargeant', 'Magnussen'
    ]
  }
];

// No constructor predictions for 2024
const constructorPredictions: ConstructorPrediction[] = [];

const driverStandings: DriverStanding[] = [
  { position: 1, driver: 'Verstappen', constructor: 'Red Bull Racing', points: 437 },
  { position: 2, driver: 'Perez', constructor: 'Red Bull Racing', points: 285 },
  { position: 3, driver: 'Leclerc', constructor: 'Ferrari', points: 308 },
  { position: 4, driver: 'Russell', constructor: 'Mercedes', points: 274 },
  { position: 5, driver: 'Norris', constructor: 'McLaren', points: 287 },
  { position: 6, driver: 'Hamilton', constructor: 'Mercedes', points: 234 },
  { position: 7, driver: 'Piastri', constructor: 'McLaren', points: 205 },
  { position: 8, driver: 'Sainz', constructor: 'Ferrari', points: 200 },
  { position: 9, driver: 'Alonso', constructor: 'Aston Martin', points: 206 },
  { position: 10, driver: 'Stroll', constructor: 'Aston Martin', points: 74 },
  { position: 11, driver: 'Gasly', constructor: 'Alpine', points: 62 },
  { position: 12, driver: 'Ocon', constructor: 'Alpine', points: 58 },
  { position: 13, driver: 'Albon', constructor: 'Williams', points: 27 },
  { position: 14, driver: 'Tsunoda', constructor: 'RB', points: 17 },
  { position: 15, driver: 'Bottas', constructor: 'Stake F1 Team', points: 10 },
  { position: 16, driver: 'Hulkenberg', constructor: 'Haas F1 Team', points: 9 },
  { position: 17, driver: 'Ricciardo', constructor: 'RB', points: 6 },
  { position: 18, driver: 'Zhou', constructor: 'Stake F1 Team', points: 6 },
  { position: 19, driver: 'Magnussen', constructor: 'Haas F1 Team', points: 3 },
  { position: 20, driver: 'Lawson', constructor: 'RB', points: 2 },
  { position: 21, driver: 'Sargeant', constructor: 'Williams', points: 1 },
  { position: 22, driver: 'de Vries', constructor: 'RB', points: 0 }
];

const constructorStandings: ConstructorStanding[] = [
  { position: 1, constructor: 'Red Bull Racing', points: 860 },
  { position: 2, constructor: 'Ferrari', points: 508 },
  { position: 3, constructor: 'McLaren', points: 492 },
  { position: 4, constructor: 'Mercedes', points: 508 },
  { position: 5, constructor: 'Aston Martin', points: 280 },
  { position: 6, constructor: 'Alpine', points: 120 },
  { position: 7, constructor: 'Williams', points: 28 },
  { position: 8, constructor: 'RB', points: 25 },
  { position: 9, constructor: 'Stake F1 Team', points: 16 },
  { position: 10, constructor: 'Haas F1 Team', points: 12 }
];

export const data2024 = {
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