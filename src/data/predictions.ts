import type { Participant, ConstructorPrediction, DriverPrediction } from '../types';

// Participants
export const participants: Participant[] = [
  { id: 'emma', name: 'Emma' },
  { id: 'jeremy', name: 'Jeremy' },
  { id: 'laura', name: 'Laura' },
  { id: 'jacob', name: 'Jacob' },
];

// Drivers Championship Predictions
export const driverPredictions: DriverPrediction[] = [
  {
    participantId: 'emma',
    predictions: [
      'Verstappen', 'Hamilton', 'Norris', 'Piastri', 'Leclerc', 'Russell', 'Sainz', 'Lawson', 'Antonelli', 'Albon',
      'Gasly', 'Ocon', 'Alonso', 'Doohan', 'Tsunoda', 'Hadjar', 'Bearman', 'Stroll', 'Hülkenberg', 'Bortoleto'
    ]
  },
  {
    participantId: 'jeremy',
    predictions: [
      'Piastri', 'Verstappen', 'Norris', 'Leclerc', 'Hamilton', 'Russell', 'Lawson', 'Antonelli', 'Gasly', 'Albon',
      'Sainz', 'Tsunoda', 'Ocon', 'Alonso', 'Doohan', 'Hadjar', 'Bearman', 'Stroll', 'Hülkenberg', 'Bortoleto'
    ]
  },
  {
    participantId: 'laura',
    predictions: [
      'Verstappen', 'Norris', 'Piastri', 'Leclerc', 'Hamilton', 'Russell', 'Lawson', 'Antonelli', 'Alonso', 'Sainz',
      'Albon', 'Gasly', 'Stroll', 'Hülkenberg', 'Bearman', 'Tsunoda', 'Ocon', 'Bortoleto', 'Hadjar', 'Doohan'
    ]
  },
  {
    participantId: 'jacob',
    predictions: [
      'Norris', 'Verstappen', 'Piastri', 'Leclerc', 'Hamilton', 'Russell', 'Lawson', 'Antonelli', 'Alonso', 'Sainz',
      'Albon', 'Gasly', 'Stroll', 'Hülkenberg', 'Bearman', 'Tsunoda', 'Ocon', 'Bortoleto', 'Hadjar', 'Doohan'
    ]
  }
];

// Constructors Championship Predictions
export const constructorPredictions: ConstructorPrediction[] = [
  {
    participantId: 'emma',
    predictions: [
      'McLaren', 'Ferrari', 'Red Bull', 'Mercedes', 'Williams', 'Alpine', 'Haas', 'RB F1 Team', 'Aston Martin', 'Sauber'
    ]
  },
  {
    participantId: 'jeremy',
    predictions: [
      'McLaren', 'Ferrari', 'Red Bull', 'Mercedes', 'Alpine', 'Williams', 'RB F1 Team', 'Haas', 'Aston Martin', 'Sauber'
    ]
  },
  {
    participantId: 'laura',
    predictions: [
      'McLaren', 'Ferrari', 'Red Bull', 'Mercedes', 'Aston Martin', 'Williams', 'Haas', 'Alpine', 'RB F1 Team', 'Sauber'
    ]
  },
  {
    participantId: 'jacob',
    predictions: [
      'McLaren', 'Ferrari', 'Mercedes', 'Red Bull', 'Aston Martin', 'Williams', 'Haas', 'RB F1 Team', 'Alpine', 'Sauber'
    ]
  }
]; 