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
    <div className="bg-blue-50/50 rounded-lg px-4 py-3 mb-6 flex items-center justify-center gap-2 text-sm text-navy/80">
      <svg className="h-4 w-4 flex-shrink-0 text-mclaren-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-medium">
        {getHintText()}
      </span>
    </div>
  );
};
