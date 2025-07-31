import React, { useState, useEffect } from 'react';
import { f1ApiService } from '../services/f1Api';

export const RaceCaption: React.FC = () => {
  const [raceInfo, setRaceInfo] = useState<{ name: string; type: 'race' | 'sprint' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRaceInfo = async () => {
      try {
        const latestRace = await f1ApiService.getLatestRace();
        setRaceInfo(latestRace);
      } catch (error) {
        console.error('Failed to fetch race info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaceInfo();
  }, []);

  if (isLoading || !raceInfo) {
    return null;
  }

  const getCaptionText = () => {
    if (raceInfo.type === 'sprint') {
      return `Standings after the ${raceInfo.name}`;
    } else {
      return `Standings after the ${raceInfo.name}`;
    }
  };

  return (
    <p className="text-sm text-navy/70 italic mt-2 text-center">
      {getCaptionText()}
    </p>
  );
}; 