import type { DriverPrediction, ConstructorPrediction, DriverStanding, ConstructorStanding } from '../types';

// Name normalization for drivers
function normalizeDriver(name: string): string {
  // Only last names are used in predictions and standings
  // Add mapping for common variations if needed
  const map: Record<string, string> = {
    'Hulkenberg': 'Hulkenberg',
    'Hülkenberg': 'Hulkenberg',
    // Add more as needed
  };
  return map[name] || name;
}

// Constructor name normalization for flexible matching
function normalizeConstructor(name: string): string {
  const map: Record<string, string> = {
    'Haas': 'Haas F1 Team',
    'Alpine': 'Alpine F1 Team',
    'RB F1 Team': 'RB F1 Team',
    'Racing Bulls': 'RB F1 Team',
    'Stake F1 Team': 'Sauber',
    'Sauber': 'Sauber',
    'Red Bull Racing': 'Red Bull', // Map "Red Bull Racing" to "Red Bull" for API matching
    'Red Bull': 'Red Bull',
    // Add more mappings as needed
  };
  return map[name] || name;
}

function getLastName(name: string) {
  return name.split(' ').slice(-1)[0];
}

// Calculate how close a driver prediction is to actual position (lower score = better)
export function calculateDriverPredictionScore(
  prediction: DriverPrediction,
  actualStandings: DriverStanding[]
): number {
  let totalScore = 0;
  
  prediction.predictions.forEach((predictedDriver, predictedPosition) => {
    // Looser matching: check if the actual driver's full name includes the predicted name
    const actualDriver = actualStandings.find(d => 
      d.driver.toLowerCase().includes(predictedDriver.toLowerCase())
    );
    if (actualDriver) {
      const positionDifference = Math.abs(actualDriver.position - (predictedPosition + 1));
      totalScore += positionDifference;
    } else {
      // Handle missing driver - assign worst possible score
      totalScore += actualStandings.length;
      // Driver not found - this is expected for some edge cases
    }
  });
  
  return totalScore;
}

// Calculate how close a constructor prediction is to actual position (lower score = better)
export function calculateConstructorPredictionScore(
  prediction: ConstructorPrediction,
  actualStandings: ConstructorStanding[]
): number {
  let totalScore = 0;
  
  prediction.predictions.forEach((predictedConstructor, predictedPosition) => {
    // Use normalized constructor names for better matching
    const normalizedPredicted = normalizeConstructor(predictedConstructor);
    const actualConstructor = actualStandings.find(c => {
      const actualLower = c.constructor.toLowerCase();
      const predictedLower = predictedConstructor.toLowerCase();
      const normalizedLower = normalizedPredicted.toLowerCase();
      // Try multiple matching strategies
      return actualLower === normalizedLower ||
             actualLower === predictedLower ||
             actualLower.includes(normalizedLower) ||
             normalizedLower.includes(actualLower) ||
             actualLower.includes(predictedLower) ||
             predictedLower.includes(actualLower);
    });
    if (actualConstructor) {
      const positionDifference = Math.abs(actualConstructor.position - (predictedPosition + 1));
      totalScore += positionDifference;
    } else {
      // Constructor not found - this is expected for some edge cases
      totalScore += actualStandings.length;
    }
  });
  
  return totalScore;
}

// Calculate number of correct driver predictions (higher score = better)
export function calculateDriverCorrectGuesses(
  prediction: DriverPrediction,
  actualStandings: DriverStanding[]
): number {
  let correctGuesses = 0;
  
  prediction.predictions.forEach((predictedDriver, predictedPosition) => {
    const actualDriver = actualStandings.find(d => 
      d.driver.toLowerCase().includes(predictedDriver.toLowerCase())
    );
    if (actualDriver && actualDriver.position === (predictedPosition + 1)) {
      correctGuesses += 1;
    }
  });
  
  return correctGuesses;
}

// Calculate number of correct constructor predictions (higher score = better)
export function calculateConstructorCorrectGuesses(
  prediction: ConstructorPrediction,
  actualStandings: ConstructorStanding[]
): number {
  let correctGuesses = 0;
  
  prediction.predictions.forEach((predictedConstructor, predictedPosition) => {
    // Use normalized constructor names for better matching
    const normalizedPredicted = normalizeConstructor(predictedConstructor);
    const actualConstructor = actualStandings.find(c => {
      const actualLower = c.constructor.toLowerCase();
      const predictedLower = predictedConstructor.toLowerCase();
      const normalizedLower = normalizedPredicted.toLowerCase();
      // Try multiple matching strategies
      return actualLower === normalizedLower ||
             actualLower === predictedLower ||
             actualLower.includes(normalizedLower) ||
             normalizedLower.includes(actualLower) ||
             actualLower.includes(predictedLower) ||
             predictedLower.includes(actualLower);
    });
    if (actualConstructor && actualConstructor.position === (predictedPosition + 1)) {
      correctGuesses += 1;
    }
  });
  
  return correctGuesses;
}

// Get driver prediction details for display
export function getDriverPredictionDetails(
  prediction: DriverPrediction,
  actualStandings: DriverStanding[]
) {
  return prediction.predictions.map((predictedDriver, index) => {
    const normalizedPredicted = normalizeDriver(getLastName(predictedDriver));
    const actualDriver = actualStandings.find(d => normalizeDriver(getLastName(d.driver)) === normalizedPredicted);
    const predictedPosition = index + 1;
    
    return {
      driver: predictedDriver,
      predictedPosition,
      actualPosition: actualDriver?.position || 0,
      actualPoints: actualDriver?.points || 0,
      constructor: actualDriver?.constructor || 'Unknown',
      isCorrect: actualDriver?.position === predictedPosition,
      positionDifference: actualDriver ? Math.abs(actualDriver.position - predictedPosition) : 0
    };
  });
}

// Get constructor prediction details for display
export function getConstructorPredictionDetails(
  prediction: ConstructorPrediction,
  actualStandings: ConstructorStanding[]
) {
  return prediction.predictions.map((predictedConstructor, index) => {
    // Use normalized constructor names for better matching
    const normalizedPredicted = normalizeConstructor(predictedConstructor);
    const actualConstructor = actualStandings.find(c => {
      const actualLower = c.constructor.toLowerCase();
      const predictedLower = predictedConstructor.toLowerCase();
      const normalizedLower = normalizedPredicted.toLowerCase();
      // Try multiple matching strategies
      return actualLower === normalizedLower ||
             actualLower === predictedLower ||
             actualLower.includes(normalizedLower) ||
             normalizedLower.includes(actualLower) ||
             actualLower.includes(predictedLower) ||
             predictedLower.includes(actualLower);
    });
    const predictedPosition = index + 1;
    
    return {
      constructor: predictedConstructor,
      predictedPosition,
      actualPosition: actualConstructor?.position || 0,
      actualPoints: actualConstructor?.points || 0,
      isCorrect: actualConstructor?.position === predictedPosition,
      positionDifference: actualConstructor ? Math.abs(actualConstructor.position - predictedPosition) : 0
    };
  });
} 