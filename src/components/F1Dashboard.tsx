import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="pb-12 max-w-7xl mx-auto">
      {season === '2026' && (
        <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Link
            to="/season/2026/predictions"
            className="inline-flex items-center gap-2 px-6 py-3 bg-papaya text-white font-bold rounded-full shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
          >
            <span>Set my 2026 predictions</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8 px-4">
        <div className="w-full md:w-auto flex justify-center">
          <ChampionshipToggle type={championshipType} onChange={setChampionshipType} />
        </div>
        <div className="w-full md:w-auto flex justify-center">
          <ScoringToggle type={scoringType} onChange={setScoringType} />
        </div>
      </div>

      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="px-2 sm:px-4">
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
