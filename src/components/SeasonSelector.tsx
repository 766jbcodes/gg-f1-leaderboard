import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { SeasonType } from '../types';

const SEASONS: Array<{ value: SeasonType; label: string }> = [
  { value: 'current', label: 'Current (2025)' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
];

interface SeasonSelectorProps {
  className?: string;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine current season from URL
  const getCurrentSeason = (): SeasonType => {
    if (location.pathname === '/') return 'current';
    const match = location.pathname.match(/\/season\/(\d{4})/);
    if (match) {
      const year = match[1];
      return (year === '2023' || year === '2024' || year === '2025') ? year : 'current';
    }
    return 'current';
  };

  const currentSeason = getCurrentSeason();
  const currentSeasonLabel = SEASONS.find(s => s.value === currentSeason)?.label || 'Current (2025)';

  const handleSeasonChange = (season: SeasonType) => {
    if (season === 'current') {
      navigate('/');
    } else {
      navigate(`/season/${season}`);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Desktop Dropdown */}
      <div className={`hidden md:block ${className}`}>
        <select
          value={currentSeason}
          onChange={(e) => handleSeasonChange(e.target.value as SeasonType)}
          className="px-3 py-1.5 text-xs font-bold border-2 border-navy rounded-lg bg-white text-navy hover:bg-silver focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-1 cursor-pointer"
          aria-label="Select season"
        >
          {SEASONS.map((season) => (
            <option key={season.value} value={season.value}>
              {season.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Modal Button */}
      <div className={`md:hidden ${className}`}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 text-xs font-bold border-2 border-navy rounded-lg bg-white text-navy hover:bg-silver transition-colors"
          aria-label="Select season"
        >
          {currentSeasonLabel} ▼
        </button>
      </div>

      {/* Mobile Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:hidden"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl border-2 border-navy shadow-lg w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-navy uppercase">Select Season</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-navy hover:text-red transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {SEASONS.map((season) => (
                <button
                  key={season.value}
                  onClick={() => handleSeasonChange(season.value)}
                  className={`w-full px-4 py-3 text-left font-bold rounded-lg transition-colors ${
                    currentSeason === season.value
                      ? 'bg-navy text-white'
                      : 'bg-silver text-navy hover:bg-lightgrey'
                  }`}
                >
                  {season.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

