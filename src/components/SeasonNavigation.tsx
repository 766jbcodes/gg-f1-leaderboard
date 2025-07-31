import React from 'react';
import type { SeasonTab, SeasonType } from '../types';

interface SeasonNavigationProps {
  seasons: SeasonTab[];
  activeSeason: SeasonType;
  onSeasonChange: (season: SeasonType) => void;
}

const SeasonNavigation: React.FC<SeasonNavigationProps> = React.memo(({ seasons, activeSeason, onSeasonChange }) => {
  const handleKeyDown = (event: React.KeyboardEvent, seasonId: SeasonType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSeasonChange(seasonId);
    }
  };

  return (
    <nav 
      className="bg-silver border-2 border-lightgrey rounded-xl p-1 mb-8 overflow-x-auto whitespace-nowrap"
      role="tablist" 
      aria-label="Season navigation tabs"
    >
      <div className="flex min-w-max">
        {seasons.map((season) => (
          <button
            key={season.id}
            onClick={() => onSeasonChange(season.id)}
            onKeyDown={(e) => handleKeyDown(e, season.id)}
            role="tab"
            aria-selected={activeSeason === season.id}
            aria-controls={`panel-${season.id}`}
            id={`tab-${season.id}`}
            className={`flex-1 py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 overflow-hidden ${
              activeSeason === season.id
                ? 'bg-navy text-white'
                : 'bg-transparent text-navy hover:bg-white'
            }`}
            tabIndex={activeSeason === season.id ? 0 : -1}
            style={{ minWidth: '110px' }}
          >
            <span className="flex items-center justify-center space-x-2 truncate">
              {season.icon && <span aria-hidden="true">{season.icon}</span>}
              <span className="truncate">{season.label}</span>
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
});

SeasonNavigation.displayName = 'SeasonNavigation';

export default SeasonNavigation; 