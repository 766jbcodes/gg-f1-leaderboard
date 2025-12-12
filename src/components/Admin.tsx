import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStandings } from '../hooks/useStandings';
import { useF1Data } from '../hooks/useF1Data';
import { currentDriverStandings, currentConstructorStandings } from '../data/currentStandings';
import { 
  calculateDriverPredictionScore, 
  calculateConstructorPredictionScore,
  calculateDriverCorrectGuesses,
  calculateConstructorCorrectGuesses
} from '../utils/calculations';
import type { Participant, DriverPrediction, ConstructorPrediction, DriverStanding, ConstructorStanding, SeasonType } from '../types';
import { logger } from '../utils/logger';
import { driverPredictions, constructorPredictions } from '../data/predictions';
import { data2023 } from '../data/staticData/2023';
import { data2024 } from '../data/staticData/2024';
import { data2025 } from '../data/staticData/2025';

interface ExportData {
  participants: Participant[];
  driverPredictions: DriverPrediction[];
  constructorPredictions: ConstructorPrediction[];
  currentDriverStandings: DriverStanding[];
  currentConstructorStandings: ConstructorStanding[];
}

interface AdminProps {
  onExit?: () => void;
}

export function Admin({ onExit }: AdminProps = {}) {
  const navigate = useNavigate();
  const { 
    isLoading, 
    error, 
    lastUpdated, 
    isLive, 
    cacheInfo,
    refreshStandings 
  } = useStandings();

  const { data: f1DataDrivers } = useF1Data('current', 'drivers');
  const { data: f1DataConstructors } = useF1Data('current', 'constructors');

  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const getStatusBadge = () => {
    if (isLoading) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-silver text-navy uppercase">
          <span className="w-2 h-2 bg-navy rounded-full mr-1 animate-pulse"></span>
          Loading
        </span>
      );
    }
    if (isLive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red text-white uppercase">
          <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
          Live
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy text-white uppercase">
        <span className="w-2 h-2 bg-red rounded-full mr-1"></span>
        Cached
      </span>
    );
  };

  const exportData = () => {
    const data = {
      participants: f1DataDrivers?.participants || [],
      driverPredictions: f1DataDrivers?.predictions as DriverPrediction[] || driverPredictions,
      constructorPredictions: f1DataConstructors?.predictions as ConstructorPrediction[] || constructorPredictions,
      currentDriverStandings,
      currentConstructorStandings,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    if (exportFormat === 'json') {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `f1-predictions-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // CSV Export
      const csvData = generateCSVData(data);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `f1-predictions-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const generateCSVData = (data: ExportData) => {
    let csv = 'Type,Data\n';
    
    // Participants
    data.participants.forEach((participant, index) => {
      csv += `Participant ${index + 1},${participant.name}\n`;
    });
    
    // Driver Predictions
    data.driverPredictions.forEach((prediction, index) => {
      const participant = data.participants.find(p => p.id === prediction.participantId);
      csv += `Driver Prediction ${index + 1} (${participant?.name || 'Unknown'}),${prediction.predictions.join(', ')}\n`;
    });
    
    // Constructor Predictions
    data.constructorPredictions.forEach((prediction, index) => {
      const participant = data.participants.find(p => p.id === prediction.participantId);
      csv += `Constructor Prediction ${index + 1} (${participant?.name || 'Unknown'}),${prediction.predictions.join(', ')}\n`;
    });
    
    // Current Driver Standings
    data.currentDriverStandings.forEach((standing, index) => {
      csv += `Driver Standing ${index + 1},${standing.driver} - ${standing.constructor} - ${standing.points} points\n`;
    });
    
    // Current Constructor Standings
    data.currentConstructorStandings.forEach((standing, index) => {
      csv += `Constructor Standing ${index + 1},${standing.constructor} - ${standing.points} points\n`;
    });
    
    return csv;
  };

  const calculateAllScores = () => {
    const participants = f1DataDrivers?.participants || [];
    if (!participants.length) return [];
    
    const driverPreds = (f1DataDrivers?.predictions as DriverPrediction[] | undefined) || driverPredictions;
    const constructorPreds = (f1DataConstructors?.predictions as ConstructorPrediction[] | undefined) || constructorPredictions;
    
    const scores = participants.map(participant => {
      const driverPrediction = driverPreds.find((p: DriverPrediction) => p.participantId === participant.id);
      const constructorPrediction = constructorPreds.find((p: ConstructorPrediction) => p.participantId === participant.id);

      const driverPositionScore = driverPrediction 
        ? calculateDriverPredictionScore(driverPrediction, currentDriverStandings)
        : 0;
      const driverCorrectScore = driverPrediction
        ? calculateDriverCorrectGuesses(driverPrediction, currentDriverStandings)
        : 0;
      const constructorPositionScore = constructorPrediction
        ? calculateConstructorPredictionScore(constructorPrediction, currentConstructorStandings)
        : 0;
      const constructorCorrectScore = constructorPrediction
        ? calculateConstructorCorrectGuesses(constructorPrediction, currentConstructorStandings)
        : 0;

      return {
        participant,
        driverPositionScore,
        driverCorrectScore,
        constructorPositionScore,
        constructorCorrectScore,
        totalPositionScore: driverPositionScore + constructorPositionScore,
        totalCorrectScore: driverCorrectScore + constructorCorrectScore
      };
    });

    return scores.sort((a, b) => a.totalPositionScore - b.totalPositionScore);
  };

  const allScores = calculateAllScores();

  // Calculate wins across all seasons and categories
  const winCounts = useMemo(() => {
    console.log('=== Calculating win counts ===');
    
    // Build current season data from fetched data
    // Note: Since 2025 is the current year, both '2025' and 'current' use the same API data
    // We'll use the fetched data for '2025' to avoid double-counting
    const currentData = f1DataDrivers && f1DataConstructors ? {
      participants: f1DataDrivers.participants,
      predictions: {
        drivers: f1DataDrivers.predictions,
        constructors: f1DataConstructors.predictions,
      },
      standings: {
        drivers: f1DataDrivers.standings,
        constructors: f1DataConstructors.standings,
      },
    } : null;
    
    // Use fetched API data for 2025 (same as current), static data for past seasons
    const seasons: Array<{ season: SeasonType; data: typeof data2023 | null }> = [
      { season: '2023', data: data2023 },
      { season: '2024', data: data2024 },
      { season: '2025', data: currentData || data2025 }, // Use API data if available, fallback to static
      // Skip 'current' since it's the same as '2025' - we don't want to double-count
    ].filter(({ data }) => data !== null) as Array<{ season: SeasonType; data: typeof data2023 }>;
    
    console.log('Seasons data:', seasons.map(s => ({ season: s.season, hasData: !!s.data })));

    const categories = [
      { type: 'drivers' as const, scoring: 'delta' as const },
      { type: 'drivers' as const, scoring: 'correct' as const },
      { type: 'constructors' as const, scoring: 'delta' as const },
      { type: 'constructors' as const, scoring: 'correct' as const },
    ];

    const wins: Record<string, number> = {};

    seasons.forEach(({ season, data }) => {
      categories.forEach(({ type, scoring }) => {
        // Skip if no predictions for this category
        if (type === 'drivers' && season === '2023' && data.predictions.drivers.length === 0) return;
        if (type === 'constructors' && season === '2024' && data.predictions.constructors.length === 0) return;

        // Access predictions correctly - handle both object structure (2025) and array structure
        const standings = data.standings[type];
        let predictions: (DriverPrediction | ConstructorPrediction)[] | undefined;
        
        // Handle different data structures
        if (type === 'drivers') {
          predictions = Array.isArray(data.predictions) 
            ? data.predictions as DriverPrediction[]
            : (data.predictions as { drivers?: DriverPrediction[] })?.drivers;
        } else {
          predictions = Array.isArray(data.predictions)
            ? data.predictions as ConstructorPrediction[]
            : (data.predictions as { constructors?: ConstructorPrediction[] })?.constructors;
        }
        
        const participants = data.participants;

        if (!standings || !predictions || !participants) {
          console.log(`Skipping ${season} ${type} ${scoring}: missing data`, { 
            hasStandings: !!standings, 
            hasPredictions: !!predictions,
            predictionsLength: predictions?.length,
            hasParticipants: !!participants,
            predictionsType: typeof predictions,
            predictionsIsArray: Array.isArray(predictions)
          });
          return;
        }

        // Calculate scores for each participant
        const participantScores = participants.map((participant) => {
          const prediction = predictions.find((p) => p.participantId === participant.id);
          let score = 0;

          if (prediction) {
            if (type === 'drivers') {
              score = scoring === 'delta'
                ? calculateDriverPredictionScore(prediction as DriverPrediction, standings as DriverStanding[])
                : calculateDriverCorrectGuesses(prediction as DriverPrediction, standings as DriverStanding[]);
            } else {
              score = scoring === 'delta'
                ? calculateConstructorPredictionScore(prediction as ConstructorPrediction, standings as ConstructorStanding[])
                : calculateConstructorCorrectGuesses(prediction as ConstructorPrediction, standings as ConstructorStanding[]);
            }
          } else {
            console.log(`No prediction found for ${participant.name} in ${season} ${type}`);
          }

          return { participantId: participant.id, participantName: participant.name, score };
        });

        // Sort scores
        const sortedScores = [...participantScores].sort((a, b) =>
          scoring === 'delta' ? a.score - b.score : b.score - a.score
        );

        // Check if all scores are 0 (no predictions)
        const allScoresZero = sortedScores.length > 0 && sortedScores.every(s => s.score === 0);
        if (allScoresZero) return;

        // Get winning score
        const winningScore = sortedScores[0]?.score;
        if (winningScore === undefined) return;

        // Count all winners (handle ties)
        const winners = sortedScores.filter(s => s.score === winningScore);
        // Debug: Log all scores for this category
        console.log(`${season} ${type} ${scoring} scores:`, sortedScores.map(s => `${s.participantName}: ${s.score}`));
        console.log(`Winning score: ${winningScore}, Winners for ${season} ${type} ${scoring}:`, winners.map(w => `${w.participantName} (${w.score})`));
        console.log(`All scores:`, JSON.stringify(sortedScores, null, 2));
        winners.forEach(winner => {
          const currentWins = wins[winner.participantName] || 0;
          wins[winner.participantName] = currentWins + 1;
          console.log(`Adding win to ${winner.participantName}: ${currentWins} -> ${currentWins + 1}`);
        });
      });
    });

    console.log('Final wins object:', wins);
    return wins;
  }, [f1DataDrivers, f1DataConstructors]);

  // Convert wins to sorted array
  const winCountsArray = useMemo(() => {
    const array = Object.entries(winCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    console.log('Win counts array:', array);
    return array;
  }, [winCounts]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border-2 border-navy shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold uppercase tracking-widest text-navy">
            Admin Panel
          </h2>
          <div className="flex items-center space-x-4">
            {getStatusBadge()}
            <button
              onClick={refreshStandings}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border-2 border-red bg-red text-white font-bold uppercase rounded shadow hover:bg-navy hover:border-navy transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
            <button
              onClick={() => {
                if (onExit) {
                  onExit();
                } else {
                  navigate('/');
                }
              }}
              className="inline-flex items-center px-4 py-2 border-2 border-navy bg-navy text-white font-bold uppercase rounded shadow hover:bg-red hover:border-red transition"
            >
              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Exit
            </button>
            <button
              onClick={async () => {
                try {
                  logger.log('Testing API connectivity...');
                  const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
                  logger.log('Primary API response:', response.status, response.statusText);
                  const data = await response.json();
                  logger.log('Primary API data received:', data.MRData?.StandingsTable?.season);
                  alert(`API Test Successful!\nStatus: ${response.status}\nSeason: ${data.MRData?.StandingsTable?.season || 'Unknown'}`);
                } catch (error) {
                  logger.error('Primary API failed:', error);
                  try {
                    const fallbackResponse = await fetch('https://ergast.com/api/f1/current/driverStandings.json');
                    logger.log('Fallback API response:', fallbackResponse.status, fallbackResponse.statusText);
                    const fallbackData = await fallbackResponse.json();
                    logger.log('Fallback API data received:', fallbackData.MRData?.StandingsTable?.season);
                    alert(`Fallback API Test Successful!\nStatus: ${fallbackResponse.status}\nSeason: ${fallbackData.MRData?.StandingsTable?.season || 'Unknown'}`);
                  } catch (fallbackError) {
                    logger.error('Both APIs failed:', fallbackError);
                    alert('API Test Failed: Both primary and fallback APIs are unavailable.');
                  }
                }
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Test API
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800 font-bold uppercase">{error}</p>
                <details className="mt-2">
                  <summary className="text-xs text-yellow-600 cursor-pointer hover:text-yellow-800">
                    Debug Info
                  </summary>
                  <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                    <p><strong>Primary API:</strong> https://api.jolpi.ca/ergast/f1</p>
                    <p><strong>Fallback API:</strong> https://ergast.com/api/f1</p>
                    <p><strong>Cache Status:</strong> Memory: {cacheInfo.memoryEntries} | Storage: {cacheInfo.localStorageSize}</p>
                    <p><strong>Last Updated:</strong> {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}</p>
                    <p><strong>Live Status:</strong> {isLive ? 'Yes' : 'No'}</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Cache Info */}
        <div className="mb-8 bg-silver border-2 border-lightgrey rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <span className="text-sm text-navy font-bold uppercase">Cache Status:</span>
              </div>
              <span className="text-sm text-navy font-bold">
                Memory: {cacheInfo.memoryEntries} | Storage: {cacheInfo.localStorageSize}
              </span>
            </div>
            <div className="text-xs text-navy font-bold uppercase">
              Background refresh: Every 5 minutes
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Status */}
          <div>
            <h3 className="text-xl font-extrabold uppercase tracking-widest text-red mb-4">
              API Status
            </h3>
            <div className="bg-white border-2 border-navy rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">Primary API:</span>
                  <span className="text-sm text-navy">api.jolpi.ca/ergast/f1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">Fallback API:</span>
                  <span className="text-sm text-navy">ergast.com/api/f1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">Status:</span>
                  <span className={`text-sm font-bold ${isLive ? 'text-green-600' : 'text-orange-600'}`}>
                    {isLive ? 'Live' : 'Cached'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">Last Updated:</span>
                  <span className="text-sm text-navy">
                    {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cache Details */}
          <div>
            <h3 className="text-xl font-extrabold uppercase tracking-widest text-navy mb-4">
              Cache Details
            </h3>
            <div className="bg-white border-2 border-navy rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">Memory Cache:</span>
                  <span className="text-sm text-navy">{cacheInfo.memoryEntries} entries</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">Local Storage:</span>
                  <span className="text-sm text-navy">{cacheInfo.localStorageSize} entries</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">Cache Duration:</span>
                  <span className="text-sm text-navy">5 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">Background Refresh:</span>
                  <span className="text-sm text-navy">Every 5 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-navy font-bold">
            Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
            {isLive && ' (Live from Jolpica F1 API)'}
            {!isLive && lastUpdated && ' (Cached data)'}
          </p>
        </div>

        {/* Data Export Section */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-navy mb-4">Data Export</h3>
          <div className="flex items-center space-x-4">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
              className="px-4 py-2 bg-white border border-lightgrey rounded-lg text-navy font-bold focus:outline-none focus:ring-2 focus:ring-navy"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={exportData}
              className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-bold"
            >
              Export Data
            </button>
          </div>
        </div>

        {/* Data Summary */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-navy mb-4">Data Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-lightgrey">
              <div className="text-2xl font-bold text-navy">{f1DataDrivers?.participants?.length || 0}</div>
              <div className="text-sm text-navy">Participants</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-lightgrey">
              <div className="text-2xl font-bold text-navy">{currentDriverStandings.length}</div>
              <div className="text-sm text-navy">Drivers</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-lightgrey">
              <div className="text-2xl font-bold text-navy">{currentConstructorStandings.length}</div>
              <div className="text-sm text-navy">Constructors</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-lightgrey">
              <div className="text-2xl font-bold text-navy">{new Date().toLocaleDateString()}</div>
              <div className="text-sm text-navy">Last Updated</div>
            </div>
          </div>
        </div>

        {/* Win Counts Across All Seasons */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-navy mb-4">All-Time Wins (Across All Seasons & Categories)</h3>
          <div className="bg-white border-2 border-navy rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {winCountsArray.map(({ name, count }) => (
                <div key={name} className="bg-silver border-2 border-navy rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red mb-2">{count}</div>
                  <div className="text-sm font-bold text-navy uppercase">{name}</div>
                  <div className="text-xs text-navy/70 mt-1">
                    {count === 1 ? 'Win' : 'Wins'}
                  </div>
                </div>
              ))}
            </div>
            {winCountsArray.length === 0 && (
              <p className="text-center text-navy/70 py-4">No wins recorded yet</p>
            )}
          </div>
        </div>

        {/* Complete Leaderboard */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-navy mb-4">Complete Leaderboard (All Scoring Methods)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-xl border-2 border-navy overflow-hidden">
              <thead className="bg-navy">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Rank</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Participant</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Position Diff</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider">Correct Guesses</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-lightgrey">
                {allScores.map((score, index) => (
                  <tr key={score.participant.id} className="hover:bg-silver">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-navy">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-navy">
                      {score.participant.name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-red">
                      {score.totalPositionScore}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-red">
                      {score.totalCorrectScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 