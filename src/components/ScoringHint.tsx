import React from 'react';
import type { ScoringType } from './ScoringToggle';

interface ScoringHintProps {
  scoringType: ScoringType;
}

export const ScoringHint: React.FC<ScoringHintProps> = ({ scoringType }) => {
  const getHintText = () => {
    switch (scoringType) {
      case 'delta':
        return 'Closest Position rewards the lowest score';
      case 'correct':
        return 'Correct Standings rewards the highest score';
      default:
        return '';
    }
  };

  return (
    <div className="bg-silver border-2 border-lightgrey rounded-xl p-3 mb-4">
      <div className="flex items-center space-x-2">
        <svg className="h-4 w-4 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-bold text-navy italic">
          {getHintText()}
        </span>
      </div>
    </div>
  );
}; 