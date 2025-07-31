import React from 'react';
import type { ChampionshipType } from '../types/common';
import { CHAMPIONSHIP_TYPES } from '../constants';
import { ToggleGroup } from './common/ToggleGroup';

interface ChampionshipToggleProps {
  type: ChampionshipType;
  onChange: (type: ChampionshipType) => void;
}

export const ChampionshipToggle: React.FC<ChampionshipToggleProps> = ({ type, onChange }) => {
  return (
    <ToggleGroup
      label="Championship:"
      options={[
        { value: CHAMPIONSHIP_TYPES.DRIVERS, label: 'Drivers' },
        { value: CHAMPIONSHIP_TYPES.CONSTRUCTORS, label: 'Constructors' },
      ]}
      value={type}
      onChange={onChange}
    />
  );
}; 