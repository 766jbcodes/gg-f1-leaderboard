import React, { useState, useMemo } from 'react';
import { participants, driverPredictions, constructorPredictions } from '../data/predictions';
import { 
  calculateDriverPredictionScore, 
  calculateConstructorPredictionScore,
  calculateDriverCorrectGuesses,
  calculateConstructorCorrectGuesses
} from '../utils/calculations';
import { useStandings } from '../hooks/useStandings';

const Leaderboard: React.FC = () => {
  const [scoringMethod, setScoringMethod] = useState<'position-difference' | 'correct-guesses'>('position-difference');
  const [error, setError] = useState<string | null>(null);

  // Use centralized standings data
  const { driverStandings, constructorStandings, error: standingsError } = useStandings();

  const participantScores = useMemo(() => {
    try {
      setError(null);
      
      if (standingsError) {
        throw new Error(`Standings error: ${standingsError}`);
      }

      if (!driverStandings || !constructorStandings || driverStandings.length === 0 || constructorStandings.length === 0) {
        throw new Error('Unable to load current standings data');
      }

      return participants.map(participant => {
        const driverPrediction = driverPredictions.find(p => p.participantId === participant.id);
        const constructorPrediction = constructorPredictions.find(p => p.participantId === participant.id);

        // Use fallback values instead of throwing errors
        const driverScore = driverPrediction 
          ? (scoringMethod === 'position-difference'
              ? calculateDriverPredictionScore(driverPrediction, driverStandings)
              : calculateDriverCorrectGuesses(driverPrediction, driverStandings))
          : 0;

        const constructorScore = constructorPrediction
          ? (scoringMethod === 'position-difference'
              ? calculateConstructorPredictionScore(constructorPrediction, constructorStandings)
              : calculateConstructorCorrectGuesses(constructorPrediction, constructorStandings))
          : 0;

        return {
          participant,
          driverScore,
          constructorScore,
          totalScore: driverScore + constructorScore
        };
      }).sort((a, b) => {
        if (scoringMethod === 'position-difference') {
          return a.totalScore - b.totalScore; // Lower is better
        } else {
          return b.totalScore - a.totalScore; // Higher is better
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to calculate scores: ${errorMessage}`);
      return [];
    }
  }, [scoringMethod, driverStandings, constructorStandings, standingsError]);

  // Filter and search participants
  const filteredScores = useMemo(() => {
    return participantScores;
  }, [participantScores]);



  const getScoreDescription = () => {
    return scoringMethod === 'position-difference' 
      ? 'Lower score is better' 
      : 'Higher score is better';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-red text-4xl mb-4">⚠️</div>
          <p className="text-navy font-bold mb-2">Error Loading Leaderboard</p>
          <p className="text-navy text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scoring Method Toggle - streamlined */}
      <div className="flex flex-col gap-1 mb-6 max-w-md mx-auto">
        <span className="text-xs text-navy font-bold uppercase">Scoring:</span>
        <div className="flex w-full">
          <button
            onClick={() => setScoringMethod('position-difference')}
            className={`flex-1 px-2 py-1 text-xs font-bold rounded-l-md transition-colors border border-lightgrey ${
              scoringMethod === 'position-difference'
                ? 'bg-navy text-white'
                : 'bg-white text-navy hover:bg-white'
            }`}
          >
            Closest Position
          </button>
          <button
            onClick={() => setScoringMethod('correct-guesses')}
            className={`flex-1 px-2 py-1 text-xs font-bold rounded-r-md transition-colors border border-lightgrey border-l-0 ${
              scoringMethod === 'correct-guesses'
                ? 'bg-navy text-white'
                : 'bg-white text-navy hover:bg-white'
            }`}
          >
            Correct Standings
          </button>
        </div>
        <span className="text-xs text-navy font-bold mt-1 ml-4">{getScoreDescription()}</span>
      </div>
      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-xl border-2 border-navy">
            <table 
              className="min-w-full divide-y divide-lightgrey"
              role="table"
              aria-label="F1 Predictions Leaderboard"
            >
              <thead className="bg-navy">
                <tr>
                  <th className="px-2 sm:px-3 py-1 sm:py-2 text-center font-extrabold text-white uppercase tracking-wider">Pos</th>
                  <th className="px-2 sm:px-3 py-1 sm:py-2 text-left font-extrabold text-white uppercase tracking-wider">Participant</th>
                  <th className="px-2 sm:px-3 py-1 sm:py-2 text-center font-extrabold text-white uppercase tracking-wider">Total</th>
                  <th className="px-2 sm:px-3 py-1 sm:py-2 text-center font-extrabold text-white uppercase tracking-wider">Driver</th>
                  <th className="px-2 sm:px-3 py-1 sm:py-2 text-center font-extrabold text-white uppercase tracking-wider">Constructor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-lightgrey">
                {filteredScores.map((score, idx) => (
                  <tr key={score.participant.id} className="hover:bg-silver">
                    <td className="px-2 sm:px-3 py-1 sm:py-2 whitespace-nowrap font-bold text-navy text-center">{idx + 1}</td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 whitespace-nowrap font-bold text-navy">{score.participant.name}</td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 whitespace-nowrap font-bold text-red text-center">{score.totalScore}</td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 whitespace-nowrap text-navy text-center">{score.driverScore}</td>
                    <td className="px-2 sm:px-3 py-1 sm:py-2 whitespace-nowrap text-navy text-center">{score.constructorScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 