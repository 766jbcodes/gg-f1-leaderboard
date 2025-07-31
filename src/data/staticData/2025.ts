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
      'McLaren', 'Ferrari', 'Red Bull Racing', 'Mercedes', 'Williams', 'Alpine F1 Team', 'Haas F1 Team', 'RB F1 Team', 'Aston Martin', 'Sauber'
    ]
  },
  {
    participantId: 'jeremy',
    predictions: [
      'McLaren', 'Ferrari', 'Red Bull Racing', 'Mercedes', 'Alpine F1 Team', 'Williams', 'RB F1 Team', 'Haas F1 Team', 'Aston Martin', 'Sauber'
    ]
  },
  {
    participantId: 'laura',
    predictions: [
      'McLaren', 'Ferrari', 'Red Bull Racing', 'Mercedes', 'Aston Martin', 'Williams', 'Haas F1 Team', 'Alpine F1 Team', 'RB F1 Team', 'Sauber'
    ]
  },
  {
    participantId: 'jacob',
    predictions: [
      'McLaren', 'Ferrari', 'Mercedes', 'Red Bull Racing', 'Aston Martin', 'Williams', 'Haas F1 Team', 'RB F1 Team', 'Alpine F1 Team', 'Sauber'
    ]
  }
];

const driverStandings: DriverStanding[] = [
  { position: 1, driver: 'Norris', constructor: 'McLaren', points: 44 },
  { position: 2, driver: 'Verstappen', constructor: 'Red Bull Racing', points: 36 },
  { position: 3, driver: 'Russell', constructor: 'Mercedes', points: 35 },
  { position: 4, driver: 'Piastri', constructor: 'McLaren', points: 34 },
  { position: 5, driver: 'Antonelli', constructor: 'Mercedes', points: 22 },
  { position: 6, driver: 'Albon', constructor: 'Williams', points: 16 },
  { position: 7, driver: 'Ocon', constructor: 'Alpine F1 Team', points: 10 },
  { position: 8, driver: 'Stroll', constructor: 'Aston Martin', points: 10 },
  { position: 9, driver: 'Hamilton', constructor: 'Mercedes', points: 9 },
  { position: 10, driver: 'Leclerc', constructor: 'Ferrari', points: 8 },
  { position: 11, driver: 'Hulkenberg', constructor: 'Haas F1 Team', points: 6 },
  { position: 12, driver: 'Bearman', constructor: 'Ferrari', points: 4 },
  { position: 13, driver: 'Tsunoda', constructor: 'RB F1 Team', points: 3 },
  { position: 14, driver: 'Sainz', constructor: 'Ferrari', points: 1 },
  { position: 15, driver: 'Hadjar', constructor: 'Alpine F1 Team', points: 0 },
  { position: 16, driver: 'Gasly', constructor: 'Alpine F1 Team', points: 0 },
  { position: 17, driver: 'Lawson', constructor: 'RB F1 Team', points: 0 },
  { position: 18, driver: 'Doohan', constructor: 'Alpine F1 Team', points: 0 },
  { position: 19, driver: 'Bortoleto', constructor: 'Williams', points: 0 },
  { position: 20, driver: 'Alonso', constructor: 'Aston Martin', points: 0 }
];

const constructorStandings: ConstructorStanding[] = [
  { position: 1, constructor: 'McLaren', points: 78 },
  { position: 2, constructor: 'Mercedes', points: 57 },
  { position: 3, constructor: 'Red Bull Racing', points: 36 },
  { position: 4, constructor: 'Ferrari', points: 17 },
  { position: 5, constructor: 'Williams', points: 17 },
  { position: 6, constructor: 'Haas F1 Team', points: 14 },
  { position: 7, constructor: 'Aston Martin', points: 10 },
  { position: 8, constructor: 'Sauber', points: 6 },
  { position: 9, constructor: 'RB F1 Team', points: 3 },
  { position: 10, constructor: 'Alpine F1 Team', points: 0 }
];

export const data2025 = {
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