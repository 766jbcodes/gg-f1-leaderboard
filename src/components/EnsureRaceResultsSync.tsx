import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

/**
 * When a user is logged in, triggers ensure-race-results once per session.
 * The Edge Function checks if the latest completed race has results in Supabase;
 * if not, it fetches from Ergast and stores them. A sync-state flag prevents
 * duplicate API calls when multiple users log in close together.
 */
export function EnsureRaceResultsSync() {
  const { user } = useAuth();
  const triggered = useRef(false);

  useEffect(() => {
    if (!user || triggered.current) return;
    triggered.current = true;

    supabase.functions
      .invoke('ensure-race-results')
      .then(({ data, error }) => {
        if (error) logger.error('ensure-race-results function error:', error);
        if (data && 'error' in data) logger.warn('ensure-race-results response:', data);
      })
      .catch((err) => {
        logger.error('ensure-race-results invoke failed:', err);
      });
  }, [user]);

  return null;
}
