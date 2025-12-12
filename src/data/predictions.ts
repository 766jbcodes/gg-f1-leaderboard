/**
 * Predictions data for the current season
 * This file contains the predictions made by participants
 */

import type { DriverPrediction, ConstructorPrediction, Participant } from '../types';

export const participants: Participant[] = [
  { id: 'emma', name: 'Emma' },
  { id: 'jeremy', name: 'Jeremy' },
  { id: 'laura', name: 'Laura' },
  { id: 'jacob', name: 'Jacob' },
];

export const driverPredictions: DriverPrediction[] = [
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

export const constructorPredictions: ConstructorPrediction[] = [
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

