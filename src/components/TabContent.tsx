import React from 'react';
import type { SeasonType, ChampionshipType } from '../types/common';
import { useF1Data } from '../hooks/useF1Data';
import { useF1AppData } from '../hooks/useF1AppData';
import { DataTable } from './common/DataTable';
import { PredictionsView } from './PredictionsView';
import { ScoringHint } from './ScoringHint';
import { RaceCaption } from './RaceCaption';
import { 
  calculateDriverPredictionScore, 
  calculateDriverCorrectGuesses,
  calculateConstructorPredictionScore,
  calculateConstructorCorrectGuesses,
} from '../utils/calculations';
import type { Participant, DriverPrediction, ConstructorPrediction, DriverStanding, ConstructorStanding } from '../types';
import type { ScoringType } from './ScoringToggle';
import type { QueryObserverResult } from '@tanstack/react-query';

// Shared app data type
interface F1AppData {
  standings: (DriverStanding | ConstructorStanding)[];
  predictions: (DriverPrediction | ConstructorPrediction)[];
  participants: Participant[];
}

interface TabContentProps {
  tab: string;
  season: SeasonType;
  championshipType: ChampionshipType;
  scoringType: ScoringType;
  appData?: QueryObserverResult<F1AppData, Error> | { data: F1AppData; isLoading: boolean; error: Error | null };
}

export const TabContent: React.FC<TabContentProps> = ({ tab, season, championshipType, scoringType, appData }) => {
  // Always call useF1Data hook (it handles both current and static seasons)
  // Only call useF1AppData if season is 'current' (to avoid conditional hooks)
  const isCurrentSeason = season === 'current';
  const appDataQuery = useF1AppData(championshipType);
  const fallbackDataQuery = useF1Data(season, championshipType);

  // Use centralised data if provided, otherwise fallback to useF1Data
  let data: F1AppData | undefined;
  let isLoading: boolean;
  let error: Error | null;

  if (appData) {
    data = appData.data;
    isLoading = appData.isLoading;
    error = appData.error;
  } else if (isCurrentSeason) {
    data = appDataQuery.data;
    isLoading = appDataQuery.isLoading;
    error = appDataQuery.error;
  } else {
    data = fallbackDataQuery.data;
    isLoading = fallbackDataQuery.isLoading;
    error = fallbackDataQuery.error;
  }

  if (!data && !isLoading) return null;

  let driverData: { position: number; driver: string; constructor: string; points: number }[] = [];
  let constructorData: { position: number; constructor: string; points: number }[] = [];

  const renderContent = () => {
    switch (tab) {
      case 'leaderboard': {
        if (!data?.participants || !data?.predictions || !data?.standings) return null;

        const participantScores = data.participants.map((participant) => {
          const prediction = data.predictions.find((p) => p.participantId === participant.id);
          let score = 0;
          if (prediction) {
            if (championshipType === 'drivers') {
              score = scoringType === 'delta'
                ? calculateDriverPredictionScore(prediction as DriverPrediction, data.standings as DriverStanding[])
                : calculateDriverCorrectGuesses(prediction as DriverPrediction, data.standings as DriverStanding[]);
            } else {
              score = scoringType === 'delta'
                ? calculateConstructorPredictionScore(prediction as ConstructorPrediction, data.standings as ConstructorStanding[])
                : calculateConstructorCorrectGuesses(prediction as ConstructorPrediction, data.standings as ConstructorStanding[]);
            }
          }
          return { name: participant.name, score };
        });

        // Sort and add position numbers
        const sortedScores = [...participantScores].sort((a, b) =>
          scoringType === 'delta' ? a.score - b.score : b.score - a.score
        );
        const scoresWithPosition = sortedScores.map((score, index) => ({
          position: index + 1,
          name: score.name,
          score: score.score,
        }));

        // Calculate winners dynamically from the sorted scores
        // Handle ties - all participants with the best (winning) score are winners
        // But don't mark winners if all participants score 0 (no predictions were made)
        const winningScore = sortedScores.length > 0 ? sortedScores[0].score : undefined;
        const allScoresZero = sortedScores.length > 0 && sortedScores.every(score => score.score === 0);
        const winnerNames = (winningScore !== undefined && !allScoresZero)
          ? sortedScores
              .filter(score => score.score === winningScore)
              .map(score => score.name)
          : [];

        return (
          <div>
            <ScoringHint scoringType={scoringType} />
            <DataTable 
              columns={['Position', 'Name', 'Score']} 
              data={scoresWithPosition} 
              isLoading={isLoading} 
              error={error?.message}
              winnerNames={winnerNames}
            />
            <RaceCaption />
          </div>
        );
      }
      case 'predictions': {
        return <PredictionsView season={season} championshipType={championshipType} scoringType={scoringType} />;
      }
      case 'standings': {
        if (championshipType === 'drivers') {
          driverData = (data?.standings || []).filter((s): s is DriverStanding => 'driver' in s).map((standing) => ({
            position: standing.position,
            driver: standing.driver,
            constructor: standing.constructor,
            points: standing.points
          }));
          return (
            <div>
              <ScoringHint scoringType={scoringType} />
              <DataTable columns={['Position', 'Driver', 'Constructor', 'Points']} data={driverData} isLoading={isLoading} error={error?.message} />
              <RaceCaption />
            </div>
          );
        }
        constructorData = (data?.standings || []).filter((s): s is ConstructorStanding => 'constructor' in s && !('driver' in s)).map((standing) => ({
          position: standing.position,
          constructor: standing.constructor,
          points: standing.points
        }));
        return (
          <div>
            <ScoringHint scoringType={scoringType} />
            <DataTable columns={['Position', 'Constructor', 'Points']} data={constructorData} isLoading={isLoading} error={error?.message} />
            <RaceCaption />
          </div>
        );
      }
      default:
        return null;
    }
  };

  return <div className="mt-6">{renderContent()}</div>;
}; 