import React, { useState } from 'react';
import type { SeasonType, ChampionshipType } from '../types/common';
import type { ScoringType } from './ScoringToggle';
import { useF1Data } from '../hooks/useF1Data';
import { participants, driverPredictions, constructorPredictions } from '../data/predictions';
import {
  getDriverPredictionDetails,
  getConstructorPredictionDetails
} from '../utils/calculations';
import type { DriverStanding, ConstructorStanding } from '../types';
import { ToggleGroup } from './common/ToggleGroup';
import { ScoringHint } from './ScoringHint';

interface PredictionsViewProps {
  season: SeasonType;
  championshipType: ChampionshipType;
  scoringType: ScoringType;
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({
  season,
  championshipType,
  scoringType
}) => {
  const { data, isLoading, error } = useF1Data(season, championshipType);
  const [selectedParticipant, setSelectedParticipant] = useState<string>(participants[0]?.id || '');

  if (!data && !isLoading) return null;

  const selectedParticipantData = participants.find(p => p.id === selectedParticipant);
  const driverPrediction = driverPredictions.find(p => p.participantId === selectedParticipant);
  const constructorPrediction = constructorPredictions.find(p => p.participantId === selectedParticipant);

  // Table columns
  const columns = ['Position', 'Prediction', 'Current Standing', 'Points'];

  // Table data builder
  const getTableData = () => {
    if (championshipType === 'drivers' && driverPrediction && data?.standings) {
      const details = getDriverPredictionDetails(driverPrediction, data.standings as DriverStanding[]);
      return details.map((detail) => ({
        Position: detail.predictedPosition,
        Prediction: detail.driver,
        'Current Standing': detail.actualPosition > 0 ? detail.actualPosition : '-',
        Points:
          scoringType === 'delta'
            ? detail.positionDifference
            : detail.isCorrect
              ? 1
              : 0
      }));
    } else if (championshipType === 'constructors' && constructorPrediction && data?.standings) {
      const details = getConstructorPredictionDetails(constructorPrediction, data.standings as ConstructorStanding[]);
      return details.map((detail) => ({
        Position: detail.predictedPosition,
        Prediction: detail.constructor,
        'Current Standing': detail.actualPosition > 0 ? detail.actualPosition : '-',
        Points:
          scoringType === 'delta'
            ? detail.positionDifference
            : detail.isCorrect
              ? 1
              : 0
      }));
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
        <p className="text-sm text-red-800 font-bold uppercase">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-center">
        <ToggleGroup
          label="Participant:"
          options={participants.map(p => ({ value: p.id, label: p.name }))}
          value={selectedParticipant}
          onChange={setSelectedParticipant}
        />
      </div>
      <ScoringHint scoringType={scoringType} />
      {/* Predictions Table */}
      <div className="bg-white border-2 border-navy rounded-xl p-6">
        <h3 className="text-xl font-extrabold uppercase tracking-widest text-navy mb-4 text-center">
          {selectedParticipantData?.name}'s {championshipType === 'drivers' ? 'Drivers' : 'Constructors'} Predictions
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-xl border-2 border-navy overflow-hidden">
            <thead className="bg-navy">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold text-white uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-lightgrey">
              {getTableData().map((row: Record<string, string | number>) => (
                <tr className="hover:bg-silver">
                  {columns.map((col) => (
                    <td key={col} className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-navy">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 