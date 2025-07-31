import React from 'react';
import { ToggleGroup } from './common/ToggleGroup';

export type ScoringType = 'delta' | 'correct';

interface ScoringToggleProps {
  type: ScoringType;
  onChange: (type: ScoringType) => void;
}

export const ScoringToggle: React.FC<ScoringToggleProps> = ({ type, onChange }) => {
  return (
    <ToggleGroup
      label="Scoring Method:"
      options={[
        { value: 'delta', label: 'Closest Position' },
        { value: 'correct', label: 'Correct Standings' },
      ]}
      value={type}
      onChange={onChange}
    />
  );
}; 