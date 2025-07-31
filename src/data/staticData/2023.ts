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
      'Verstappen', 'Hamilton', 'Norris', 'Piastri', 'Leclerc', 'Russell', 'Sainz', 'Lawson', 'Antonelli', 'Albon',
      'Gasly', 'Ocon', 'Alonso', 'Doohan', 'Tsunoda', 'Hadjar', 'Bearman', 'Stroll', 'Hulkenberg', 'Bortoleto'
    ]
  },
  {
    participantId: 'jeremy',
    predictions: [
      'Piastri', 'Verstappen', 'Norris', 'Leclerc', 'Hamilton', 'Russell', 'Lawson', 'Antonelli', 'Gasly', 'Albon',
      'Sainz', 'Tsunoda', 'Ocon', 'Alonso', 'Doohan', 'Hadjar', 'Bearman', 'Stroll', 'Hulkenberg', 'Bortoleto'
    ]
  },
  {
    participantId: 'laura',
    predictions: [
      'Verstappen', 'Norris', 'Piastri', 'Leclerc', 'Hamilton', 'Russell', 'Lawson', 'Antonelli', 'Alonso', 'Sainz',
      'Albon', 'Gasly', 'Stroll', 'Hulkenberg', 'Bearman', 'Tsunoda', 'Ocon', 'Bortoleto', 'Hadjar', 'Doohan'
    ]
  },
  {
    participantId: 'jacob',
    predictions: [
      'Norris', 'Verstappen', 'Piastri', 'Leclerc', 'Hamilton', 'Russell', 'Lawson', 'Antonelli', 'Alonso', 'Sainz',
      'Albon', 'Gasly', 'Stroll', 'Hulkenberg', 'Bearman', 'Tsunoda', 'Ocon', 'Bortoleto', 'Hadjar', 'Doohan'
    ]
  }
];

const constructorPredictions: ConstructorPrediction[] = [
  {
    participantId: 'emma',
    predictions: [
      'Mclaren', 'Ferrari', 'Redbull', 'Mercedes', 'Williams', 'Alpine', 'Haas', 'RB', 'Aston Martin', 'Sauber'
    ]
  },
  {
    participantId: 'jeremy',
    predictions: [
      'Mclaren', 'Ferrari', 'Redbull', 'Mercedes', 'Alpine', 'Williams', 'RB', 'Haas', 'Aston Martin', 'Sauber'
    ]
  },
  {
    participantId: 'laura',
    predictions: [
      'Mclaren', 'Ferrari', 'Redbull', 'Mercedes', 'Aston Martin', 'Williams', 'Haas', 'Alpine', 'RB', 'Sauber'
    ]
  },
  {
    participantId: 'jacob',
    predictions: [
      'Mclaren', 'Ferrari', 'Mercedes', 'Redbull', 'Aston Martin', 'Williams', 'Haas', 'RB', 'Alpine', 'Sauber'
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