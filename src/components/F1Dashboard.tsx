import React, { useState } from 'react';
import type { SeasonType, ChampionshipType } from '../types/common';
import { ChampionshipToggle } from './ChampionshipToggle';
import { TabNavigation } from './common/TabNavigation';
import { TabContent } from './TabContent';
import { ScoringToggle, type ScoringType } from './ScoringToggle';
import { useF1AppData } from '../hooks/useF1AppData';

const TABS = [
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'standings', label: 'Current Standings' },
];

interface F1DashboardProps {
  season: SeasonType;
}

export const F1Dashboard: React.FC<F1DashboardProps> = ({ season }) => {
  const [championshipType, setChampionshipType] = useState<ChampionshipType>('drivers');
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [scoringType, setScoringType] = useState<ScoringType>('delta');

  // Use centralised data hook for current season only
  const appData = season === 'current' ? useF1AppData(championshipType) : undefined;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-6 text-center">F1 Predictions Dashboard</h1>
        
        <div className="flex flex-col justify-center items-center gap-4 mb-6">
          <ChampionshipToggle type={championshipType} onChange={setChampionshipType} />
          <ScoringToggle type={scoringType} onChange={setScoringType} />
        </div>

        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <TabContent
          tab={activeTab}
          season={season}
          championshipType={championshipType}
          scoringType={scoringType}
          appData={appData}
        />
      </div>
    </div>
  );
}; 